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
    const { theme } = await req.json();
    console.log('Received theme:', theme);

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
            content: 'You are a helpful assistant that generates content for bingo cards. Generate content as an array of strings.'
          },
          {
            role: 'user',
            content: `Generate 25 unique, fun, and engaging bingo squares content for a ${theme} themed bingo game. Each item should be concise (2-4 words). Return ONLY an array of strings, no additional text or formatting.`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let content;
    try {
      // Try to parse the content as JSON first
      content = JSON.parse(data.choices[0].message.content.trim());
    } catch (e) {
      // If parsing fails, split the text into an array
      content = data.choices[0].message.content
        .trim()
        .split('\n')
        .map(item => item.replace(/^\d+\.\s*|-\s*|"\s*|\s*"$/g, '').trim())
        .filter(item => item.length > 0);
    }

    if (!Array.isArray(content)) {
      throw new Error('Content is not an array');
    }

    console.log('Processed content:', content);

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in generate-bingo-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});