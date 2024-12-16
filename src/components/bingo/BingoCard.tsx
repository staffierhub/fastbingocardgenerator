import { Card } from "@/components/ui/card";
import { generateBingoGrid } from "@/utils/bingoGridGenerator";
import { useState } from "react";

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

  const initialGrid = cardType === "traditional" 
    ? generateBingoGrid(gridSize as any, includeFreeSpace)
    : Array(totalCells).fill(null).map((_, index) => ({
        value: bingoContent[index] || "",
        isFreeSpace: includeFreeSpace && index === Math.floor(totalCells / 2),
        isBlank: false
      } as BingoCell));

  const [grid, setGrid] = useState(initialGrid);

  const handleCellEdit = (index: number, newValue: string) => {
    const newGrid = [...grid.flat()];
    newGrid[index] = {
      ...newGrid[index],
      value: newValue
    };
    setGrid(newGrid.map(cell => [cell]));
  };

  const toggleFreeSpace = (index: number) => {
    const newGrid = [...grid.flat()];
    // Remove existing free space if there is one
    const currentFreeSpaceIndex = newGrid.findIndex(cell => cell.isFreeSpace);
    if (currentFreeSpaceIndex !== -1) {
      newGrid[currentFreeSpaceIndex] = {
        ...newGrid[currentFreeSpaceIndex],
        isFreeSpace: false
      };
    }
    // Toggle the clicked cell
    newGrid[index] = {
      ...newGrid[index],
      isFreeSpace: !newGrid[index].isFreeSpace,
      value: newGrid[index].isFreeSpace ? newGrid[index].value : "FREE"
    };
    setGrid(newGrid.map(cell => [cell]));
  };

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
                text-center text-sm border-2 border-gray-200 relative
                ${cell.isBlank ? 'bg-gray-100' : ''}
                ${cell.isFreeSpace ? 'bg-yellow-100' : ''}
                cursor-pointer
              `}
              onClick={() => includeFreeSpace && toggleFreeSpace(index)}
            >
              <input
                type="text"
                value={cell.value}
                onChange={(e) => handleCellEdit(index, e.target.value)}
                className="w-full h-full text-center bg-transparent focus:outline-none cursor-text"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};