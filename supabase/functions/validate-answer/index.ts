import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const validationPrompt = `You are a conversational assistant validating user responses in a chat interface.

Question asked: "${question}"
User's answer: "${answer}"

Analyze if the answer appropriately addresses the question. Consider:
1. Does the answer relate to what was asked?
2. Is it specific and meaningful (not just generic words)?
3. Does it provide useful information?

Respond with a JSON object:
{
  "isValid": true/false,
  "feedback": "brief message to user explaining why their answer doesn't work and what you need instead",
  "acknowledgment": "brief, natural acknowledgment of what they shared (only if valid)"
}

Examples:
- If asked "What's the name of your project?" and they say "Hello my name is Derek", respond with isValid: false and feedback asking specifically for the PROJECT name, not their personal name.
- If asked about technologies and they say "i used my hands", respond with isValid: false asking for specific software, programming languages, frameworks, or tools used.
- If the answer is too vague or nonsensical, ask for more specific details.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: validationPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to validate answer');
    }

    const data = await response.json();
    const validationResult = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(validationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in validate-answer function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
