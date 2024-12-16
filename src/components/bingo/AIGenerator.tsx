import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AIGeneratorProps {
  setBingoContent: (content: string[]) => void;
}

export const AIGenerator = ({ setBingoContent }: AIGeneratorProps) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
      const { data, error } = await supabase.functions.invoke('generate-bingo-content', {
        body: { theme }
      });

      if (error) throw error;

      setBingoContent(data.content);
      toast({
        title: "Bingo card generated!",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error generating bingo content:", error);
      toast({
        title: "Error generating bingo content",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-[#FEF7CD] rounded-lg">
      <h3 className="font-semibold mb-2">AI-Generated Bingo Card</h3>
      <Input
        placeholder="Enter theme & hit generate!"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="mb-2"
      />
      <Button
        onClick={generateBingoContent}
        disabled={isGenerating}
        className="w-full bg-[#5BB6EE] hover:bg-[#4A92BE]"
      >
        {isGenerating ? "Generating..." : "Generate Bingo Card!"}
      </Button>
    </div>
  );
};