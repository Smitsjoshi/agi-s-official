'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Map, Users, History, Shield, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCosmosAction } from '@/app/actions';
import type { CosmosOutput } from '@/lib/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const examplePrompts = [
  "A dieselpunk world where ancient Rome never fell, but discovered electricity.",
  "A solar system where planets are the backs of giant space-faring creatures.",
  "A cyberpunk city run by five dragon-CEOs from a neon-drenched arcology.",
  "An enchanted forest where trees are made of crystal and seasons change based on emotions."
];

export default function CosmosPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CosmosOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (currentPrompt: string) => {
    if (!currentPrompt.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await generateCosmosAction({ prompt: currentPrompt });
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        throw new Error(response.error || 'Failed to generate universe.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Universe',
        description: error.message,
      });
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(prompt);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background text-foreground relative overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0, hsl(var(--primary) / 0.5), transparent 40%), radial-gradient(circle at 10% 10%, hsl(var(--chart-4)/0.4), transparent 30%), radial-gradient(circle at 90% 80%, hsl(var(--chart-2)/0.4), transparent 30%)',
        }}
      />
      
      <div className="container mx-auto p-4 md:p-8 relative z-10">
        <AnimatePresence>
          {!result && (
            <motion.div
              key="prompt-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]"
            >
              <h1 className="font-headline text-5xl font-bold text-primary">Cosmos</h1>
              <p className="text-muted-foreground text-xl mt-2">The AI Universe & Lore Generator</p>
              
              <Card className="w-full mt-8 glass-card">
                <form onSubmit={handleSubmit}>
                  <CardContent className="p-6">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe a high-concept world..."
                      className="min-h-[100px] text-base bg-transparent focus-visible:ring-primary/50"
                      disabled={isLoading}
                    />
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
                      {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" />Generate Universe</>}
                    </Button>
                     <div className="flex flex-wrap items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">Or try an example:</p>
                        {examplePrompts.slice(0, 2).map(p => (
                            <Button key={p} variant="link" size="sm" onClick={() => handleGenerate(p)} disabled={isLoading} className="text-primary/80">
                                {p}
                            </Button>
                        ))}
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && !result && (
          <div className="fixed inset-0 bg-background/80 z-50 flex flex-col items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Cosmos is aligning... Building your world.</p>
          </div>
        )}

        {result && (
          <motion.div
            key="result-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="relative aspect-[16/7] w-full rounded-xl overflow-hidden border-4 border-primary/20">
              <Image src={result.images.main} alt={result.title} fill className="object-cover" priority data-ai-hint="fantasy world landscape" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="font-headline text-5xl font-bold" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>{result.title}</h1>
                <p className="text-xl mt-2 opacity-90" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.7)' }}>{result.tagline}</p>
              </div>
            </div>

            <p className="text-center text-lg text-muted-foreground max-w-4xl mx-auto">{result.description}</p>
            <Separator />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column for History & Map */}
              <div className="lg:col-span-1 space-y-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History /> {result.history.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                    <p>{result.history.content}</p>
                  </CardContent>
                </Card>
                <Card className="glass-card overflow-hidden">
                   <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Map /> World Map</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Image src={result.images.map} alt="World Map" width={800} height={600} className="w-full h-auto object-cover" data-ai-hint="fantasy map" />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column for Factions & Characters */}
              <div className="lg:col-span-2 space-y-8">
                {/* Factions */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield /> Major Factions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.factions.map(faction => (
                      <div key={faction.name} className="flex items-start gap-4">
                        <Image src={faction.emblemUrl} alt={`${faction.name} Emblem`} width={64} height={64} className="rounded-full border-2 border-primary/30" data-ai-hint="fantasy emblem" />
                        <div>
                          <h4 className="font-bold text-primary">{faction.name}</h4>
                          <p className="text-sm text-muted-foreground">{faction.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Characters */}
                <Card className="glass-card">
                   <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Notable Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {result.characters.map(char => (
                        <div key={char.name} className="text-center">
                          <Image src={char.portraitUrl} alt={char.name} width={200} height={300} className="rounded-lg aspect-[2/3] object-cover mx-auto mb-2 border-2 border-primary/20" data-ai-hint="fantasy character portrait" />
                          <h4 className="font-bold">{char.name}</h4>
                          <p className="text-xs text-muted-foreground">{char.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
             <div className="text-center pt-8">
                <Button onClick={() => setResult(null)}>Generate a New Universe</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
