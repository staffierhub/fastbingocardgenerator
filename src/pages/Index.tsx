import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";
import { BingoCard } from "@/components/bingo/BingoCard";
import { CardControls } from "@/components/bingo/CardControls";
import { Navigation } from "@/components/layout/Navigation";
import html2canvas from 'html2canvas';

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cardType, setCardType] = useState("custom");
  const [gridSize, setGridSize] = useState("3x3");
  const [title, setTitle] = useState("Bingo Card");
  const [showTitle, setShowTitle] = useState(true);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(true);
  const [bingoContent, setBingoContent] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState("#F7C052");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please log in to save cards",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      const { error } = await supabase
        .from('bingo_cards')
        .insert({
          user_id: user.id,
          title,
          grid_size: gridSize,
          card_type: cardType,
          content: bingoContent,
          show_title: showTitle,
          include_free_space: includeFreeSpace,
          background_url: backgroundUrl,
        });

      if (error) throw error;

      toast({
        title: "Card saved successfully!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Error saving card",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-bingo-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Card downloaded successfully!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error downloading card:', error);
      toast({
        title: "Error downloading card",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF6FF]">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
        <div className="space-y-6">
          <CardControls
            cardType={cardType}
            setCardType={setCardType}
            gridSize={gridSize}
            setGridSize={setGridSize}
            title={title}
            setTitle={setTitle}
            showTitle={showTitle}
            setShowTitle={setShowTitle}
            includeFreeSpace={includeFreeSpace}
            setIncludeFreeSpace={setIncludeFreeSpace}
            setBingoContent={setBingoContent}
            onBackgroundChange={setBackgroundUrl}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            onSave={handleSave}
            onDownload={handleDownload}
            isSaving={isSaving}
            isDownloading={isDownloading}
          />
        </div>

        <div ref={cardRef}>
          <BingoCard
            title={title}
            showTitle={showTitle}
            includeFreeSpace={includeFreeSpace}
            bingoContent={bingoContent}
            gridSize={gridSize}
            cardType={cardType}
            backgroundUrl={backgroundUrl}
            backgroundColor={backgroundColor}
          />
        </div>
      </main>
    </div>
  );
}