'use client'
import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import Markdown from 'react-markdown'
import { Badge } from '../ui/badge'
import { translateWithFeedback } from '@/app/patterns/helpers'

const Evaluator = () => {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    iterationsRequired: number;
    finalTranslation: string;
  } | null>(null)

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  }

  const handleSubmit = async () => {
    const text = textRef.current?.value;
    if (!text?.trim()) return;

    setLoading(true)
    try {
      const { finalTranslation, iterationsRequired } = await translateWithFeedback(text, 'Indonesian')
      setResult({
        iterationsRequired,
        finalTranslation
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-[1200px]">
        <CardHeader>
            <CardTitle className="text-3xl">Translate and Reinforcement</CardTitle>
            <CardDescription>Translate a text, evaluates and optimize the translation iteratively based on feedback in each iterations.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Label>Text to Translate:</Label>
                <Textarea 
                  ref={textRef}
                  placeholder='Enter text to translate'
                  onKeyUp={handleKeyUp}
                  className="max-h-[240px] max-w-[798px]"
                />
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Translating...' : 'Submit'}
                </Button>
            </div>
            <div className='mt-4 space-y-4'>
                <h4>Result:</h4>
                <div className="flex gap-4">
                    <Badge className="text-lg">Iterations: {result?.iterationsRequired}</Badge>
                </div>
                {loading ? <div className='w-1/2 h-3 bg-gray-400 rounded animate-pulse' /> : (
                    <div className="w-full p-5 border rounded-lg max-w-[798px]">
                        <Markdown>{result?.finalTranslation}</Markdown>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  )
}

export default Evaluator