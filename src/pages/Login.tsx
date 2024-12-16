import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in!');
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out!');
      } else if (event === 'USER_UPDATED') {
        toast.success('Profile updated successfully!');
      } else if (event === 'USER_DELETED') {
        toast.success('Account deleted successfully!');
        navigate("/login");
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Check your email for password reset instructions.');
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F4F4]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#5BB6EE]">Bingo Bliss</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#5BB6EE',
                  brandAccent: '#F1B642',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;