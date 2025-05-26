'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChat } from '@ai-sdk/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react'
import Markdown from 'react-markdown';
import { useScrollToBottom } from '../hooks/useScrollToBottom';

const MCPClient = () => {
    const { messages, input, handleInputChange, handleSubmit, status } = useChat({
      api: '/api/mcp',
      maxSteps: 5
    })
  
    const isLoading = status === 'submitted' || status === 'streaming';

    const containerRef = useScrollToBottom(messages);
  
    return (
      <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-2xl font-semibold mb-5">Agent equipped with Model Context Protocol</h1>
        <main className="w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>V0 at Home</CardTitle>
                    <CardDescription>Generate an HTML web page and deploy it in instant!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {messages.length > 0 ? (
                        <section ref={containerRef} className="h-[560px] space-y-4 overflow-y-auto rounded-lg border border-muted p-4">
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
                            {status === 'submitted' && <span className='animate-pulse'>Typing</span>}
                        </section>
                    ) : (
                        <section className='h-[560px] rounded-lg border border-muted flex justify-center items-center text-muted-foreground'>Start working together with this agent to create HTML webpages!</section>
                    )}
        
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask to scrap web contents or ask to generate HTML page and deploy it"
                        className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" size={20} /> : 'Send'}</Button>
                    </form>
                </CardContent>
            </Card>
        </main>
      </div>
    )
  }

export default MCPClient;
