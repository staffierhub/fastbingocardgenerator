import { Button } from "@/components/ui/button";

interface CardTypeSelectorProps {
  cardType: string;
  setCardType: (type: string) => void;
  setGridSize: (size: string) => void;
}

export const CardTypeSelector = ({ cardType, setCardType, setGridSize }: CardTypeSelectorProps) => {
  const handleTypeChange = (type: string) => {
    setCardType(type);
    if (type === "custom") {
      setGridSize("3x3");
    } else {
      setGridSize("75-ball");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Card Type</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add your own text and images with a custom card, or play traditional
        30/75/80/90 ball bingo.
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant={cardType === "custom" ? "default" : "outline"}
          onClick={() => handleTypeChange("custom")}
          className="h-24"
        >
          <div className="text-center">
            <div className="mb-2">≡</div>
            <div>Custom</div>
          </div>
        </Button>
        <Button
          variant={cardType === "traditional" ? "default" : "outline"}
          onClick={() => handleTypeChange("traditional")}
          className="h-24"
        >
          <div className="text-center">
            <div className="mb-2">#</div>
            <div>Traditional</div>
          </div>
        </Button>
      </div>
    </div>
  );
};