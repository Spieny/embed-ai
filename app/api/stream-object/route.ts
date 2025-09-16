import { heroesSchema } from '@/lib/utils';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const count = await req.json();

  const model: any = google('gemini-2.0-flash');

  const result = streamObject({
    model,
    schema: heroesSchema,
    prompt: `Generate ${count} hero descriptions for a fantasy role playing game.`,
  });

  return result.toTextStreamResponse();
}