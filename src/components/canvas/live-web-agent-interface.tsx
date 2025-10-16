
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { Globe, ArrowRight, Cpu, CheckCircle, Shield, GitMerge, Mic, Paperclip, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { askAi } from '@/app/actions';
import type { LiveWebAgentOutput, SearchResult } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserFrame } from './browser-frame';

// --- TYPES AND INTERFACES ---
type LogEntry = {
    source: 'U.A.L' | 'ANALYZER' | 'PLANNER' | 'EXECUTOR' | 'SYNTHESIZER';
    message: string;
    icon: React.ElementType;
    color: string;
};

// --- UI COMPONENTS ---

const SearchResultCard = ({ result }: { result: SearchResult }) => {
    let hostname = 'source';
    try {
        hostname = new URL(result.url).hostname;
    } catch (e) { /* Invalid URL */ }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="group block bg-zinc-800/50 border border-zinc-700/80 rounded-lg p-4 shadow-sm hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center text-sm text-zinc-400"><Globe className="w-4 h-4 mr-2" /><span>{hostname}</span></div>
                <h3 className="text-blue-400 group-hover:underline text-lg font-medium mt-1">{result.title}</h3>
                {result.snippet && <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{result.snippet}</p>}
            </a>
        </motion.div>
    );
};

