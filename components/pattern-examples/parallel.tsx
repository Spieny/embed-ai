'use client'
import { ReactNode, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { parallelCodeReview } from '@/app/patterns/helpers'
import { Button } from '../ui/button'
import { BadgeCheck, ChartLine, LoaderCircle, ShieldHalf } from 'lucide-react'
import Markdown from 'react-markdown'
import { Separator } from '../ui/separator'

type Level = "low" | "medium" | "high";

type Review = {
    type: 'security' | 'performance' | 'maintainability';
    vulnerabilities?: string[];
    riskLevel?: Level;
    suggestions?: string[];
    issues?: string[];
    impact?: Level;
    optimizations?: string[];
    concerns?: string[];
    qualityScore?: number;
    recommendations?: string[];
}

type ParallelResult = {
    summary: string;
    reviews: Review[];
}

const Parallel = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParallelResult | null>(null);
  const codeRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const code = codeRef.current?.value;
    if (!code?.trim()) return;
    
    setLoading(true);
    try {
      const {reviews, summary} = await parallelCodeReview(code);
      setResult({ reviews: reviews as Review[], summary});
      console.log(reviews);
      console.log(summary);
    } catch (error) {
      console.error('Error during code review:', error);
    } finally {
      setLoading(false);
    }
  };

  const securityChecks = result?.reviews?.find((review) => review?.type === 'security');
  const performanceChecks = result?.reviews?.find((review) => review?.type === 'performance');
  const maintainabilityChecks = result?.reviews?.find((review) => review?.type === 'maintainability');

  return (
    <Card className="max-w-[1200px]">
        <CardHeader>
            <CardTitle className="text-3xl">Code Reviewer</CardTitle>
            <CardDescription>Run parallel model call for simultaneous code review.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                <Label>Code Snippet:</Label>
                <Textarea 
                  ref={codeRef}
                  placeholder='Input the code snippet you want to review'
                  onKeyUp={handleKeyUp}
                  className="max-h-[240px]"
                />
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Reviewing...' : 'Submit'}
                </Button>
            </div>
            <Separator className="my-5" />
            <section className='flex justify-between gap-4'>
              <ReviewCard
                title="Security"
                item="Risk Level"
                value={securityChecks?.riskLevel}
                icon={<ShieldHalf size={24} />}
                isLoading={loading}
              />
              <ReviewCard
                title="Performance"
                item="Impact"
                value={performanceChecks?.impact}
                icon={<ChartLine size={24} />}
                isLoading={loading}
              />
              <ReviewCard
                title="Maintainability"
                item="Quality Score"
                value={maintainabilityChecks?.qualityScore}
                icon={<BadgeCheck size={24} />}
                isLoading={loading}
              />
            </section>
            
            <Separator className="my-5" />
            <Markdown>{result?.summary}</Markdown>
        </CardContent>
    </Card>
  )
}

type ReviewCardProps = {
  title: string;
  item: string;
  value?: string | number;
  icon: ReactNode;
  isLoading: boolean;
}

const ReviewCard = ({ title, item, value, icon, isLoading }: ReviewCardProps) => (
  <Card className="mt-4 w-full">
    <CardHeader>
      <CardTitle className="flex gap-2 items-center">
        {icon}
        <h4 className="text-xl">{title}</h4>
      </CardTitle>
      <CardDescription>{item}</CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? <LoaderCircle size={20} className="animate-spin" /> : value}
    </CardContent>
  </Card>
);

export default Parallel