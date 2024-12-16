import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BingoCard } from "@/components/bingo/BingoCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";
import { Navigation } from "@/components/layout/Navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface BingoCardData {
  id: string;
  title: string;
  grid_size: string;
  card_type: string;
  content: string[];
  show_title: boolean;
  include_free_space: boolean;
  background_url: string;
}

export default function MyCards() {
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = useState<BingoCardData | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const { data: cards, isLoading } = useQuery({
    queryKey: ['bingo-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bingo_cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BingoCardData[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase
        .from('bingo_cards')
        .delete()
        .eq('id', cardId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bingo-cards'] });
      toast.success("Card deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete card");
      console.error("Delete error:", error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase
        .from('bingo_cards')
        .update({ title })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bingo-cards'] });
      toast.success("Card updated successfully");
      setEditingCard(null);
    },
    onError: (error) => {
      toast.error("Failed to update card");
      console.error("Update error:", error);
    }
  });

  const handleDelete = (cardId: string) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      deleteMutation.mutate(cardId);
    }
  };

  const handleEdit = (card: BingoCardData) => {
    setEditingCard(card);
    setEditedTitle(card.title);
  };

  const handleUpdate = () => {
    if (editingCard && editedTitle.trim()) {
      updateMutation.mutate({
        id: editingCard.id,
        title: editedTitle.trim()
      });
    }
  };

  const handleDownload = async (card: BingoCardData) => {
    const cardElement = document.getElementById(`card-${card.id}`);
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement);
      const link = document.createElement('a');
      link.download = `${card.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error("Failed to download card");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEF6FF]">
        <Navigation />
        <div className="p-4 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF6FF]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bingo Cards</h1>
          <Link to="/generator">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Card
            </Button>
          </Link>
        </header>

        {cards?.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No cards saved yet</h2>
            <Link to="/generator">
              <Button>Create your first card</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards?.map((card) => (
              <div key={card.id} className="space-y-4">
                <div id={`card-${card.id}`}>
                  <BingoCard
                    title={card.title}
                    showTitle={card.show_title}
                    includeFreeSpace={card.include_free_space}
                    bingoContent={card.content}
                    gridSize={card.grid_size}
                    cardType={card.card_type}
                    backgroundUrl={card.background_url}
                  />
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(card)}
                      >
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
                          onClick={handleUpdate}
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
                    onClick={() => handleDelete(card.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => handleDownload(card)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}