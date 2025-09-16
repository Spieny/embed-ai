'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Markdown from "react-markdown";
import { LoaderCircle} from "lucide-react";
import Image from 'next/image';


export default function Home() {
  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-semibold mb-5 flex items-center gap-2">
        <Image 
          src="https://ark-auto-2100466578-cn-beijing-default.tos-cn-beijing.volces.com/model_cardXr5mijtuwf.png"
          alt="Logo"
          width={30}  
          height={30}
          className="object-contain"
        />
        <span>今天有什么可以帮到你?</span>
      </h1>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <StreamTextSection2 />
      </main>
    </div>
  );
}

const StreamTextSection = () => {
  // 保存对话消息
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 添加用户消息
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('/api/stream-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] })
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      // 处理流式响应
      const textDecoder = new TextDecoder();
      const assistantMessage = { role: 'assistant', content: '' };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将新的文本片段添加到助手的回复中
        const text = textDecoder.decode(value);
        assistantMessage.content += text;
        
        // 更新消息列表，保留之前所有的消息
        setMessages([...newMessages, assistantMessage]);
      }
    } catch (error) {
      console.error('错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>
        <CardTitle>DeepSeek</CardTitle>
        <CardDescription>AI 智能对话</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="max-h-[1000px] overflow-y-auto space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ))}
        </section>

        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              '发送'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const StreamTextSection2 = () => {
  // 保存对话消息
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 添加用户消息
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('/api/doubao-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] })
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      // 处理流式响应
      const textDecoder = new TextDecoder();
      const assistantMessage = { role: 'assistant', content: '' };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将新的文本片段添加到助手的回复中
        const text = textDecoder.decode(value);
        assistantMessage.content += text;
        
        // 更新消息列表，保留之前所有的消息
        setMessages([...newMessages, assistantMessage]);
      }
    } catch (error) {
      console.error('错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>
        <CardTitle>AI 智能助手</CardTitle>
        <CardDescription>向 AI 提出你的问题</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="max-h-[1000px] overflow-y-auto space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ))}
        </section>

        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              '发送'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};