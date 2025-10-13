'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { askAi } from '@/app/actions';
import { ChatMessageDisplay } from '../chat/chat-message';
import type { ChatMessage } from '@/lib/types';
import { nanoid } from 'nanoid';

type FileState = {
  name: string;
  type: 'image' | 'pdf';
  data: string; // data URI
};

export function VisionInterface() {
  const [file, setFile] = useState<FileState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    if (!fileToProcess.type.startsWith('image/') && fileToProcess.type !== 'application/pdf') {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image or a PDF.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile({
        name: fileToProcess.name,
        type: fileToProcess.type.startsWith('image/') ? 'image' : 'pdf',
        data: e.target?.result as string,
      });
      setMessages([]); // Reset chat on new file
    };
    reader.readAsDataURL(fileToProcess);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !file) return;

    const userMessage: ChatMessage = { id: nanoid(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const result = await askAi(input, 'AI Knowledge', messages, file); // Mode doesn't matter when file is present
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: result.answer,
        reasoning: result.reasoning,
        confidenceScore: result.confidenceScore,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to analyze the file.' });
      setMessages(messages => messages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  if (!file) {
    return (
      <Card
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <CardContent className="p-6">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-muted-foreground">Image or PDF</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
          </label>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-center gap-2 p-4 border-b">
                {file.type === 'image' ? <ImageIcon/> : <FileText />}
                <CardTitle className="text-base font-normal">{file.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                {file.type === 'image' ? (
                    <img src={file.data} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                    <iframe src={file.data} className="w-full h-full" title="PDF Preview"/>
                )}
            </CardContent>
        </Card>
        <Card className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => <ChatMessageDisplay key={msg.id} message={msg} />)}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <ChatMessageDisplay message={{ id: 'loading', role: 'assistant', content: '' }} isLoading={true} />
                )}
            </div>
            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask a question about the document..."
                        className="pr-12"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading || !input.trim()}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </Card>
    </div>
  );
}
