import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F4F4]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#5BB6EE]">Bingo Bliss</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-[#5BB6EE] text-[#5BB6EE] hover:bg-[#CFE3EF]"
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Bingo Bliss</h2>
          <p className="text-gray-600">Start creating your custom bingo cards!</p>
        </div>
      </main>
    </div>
  );
};

export default Index;