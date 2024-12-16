import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BingoCard } from "./BingoCard";
import { supabase } from "@/integrations/supabase/client";
import { CardControls } from "./CardControls";
import html2canvas from 'html2canvas';
import { useRef } from "react";

export const FreeBingoGenerator = () => {
  const { toast } = useToast();
  const [cardType, setCardType] = useState("custom");
  const [gridSize, setGridSize] = useState("3x3");
  const [title, setTitle] = useState("My Bingo Card");
  const [showTitle, setShowTitle] = useState(true);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(true);
  const [bingoContent, setBingoContent] = useState<string[]>(Array(9).fill("")); // Default 3x3 grid content
  const [showCard, setShowCard] = useState(true); // Changed to true to show default card
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState("#F7C052");
  const cardRef = useRef<HTMLDivElement>(null);

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

  const checkDailyLimit = async () => {
    try {
      const ip = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip);
      const { data: usageData, error: usageError } = await supabase
        .from('daily_generator_usage')
        .select('*')
        .eq('ip_address', ip)
        .eq('used_date', new Date().toISOString().split('T')[0]);

      if (usageError) throw usageError;

      if (usageData && usageData.length >= 1) {
        toast({
          title: "Daily limit reached",
          description: "You can generate 1 bingo card per day. Sign up for unlimited cards!",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking daily limit:", error);
      return false;
    }
  };

  const recordUsage = async () => {
    try {
      const ip = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip);
      const { error: insertError } = await supabase
        .from('daily_generator_usage')
        .insert([{ ip_address: ip }]);

      if (insertError) throw insertError;
    } catch (error) {
      console.error("Error recording usage:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
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
          setBingoContent={async (content) => {
            const canProceed = await checkDailyLimit();
            if (!canProceed) return;
            
            setBingoContent(content);
            setShowCard(true);
            await recordUsage();
          }}
          onBackgroundChange={setBackgroundUrl}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          onSave={() => {
            toast({
              title: "Sign up to save cards!",
              description: "Create an account to save and manage your bingo cards.",
              duration: 3000,
            });
          }}
          onDownload={handleDownload}
          isSaving={false}
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
    </div>
  );
};
