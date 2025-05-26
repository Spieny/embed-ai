'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useRef, useState, useTransition } from 'react'
import { generateMarketingCopy } from '@/app/patterns/helpers'
import Markdown from 'react-markdown';
import { Badge } from '../ui/badge'

type MarketingCopyResult = {
    copy: string;
    qualityMetrics: {
        hasCallToAction: boolean;
        emotionalAppeal: number;
        clarity: number;
    }
}

const Sequential = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<MarketingCopyResult | null>(null);
  const [loading, startTransition] = useTransition();

  const generateCopy = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    startTransition(async () => {
        if (ref.current && ref.current.value) {
            const { copy, qualityMetrics } = await generateMarketingCopy(ref.current.value);
            setResult({copy, qualityMetrics});
        }
    });
  }
  
  return (
    <Card className="max-w-[1200px]">
        <CardHeader>
            <CardTitle className="text-3xl">Generate Marketing Copy</CardTitle>
            <CardDescription>Takes user input and create a marketing copy, perform quality check on the output and regenerate with more specific instructions</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Label htmlFor="topic">Topic</Label>
                <Input 
                    ref={ref} 
                    onKeyUp={(e) => generateCopy(e)} 
                    id="topic" 
                    name="topic" 
                    placeholder="Input what topic you want to generate a marketing copy" 
                />
            </div>
            <div className='mt-4 space-y-4'>
                <h4>Result:</h4>
                <div className="flex gap-4">
                    <Badge>Has Call To Action: {result?.qualityMetrics.hasCallToAction.toString()}</Badge>
                    <Badge>Emotional Appeal: {result?.qualityMetrics.emotionalAppeal}</Badge>
                    <Badge>Clarity: {result?.qualityMetrics.clarity}</Badge>
                </div>
                {loading ? <div className='w-1/2 h-3 bg-gray-400 rounded animate-pulse' /> : <Markdown>{result?.copy}</Markdown>}
            </div>
        </CardContent>
    </Card>
  )
}

export default Sequential