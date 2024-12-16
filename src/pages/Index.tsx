import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { BingoCard } from "@/components/bingo/BingoCard";
import { CardTypeSelector } from "@/components/bingo/CardTypeSelector";
import { GridSizeSelector } from "@/components/bingo/GridSizeSelector";
import { CardSettings } from "@/components/bingo/CardSettings";
import { AIGenerator } from "@/components/bingo/AIGenerator";
import { FileText } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cardType, setCardType] = useState("traditional");
  const [gridSize, setGridSize] = useState("75-ball");
  const [title, setTitle] = useState("Bingo Card");
  const [showTitle, setShowTitle] = useState(true);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(true);
  const [bingoContent, setBingoContent] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Update grid size when card type changes
  useEffect(() => {
    if (cardType === "custom") {
      setGridSize("3x3");
    } else {
      setGridSize("75-ball");
    }
  }, [cardType]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleRandomize = () => {
    if (cardType === "traditional") {
      // Force a re-render of the BingoCard component
      setIncludeFreeSpace(prev => !prev);
      setIncludeFreeSpace(prev => !prev);
    } else {
      setBingoContent(prev => [...shuffleArray(prev)]);
    }
    toast({
      title: "Card randomized!",
      duration: 2000,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please log in to save cards",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      const { error } = await supabase
        .from('bingo_cards')
        .insert({
          user_id: user.id,
          title,
          grid_size: gridSize,
          card_type: cardType,
          content: bingoContent,
          show_title: showTitle,
          include_free_space: includeFreeSpace,
        });

      if (error) throw error;

      toast({
        title: "Card saved successfully!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Error saving card",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="min-h-screen p-4 bg-[#EEF6FF]">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5BB6EE]">Bingo Bliss</h1>
        <div className="flex gap-4">
          <Link to="/my-cards">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Cards
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <CardTypeSelector cardType={cardType} setCardType={setCardType} />
            <GridSizeSelector 
              gridSize={gridSize} 
              setGridSize={setGridSize} 
              cardType={cardType}
            />
            <CardSettings
              title={title}
              setTitle={setTitle}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              includeFreeSpace={includeFreeSpace}
              setIncludeFreeSpace={setIncludeFreeSpace}
            />
            {cardType === "custom" && (
              <AIGenerator setBingoContent={setBingoContent} />
            )}
            <div className="mt-4 space-y-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleRandomize}
              >
                Shuffle Card
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Card"}
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Coming soon!",
                    duration: 2000,
                  });
                }}
              >
                Play Online Now
              </Button>
            </div>
          </Card>
        </div>

        <BingoCard
          title={title}
          showTitle={showTitle}
          includeFreeSpace={includeFreeSpace}
          bingoContent={bingoContent}
          gridSize={gridSize}
          cardType={cardType}
        />
      </main>
    </div>
  );
}