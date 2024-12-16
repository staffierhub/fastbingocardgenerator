import { Card } from "@/components/ui/card";
import { generateBingoGrid } from "@/utils/bingoGridGenerator";

interface BingoCell {
  value: string | number;
  isBlank?: boolean;
  isFreeSpace?: boolean;
}

interface BingoCardProps {
  title: string;
  showTitle: boolean;
  includeFreeSpace: boolean;
  bingoContent: string[];
  gridSize: string;
  cardType: string;
}

export const BingoCard = ({ 
  title, 
  showTitle, 
  includeFreeSpace, 
  bingoContent,
  gridSize,
  cardType 
}: BingoCardProps) => {
  const getGridTemplateColumns = () => {
    switch (gridSize) {
      case "30-ball":
        return "repeat(3, 1fr)";
      case "75-ball":
        return "repeat(5, 1fr)";
      case "80-ball":
        return "repeat(4, 1fr)";
      case "90-ball":
        return "repeat(9, 1fr)";
      default:
        return "repeat(5, 1fr)";
    }
  };

  const grid = cardType === "traditional" 
    ? generateBingoGrid(gridSize as any, includeFreeSpace)
    : Array(25).fill(null).map((_, index) => ({
        value: bingoContent[index] || "",
        isFreeSpace: includeFreeSpace && index === 12,
        isBlank: false
      } as BingoCell));

  return (
    <Card className="p-8 bg-[#F7C052]">
      <div className="aspect-square">
        {showTitle && (
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        )}
        <div 
          className="grid gap-4 h-full" 
          style={{ 
            gridTemplateColumns: getGridTemplateColumns(),
            gridTemplateRows: getGridTemplateColumns()
          }}
        >
          {grid.flat().map((cell, index) => (
            <div
              key={index}
              className={`
                bg-white rounded-lg flex items-center justify-center p-2 
                text-center text-sm border-2 border-gray-200
                ${cell.isBlank ? 'bg-gray-100' : ''}
                ${cell.isFreeSpace ? 'bg-yellow-100' : ''}
              `}
            >
              {cell.value}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};