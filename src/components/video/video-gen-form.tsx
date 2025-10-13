'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { generateVideoAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
});

export function VideoGenForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setVideoDataUri(null);

    const result = await generateVideoAction(values.prompt);

    if (result.success && result.data) {
      setVideoDataUri(result.data.videoDataUri);
      toast({
        title: 'Video Generated!',
        description: 'Your video is ready to be viewed.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Video',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
            <CardTitle>Video Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A cinematic shot of a futuristic city at sunset"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Describe the video you want to create in detail.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Generated Video</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center aspect-video bg-muted rounded-b-lg">
          {isLoading && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
          {!isLoading && videoDataUri && (
            <video src={videoDataUri} controls autoPlay loop className="w-full h-full rounded-md" />
          )}
          {!isLoading && !videoDataUri && (
            <p className="text-muted-foreground">Your video will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
