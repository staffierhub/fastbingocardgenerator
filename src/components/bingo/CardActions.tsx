import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Download, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CardActionsProps {
  cardId: string;
  title: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
}

export const CardActions = ({ cardId, title: initialTitle, isAdmin, onDelete, onUpdate }: CardActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTemplate = async () => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase.rpc('convert_card_to_template', {
        card_id: cardId,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      if (error) throw error;

      toast.success("Card saved as template successfully!");
      setIsTemplateOpen(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(cardId, title);
      setIsEditOpen(false);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Download className="h-4 w-4" />
      </Button>
      
      {onUpdate && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Card Title</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(cardId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {isAdmin && (
        <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Save as Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tags">Meta Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="fun, easy, kids"
                />
              </div>
              <Button onClick={handleSaveTemplate} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};