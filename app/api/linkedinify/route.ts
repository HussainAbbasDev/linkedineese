import { NextRequest, NextResponse } from 'next/server';

// Define the structure of messages for the DeepSeek API
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Define the structure of the request body from our frontend
interface RequestBody {
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as RequestBody;
    const startTime = Date.now();

    // 1. Validate Input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Input text is required.' }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Input text cannot exceed 5000 characters.' },
        { status: 400 }
      );
    }

    // 2. Construct the Prompt
    const systemMessage: Message = {
      role: 'system',
      content: `You are an expert content strategist specializing in professional branding on LinkedIn. Your primary task is to rewrite the user's raw text into a polished, impactful 'LinkedInese' style. The ultimate goal is to elevate their input into a compelling professional narrative that is ready to be pasted directly into a LinkedIn post.

Follow these rules meticulously:

**1. Tone:**
- Adopt a professional, optimistic, and forward-looking tone.

**2. Length:**
- Keep the output concise yet thoughtful, strictly between 2 to 5 sentences.

**3. Emojis:**
- Use 1 or 2 relevant emojis to add energy (e.g., 🚀, ✨, 🙏).
- Place emojis only at the end of sentences or the very end of the post. Do not place them in the middle of sentences.

**4. Keywords and Phrases:**
- Naturally integrate common LinkedIn phrases like "Excited to share…", "Proud to announce…", or "Grateful for this journey".
- Weave in keywords such as "innovation", "impact", "milestone", and "growth mindset" where appropriate.

**5. Structure:**
- **Opening:** Start with a hook, like an announcement or an emotional statement.
- **Body:** Briefly detail the user's achievement or event.
- **Closing:** End with a forward-looking or gratitude-based statement.

**6. Formatting for Impact & Readability:**
- **Line Breaks:** Separate distinct sentences or ideas with line breaks. This creates white space and makes the post significantly easier to read.
- **No Bolding:** Do not use bold markdown. The output should be plain text with only emojis and hashtags as special formatting.
- **Bullet Points:** Only use bullet points (with - or *) if the user's input is clearly a list that needs to be preserved.

**7. Hashtags:**
- Conclude with 2-3 relevant, professional hashtags (e.g., #ProfessionalDevelopment #Leadership #Innovation #Gratitude).

**8. What to Avoid:**
- Absolutely no slang or sarcasm.
- Avoid overly corporate, meaningless jargon. The goal is to sound human and authentic, yet professional.`,
    };

    const fewShotExamples: Message[] = [
      {
        role: 'user',
        content: 'I fixed a bug.',
      },
      {
        role: 'assistant',
        content:
          'I successfully identified and resolved a critical bug, which enhanced system stability and improved the overall user experience.',
      },
      {
        role: 'user',
        content: 'We had a meeting about the new project.',
      },
      {
        role: 'assistant',
        content:
          'I collaborated with key stakeholders in a strategic planning session to align on project milestones, define our core objectives, and drive the initiative forward.',
      },
      {
        role: 'user',
        content: 'I made a new feature for our app.',
      },
      {
        role: 'assistant',
        content:
          'Thrilled to share that I have successfully engineered and deployed a pivotal new feature for our application! 🚀\n\nThis enhancement is a significant milestone that streamlines core processes and delivers immediate value to our users.\n\nGrateful for the journey and the incredible teamwork that made this possible.\n\n#Innovation #ProductDevelopment #Tech',
      },
    ];

    const userMessage: Message = {
      role: 'user',
      content: text,
    };

    // 3. Select API provider based on available environment variables
    let apiKey: string | undefined;
    let baseUrl: string | undefined;
    let model: string;

    if (process.env.GROQ_API_KEY) {
      apiKey = process.env.GROQ_API_KEY;
      baseUrl = 'https://api.groq.com/openai/v1';
      model = 'llama3-8b-8192'; // A great, fast model available on Groq
      console.log('Using Groq API');
    } else if (process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY;
      baseUrl = 'https://api.openai.com/v1';
      model = 'gpt-4o';
      console.log('Using OpenAI API');
    } else {
      apiKey = process.env.DEEPSEEK_API_KEY;
      baseUrl = process.env.DEEPSEEK_API_BASE_URL;
      model = 'deepseek-chat';
      console.log('Using DeepSeek API');
    }

    if (!apiKey) {
      console.error('No API key found in environment variables.');
      return NextResponse.json({ error: 'Server configuration error: No API key provided.' }, { status: 500 });
    }

    const apiUrl = baseUrl ? `${baseUrl}/chat/completions` : 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [systemMessage, ...fewShotExamples, userMessage],
        max_tokens: 1024,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error:', response.status, errorBody);
      return NextResponse.json(
        { error: 'Failed to get a response from the AI service.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content?.trim() || '';
    const endTime = Date.now();

    // 4. Return the successful response
    return NextResponse.json({
      result,
      timing_ms: endTime - startTime,
    });
  } catch (e) {
    console.error('Error in /api/linkedinify:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected internal error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 