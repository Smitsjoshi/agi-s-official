'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Send, Loader2, PlusCircle, Search, Globe, Bookmark, Star, Github, BookOpen, Youtube, Linkedin, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { askAi } from '@/app/actions';
import type { ChatMessage, LiveWebAgentOutput, SearchResult } from '@/lib/types';
import { nanoid } from 'nanoid';
import { motion, AnimatePresence } from 'framer-motion';

const useTypewriter = (text: string, speed = 10) => {
    const [displayText, setDisplayText] = useState('');
  
    useEffect(() => {
      setDisplayText('');
      if (text) {
        let i = 0;
        const timerId = setInterval(() => {
          if (i < text.length) {
            setDisplayText(prev => prev + text.charAt(i));
            i++;
          } else {
            clearInterval(timerId);
          }
        }, speed);
        return () => clearInterval(timerId);
      }
    }, [text, speed]);
  
    return displayText;
};

const SearchResultCard = ({ result }: { result: SearchResult }) => {
    const url = new URL(result.url);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
        >
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="group">
                <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{url.hostname}</span>
                </div>
                <h3 className="text-blue-500 group-hover:underline text-xl font-medium mt-1">{result.title}</h3>
            </a>
            <p className="text-sm text-neutral-400 mt-1">{result.snippet}</p>
        </motion.div>
    );
};


export function LiveWebAgentInterface() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('live-agent-history', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleNewConversation = () => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent, goal?: string) => {
    e.preventDefault();
    const currentGoal = goal || input;
    if (!currentGoal.trim()) return;

    const userMessage: ChatMessage = { id: nanoid(), role: 'user', content: currentGoal };
    setMessages([userMessage]); 
    setIsLoading(true);
    setInput('');

    try {
      const result: LiveWebAgentOutput = await askAi(currentGoal, 'Canvas', []);
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: result.summary,
        liveWebAgentOutput: result,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'The AI agent failed its task. This can happen due to website restrictions or complex navigation. Please try a simpler goal.',
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const hasResult = lastMessage?.role === 'assistant' && lastMessage.liveWebAgentOutput;
  const typedSummary = useTypewriter(lastMessage?.content || '');

  if (!isClient) {
    return <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center p-4">
        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
            {/* Browser Header */}
            <div className="bg-muted border border-b-0 border-border rounded-t-xl shadow-2xl flex-shrink-0">
                <div className="h-11 px-4 flex items-center gap-2 border-b border-border">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 ml-4 bg-background h-7 rounded-md flex items-center px-3">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-foreground ml-2 truncate">
                            {isLoading ? 'Agent is working...' : (messages[0]?.content || 'Ready for new goal...')}
                        </p>
                    </div>
                </div>
                 <div className="h-10 px-2 flex items-center gap-1 border-b border-border">
                    <Button variant="ghost" size="sm" className="h-8"><Star className="mr-2 h-4 w-4" /> Bookmarks</Button>
                    <Button variant="ghost" size="sm" className="h-8"><Github className="mr-2 h-4 w-4" /> GitHub</Button>
                    <Button variant="ghost" size="sm" className="h-8"><BookOpen className="mr-2 h-4 w-4" /> Wikipedia</Button>
                </div>
            </div>

            {/* Browser Content */}
            <div className="bg-background border border-t-0 border-border rounded-b-xl p-4 sm:p-8 flex-1 overflow-y-auto">
                {(!messages.length && !isLoading) && (
                     <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative mb-6">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                            <div className="relative p-4 bg-background rounded-full border-4 border-muted">
                                <Cpu size={40} className="text-primary" />
                            </div>
                        </div>
                        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">Canvas</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-2">
                           Give the autonomous AI agent a goal, and it will use a live web browser to achieve it.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Button variant="outline" size="lg" className="h-20 w-20 flex-col"><Youtube className="h-8 w-8 mb-1" /> YouTube</Button>
                            <Button variant="outline" size="lg" className="h-20 w-20 flex-col"><Linkedin className="h-8 w-8 mb-1" /> LinkedIn</Button>
                            <Button variant="outline" size="lg" className="h-20 w-20 flex-col"><ShoppingCart className="h-8 w-8 mb-1" /> Amazon</Button>
                        </div>
                    </div>
                )}
                {(isLoading && !hasResult) && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="p-3 border-4 border-dashed border-primary/50 rounded-full mb-4"
                        >
                            <Cpu className="h-8 w-8 text-primary" />
                        </motion.div>
                        <p className="text-lg font-medium text-foreground">Agent is navigating the web...</p>
                        <p className="text-muted-foreground">This may take a moment. The agent is using a live browser to find the information.</p>
                    </div>
                )}
                {hasResult && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-headline text-lg text-primary mb-2">Agent's Summary</h2>
                            <p className="prose prose-sm dark:prose-invert max-w-none text-foreground">{typedSummary}</p>
                        </div>
                        <div className="border-t pt-6">
                            <h3 className="font-headline text-lg text-foreground mb-4">Relevant Search Results</h3>
                            {lastMessage.liveWebAgentOutput?.results?.map(result => (
                                <SearchResultCard key={result.url} result={result} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="w-full sticky bottom-0 pt-4 mt-auto">
            <div className="relative max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Give the agent a new goal..."
                    className="w-full rounded-full border-2 border-border bg-background text-foreground py-3 pl-6 pr-16 text-base shadow-lg focus-visible:ring-primary focus:border-primary h-12"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                        }
                    }}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary hover:bg-primary/90" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
                </form>
            </div>
        </div>
    </div>
  );
}
