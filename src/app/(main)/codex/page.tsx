'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, FileDown, Clipboard, Spline, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { askAi } from '@/app/actions';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function CodeXPage() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ componentCode: string; reasoning: string; } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
        const response = await askAi(description, 'CodeX', []);
        if (response && response.componentCode) {
            setResult(response);
        } else {
            throw new Error('Invalid response from AI');
        }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Component',
        description: 'The AI failed to generate code. Please try a different prompt.',
      });
    }

    setIsLoading(false);
  };
  
  const handleCopy = () => {
    if (result?.componentCode) {
        navigator.clipboard.writeText(result.componentCode);
        toast({ title: 'Copied to Clipboard!' });
    }
  }

  const handleExport = () => {
      if (result?.componentCode) {
          const blob = new Blob([result.componentCode], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'component.html';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast({ title: 'Exported as component.html' });
      }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Left Pane */}
        <div className="flex w-1/2 flex-col gap-4">
            {/* Prompt Area (35%) */}
            <Card className="flex flex-col" style={{ flex: '0 0 35%' }}>
                <div className="p-3 border-b flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    <p className="font-headline font-medium">Component Request</p>
                </div>
                <CardContent className="p-4 flex-1">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={`e.g., "A responsive pricing card with three tiers..."`}
                            className="flex-1 bg-background border-border resize-none text-base"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !description.trim()} className="mt-4 w-full">
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Generate Component'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Code Area (65%) */}
            <Card className="flex flex-col" style={{ flex: '0 0 65%' }}>
                 <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <p className="font-headline font-medium">Code</p>
                    </div>
                    {result && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
                                <Clipboard className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleExport}>
                                <FileDown className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
                <CardContent className="p-0 flex-1">
                     <div className="h-full bg-background rounded-b-lg">
                        {isLoading && !result && (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="animate-spin text-primary h-8 w-8" />
                            </div>
                        )}
                        {result ? (
                            <motion.pre
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs whitespace-pre-wrap h-full overflow-auto font-code p-4"
                            >
                               <code className="language-html">{result.componentCode}</code>
                            </motion.pre>
                        ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>Code will appear here</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Pane */}
        <Card className="w-1/2 flex flex-col">
             <div className="p-3 border-b flex items-center gap-2">
                <Spline className="h-5 w-5 text-primary" />
                <p className="font-headline font-medium">Preview</p>
            </div>
            <CardContent className="p-4 flex-1">
                <div className="w-full h-full border rounded-lg bg-muted/20 flex items-center justify-center">
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-primary h-8 w-8" />
                        </div>
                    )}
                    {result ? (
                         <div className="p-4 w-full h-full overflow-auto">
                            <div dangerouslySetInnerHTML={{ __html: result.componentCode }} />
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Live preview will appear here</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
