import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Home, User, LogOut, Grid } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function Navigation() {
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <div className="w-full border-b mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#5BB6EE] font-['__Inter_e66fe9', '__Inter_Fallback_e66fe9']">
          instantbingogenerator.com
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <Link 
                to="/generator" 
                className={navigationMenuTriggerStyle() + " gap-2"}
              >
                <Home className="h-4 w-4" />
                Generator
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link 
                to="/my-cards" 
                className={navigationMenuTriggerStyle() + " gap-2"}
              >
                <User className="h-4 w-4" />
                My Cards
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/templates" 
                className={navigationMenuTriggerStyle() + " gap-2"}
              >
                <Grid className="h-4 w-4" />
                Templates
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <button 
                onClick={handleLogout}
                className={navigationMenuTriggerStyle() + " gap-2"}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}