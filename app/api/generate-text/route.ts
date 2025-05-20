import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { country } = await req.json();

  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    system: 'You are a professional chef from a 5 star restaurant',
    prompt: `Write recipes of specialty foods from the country ${country}, starting from appetizer, main dish, and dessert.`
  });

  return Response.json({ text });
}