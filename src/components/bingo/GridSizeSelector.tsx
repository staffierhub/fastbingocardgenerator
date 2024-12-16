import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface GridSizeSelectorProps {
  gridSize: string;
  setGridSize: (size: string) => void;
}

export const GridSizeSelector = ({ gridSize, setGridSize }: GridSizeSelectorProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Grid Size</h2>
      <p className="text-sm text-gray-600 mb-4">
        Select a traditional bingo game variant to automatically set the
        appropriate grid size.
      </p>
      <RadioGroup
        value={gridSize}
        onValueChange={setGridSize}
        className="grid grid-cols-2 gap-4"
      >
        {["30-ball", "75-ball", "80-ball", "90-ball"].map((size) => (
          <div key={size}>
            <RadioGroupItem
              value={size}
              id={size}
              className="peer sr-only"
            />
            <Label
              htmlFor={size}
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              {size}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};