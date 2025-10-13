'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Mic, Wand2 } from 'lucide-react';
import { generateAudioAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters.'),
  voice: z.enum(['Algenib', 'Achernar', 'Sirius', 'Vega']).default('Algenib'),
});

export function TTSForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '', voice: 'Algenib' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAudioDataUri(null);

    const result = await generateAudioAction(values);

    if (result.success && result.data) {
      setAudioDataUri(result.data.audioDataUri);
      toast({
        title: 'Audio Generated!',
        description: 'Your audio is ready to be played.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Audio',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
            <CardTitle>Text-to-Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the text you want to convert to speech..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a voice" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Algenib">Algenib (Male)</SelectItem>
                            <SelectItem value="Achernar">Achernar (Female)</SelectItem>
                            <SelectItem value="Sirius">Sirius (Male)</SelectItem>
                            <SelectItem value="Vega">Vega (Female)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>Choose a voice for the generated audio.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Mic className="mr-2" />
                    Generate Audio
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Generated Audio</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center aspect-video bg-muted rounded-b-lg">
          {isLoading && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
          {!isLoading && audioDataUri && (
            <audio src={audioDataUri} controls autoPlay className="w-full" />
          )}
          {!isLoading && !audioDataUri && (
            <p className="text-muted-foreground">Your generated audio will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
