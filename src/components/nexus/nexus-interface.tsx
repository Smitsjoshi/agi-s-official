'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Send, Sparkles, Cpu, Search, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// A single particle in the background animation
const Particle = () => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const duration = 5 + Math.random() * 5;
  const delay = Math.random() * 5;
  const size = 2 + Math.random() * 3;

  return (
    <motion.div
      className="absolute rounded-full bg-primary/50"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay,
      }}
    />
  );
};

// The main interface component
export function NexusInterface() {
  const [query, setQuery] = useState('');
  const [isEngaged, setIsEngaged] = useState(false);

  const handleEngage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsEngaged(true);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(30)].map((_, i) => <Particle key={i} />)}
      </div>

      <AnimatePresence>
        {!isEngaged ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative flex flex-col items-center justify-center flex-1 h-full"
          >
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold font-headline tracking-tighter mb-2">Agent Nexus</h1>
                <p className="text-xl text-muted-foreground">Engage the multi-agent collective.</p>
            </div>
            <Card className="w-full max-w-2xl shadow-lg bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <form onSubmit={handleEngage} className="flex flex-col gap-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Direct your agent collective... e.g., 'Develop a go-to-market strategy for a new AI-powered analytics tool.'"
                    className="w-full text-base p-4 border-2 border-border focus-visible:ring-primary/50 resize-none h-32"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold text-base shadow-md transition-all duration-300"
                    disabled={!query.trim()}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Engage Collective
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex-1 w-full h-full p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {/* Left Column: Agents */}
              <Card className="col-span-1 flex flex-col bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><GitMerge/> Agent Collective</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3"><Cpu className="text-primary"/> <div><p className="font-bold">Coordinator</p><p className="text-sm text-green-500">Active</p></div></div>
                  <div className="flex items-center gap-3"><Search className="text-muted-foreground"/> <div><p className="font-bold">Research Agent</p><p className="text-sm text-yellow-500">Processing...</p></div></div>
                  <div className="flex items-center gap-3"><Code className="text-muted-foreground"/> <div><p className="font-bold">Coding Agent</p><p className="text-sm text-muted-foreground">Idle</p></div></div>
                </CardContent>
              </Card>

              {/* Right Column: Output */}
              <Card className="col-span-1 md:col-span-2 flex flex-col bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Collective Output</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    <p className="font-bold mb-2">Objective:</p>
                    <p className="mb-4 p-3 bg-muted rounded-md">{query}</p>
                    <p className="font-bold mb-2">Summary:</p>
                    <p className="text-muted-foreground">The collective is analyzing the request. The Research Agent is currently gathering data on market trends and competitor landscapes. The Coding Agent is on standby to develop a prototype based on the findings.</p>
                </CardContent>
              </Card>
            </div>
            <Button onClick={() => setIsEngaged(false)} className="absolute top-6 right-6">New Query</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
