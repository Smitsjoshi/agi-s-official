'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wind, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAetherAction } from '@/app/actions';
import type { AetherOutput } from '@/lib/types';
import Image from 'next/image';
import useLocalStorage from '@/hooks/use-local-storage';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

export default function AetherPage() {
  const [dream, setDream] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journal, setJournal] = useLocalStorage<AetherOutput[]>('aether-journal', []);
  const [selectedDream, setSelectedDream] = useState<AetherOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setIsLoading(true);

    const response = await generateAetherAction({ dream });

    if (response.success && response.data) {
      setJournal(prev => [response.data!, ...prev]);
      setDream('');
      toast({
        title: 'Dream Interpreted',
        description: 'Your dream has been added to your journal.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Interpreting Dream',
        description: response.error,
      });
    }

    setIsLoading(false);
  };
  
  const handleDelete = (id: string) => {
    setJournal(journal.filter(d => d.id !== id));
    toast({
        title: "Dream Deleted",
        description: "The dream has been removed from your journal."
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center relative z-10">
        <h1 className="font-headline text-4xl font-bold text-primary">Aether</h1>
        <p className="text-muted-foreground text-lg mt-2">Your AI-powered dream journal and visualizer.</p>
      </div>

      <Card className="max-w-3xl mx-auto glass-card">
        <form onSubmit={handleSubmit}>
            <CardContent className="p-6">
                <Textarea
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder="Describe your dream... What did you see, feel, and experience?"
                    className="flex-1 text-base min-h-[120px] bg-transparent focus-visible:ring-primary/50"
                    disabled={isLoading}
                />
            </CardContent>
            <CardFooter className="flex justify-end p-4 border-t border-white/10">
                <Button type="submit" disabled={isLoading || !dream.trim()}>
                {isLoading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <>
                    <Sparkles className="mr-2" />
                    Interpret Dream
                    </>
                )}
                </Button>
            </CardFooter>
        </form>
      </Card>

      <div className="relative z-10">
        <h2 className="font-headline text-2xl font-bold mb-6">Dream Journal</h2>
        {journal.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Your interpreted dreams will appear here.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 <AnimatePresence>
                    {journal.map((entry) => (
                        <motion.div
                            key={entry.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <Card className="overflow-hidden group cursor-pointer h-full flex flex-col" onClick={() => setSelectedDream(entry)}>
                                <div className="relative aspect-square">
                                    <Image src={entry.imageUrl} alt={entry.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="abstract dream"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h3 className="font-bold text-white text-lg leading-tight">{entry.title}</h3>
                                        <p className="text-sm text-white/80">{entry.mood}</p>
                                    </div>
                                </div>
                                <CardContent className="p-4 flex-1">
                                    <p className="text-xs text-muted-foreground">{format(parseISO(entry.timestamp), "MMMM d, yyyy")}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>

       <Dialog open={!!selectedDream} onOpenChange={(open) => !open && setSelectedDream(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          {selectedDream && (
            <>
              <DialogHeader className="pr-12">
                <DialogTitle className="font-headline text-2xl">{selectedDream.title}</DialogTitle>
                <DialogDescription>
                    {format(parseISO(selectedDream.timestamp), "MMMM d, yyyy 'at' h:mm a")} &middot; <span className="font-semibold text-primary">{selectedDream.mood}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2">
                <div className="space-y-6">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={selectedDream.imageUrl} alt={selectedDream.title} fill className="object-cover" data-ai-hint="abstract dream art" />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Interpretation</h4>
                        <p className="text-sm text-muted-foreground">{selectedDream.interpretation}</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Themes</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedDream.themes.map(theme => <Badge key={theme} variant="secondary">{theme}</Badge>)}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Symbols</h4>
                        <div className="space-y-3">
                            {selectedDream.symbols.map(symbol => (
                                <div key={symbol.name}>
                                    <p className="font-medium text-sm">{symbol.name}</p>
                                    <p className="text-xs text-muted-foreground">{symbol.meaning}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <Button variant="destructive" onClick={() => {
                    handleDelete(selectedDream.id);
                    setSelectedDream(null);
                }}>
                    Delete Dream
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
