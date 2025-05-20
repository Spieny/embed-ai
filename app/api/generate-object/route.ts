import { weatherSchema } from '@/lib/utils';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { date } = await req.json();

  const { object } = await generateObject({
    model: google('gemini-2.0-flash'),
    schema: weatherSchema,
    system: 'You are a weather report generator',
    prompt: `Generate a random weather report for this date: ${date}`
  });

  return Response.json(object);
}