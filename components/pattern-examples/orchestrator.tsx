'use client'
import React, { useRef, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader } from 'lucide-react'
import { implementFeature } from '@/app/patterns/helpers'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

type File = {
  purpose: string;
  filePath: string;
  changeType: 'create' | 'modify' | 'delete';
};

type FileChange = {
  file: File;
  implementation: {
    explanation: string;
    code: string;
  };
}

type ImplementationResult = {
  plan: {
    files: File[];
    estimatedComplexity: 'low' | 'medium' | 'high';
  };
  changes: FileChange[];
}

const getFileName = (path: string) => {
    const splitPath = path.split('/');
    if (splitPath.length === 0) return path;

    return splitPath[splitPath.length - 1];
}

const Orchestrator = () => {
  const [loading, startTransition] = useTransition();
  const [result, setResult] = useState<ImplementationResult | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const request = codeRef.current?.value;
    if (!request?.trim()) return;
    
    startTransition(async () => {
      try {
        const res = await implementFeature(request);
        setResult(res);
        console.log(res);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  };

  return (
    <Card className="max-w-[1200px]">
        <CardHeader>
            <CardTitle className="text-3xl">Implementation Planner</CardTitle>
            <CardDescription>Plan the implementation and execute different implementation type with different workers.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                <Label>Feature Request:</Label>
                <Input 
                  ref={codeRef}
                  placeholder='Enter your feature request'
                  onKeyUp={handleKeyUp}
                  className="max-h-[240px]"
                />
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? <Loader size={20} className="animate-spin" /> : null} Submit
                </Button>
            </div>
            <section className="mt-5 rounded-md border">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="p-5">No</TableHead>
                            <TableHead className="p-5">File Path</TableHead>
                            <TableHead className="p-5">File Purpose</TableHead>
                            <TableHead className="p-5">Change Type</TableHead>
                            <TableHead className="p-5">Implementation Code</TableHead>
                            <TableHead className="p-5">Explanation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result?.changes?.map((fileChange, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="p-5">{idx + 1}</TableCell>
                                <TableCell className="p-5">{fileChange.file.filePath}</TableCell>
                                <TableCell className="p-5">{fileChange.file.purpose}</TableCell>
                                <TableCell className="p-5"><Badge variant="outline">{fileChange.file.changeType}</Badge></TableCell>
                                <TableCell className="p-5">
                                    <Dialog>
                                        <DialogTrigger asChild className="cursor-pointer hover:underline">
                                            <pre>{getFileName(fileChange.file.filePath)}</pre>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-1/2 h-full sm:max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>{getFileName(fileChange.file.filePath)}</DialogTitle>
                                            </DialogHeader>
                                            <pre className="bg-muted p-3 rounded-lg overflow-auto">{fileChange.implementation.code}</pre>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell className="p-5">
                                    <HoverCard>
                                        <HoverCardTrigger className="cursor-pointer">Hover</HoverCardTrigger>
                                        <HoverCardContent className="w-[560px]">
                                            <div className="p-5 w-full">
                                                {fileChange.implementation.explanation}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!result && <TableRow><TableCell colSpan={6} className="text-center">No implementation plan to be shown</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </section>
        </CardContent>
    </Card>
  )
}

export default Orchestrator