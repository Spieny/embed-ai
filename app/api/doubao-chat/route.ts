import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const resp = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DOUBAO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.DOUBAO_MODEL!,
      messages,
      stream: true, // ⚠️关键：请求流式
    }),
  });

  if (!resp.ok || !resp.body) {
    const errText = await resp.text();
    return new Response(errText, { status: resp.status });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Ark 流式返回是 SSE 格式，逐行处理
        for (const line of chunk.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          if (trimmed === "data: [DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(trimmed.replace(/^data:\s*/, ""));
            const delta = json?.choices?.[0]?.delta?.content;

            if (delta) {
              // 只输出文本类型
              const text = Array.isArray(delta)
                ? delta.filter((c: any) => c.type === "text").map((c: any) => c.text).join("")
                : delta;
              if (text) controller.enqueue(new TextEncoder().encode(text));
            }
          } catch (err) {
            console.error("JSON parse error:", err, trimmed);
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
