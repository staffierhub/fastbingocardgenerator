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

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cardType, setCardType] = useState("traditional");
  const [gridSize, setGridSize] = useState("75-ball");
  const [title, setTitle] = useState("Bingo Card");
  const [showTitle, setShowTitle] = useState(true);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(true);
  const [bingoContent, setBingoContent] = useState<string[]>([]);

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

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="min-h-screen p-4 bg-[#EEF6FF]">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5BB6EE]">Bingo Bliss</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <CardTypeSelector cardType={cardType} setCardType={setCardType} />
            <GridSizeSelector gridSize={gridSize} setGridSize={setGridSize} />
            <CardSettings
              title={title}
              setTitle={setTitle}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              includeFreeSpace={includeFreeSpace}
              setIncludeFreeSpace={setIncludeFreeSpace}
            />
            <AIGenerator setBingoContent={setBingoContent} />

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