import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CardSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
  includeFreeSpace: boolean;
  setIncludeFreeSpace: (include: boolean) => void;
  disabled?: boolean;
}

export const CardSettings = ({
  title,
  setTitle,
  showTitle,
  setShowTitle,
  includeFreeSpace,
  setIncludeFreeSpace,
  disabled,
}: CardSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Bingo Card Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-title">Show Title</Label>
        <Switch
          id="show-title"
          checked={showTitle}
          onCheckedChange={setShowTitle}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="free-space">Include Free Space</Label>
        <Switch
          id="free-space"
          checked={includeFreeSpace}
          onCheckedChange={setIncludeFreeSpace}
          disabled={disabled}
        />
      </div>
    </div>
  );
};