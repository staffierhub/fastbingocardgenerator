import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface BackgroundUploaderProps {
  onBackgroundChange: (url: string) => void;
}

export const BackgroundUploader = ({ onBackgroundChange }: BackgroundUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('card-backgrounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('card-backgrounds')
        .getPublicUrl(filePath);

      onBackgroundChange(publicUrl);
      
      toast({
        title: "Background uploaded successfully",
        description: "Your card background has been updated",
      });
    } catch (error) {
      console.error('Error uploading background:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your background",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-[#FEF7CD] rounded-lg">
      <h3 className="font-semibold mb-2">Card Background</h3>
      <Button
        variant="outline"
        className="w-full bg-white hover:bg-gray-50"
        disabled={isUploading}
      >
        <label className="flex items-center justify-center w-full cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Background"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
};