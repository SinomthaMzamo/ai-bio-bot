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
    const { contentType, tone, wordLimit, inputData, refinementPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build the prompt based on content type
    let systemPrompt = "";
    let userPrompt = "";

    if (refinementPrompt) {
      systemPrompt = `You are a professional content editor. Take the existing content and refine it based on the user's instructions. Maintain the same approximate word count (${wordLimit} words) and ${tone} perspective.`;
      userPrompt = `Refine the following content based on these instructions: "${refinementPrompt}"\n\nExisting content:\n${inputData.existingContent || JSON.stringify(inputData)}`;
    } else {
      switch (contentType) {
      case "bio":
        systemPrompt = `You are a professional content writer specializing in personal bios. Create a compelling, professional bio in ${tone} perspective. The bio should be approximately ${wordLimit} words and highlight the person's skills, experience, and achievements in a natural, engaging way.`;
        userPrompt = `Create a professional bio with the following information:
Name: ${inputData.name}
Skills: ${inputData.skills}
Experience: ${inputData.experience}
Achievements: ${inputData.achievements}`;
        break;

      case "project":
        systemPrompt = `You are a technical writer specializing in project documentation. Create a clear, professional project summary in ${tone} perspective. The summary should be approximately ${wordLimit} words and effectively communicate the project's objectives, technical aspects, achievements, and impact.`;
        userPrompt = `Create a project summary with the following information:
Project Name: ${inputData.projectName}
Objective: ${inputData.objective}
Technologies: ${inputData.technologies}
Achievements: ${inputData.achievements}
Impact: ${inputData.impact}`;
        break;

      case "reflection":
        systemPrompt = `You are an educational content writer specializing in learning reflections. Create a thoughtful, insightful learning reflection in ${tone} perspective. The reflection should be approximately ${wordLimit} words and demonstrate deep understanding, critical thinking, and personal growth.`;
        userPrompt = `Create a learning reflection with the following information:
Topic: ${inputData.topic}
Context: ${inputData.context}
Key Learnings: ${inputData.keyLearnings}
Challenges: ${inputData.challenges}
Future Application: ${inputData.application}`;
        break;

        default:
          throw new Error('Invalid content type');
      }
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Generate content error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});