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
  const getGridSize = () => {
    if (cardType === "traditional") {
      switch (gridSize) {
        case "30-ball": return 3;
        case "75-ball": return 5;
        case "80-ball": return 4;
        case "90-ball": return 9;
        default: return 5;
      }
    } else {
      return parseInt(gridSize.split('x')[0]);
    }
  };

  const size = getGridSize();
  const totalCells = size * size;

  const grid = cardType === "traditional" 
    ? generateBingoGrid(gridSize as any, includeFreeSpace)
    : Array(totalCells).fill(null).map((_, index) => ({
        value: bingoContent[index] || "",
        isFreeSpace: includeFreeSpace && index === Math.floor(totalCells / 2),
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
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`
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