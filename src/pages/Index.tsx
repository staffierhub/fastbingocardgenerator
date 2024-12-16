import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theme, setTheme] = useState("");
  const [cardType, setCardType] = useState("traditional");
  const [gridSize, setGridSize] = useState("75-ball");
  const [title, setTitle] = useState("Bingo Card");
  const [showTitle, setShowTitle] = useState(true);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bingoContent, setBingoContent] = useState<string[]>([]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

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
      const response = await fetch(
        "https://wlhopipxemzceplljzsy.supabase.co/functions/v1/generate-bingo-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme }),
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

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
    <div className="min-h-screen p-4 bg-[#EEF6FF]">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5BB6EE]">Bingo Bliss</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Card Type</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add your own text and images with a custom card, or play traditional
              30/75/80/90 ball bingo.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant={cardType === "custom" ? "default" : "outline"}
                onClick={() => setCardType("custom")}
                className="h-24"
              >
                <div className="text-center">
                  <div className="mb-2">≡</div>
                  <div>Custom</div>
                </div>
              </Button>
              <Button
                variant={cardType === "traditional" ? "default" : "outline"}
                onClick={() => setCardType("traditional")}
                className="h-24"
              >
                <div className="text-center">
                  <div className="mb-2">#</div>
                  <div>Traditional</div>
                </div>
              </Button>
            </div>

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
              <div>
                <RadioGroupItem
                  value="30-ball"
                  id="30-ball"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="30-ball"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  30-ball
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="75-ball"
                  id="75-ball"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="75-ball"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  75-ball
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="80-ball"
                  id="80-ball"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="80-ball"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  80-ball
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="90-ball"
                  id="90-ball"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="90-ball"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  90-ball
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="title">Bingo Card Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-title">Show Title</Label>
                <Switch
                  id="show-title"
                  checked={showTitle}
                  onCheckedChange={setShowTitle}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="free-space">Include Free Space</Label>
                <Switch
                  id="free-space"
                  checked={includeFreeSpace}
                  onCheckedChange={setIncludeFreeSpace}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#FEF7CD] rounded-lg">
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

            <div className="mt-4 space-y-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  // TODO: Implement random card generation
                  toast({
                    title: "Coming soon!",
                    duration: 2000,
                  });
                }}
              >
                Generate Random Card
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  // TODO: Implement online play
                  toast({
                    title: "Coming soon!",
                    duration: 2000,
                  });
                }}
              >
                Play Online Now
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-8 bg-[#F7C052]">
          <div className="aspect-square">
            {showTitle && (
              <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
            )}
            <div className="grid grid-cols-5 gap-4 h-full">
              {Array.from({ length: 25 }).map((_, index) => {
                const isCenter = index === 12;
                const content = isCenter && includeFreeSpace ? "FREE" : bingoContent[isCenter ? index - 1 : index] || "";
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg flex items-center justify-center p-2 text-center text-sm border-2 border-gray-200"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}