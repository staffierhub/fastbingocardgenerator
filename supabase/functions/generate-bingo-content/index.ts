import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, gridSize = "3x3" } = await req.json();
    const size = parseInt(gridSize.split('x')[0]);
    const totalItems = size * size;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates bingo card content. Generate content as a JSON array of ${totalItems} unique strings (if free space is enabled, one less item will be needed).`
          },
          {
            role: 'user',
            content: `Generate ${totalItems} unique bingo squares content for a ${theme} themed bingo game. Return only a JSON array of strings, nothing else.`
          }
        ],
      }),
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Ensure the response is properly parsed as JSON
    if (typeof content === 'string') {
      content = JSON.parse(content);
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-bingo-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});