export const maxDuration = 30;

export async function POST(req: Request) {
  // 获取请求体
  const body = await req.json();
  
  // 获取headers
  const headers = {
    'X-Token': req.headers.get('X-Token') || ''
  };
  
  // 打印信息
  console.log('=== Conversation Save Request ===');
  console.log('Headers:', headers);
  console.log('Messages:', JSON.stringify(body.messages, null, 2));
  console.log('================================');
  
  // 返回成功响应
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Conversation data received and logged' 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}