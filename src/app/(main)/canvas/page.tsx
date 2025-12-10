'use client';

/**
 * AGI-S Canvas - Powered by Universal Action Layer (UAL)™
 * Copyright © 2024-2025 AGI-S Technologies
 * Patent Pending
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Sparkles, Globe, Zap } from 'lucide-react';
import { UALClient } from '@/lib/universal-action-layer';
import type { UALResult } from '@/lib/universal-action-layer';

export default function CanvasPage() {
    const [goal, setGoal] = useState('');
    const [url, setUrl] = useState('https://google.com');
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<UALResult | null>(null);
    const [currentStep, setCurrentStep] = useState('');

    const ualClient = new UALClient();

    const executeTask = async () => {
        if (!goal.trim()) {
            alert('Please enter a goal');
            return;
        }

        setIsExecuting(true);
        setResult(null);
        setCurrentStep('🤖 Initializing Universal Action Layer™...');

        try {
            // Step 1: Plan actions using AI
            setCurrentStep('🧠 Liquid Intelligence™ planning actions...');
            const actions = await ualClient.planActions(goal, url);

            setCurrentStep(`✅ Generated ${actions.length} actions`);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Step 2: Execute the task
            setCurrentStep('🌐 Universal Action Layer™ executing...');
            const taskResult = await ualClient.executeTask({
                goal,
                url,
                actions,
            });

            setResult(taskResult);
            setCurrentStep('✅ Task complete!');

        } catch (error: any) {
            setResult({
                success: false,
                error: error.message,
                steps: [`❌ Error: ${error.message}`],
            });
            setCurrentStep('❌ Task failed');
        } finally {
            setIsExecuting(false);
        }
    };

    const exampleTasks = [
        { goal: 'Search for "AI news" on Google', url: 'https://google.com' },
        { goal: 'Go to GitHub homepage', url: 'https://github.com' },
        { goal: 'Visit OpenAI website', url: 'https://openai.com' },
    ];

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-headline text-4xl font-bold">Canvas</h1>
                    <Badge variant="outline" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Patent Pending
                    </Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                    Powered by <span className="font-semibold text-primary">Universal Action Layer (UAL)™</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    AI-driven browser automation using Liquid Intelligence™
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Input Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                Task Configuration
                            </CardTitle>
                            <CardDescription>
                                Describe what you want to do on the web
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* URL Input */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    <Globe className="h-4 w-4 inline mr-1" />
                                    Target URL
                                </label>
                                <Input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    disabled={isExecuting}
                                />
                            </div>

                            {/* Goal Input */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    🎯 Goal (Natural Language)
                                </label>
                                <Input
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder="e.g., Search for AI news and click the first result"
                                    disabled={isExecuting}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isExecuting) {
                                            executeTask();
                                        }
                                    }}
                                />
                            </div>

                            {/* Execute Button */}
                            <Button
                                onClick={executeTask}
                                disabled={isExecuting || !goal.trim()}
                                className="w-full"
                                size="lg"
                            >
                                {isExecuting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Executing...
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" />
                                        Execute with UAL™
                                    </>
                                )}
                            </Button>

                            {/* Current Step */}
                            {currentStep && (
                                <div className="p-3 bg-muted rounded-lg text-sm">
                                    <p className="font-medium">{currentStep}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Example Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Quick Examples</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {exampleTasks.map((task, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-left"
                                    onClick={() => {
                                        setGoal(task.goal);
                                        setUrl(task.url);
                                    }}
                                    disabled={isExecuting}
                                >
                                    <Sparkles className="h-3 w-3 mr-2 flex-shrink-0" />
                                    <span className="truncate">{task.goal}</span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Results Panel */}
                <div className="space-y-6">
                    {result && (
                        <>
                            {/* Execution Steps */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Execution Log</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1 max-h-60 overflow-y-auto">
                                        {result.steps.map((step, index) => (
                                            <div key={index} className="text-sm font-mono p-2 bg-muted rounded">
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Screenshot */}
                            {result.screenshot && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Result Screenshot</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <img
                                            src={`data:image/png;base64,${result.screenshot}`}
                                            alt="Result"
                                            className="w-full border rounded-lg shadow-lg"
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Extracted Data */}
                            {result.data && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Extracted Data</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium">Title:</span> {result.data.title}
                                            </div>
                                            <div>
                                                <span className="font-medium">URL:</span>{' '}
                                                <a href={result.data.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    {result.data.url}
                                                </a>
                                            </div>
                                            {result.data.text && (
                                                <div>
                                                    <span className="font-medium">Preview:</span>
                                                    <p className="mt-1 text-muted-foreground">{result.data.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Error */}
                            {result.error && (
                                <Card className="border-destructive">
                                    <CardHeader>
                                        <CardTitle className="text-sm text-destructive">Error</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-destructive">{result.error}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Placeholder when no result */}
                    {!result && !isExecuting && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    Enter a goal and click Execute to see results
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Powered by Universal Action Layer™
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>
                    Powered by <span className="font-semibold">Universal Action Layer (UAL)™</span> and{' '}
                    <span className="font-semibold">Liquid Intelligence™</span>
                </p>
                <p className="mt-1">© 2024-2025 AGI-S Technologies. Patent Pending.</p>
            </div>
        </div>
    );
}
