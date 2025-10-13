'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Send, Loader2, Play, PlusCircle, Workflow } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { askAi } from '@/app/actions';
import type { ChatMessage, WebAgentOutput } from '@/lib/types';
import { nanoid } from 'nanoid';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const exampleGoals = [
    'Make a playlist for a late-night roadtrip',
    'Find the top 5 noise-cancelling headphones',
    'Create a workout plan to build muscle',
    'Plan a 3-day trip to Paris on a budget',
];

export function BlueprintInterface() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('blueprint-history', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    document.body.style.setProperty('--background', '240 6% 10%');
    document.body.style.setProperty('--foreground', '0 0% 98%');
    return () => {
      document.body.style.removeProperty('--background');
      document.body.style.removeProperty('--foreground');
    };
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

    // Reset conversation for a new goal
    const userMessage: ChatMessage = { id: nanoid(), role: 'user', content: currentGoal };
    setMessages([userMessage]); 
    setIsLoading(true);
    setInput('');

    try {
      const result: WebAgentOutput = await askAi(currentGoal, 'Blueprint', []);
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: '', // No simple content
        ...result
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'The AI agent failed to generate a plan.',
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const hasResult = lastMessage?.role === 'assistant' && lastMessage.items && lastMessage.integrations;

  if (!isClient) {
    return <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex h-full flex-col bg-black text-white font-sans items-center px-4 relative overflow-hidden">
        <div className="liquid-glow" style={{ zIndex: -1, opacity: 0.3 }}></div>
        <div className='absolute top-4 right-4 p-4 z-20 flex gap-2'>
            <Button variant="outline" size="sm" onClick={handleNewConversation} className="bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/50 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
            </Button>
        </div>

      <AnimatePresence>
        {!hasResult && !isLoading ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center flex-1"
          >
            <div className="relative mb-6">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative p-4 bg-black rounded-full border-4 border-neutral-800">
                    <Workflow size={40} className="text-primary" />
                </div>
            </div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-white">Blueprint</h1>
            <p className="text-neutral-400 text-lg max-w-lg mx-auto mt-4">
              The AI-powered planning agent. It deconstructs goals into actionable, structured plans with integrated tools.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
              {exampleGoals.map((goal, i) => (
                <button 
                  key={i} 
                  onClick={(e) => handleSubmit(e, goal)} 
                  className="text-left p-4 border border-neutral-800 rounded-xl hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="font-medium text-sm text-neutral-200">{goal}</p>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
            <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-5xl mx-auto flex-1 pt-24 pb-32 overflow-y-auto"
            >
             {isLoading && messages.length < 2 && (
                 <div className="flex flex-col items-center justify-center py-16 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="p-3 border-4 border-dashed border-primary/50 rounded-full mb-4"
                    >
                        <Workflow className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-lg font-medium text-white">Deconstructing goal...</p>
                    <p className="text-muted-foreground">The agent is analyzing your request and formulating a plan.</p>
                </div>
            )}
             {lastMessage && lastMessage.integrations && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Integrations</h3>
                     <div className="glass-card p-3 rounded-2xl inline-flex justify-center items-center gap-3">
                         {lastMessage.integrations.map(integration => (
                             <a key={integration.name} href={integration.action_url || '#'} target="_blank" rel="noopener noreferrer" aria-label={`Open in ${integration.name}`} className="tech-glow">
                                 <Image src={integration.logo_url} alt={`${integration.name} logo`} width={48} height={48} className="rounded-full transition-all duration-300 ease-in-out hover:scale-110" />
                             </a>
                         ))}
                     </div>
                </div>
             )}
             {lastMessage && (
                 <>
                    <h2 className="text-3xl font-semibold tracking-tight text-primary">
                        {lastMessage.title}
                    </h2>
                    <p className="mt-2 text-neutral-400 max-w-2xl">{lastMessage.description}</p>
                    
                    <div className="mt-8 space-y-3">
                        {lastMessage.items?.map((item, index) => (
                            <div key={index} className="p-4 border border-neutral-800 rounded-xl flex items-center justify-between hover:bg-neutral-900/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="text-neutral-500 font-medium w-6 text-center">{index + 1}</div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-100">{item.title}</h3>
                                        <p className="text-neutral-400 text-sm">{item.subtitle}</p>
                                        <p className="text-xs text-primary/80 font-medium mt-1">{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     {item.external_links?.spotify && <a href={item.external_links.spotify} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><Image src="https://storage.googleapis.com/stytch-public-prod/Logos/spotify-white.svg" alt="Spotify" width={20} height={20}/></a>}
                                     {item.external_links?.youtube && <a href={item.external_links.youtube} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><Image src="https://storage.googleapis.com/stytch-public-prod/Logos/youtube-icon.svg" alt="YouTube" width={20} height={20}/></a>}
                                </div>
                            </div>
                        ))}
                    </div>
                 </>
             )}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black/80 backdrop-blur-md w-full sticky bottom-0 p-4 border-t border-neutral-800">
        <div className="relative max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Give the agent a new goal..."
              className="w-full resize-none rounded-full border-2 border-neutral-700 bg-neutral-900 text-white py-3 pl-6 pr-16 text-base shadow-lg focus-visible:ring-primary focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              rows={1}
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-black" /> : <Send className="h-5 w-5 text-black" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
