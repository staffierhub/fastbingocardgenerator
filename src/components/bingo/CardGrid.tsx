import { BingoCard } from "@/components/bingo/BingoCard";
import { CardActions } from "@/components/bingo/CardActions";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface BingoCardData {
  id: string;
  title: string;
  grid_size: string;
  card_type: string;
  content: string[];
  show_title: boolean;
  include_free_space: boolean;
  background_url: string;
}

interface CardGridProps {
  cards: BingoCardData[];
  isAdmin: boolean;
  onDelete: (cardId: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export const CardGrid = ({ cards, isAdmin, onDelete, onUpdate }: CardGridProps) => {
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
      toast.error("Failed to download card");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cards.map((card) => (
        <div key={card.id} className="space-y-4">
          <div id={`card-${card.id}`}>
            <BingoCard
              title={card.title}
              showTitle={card.show_title}
              includeFreeSpace={card.include_free_space}
              bingoContent={card.content}
              gridSize={card.grid_size}
              cardType={card.card_type}
              backgroundUrl={card.background_url}
            />
          </div>
          <CardActions
            card={card}
            isAdmin={isAdmin}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onDownload={() => handleDownload(card)}
          />
        </div>
      ))}
    </div>
  );
};