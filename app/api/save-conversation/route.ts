import { prisma } from '@/lib/prisma';

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  const { userInfo, messages } = body;
  const { phone, name, conversationId } = userInfo;


  try {
    // 1. 保存对话元信息（如果不存在）
    await prisma.conversation.upsert({
      where: { conversationId },
      update: {},
      create: {
        conversationId,
        userPhoneTail: phone,
        userName: name,
      },
    });

    // 2. 保存消息
    for (const msg of messages) {
      for (const c of msg.content) {
        await prisma.conversationMessage.create({
          data: {
            conversationId,
            role: msg.role,
            contentType: c.type,
            contentText: c.type === 'text' ? c.text : null,
            contentImageUrl:
              c.type === 'image_url' ? c.image_url?.url || null : null,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    console.error('Save error:', err);
    return new Response(
      JSON.stringify({ success: false }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
