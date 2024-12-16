import { Button } from "@/components/ui/button";
import { useState } from "react";

export const SubscribeButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      // Redirect to Stripe test payment link
      window.location.href = 'https://buy.stripe.com/test_8wM5kR8E2guy5m8eUU';
    } catch (error) {
      console.error('Error:', error);
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