import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BingoCard } from "@/components/bingo/BingoCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import html2canvas from "html2canvas";

interface BingoCardData {
  id: string;
  title: string;
  grid_size: string;
  card_type: string;
  content: string[];
  show_title: boolean;
  include_free_space: boolean;
}

export default function MyCards() {
  const { data: cards, isLoading } = useQuery({
    queryKey: ['bingo-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bingo_cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BingoCardData[];
    },
  });

  const handleDownload = async (card: BingoCardData) => {
    const cardElement = document.getElementById(`card-${card.id}`);
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement);
      const link = document.createElement('a');
      link.download = `${card.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-[#EEF6FF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-[#EEF6FF]">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5BB6EE]">My Bingo Cards</h1>
        <Link to="/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Card
          </Button>
        </Link>
      </header>

      {cards?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No cards saved yet</h2>
          <Link to="/">
            <Button>Create your first card</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards?.map((card) => (
            <div key={card.id} className="space-y-4">
              <div id={`card-${card.id}`}>
                <BingoCard
                  title={card.title}
                  showTitle={card.show_title}
                  includeFreeSpace={card.include_free_space}
                  bingoContent={card.content}
                  gridSize={card.grid_size}
                  cardType={card.card_type}
                />
              </div>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => handleDownload(card)}
              >
                Download Card
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}