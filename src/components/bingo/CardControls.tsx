import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardTypeSelector } from "./CardTypeSelector";
import { GridSizeSelector } from "./GridSizeSelector";
import { CardSettings } from "./CardSettings";
import { AIGenerator } from "./AIGenerator";
import { BackgroundUploader } from "./BackgroundUploader";
import { ColorSlider } from "./ColorSlider";
import { Download } from "lucide-react";

interface CardControlsProps {
  cardType: string;
  setCardType: (type: string) => void;
  gridSize: string;
  setGridSize: (size: string) => void;
  title: string;
  setTitle: (title: string) => void;
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
  includeFreeSpace: boolean;
  setIncludeFreeSpace: (include: boolean) => void;
  setBingoContent: (content: string[]) => void;
  onBackgroundChange: (url: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  onSave: () => void;
  onDownload: () => void;
  isSaving: boolean;
  isDownloading: boolean;
  isDisabled?: boolean;
}

export const CardControls = ({
  cardType,
  setCardType,
  gridSize,
  setGridSize,
  title,
  setTitle,
  showTitle,
  setShowTitle,
  includeFreeSpace,
  setIncludeFreeSpace,
  setBingoContent,
  onBackgroundChange,
  backgroundColor,
  setBackgroundColor,
  onSave,
  onDownload,
  isSaving,
  isDownloading,
  isDisabled = false,
}: CardControlsProps) => {
  return (
    <Card className="p-6">
      <CardTypeSelector 
        cardType={cardType} 
        setCardType={setCardType}
        setGridSize={setGridSize}
        disabled={isDisabled}
      />
      <GridSizeSelector 
        gridSize={gridSize} 
        setGridSize={setGridSize} 
        cardType={cardType}
        disabled={isDisabled}
      />
      <CardSettings
        title={title}
        setTitle={setTitle}
        showTitle={showTitle}
        setShowTitle={setShowTitle}
        includeFreeSpace={includeFreeSpace}
        setIncludeFreeSpace={setIncludeFreeSpace}
        disabled={isDisabled}
      />
      {cardType === "custom" && (
        <AIGenerator setBingoContent={setBingoContent} disabled={isDisabled} />
      )}
      <BackgroundUploader onBackgroundChange={onBackgroundChange} disabled={isDisabled} />
      <ColorSlider
        backgroundColor={backgroundColor}
        onBackgroundColorChange={setBackgroundColor}
        disabled={isDisabled}
      />
      <div className="mt-4 space-y-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onSave}
          disabled={isSaving || isDisabled}
        >
          {isSaving ? "Saving..." : "Save Card"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onDownload}
          disabled={isDownloading || isDisabled}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download Card"}
        </Button>
      </div>
    </Card>
  );
};