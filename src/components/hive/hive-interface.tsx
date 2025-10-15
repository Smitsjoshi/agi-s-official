'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const AgentNode = ({ name, x, y }: { name: string, x: number, y: number }) => (
  <motion.div
    initial={{ x, y, scale: 0 }}
    animate={{ scale: 1 }}
    className="absolute flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/50">
      <Cpu className="w-8 h-8 text-primary" />
    </div>
    <p className="mt-2 text-sm font-bold text-foreground">{name}</p>
  </motion.div>
);

export function HiveInterface() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Agent Hive Mind Visualization */}
        <div className="relative w-full h-full max-w-4xl max-h-4xl">
          {/* Queen Agent */}
          <AgentNode name="Queen" x={0} y={0} />

          {/* Placeholder for other agents */}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t bg-muted/20 p-4 flex-shrink-0">
        <form className="max-w-2xl mx-auto flex gap-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Direct your agent swarm... e.g., 'Research the future of AI.'"
            className="w-full text-base p-3 border-2 focus-visible:ring-primary/50 resize-none bg-background"
          />
          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base px-6 shadow-md"
            disabled={!query.trim()}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Direct Swarm
          </Button>
        </form>
      </div>
    </div>
  );
}
