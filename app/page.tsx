'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { LoaderCircle } from "lucide-react";
import Image from 'next/image';
import { Upload } from "lucide-react";
// 添加 Dialog 组件
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

const StreamTextSection2 = () => {
  const [uploading, setUploading] = useState(false);
  // 添加用户信息状态
  const [userInfo, setUserInfo] = useState<{ phone: string; name: string } | null>(null);
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(true);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  type MessageContent = {
    image_url?: {
      url: string;
    };
    type: 'image_url' | 'text';
    text?: string;
  }

  interface ChatMessage {
    content: string | MessageContent[];
    role: string;
  }

  type ModelContent = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };
  type ModelMessage = { role: 'user' | 'assistant' | 'system'; content: ModelContent[] };

  const fileInputRef = useRef<HTMLInputElement>(null);
  // 处理上传按钮点击
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  // 保存对话消息
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const toModelMessages = (messages: ChatMessage[]): ModelMessage[] => {
      const converted: ModelMessage[] = messages.map((msg) => {
        const role = ['user', 'assistant', 'system'].includes(msg.role) ? (msg.role as any) : 'user';
        const content: ModelContent[] = [];

        if (typeof msg.content === 'string') {
          const t = msg.content.trim();
          if (t) content.push({ type: 'text', text: t });
        } else if (Array.isArray(msg.content)) {
          for (const c of msg.content) {
            if (!c) continue;
            // 文本
            if (c.type === 'text' && typeof c.text === 'string') {
              const t = c.text.trim();
              if (t) content.push({ type: 'text', text: t });
            }
            // 用户上传图片
            else if ((c.type === 'image_url') && c.image_url?.url) {
              content.push({ type: 'image_url', image_url: { url: c.image_url.url } });
            }
          }
        }

        return { role, content };
      });
    return converted;
  };

  // 验证用户信息
  const validateUserInfo = () => {
    let isValid = true;
    
    // 验证手机号尾号
    if (!phoneInput) {
      setPhoneError('请输入手机号尾号');
      isValid = false;
    } else if (!/^\d{4}$/.test(phoneInput)) {
      setPhoneError('请输入4位数字');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    // 验证姓名
    if (!nameInput) {
      setNameError('请输入姓名缩写');
      isValid = false;
    } else if (nameInput.length < 2) {
      setNameError('姓名缩写至少2个字符');
      isValid = false;
    } else {
      setNameError('');
    }
    
    return isValid;
  };

  // 提交用户信息
  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserInfo()) {
      const userInfo = {
        phone: phoneInput,
        name: nameInput
      };
      setUserInfo(userInfo);
      setShowUserInfoDialog(false);
      
      // 保存到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  // 页面加载时检查是否已保存用户信息
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        if (parsed.phone && parsed.name) {
          setUserInfo(parsed);
          setShowUserInfoDialog(false);
        }
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !userInfo) return;


    // 添加用户消息
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage] as ChatMessage[];

    setMessages([...messages, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      // 生成用户识别编码：姓名缩写加手机尾号
      const generateUserCode = (name: string, phone: string) => {
        const nameInitials = name.split('').map(char => char.toUpperCase()).join('');
        return `${nameInitials}${phone}`;
      };
      
      const userCode = userInfo ? generateUserCode(userInfo.name, userInfo.phone) : '';

      console.log('用户编码:', userCode);

      // 发送对话历史和用户信息到保存接口（通过headers传输）
      await fetch('/api/save-conversation', {
        method: 'POST',
        body: JSON.stringify({ 
          userInfo: userInfo,
          messages: toModelMessages(newMessages)
        })
      });

      const response = await fetch('/api/doubao-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: toModelMessages(newMessages),
        })
      });

      const reader = response.body?.getReader();
      if (!reader) return;


      // 处理流式响应
      const textDecoder = new TextDecoder();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // 追加到最后一个消息
        assistantMessage = {
          ...assistantMessage,
          content: assistantMessage.content + chunk,
        };
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = assistantMessage;
          return newMsgs;
        });
      }
      
      // 对话完成后再次保存完整对话
      await fetch('/api/save-conversation', {
        method: 'POST',
        body: JSON.stringify({ 
          userInfo: userInfo,
          messages: toModelMessages([...newMessages, assistantMessage])
        })
      });
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
    let data: any;
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
        data = await response.json();
        console.log('上传成功:', data.url);
        setUploaded(true);
      }

      // 上传成功后可以将文件链接添加到对话中
      const fileMessage: ChatMessage = {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: data.url
            }
          }
          // {
          //   type: 'text',
          //   text: '请描述这张图片'
          // }
        ]
      };
      console.log('new fileMessage', fileMessage);
      const newMessages = [...messages, fileMessage];
      console.log('newMessages', newMessages);
      setMessages(newMessages);

    } catch (error) {
      console.error('文件上传错误:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* 用户信息输入弹窗 */}
      <Dialog open={showUserInfoDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>用户信息</DialogTitle>
            <DialogDescription>
              请输入您的信息以便我们更好地完成调查工作
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserInfoSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  姓名缩写
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className={nameError ? "border-red-500" : ""}
                    placeholder="请输入您的姓名缩写"
                  />
                  {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  手机尾号
                </Label>
                <div className="col-span-3">
                  <Input
                    id="phone"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className={phoneError ? "border-red-500" : ""}
                    placeholder="请输入4位手机号尾号"
                    maxLength={4}
                  />
                  {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">开始对话</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                    }`}
                >
                  {Array.isArray(message.content) ? (
                    <div className="space-y-2">
                      {message.content.map((content, index) => (
                        <div key={index}>
                          {content.type === 'image_url' && content.image_url && (
                            <Image
                              src={content.image_url.url}
                              alt="Uploaded image"
                              width={200}
                              height={200}
                              className="rounded-md"
                            />
                          )}
                          {content.type === 'text' && content.text && (
                            <Markdown>{content.text}</Markdown>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Markdown>{message.content}</Markdown>
                  )}
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
              <Button type="submit" disabled={isLoading || !userInfo}>
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
    </>
  );
};