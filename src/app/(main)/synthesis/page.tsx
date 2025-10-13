'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileJson, FileSpreadsheet, Send, Loader2, BookCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSynthesisAction } from '@/app/actions';
import type { ChatMessage, SynthesisOutput, SynthesisContentBlock } from '@/lib/types';
import { nanoid } from 'nanoid';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell } from 'recharts';
import { ChatMessageDisplay } from '@/components/chat/chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';

type FileState = {
  name: string;
  type: 'csv' | 'json';
  data: string; // The raw string data of the file
};

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function SynthesisPage() {
  const [file, setFile] = useState<FileState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (fileToProcess: File) => {
    const fileType = fileToProcess.name.endsWith('.csv') ? 'csv' : fileToProcess.name.endsWith('.json') ? 'json' : null;
    if (!fileType) {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a CSV or JSON file.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      setFile({
        name: fileToProcess.name,
        type: fileType,
        data: fileContent,
      });
      setMessages([]);
      toast({ title: 'File Ready', description: `Loaded ${fileToProcess.name}. Ask a question to begin analysis.` });
    };
    reader.readAsText(fileToProcess);
  };
  
  const resetState = () => {
    setFile(null);
    setMessages([]);
    setInput('');
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !file) return;

    const userMessage: ChatMessage = { id: nanoid(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const result: SynthesisOutput = await generateSynthesisAction({ query: input, ...file });
      
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: '', // Main content will be in blocks
        synthesisBlocks: result.content,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to analyze the data.' });
      setMessages(messages => messages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentBlock = (block: SynthesisContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return <p key={index} className="prose dark:prose-invert max-w-none">{block.content}</p>;
      case 'chart':
        return (
          <Card key={index} className="my-4">
            <CardHeader>
                <CardTitle>{block.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  {block.chartType === 'pie' ? (
                    <PieChart>
                      <Pie data={block.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {block.data.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                        }}
                      />
                      <Legend iconType="circle" />
                    </PieChart>
                  ) : (
                    <RechartsBarChart data={block.data}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip
                          contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: 'var(--radius)',
                          }}
                      />
                      <Legend iconType="circle" />
                      {Object.keys(block.data[0] || {}).filter(key => key !== 'name').map((key, i) => (
                          <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                      ))}
                    </RechartsBarChart>
                  )}
                </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case 'table':
         return (
            <Card key={index} className="my-4">
                <CardHeader>
                    <CardTitle>{block.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b">
                                {block.headers.map(header => <th key={header} className="p-2 text-left font-medium text-muted-foreground">{header}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {block.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                {row.map((cell, cellIndex) => <td key={cellIndex} className="p-2">{cell}</td>)}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        )
      default:
        return null;
    }
  };

  const AssistantMessageDisplay = ({ message }: { message: ChatMessage }) => (
     <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <ChatMessageDisplay message={{ id: message.id, role: 'assistant', content: '' }} />
        </div>
        <Card className="flex-1">
            <CardContent className="p-4 space-y-4">
            {isLoading && !message.synthesisBlocks ? (
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin" />
                    <span>AGI-S is analyzing...</span>
                </div>
            ) : (
                message.synthesisBlocks?.map(renderContentBlock)
            )}
            </CardContent>
        </Card>
    </div>
  );

  if (!file) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
            <h1 className="font-headline text-4xl font-bold text-primary">Synthesis</h1>
            <p className="text-muted-foreground text-lg mt-2">Your AI Data Analyst & Report Generator.</p>
        </div>
        <Card
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="max-w-2xl mx-auto"
        >
            <CardHeader>
                <CardTitle>Upload Your Data</CardTitle>
                <CardDescription>Upload a CSV or JSON file to begin your analysis.</CardDescription>
            </CardHeader>
            <CardContent>
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-muted-foreground">CSV or JSON files</p>
                </div>
                <input ref={fileInputRef} id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.json" />
            </label>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-background">
            <div className="flex items-center gap-2">
                {file.type === 'csv' ? <FileSpreadsheet className="text-primary" /> : <FileJson className="text-primary" />}
                <span className="font-medium">{file.name}</span>
            </div>
            <Button variant="outline" onClick={resetState}>Upload New File</Button>
        </div>
        <ScrollArea className="flex-1">
             <div className="p-4 md:p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center py-16">
                        <BookCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Data loaded. Ask a question to begin your analysis.</p>
                    </div>
                )}
                {messages.map(msg => (
                     msg.role === 'user'
                        ? <ChatMessageDisplay key={msg.id} message={msg} />
                        : <AssistantMessageDisplay key={msg.id} message={msg} />
                ))}
                 {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <AssistantMessageDisplay message={{ id: 'loading', role: 'assistant', content: '' }} />
                )}
            </div>
        </ScrollArea>
        <div className="border-t bg-background/95 p-4 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about your data, e.g., 'What are the key trends?' or 'Chart sales by region'"
                    className="pr-12"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    </div>
  );
}
