import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5BB6EE]">Bingo Bliss</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </header>
      <main>
        {/* Content will be added in future implementations */}
        <p className="text-center text-gray-600">Welcome to Bingo Bliss!</p>
      </main>
    </div>
  );
}