import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const SubscribeButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        method: 'POST',
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      if (!data.url) throw new Error("No checkout URL received");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      className="bg-[#5BB6EE] hover:bg-[#4A92BE]"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Subscribe Now"}
    </Button>
  );
};