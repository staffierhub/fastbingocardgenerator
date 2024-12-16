import { Navigation } from "@/components/layout/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { BingoCard } from "@/components/bingo/BingoCard";

export default function Templates() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['bingo-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bingo_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bingo Templates</h1>
          <p className="text-gray-600 mt-2">Choose from our collection of pre-made bingo templates</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates?.map((template) => (
            <div key={template.id}>
              <BingoCard
                title={template.title}
                showTitle={template.show_title}
                includeFreeSpace={template.include_free_space}
                bingoContent={template.content}
                gridSize={template.grid_size}
                cardType={template.card_type}
                backgroundUrl={template.background_url}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}