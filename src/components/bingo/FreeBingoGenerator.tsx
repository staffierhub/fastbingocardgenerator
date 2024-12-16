import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BingoCard } from "./BingoCard";
import { supabase } from "@/integrations/supabase/client";

export const FreeBingoGenerator = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [bingoContent, setBingoContent] = useState<string[]>([]);
  const [showCard, setShowCard] = useState(false);

  const generateBingoContent = async () => {
    if (!theme.trim()) {
      toast({
        title: "Please enter a theme",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      // First check if the user has reached their daily limit
      const { data: usageData, error: usageError } = await supabase
        .from('daily_generator_usage')
        .select('*')
        .eq('ip_address', await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip))
        .eq('used_date', new Date().toISOString().split('T')[0]);

      if (usageError) throw usageError;

      if (usageData && usageData.length >= 3) {
        toast({
          title: "Daily limit reached",
          description: "You can generate up to 3 bingo cards per day. Sign up for unlimited cards!",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-bingo-content', {
        body: { theme }
      });

      if (error) throw error;

      // Record the usage
      const { error: insertError } = await supabase
        .from('daily_generator_usage')
        .insert([
          {
            ip_address: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip)
          }
        ]);

      if (insertError) throw insertError;

      setBingoContent(data.content);
      setShowCard(true);
      toast({
        title: "Bingo card generated!",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error generating bingo content:", error);
      toast({
        title: "Error generating bingo content",
        description: "Please try again later",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <Input
            placeholder="Enter a theme for your bingo card (e.g., 'Office Meeting', 'Baby Shower')"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={generateBingoContent}
            disabled={isGenerating}
            className="w-full bg-[#5BB6EE] hover:bg-[#4A92BE]"
          >
            {isGenerating ? "Generating..." : "Generate Free Bingo Card"}
          </Button>
        </div>

        {showCard && (
          <div className="mt-8">
            <BingoCard
              title={theme}
              showTitle={true}
              includeFreeSpace={true}
              bingoContent={bingoContent}
              gridSize="5x5"
              cardType="custom"
              backgroundColor="#F7C052"
            />
          </div>
        )}
      </div>
    </div>
  );
};