import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BackgroundColorPickerProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

export const BackgroundColorPicker = ({
  backgroundColor,
  onBackgroundColorChange,
}: BackgroundColorPickerProps) => {
  const colorOptions = [
    { value: "#F7C052", label: "Yellow (Default)", className: "bg-[#F7C052]" },
    { value: "#FEF7CD", label: "Soft Yellow", className: "bg-[#FEF7CD]" },
    { value: "#F97316", label: "Bright Orange", className: "bg-[#F97316]" },
    { value: "#FFFFFF", label: "White", className: "bg-white" },
    { value: "#F1F1F1", label: "Light Gray", className: "bg-[#F1F1F1]" },
  ];

  return (
    <div className="space-y-3">
      <Label>Background Color</Label>
      <RadioGroup
        value={backgroundColor}
        onValueChange={onBackgroundColorChange}
        className="grid grid-cols-2 gap-2"
      >
        {colorOptions.map((color) => (
          <div
            key={color.value}
            className="flex items-center space-x-2 rounded-md border p-2"
          >
            <RadioGroupItem value={color.value} id={color.value} />
            <Label htmlFor={color.value} className="flex items-center gap-2">
              <div
                className={`h-4 w-4 rounded-full border ${color.className}`}
              />
              {color.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};