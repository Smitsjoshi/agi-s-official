'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, User, Loader2, Info, Link as LinkIcon, Globe } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SourcePreview } from './source-preview';
import { cn } from '@/lib/utils';
import type { ChatMessage, SearchResult } from '@/lib/types';
import { Logo } from '../logo';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

// Custom hook for word-by-word typewriter effect
const useTypewriter = (text: string, speed = 100) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!text) return;

    setDisplayText(''); // Reset on new message
    const words = text.split(' ');
    let i = 0;

    const timer = setInterval(() => {
      if (i < words.length) {
        setDisplayText(prev => (prev ? `${prev} ${words[i]}` : words[i]));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

// A simple markdown-to-html renderer
const SimpleMarkdown = ({ content }: { content: string }) => {
    const typedContent = useTypewriter(content, 20); // Faster speed for main content
    const html = typedContent
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-md my-2 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded-sm">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm dark:prose-invert max-w-none" />;
};

const SearchResultDisplay = ({ result }: { result: SearchResult }) => {
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
                    <span className="text-muted-foreground truncate">{url.hostname}</span>
                </div>
                <h3 className="text-blue-400 group-hover:underline text-lg font-medium mt-1">{result.title}</h3>
            </a>
            <p className="text-sm text-neutral-400 mt-1">{result.snippet}</p>
        </motion.div>
    );
};


export function ChatMessageDisplay({ message, isLoading = false }: { message: ChatMessage; isLoading?: boolean }) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  if (message.role === 'user') {
    return (
      <div className="flex items-start gap-4 relative z-10 justify-end">
        <div className="flex-1 rounded-lg bg-primary text-primary-foreground p-4 max-w-2xl">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
         <Avatar>
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  const confidenceColor = (score: number) => {
    if (score > 0.8) return 'text-green-500';
    if (score > 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const isFinishedTyping = !isLoading && (message.content || message.liveWebAgentOutput);
  const isLiveAgentResponse = !!message.liveWebAgentOutput;

  return (
    <div className="flex items-start gap-4 relative z-10">
      <Avatar>
        <AvatarFallback>
          <Logo className="p-1" />
        </AvatarFallback>
      </Avatar>
      <Card className="flex-1 max-w-4xl">
        <CardContent className="p-4 space-y-4">
          {isLoading && !message.content ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin" />
              <span>AGI-S is thinking...</span>
            </div>
          ) : (
            <TooltipProvider delayDuration={100}>
              <div className="text-sm">
                <SimpleMarkdown content={message.content} />
              </div>

              {isLiveAgentResponse && message.liveWebAgentOutput.results && message.liveWebAgentOutput.results.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-base">Agent Results:</h4>
                   <div className="border-t pt-4">
                    {message.liveWebAgentOutput.results.map((result, index) => (
                       <SearchResultDisplay key={index} result={result} />
                    ))}
                  </div>
                </div>
              )}

              {isFinishedTyping && message.sources && message.sources.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Sources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {message.sources.map((source, index) => (
                      <SourcePreview key={index} url={source.url} title={source.title} />
                    ))}
                  </div>
                </div>
              )}

              {isFinishedTyping && (message.reasoning || message.confidenceScore) && !isLiveAgentResponse && (
                 <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                    {message.reasoning && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-1.5 hover:text-foreground">
                            <Info className="h-4 w-4" />
                            <span>Show reasoning</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="max-w-sm z-50">
                          <p>{message.reasoning}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <div className="flex-1"></div> {/* Spacer */}
                    {message.confidenceScore && (
                        <div className="flex items-center gap-2">
                           <span className="font-semibold">Confidence:</span>
                           <span className={cn("font-bold", confidenceColor(message.confidenceScore))}>
                            {(message.confidenceScore * 100).toFixed(0)}%
                           </span>
                        </div>
                      )}
                 </div>
              )}

              {isFinishedTyping && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant={feedback === 'up' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  >
                    <ThumbsUp className={cn("h-4 w-4", feedback === 'up' && "text-primary")} />
                  </Button>
                  <Button
                    variant={feedback === 'down' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  >
                    <ThumbsDown className={cn("h-4 w-4", feedback === 'down' && "text-destructive")} />
                  </Button>
                </div>
              )}
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
