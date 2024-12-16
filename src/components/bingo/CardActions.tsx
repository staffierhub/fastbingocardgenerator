import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Grid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CardActionsProps {
  card: {
    id: string;
    title: string;
  };
  isAdmin: boolean;
  onDelete: (cardId: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDownload: () => void;
}

export const CardActions = ({ card, isAdmin, onDelete, onUpdate, onDownload }: CardActionsProps) => {
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [metaTags, setMetaTags] = useState("");

  const handleSaveAsTemplate = async () => {
    try {
      const { data, error } = await supabase.rpc('convert_card_to_template', {
        card_id: card.id,
        tags: metaTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      if (error) throw error;

      toast.success("Card saved as template successfully");
      setIsTemplateDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save as template");
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter new title"
            />
            <Button 
              className="w-full" 
              onClick={() => onUpdate(card.id, editedTitle)}
              disabled={!editedTitle.trim()}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        variant="outline" 
        className="flex-1"
        onClick={() => onDelete(card.id)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <Button 
        variant="secondary" 
        className="flex-1"
        onClick={onDownload}
      >
        Download
      </Button>

      {isAdmin && (
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Grid className="h-4 w-4 mr-2" />
              Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Meta Tags</label>
                <Input
                  value={metaTags}
                  onChange={(e) => setMetaTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Example: holiday, christmas, family
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={handleSaveAsTemplate}
              >
                Save as Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};