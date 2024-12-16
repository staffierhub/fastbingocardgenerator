import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface ColorSliderProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorSlider = ({
  backgroundColor,
  onBackgroundColorChange,
  disabled,
}: ColorSliderProps) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // Convert hex to HSL on component mount
  useEffect(() => {
    const hexToHSL = (hex: string) => {
      // Remove the # if present
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    };

    const hsl = hexToHSL(backgroundColor);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }, []);

  // Convert HSL to hex and update parent
  useEffect(() => {
    const hslToHex = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c/2;
      let r = 0;
      let g = 0;
      let b = 0;

      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }

      const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const newColor = hslToHex(hue, saturation, lightness);
    onBackgroundColorChange(newColor);
  }, [hue, saturation, lightness]);

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <Label>Background Color</Label>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <Label>Hue</Label>
            <span>{hue}°</span>
          </div>
          <Slider
            value={[hue]}
            onValueChange={(values) => setHue(values[0])}
            max={360}
            step={1}
            className="[&>.relative>.absolute]:bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
            disabled={disabled}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Saturation</Label>
            <span>{saturation}%</span>
          </div>
          <Slider
            value={[saturation]}
            onValueChange={(values) => setSaturation(values[0])}
            max={100}
            step={1}
            disabled={disabled}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Lightness</Label>
            <span>{lightness}%</span>
          </div>
          <Slider
            value={[lightness]}
            onValueChange={(values) => setLightness(values[0])}
            max={100}
            step={1}
            disabled={disabled}
          />
        </div>

        <div 
          className="w-full h-12 rounded-md border"
          style={{ backgroundColor }}
        />
      </div>
    </div>
  );
};