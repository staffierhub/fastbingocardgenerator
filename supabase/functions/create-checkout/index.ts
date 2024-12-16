import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    console.log('Starting checkout process...')
    
    let email: string | undefined;
    let customer_id: string | undefined;

    // Try to get user email if they're authenticated
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        if (!sessionError && session) {
          email = session.user.email;
          console.log('Found authenticated user email:', email);
        }
      }
    } catch (error) {
      console.log('No authenticated user found, continuing as guest');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // If we have an email, check for existing customer
    if (email) {
      console.log('Checking for existing customer...')
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      })

      if (customers.data.length > 0) {
        customer_id = customers.data[0].id;
        console.log('Found existing customer:', customer_id);
        
        // check if already subscribed to this price
        const subscriptions = await stripe.subscriptions.list({
          customer: customers.data[0].id,
          status: 'active',
          price: 'price_1QVGtkAtzaF3EPGiOo9IAxKJ',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          throw new Error("You are already subscribed to this plan");
        }
      }
    }

    console.log('Creating checkout session...')
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : email, // Only set if we have an email but no customer
      line_items: [
        {
          price: 'price_1QVGtkAtzaF3EPGiOo9IAxKJ',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/generator`,
      cancel_url: `${req.headers.get('origin')}/generator`,
      allow_promotion_codes: true,
    })

    console.log('Checkout session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in checkout process:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})