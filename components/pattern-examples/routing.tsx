'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Mail, TicketSlash, Wrench, UserRound, Bot, LoaderCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRef, useState } from 'react';
import { handleCustomerQuery } from '@/app/patterns/helpers';
import Markdown from 'react-markdown';

type RoutingResult = {
    response: string;
    classification: {
        type: "general" | "refund" | "technical";
        reasoning: string;
        complexity: "simple" | "complex";
    }
}

const Routing = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<RoutingResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleKeyUp = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputRef.current) {
      setLoading(true);
      const query = inputRef.current.value;
      // Handle the query here
      const { response, classification } = await handleCustomerQuery(query);
      setResult({ response, classification });
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-[1200px]">
        <CardHeader>
            <CardTitle className="text-3xl">Handle Customer Query</CardTitle>
            <CardDescription>Classify the customer query and use the classification to rearrange the model and system prompt for better answer.</CardDescription>
        </CardHeader>
        <CardContent>
            <section className="space-y-6">
                <div className="space-y-3">
                    <div className="flex gap-2 items-center justify-end">
                        <Label className="text-xl">Customer</Label>
                        <UserRound size={24} />
                    </div>
                    <Input 
                      ref={inputRef}
                      id='query' 
                      name='query' 
                      placeholder='Insert your customer query'
                      onKeyUp={handleKeyUp}
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                        <Bot size={24} />
                        <Label className="text-xl">Model</Label>
                    </div>
                    <div className="flex gap-4">
                        <Badge variant={result?.classification.type === 'general' ? "default" : "secondary"}><Mail size={20} /> General</Badge>
                        <Badge variant={result?.classification.type === 'refund' ? "default" : "secondary"}><TicketSlash size={20} /> Refund</Badge>
                        <Badge variant={result?.classification.type === 'technical' ? "default" : "secondary"}><Wrench size={20} /> Technical</Badge>
                    </div>
                    <p>Answer: {loading ? <LoaderCircle size={20} className="animate-spin" /> : null}</p>
                    <Markdown>{result?.response}</Markdown>
                </div>
                
            </section>
        </CardContent>
    </Card>
  )
}

export default Routing