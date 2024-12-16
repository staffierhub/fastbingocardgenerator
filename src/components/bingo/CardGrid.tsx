import { BingoCard } from "./BingoCard";
import { CardActions } from "./CardActions";

export interface BingoCardData {
  id: string;
  title: string;
  grid_size: string;
  card_type: string;
  content: string[];
  show_title: boolean;
  include_free_space: boolean;
  background_url: string | null;
}

interface CardGridProps {
  cards: BingoCardData[];
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
}

export const CardGrid = ({ cards, isAdmin, onDelete, onUpdate }: CardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cards.map((card) => (
        <div key={card.id} className="space-y-4">
          <div className="relative">
            <BingoCard
              title={card.title}
              showTitle={card.show_title}
              includeFreeSpace={card.include_free_space}
              bingoContent={card.content}
              gridSize={card.grid_size}
              cardType={card.card_type}
              backgroundUrl={card.background_url || undefined}
            />
          </div>
          <CardActions
            cardId={card.id}
            title={card.title}
            isAdmin={isAdmin}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  );
};