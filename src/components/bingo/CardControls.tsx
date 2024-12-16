import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardTypeSelector } from "./CardTypeSelector";
import { GridSizeSelector } from "./GridSizeSelector";
import { CardSettings } from "./CardSettings";
import { AIGenerator } from "./AIGenerator";
import { BackgroundUploader } from "./BackgroundUploader";
import { BackgroundColorPicker } from "./BackgroundColorPicker";
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
}: CardControlsProps) => {
  return (
    <Card className="p-6">
      <CardTypeSelector 
        cardType={cardType} 
        setCardType={setCardType}
        setGridSize={setGridSize}
      />
      <GridSizeSelector 
        gridSize={gridSize} 
        setGridSize={setGridSize} 
        cardType={cardType}
      />
      <CardSettings
        title={title}
        setTitle={setTitle}
        showTitle={showTitle}
        setShowTitle={setShowTitle}
        includeFreeSpace={includeFreeSpace}
        setIncludeFreeSpace={setIncludeFreeSpace}
      />
      {cardType === "custom" && (
        <AIGenerator setBingoContent={setBingoContent} />
      )}
      <BackgroundUploader onBackgroundChange={onBackgroundChange} />
      <BackgroundColorPicker
        backgroundColor={backgroundColor}
        onBackgroundColorChange={setBackgroundColor}
      />
      <div className="mt-4 space-y-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Card"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onDownload}
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download Card"}
        </Button>
      </div>
    </Card>
  );
};