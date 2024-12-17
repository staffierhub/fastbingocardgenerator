import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          navigate("/generator");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F4F4]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Link to="/" className="block text-3xl font-bold text-center mb-8 text-[#5BB6EE] hover:text-[#4A92C7] transition-colors">
          FastBingoCardGenerator.com
        </Link>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#5BB6EE",
                  brandAccent: "#4A92C7",
                },
              },
            },
          }}
          providers={["google"]}
        />
      </div>
    </div>
  );
}
