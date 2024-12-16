import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { BingoCard } from "@/components/bingo/BingoCard";
import { CardTypeSelector } from "@/components/bingo/CardTypeSelector";
import { GridSizeSelector } from "@/components/bingo/GridSizeSelector";
import { CardSettings } from "@/components/bingo/CardSettings";
import { AIGenerator } from "@/components/bingo/AIGenerator";
import { BackgroundUploader } from "@/components/bingo/BackgroundUploader";
import { Navigation } from "@/components/layout/Navigation";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cardType, setCardType] = useState("custom");
  const [gridSize, setGridSize] = useState("3x3");
  const [title, setTitle] = useState("Bingo Card");
  const [showTitle, setShowTitle] = useState(true);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(true);
  const [bingoContent, setBingoContent] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");

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
          background_url: backgroundUrl,
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
    <div className="min-h-screen bg-[#EEF6FF]">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <CardTypeSelector 
              cardType={cardType} 
              setCardType={setCardType}
              setGridSize={setGridSize}
            />
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
            <BackgroundUploader onBackgroundChange={setBackgroundUrl} />
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
          backgroundUrl={backgroundUrl}
        />
      </main>
    </div>
  );
}
