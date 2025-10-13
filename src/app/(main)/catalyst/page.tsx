'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, BookOpen, Book, Youtube, Newspaper, Check, X, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCatalystAction } from '@/app/actions';
import type { CatalystOutput, CatalystOutputSchema } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

const exampleGoals = [
    "Learn to bake sourdough bread",
    "Understand the basics of quantum mechanics",
    "Become a front-end developer",
    "Learn to invest in the stock market"
];

const Quiz = ({ quizData }: { quizData: z.infer<typeof CatalystOutputSchema.shape.modules.element.shape.quiz> }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
  
    const handleAnswerChange = (questionIndex: number, answer: string) => {
      setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };
  
    const handleSubmit = () => setSubmitted(true);
  
    return (
      <div className="space-y-6 mt-4">
        {quizData.map((q, i) => {
          const isCorrect = submitted && answers[i] === q.correctAnswer;
          const selectedAnswer = answers[i];
          return (
            <div key={i} className="p-4 border rounded-lg bg-background/30">
              <p className="font-medium mb-4">{i + 1}. {q.question}</p>
              <RadioGroup value={selectedAnswer} onValueChange={(val) => handleAnswerChange(i, val)} disabled={submitted}>
                {q.options.map(opt => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrectOption = q.correctAnswer === opt;
                    const radioId = `q${i}-opt-${opt.replace(/\s/g, '')}`;
                    
                    let stateColor = "";
                    if (submitted) {
                        if (isCorrectOption) stateColor = "text-green-500";
                        else if (isSelected && !isCorrectOption) stateColor = "text-red-500";
                    }

                    return (
                        <div key={opt} className={`flex items-center space-x-2 p-2 rounded-md ${submitted && isSelected ? 'bg-muted/50' : ''}`}>
                            <RadioGroupItem value={opt} id={radioId} />
                            <Label htmlFor={radioId} className={`flex-1 cursor-pointer ${stateColor}`}>
                                {opt}
                            </Label>
                             {submitted && isCorrectOption && <Check className="h-5 w-5 text-green-500" />}
                             {submitted && isSelected && !isCorrectOption && <X className="h-5 w-5 text-red-500" />}
                        </div>
                    );
                })}
              </RadioGroup>
            </div>
          );
        })}
         {!submitted ? (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== quizData.length}>Check Answers</Button>
         ) : (
            <Button onClick={() => { setSubmitted(false); setAnswers({}); }}>Try Again</Button>
         )}
      </div>
    );
};

export default function CatalystPage() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CatalystOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (currentGoal: string) => {
    if (!currentGoal.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await generateCatalystAction({ goal: currentGoal });
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        throw new Error(response.error || 'Failed to generate learning path.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Path',
        description: error.message,
      });
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(goal);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background/80">
      <div className="container mx-auto p-4 md:p-8">
        <AnimatePresence>
          {!result && (
            <motion.div
              key="prompt-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="font-headline text-5xl font-bold text-primary">Catalyst</h1>
                <p className="text-muted-foreground text-xl mt-2">Your personal AI curriculum designer.</p>
              </div>

              <Card className="shadow-lg">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Define Your Learning Goal</CardTitle>
                        <CardDescription>What do you want to learn? Be as specific as you can.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g., 'Learn to build modern web applications with React'"
                            className="text-base h-12"
                            disabled={isLoading}
                        />
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button type="submit" disabled={isLoading || !goal.trim()} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" />Generate Learning Path</>}
                        </Button>
                        <div className="text-sm text-muted-foreground">Or try an example:</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {exampleGoals.map(g => (
                                <Button key={g} variant="outline" size="sm" onClick={() => handleGenerate(g)} disabled={isLoading}>
                                    {g}
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
            <p className="mt-4 text-lg text-muted-foreground">Catalyst is designing your curriculum...</p>
          </div>
        )}

        {result && (
          <motion.div
            key="result-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl font-bold">{result.title}</h1>
              <p className="text-muted-foreground text-lg mt-2">{result.description}</p>
            </div>
            
            <div className="space-y-4">
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                {result.modules.map((module, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="bg-card/50 border rounded-lg mb-4">
                    <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-4">
                           <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xl">{index + 1}</span>
                           <span>{module.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                       <div className="space-y-8 pl-14">
                           {/* Concepts */}
                            <div>
                                <h3 className="font-semibold text-md mb-4 flex items-center gap-2"><Book className="h-5 w-5"/>Key Concepts</h3>
                                <div className="space-y-4">
                                {module.concepts.map(concept => (
                                    <div key={concept.name}>
                                        <h4 className="font-medium text-primary">{concept.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1 mb-3">{concept.explanation}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {concept.resources.map(res => {
                                                const Icon = res.type === 'Video' ? Youtube : Newspaper;
                                                return (
                                                <Button key={res.url} variant="secondary" size="sm" asChild>
                                                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                                                        <Icon className="mr-2 h-4 w-4" />
                                                        {res.title}
                                                    </a>
                                                </Button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <Separator/>
                             {/* Project */}
                            <div>
                                <h3 className="font-semibold text-md mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5"/>Hands-On Project: {module.project.title}</h3>
                                <p className="text-sm text-muted-foreground">{module.project.description}</p>
                            </div>
                             <Separator/>
                            {/* Quiz */}
                            <div>
                               <h3 className="font-semibold text-md mb-4 flex items-center gap-2"><Check className="h-5 w-5"/>Knowledge Check</h3>
                               <Quiz quizData={module.quiz} />
                            </div>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
             <div className="text-center pt-8">
                <Button onClick={() => { setResult(null); setGoal('') }}>Generate a New Path</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
