import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model: any = deepseek('deepseek-chat');

  const result = await streamText({
    model,
    system: '你是被嵌入到一个问卷中的对话助手,使用中文回答问题,今天是' + 
        new Date().toLocaleDateString() +
        '用户正在做一个研究调查问卷,旨在探讨人工智能（AI）在决策任务中的影响。' +
        '用户查看问卷给出的股票历史数据后,将会向您提问一系列关于股票的问题' +
        '请你做简单的回答,如果用户问的问题和调查问卷无关,请礼貌的告诉用户,你只能回答和股票相关的问题', 
    messages,
  });

  return result.toTextStreamResponse();
}