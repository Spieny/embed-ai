'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import Markdown from "react-markdown";
import { LoaderCircle} from "lucide-react";
import Image from 'next/image';
import { Upload } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // 处理上传按钮点击
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('上传失败');
      } else {
        const data = await response.json();
        console.log('上传成功:', data); 
      }
      
      // 上传成功后可以将文件链接添加到对话中
      const fileMessage = { 
        role: 'user', 
        content: `[上传文件] ${file.name}` 
      };
      setMessages(prev => [...prev, fileMessage]);
    } catch (error) {
      console.error('文件上传错误:', error);
    } finally {
      setUploading(false);
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

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                disabled={isLoading || uploading}
                accept=".png,.jpg,.jpeg"
                max="10485760"
              />
              <Button 
                type="button" 
                variant="outline"
                disabled={isLoading || uploading}
                className="px-3"
                onClick={handleUploadClick}
              >
                {uploading ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  <Upload size={20} />
                )}
              </Button>
            </label>
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={20} />
              ) : (
                '发送'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};