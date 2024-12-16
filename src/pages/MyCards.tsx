import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { toast } from "sonner";
import { CardGrid } from "@/components/bingo/CardGrid";
import { useEffect, useState } from "react";

export default function MyCards() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(session?.user?.email === 'mph.wrk@gmail.com');
    };
    checkAdminStatus();
  }, []);

  const { data: cards, isLoading } = useQuery({
    queryKey: ['bingo-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bingo_cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure content is always a string array
      return data.map(card => ({
        ...card,
        content: Array.isArray(card.content) ? card.content : []
      }));
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

  const handleUpdate = (id: string, title: string) => {
    if (title.trim()) {
      updateMutation.mutate({ id, title });
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
          <CardGrid
            cards={cards || []}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}