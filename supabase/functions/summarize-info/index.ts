import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { formData, contentType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that summarizes user information in a natural, conversational way. 
            Your task is to take the raw user input and rephrase it in a clear, professional, and easy-to-scan format.
            Do NOT just repeat what the user said - show understanding by summarizing it in your own words.
            Make it more readable and organized. Be concise but comprehensive.`
          },
          {
            role: 'user',
            content: `Please summarize the following information about a ${contentType} in a natural, conversational way. 
            Make it easy to read and scan. Group related information together.
            
            Information collected:
            ${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}
            
            Provide a brief, natural summary that shows you understand what the user shared. Format it in a scannable way with bullet points or short paragraphs.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`Failed to generate summary: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