const AgentIdleView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-48 h-48 flex items-center justify-center"
        >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-900/50 to-purple-900/50 blur-2xl"></div>
            <motion.div
                animate={{ scale: [1, 1.05, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute inset-0 rounded-full border-2 border-blue-500/30"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 0.95, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }}
                className="absolute inset-0 rounded-full border-2 border-purple-500/30"
            ></motion.div>
            <Cpu size={64} className="text-zinc-400 z-10" />
        </motion.div>
        <h2 className="text-2xl font-bold text-zinc-200 mt-8">Canvas Agent</h2>
        <p className="text-zinc-400">The Universal Action Layer is awaiting your command.</p>
    </div>
);

const AgentLoadingView = ({ goal, logs }: { goal: string, logs: LogEntry[] }) => (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto h-full flex flex-col">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-200">Executing Task...</h2>
            <p className="text-zinc-400">Goal: <span className="text-zinc-100 font-medium">"{goal}"</span></p>
        </div>
        <div className="flex-grow bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/80 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => {
                const Icon = log.icon;
                return (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 mb-2"
                    >
                        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${log.color}`} />
                        <span className={`font-semibold ${log.color}`}>[{log.source}]</span>
                        <span className="text-zinc-300 flex-grow">{log.message}</span>
                    </motion.div>
                )
            })}
        </div>
    </div>
);

const AgentOutputView = ({ output }: { output: LiveWebAgentOutput }) => (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
        <div>
            <h2 className="text-3xl font-bold text-zinc-100 mb-3 flex items-center gap-3"><CheckCircle className="text-green-500"/> Task Completed</h2>
            <p className="text-zinc-300 leading-relaxed">{output.summary}</p>
        </div>
        {output.results && output.results.length > 0 && (
            <div className="border-t border-zinc-700/50 pt-6">
                <h3 className="text-xl font-semibold text-zinc-100 mb-4">Sources & Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {output.results.map((result, index) => <SearchResultCard key={result.url || index} result={result} />)}
                </div>
            </div>
        )}
    </div>
);

export function LiveWebAgentInterface() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentOutput, setAgentOutput] = useState<LiveWebAgentOutput | null>(null);
  const [currentGoal, setCurrentGoal] = useState('');
  const [agentLogs, setAgentLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      const executeAgent = async () => {
        const logMap: Record<LogEntry['source'], { icon: React.ElementType, color: string }> = {
            'U.A.L': { icon: Cpu, color: 'text-yellow-400' },
            'ANALYZER': { icon: Search, color: 'text-blue-400' },
            'PLANNER': { icon: GitMerge, color: 'text-purple-400' },
            'EXECUTOR': { icon: Shield, color: 'text-green-400' },
            'SYNTHESIZER': { icon: CheckCircle, color: 'text-teal-400' },
        };

        const initialLogs: Omit<LogEntry, 'icon' | 'color'>[] = [
            { source: 'U.A.L', message: `Received new directive: "${currentGoal}"`},
            { source: 'ANALYZER', message: 'Parsing goal and identifying key objectives.' },
            { source: 'PLANNER', message: 'Formulating a multi-step execution plan.' },
        ];

        initialLogs.forEach((log, index) => {
            setTimeout(() => {
                setAgentLogs(prev => [...prev, { ...log, ...logMap[log.source] }]);
            }, index * 100);
        });

        try {
          // @ts-ignore
          const result: LiveWebAgentOutput = await askAi(currentGoal, 'Canvas', []);
          setAgentLogs(prev => [...prev, { source: 'EXECUTOR', message: 'Executing plan and interacting with web tools...', ...logMap['EXECUTOR'] }]);
          setTimeout(() => {
            setAgentLogs(prev => [...prev, { source: 'SYNTHESIZER', message: 'Compiling findings and generating final summary.', ...logMap['SYNTHESIZER'] }]);
            setAgentOutput(result);
            setIsLoading(false);
          }, 1500);
        } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Error', description: 'The AI agent failed. Please try a simpler goal.' });
          setIsLoading(false);
          setCurrentGoal('');
        }
      };
      executeAgent();
    }
  }, [isLoading, currentGoal, toast]);


  const handleSubmit = async (goal: string) => {
    if (!goal.trim()) return;

    setCurrentGoal(goal);
    setIsLoading(true);
    setAgentOutput(null);
    setAgentLogs([]);
    setQuery('');
  };

  const handleFormSubmit = (e: FormEvent) => {
      e.preventDefault();
      handleSubmit(query);
  };

  const handleFutureFeatureClick = () => {
      toast({
          title: 'Coming Soon!',
          description: 'This multi-modal input feature is currently in development.',
      })
  }

  let browserUrl = "agi-s://canvas/idle";
  if (isLoading) {
      browserUrl = `agi-s://canvas/executing?q=${encodeURIComponent(currentGoal)}`;
  } else if (agentOutput) {
      browserUrl = `agi-s://canvas/results?goal=${encodeURIComponent(currentGoal)}`;
  }

  return (
      <div className="h-[calc(100vh-8rem)] w-full p-4">
        <BrowserFrame url={browserUrl}>
          <div className="h-full w-full flex flex-col">
            <div className="flex-grow overflow-y-auto"><AnimatePresence mode="wait">
                {isLoading ? <motion.div key="loading"><AgentLoadingView goal={currentGoal} logs={agentLogs} /></motion.div>
                 : agentOutput ? <motion.div key="output"><AgentOutputView output={agentOutput} /></motion.div>
                 : <motion.div key="input"><AgentIdleView /></motion.div>}
            </AnimatePresence></div>
            <div className="flex-shrink-0 p-4 z-10"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-4xl mx-auto">
                <form onSubmit={handleFormSubmit}><div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 w-8 h-8 rounded-lg" onClick={handleFutureFeatureClick}><Mic /></Button>
                        <Button type="button" variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 w-8 h-8 rounded-lg" onClick={handleFutureFeatureClick}><Paperclip /></Button>
                    </div>
                    <Textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Command the agent..." className="w-full text-base pl-24 pr-12 py-3 border-2 border-zinc-700/80 bg-zinc-900/80 rounded-xl focus-visible:ring-blue-500/60 focus-visible:ring-2 focus:border-blue-500/10 resize-none shadow-lg transition-all duration-300 h-12 overflow-hidden" disabled={isLoading} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(e); }}}/>
                    <Button type="submit" size="icon" className="absolute top-1/2 right-2.5 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-zinc-700 disabled:text-zinc-400 w-9 h-9" disabled={!query.trim() || isLoading}>{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}</Button>
                </div></form>
            </motion.div></div>
          </div>
        </BrowserFrame>
    </div>
  );
}
