'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateContinuumAction } from '@/app/actions';
import type { ContinuumOutput } from '@/lib/types';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const exampleEvents = [
  "The signing of the Declaration of Independence, 1776",
  "The first human colony on Mars, 2077",
  "The fall of the Berlin Wall, 1989",
  "The height of the Roaring Twenties in New York City",
];

export default function ContinuumPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContinuumOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (eventDescription: string) => {
    if (!eventDescription.trim()) return;

    setIsLoading(true);
    setResult(null);

    const response = await generateContinuumAction({ eventDescription });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Event',
        description: response.error,
      });
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(input);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Continuum</h1>
        <p className="text-muted-foreground text-lg mt-2">The AI-powered historical & future event simulator.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Describe an Event</CardTitle>
          <CardDescription>Enter a historical or future event to generate an immersive snapshot.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'The first Moon landing, 1969'"
              className="flex-1 text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Wand2 className="mr-2" />
                  Generate Snapshot
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row items-start sm:items-center gap-2 p-4 border-t bg-muted/50">
            <p className="text-sm text-muted-foreground font-medium">Or try an example:</p>
            <div className="flex flex-wrap gap-2">
                {exampleEvents.map(event => (
                    <Button key={event} variant="outline" size="sm" onClick={() => handleGenerate(event)} disabled={isLoading}>
                        {event}
                    </Button>
                ))}
            </div>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Continuum is traveling through time... please wait.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <Card className="overflow-hidden">
            <CardHeader className="text-center p-6">
                <p className='font-bold text-primary'>{result.era}</p>
                <CardTitle className="font-headline text-3xl">{result.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Image src={result.mainImageUrl} alt={result.title} width={1200} height={600} className="w-full h-auto object-cover" priority data-ai-hint="historical event" />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">{result.narrative.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                     <p>{result.narrative.story}</p>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">{result.report.title}</CardTitle>
                      <CardDescription>Source: {result.report.source}</CardDescription>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <p>{result.report.content}</p>
                  </CardContent>
              </Card>
          </div>

          <div>
            <h2 className="text-2xl font-headline font-bold text-center mb-6 flex items-center justify-center gap-2">
                <Sparkles className="text-primary" /> What If?
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {result.whatIf.map((scenario, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                       <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{scenario.scenario}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{scenario.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}
