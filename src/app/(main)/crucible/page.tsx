'use client';

import { useState, useId, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldHalf, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCrucibleAction } from '@/app/actions';
import type { CrucibleOutput, AdversaryPersona, CrucibleCritique } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ADVERSARY_PERSONAS } from '@/lib/personas';


const useTypewriter = (text: string, speed = 20) => {
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

const CritiqueCard = ({ critique }: { critique: CrucibleCritique }) => {
    const persona = ADVERSARY_PERSONAS.find(p => p.name === critique.personaName);
    const typedAnalysis = useTypewriter(critique.analysis);
  
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
          <Avatar>
            <AvatarFallback className="bg-primary/20 text-primary">
              {persona?.icon ? <persona.icon /> : <ShieldHalf />}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{critique.personaName}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-1">
              {critique.keyConcerns.map(concern => (
                <Badge key={concern} variant="destructive">{concern}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-2">Detailed Analysis</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{typedAnalysis}</p>
        </CardContent>
      </Card>
    );
};


export default function CruciblePage() {
  const [plan, setPlan] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<AdversaryPersona[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CrucibleOutput | null>(null);
  const [displayedCritiques, setDisplayedCritiques] = useState<CrucibleCritique[]>([]);
  const { toast } = useToast();
  const id = useId();

  useEffect(() => {
    if (result) {
        setDisplayedCritiques([]);
        let critiqueIndex = 0;
        const intervalId = setInterval(() => {
            if (critiqueIndex < result.critiques.length) {
                setDisplayedCritiques(prev => [...prev, result.critiques[critiqueIndex]]);
                critiqueIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 2000); // Display a new critique every 2 seconds
        return () => clearInterval(intervalId);
    }
  }, [result]);

  const handlePersonaToggle = (persona: AdversaryPersona) => {
    setSelectedPersonas(prev =>
      prev.some(p => p.id === persona.id)
        ? prev.filter(p => p.id !== persona.id)
        : [...prev, persona]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan.trim() || selectedPersonas.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a plan and select at least one adversary persona.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setDisplayedCritiques([]);

    const response = await generateCrucibleAction({
      plan,
      personas: selectedPersonas.map(p => p.id),
    });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error during simulation',
        description: response.error || 'The AI failed to generate a critique. Please try again.',
      });
    }

    setIsLoading(false);
  };
  
  const executiveSummary = useTypewriter(result?.executiveSummary || '');

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Crucible</h1>
        <p className="text-muted-foreground text-lg mt-2">The AI Red Team & Decision Simulator. Pressure-test your ideas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 sticky top-24">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Define your plan and select your adversaries.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="plan-input">Your Plan or Idea</Label>
                <Textarea
                  id="plan-input"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="e.g., Launch a new productivity app targeting freelance developers with a subscription model..."
                  className="min-h-[150px]"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Adversaries (Red Team)</Label>
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg max-h-60 overflow-y-auto">
                  {ADVERSARY_PERSONAS.map((persona) => (
                    <div key={persona.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`${id}-${persona.id}`}
                        checked={selectedPersonas.some(p => p.id === persona.id)}
                        onCheckedChange={() => handlePersonaToggle(persona)}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`${id}-${persona.id}`} className="flex-1 cursor-pointer">
                        <span className="font-semibold">{persona.name}</span>
                        <p className="text-xs text-muted-foreground">{persona.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !plan.trim() || selectedPersonas.length === 0}>
                {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Run Simulation</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !result && (
            <div className="text-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">The Red Team is assembling... Critiques are being generated.</p>
            </div>
          )}

            {result && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Executive Summary</CardTitle>
                    <CardDescription>A high-level overview of the potential risks and blind spots in your plan.</CardDescription>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <p>{executiveSummary}</p>
                  </CardContent>
                </Card>

                <div>
                    <h2 className="font-headline text-xl font-bold mb-4">Adversary Critiques</h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                        {displayedCritiques.map((critique) => (
                             <motion.div
                                key={critique.personaName}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5 }}
                             >
                                <CritiqueCard critique={critique} />
                             </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>
              </div>
            )}

          {!isLoading && !result && (
            <div className="text-center py-24 border-2 border-dashed rounded-lg">
                <ShieldHalf className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Your simulation results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
