type GridType = "30-ball" | "75-ball" | "80-ball" | "90-ball";

interface BingoCell {
  value: string | number;
  isBlank?: boolean;
  isFreeSpace?: boolean;
}

export const generateBingoGrid = (
  gridType: GridType,
  includeFreeSpace: boolean = true
): BingoCell[][] => {
  switch (gridType) {
    case "30-ball":
      return generate30BallGrid();
    case "75-ball":
      return generate75BallGrid(includeFreeSpace);
    case "80-ball":
      return generate80BallGrid();
    case "90-ball":
      return generate90BallGrid();
    default:
      return generate75BallGrid(includeFreeSpace);
  }
};

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generate30BallGrid = (): BingoCell[][] => {
  const grid: BingoCell[][] = Array(3).fill([]).map(() => Array(3).fill({ value: "" }));
  const numbers = shuffleArray(Array.from({ length: 30 }, (_, i) => i + 1));
  let numberIndex = 0;

  for (let col = 0; col < 3; col++) {
    const colRange = numbers.slice(col * 10, (col + 1) * 10);
    const selectedNumbers = shuffleArray(colRange).slice(0, 3);
    
    for (let row = 0; row < 3; row++) {
      grid[row][col] = { value: selectedNumbers[row] };
    }
  }

  return grid;
};

const generate75BallGrid = (includeFreeSpace: boolean): BingoCell[][] => {
  const grid: BingoCell[][] = Array(5).fill([]).map(() => Array(5).fill({ value: "" }));
  const ranges = [
    [1, 15], // B
    [16, 30], // I
    [31, 45], // N
    [46, 60], // G
    [61, 75], // O
  ];

  ranges.forEach((range, colIndex) => {
    const [min, max] = range;
    const numbers = shuffleArray(Array.from({ length: max - min + 1 }, (_, i) => min + i));
    
    for (let row = 0; row < 5; row++) {
      if (includeFreeSpace && row === 2 && colIndex === 2) {
        grid[row][colIndex] = { value: "FREE", isFreeSpace: true };
      } else {
        grid[row][colIndex] = { value: numbers[row] };
      }
    }
  });

  return grid;
};

const generate80BallGrid = (): BingoCell[][] => {
  const grid: BingoCell[][] = Array(4).fill([]).map(() => Array(4).fill({ value: "" }));
  const ranges = [
    [1, 20],
    [21, 40],
    [41, 60],
    [61, 80],
  ];

  ranges.forEach((range, colIndex) => {
    const [min, max] = range;
    const numbers = shuffleArray(Array.from({ length: max - min + 1 }, (_, i) => min + i));
    
    for (let row = 0; row < 4; row++) {
      grid[row][colIndex] = { value: numbers[row] };
    }
  });

  return grid;
};

const generate90BallGrid = (): BingoCell[][] => {
  const grid: BingoCell[][] = Array(3).fill([]).map(() => Array(9).fill({ value: "" }));
  
  // Generate numbers for each column
  for (let col = 0; col < 9; col++) {
    const min = col * 10 + 1;
    const max = col === 8 ? 90 : (col + 1) * 10;
    const numbers = shuffleArray(Array.from({ length: max - min + 1 }, (_, i) => min + i));
    
    // Each row needs 5 numbers and 4 blanks
    const rowsWithNumbers = shuffleArray([0, 1, 2]).slice(0, 2); // Randomly select 2 rows
    rowsWithNumbers.forEach(row => {
      grid[row][col] = { value: numbers.pop()! };
    });
  }

  // Fill remaining cells as blank
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      if (!grid[row][col].value) {
        grid[row][col] = { value: "", isBlank: true };
      }
    }
  }

  return grid;
};