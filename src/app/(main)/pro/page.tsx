
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Shield, Video, BrainCircuit, Users, Building, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const pages = [
    { id: 'knowledgeChat', name: 'Standard AI Knowledge Chat', tiers: [{ name: 'Low', price: 50 }, { name: 'Medium', price: 100 }, { name: 'High', price: 150 }] },
    { id: 'academicSearch', name: 'Advanced Academic & Code Search', tiers: [{ name: 'Low', price: 75 }, { name: 'Medium', price: 150 }, { name: 'High', price: 225 }] },
    { id: 'documentAnalysis', name: 'Analyze Documents', tiers: [{ name: 'Low', price: 100 }, { name: 'Medium', price: 200 }, { name: 'High', price: 300 }] },
    { id: 'videoGeneration', name: 'Generate Video', tiers: [{ name: 'Low', price: 125 }, { name: 'Medium', price: 250 }, { name: 'High', price: 375 }] },
    { id: 'multiSourceAnalysis', name: 'Deep Dive Multi-Source Analysis', tiers: [{ name: 'Low', price: 150 }, { name: 'Medium', price: 300 }, { name: 'High', price: 450 }] },
    { id: 'redTeamSimulations', name: 'Crucible Red Team Simulations', tiers: [{ name: 'Low', price: 175 }, { name: 'Medium', price: 350 }, { name: 'High', price: 525 }] },
];

const tiers = [
    {
        name: "Casual",
        icon: Sparkles,
        prices: { daily: "₹25", weekly: "₹150", monthly: "₹500", yearly: "₹5,000" },
        description: "For occasional use and trying out core features.",
        features: [
            { text: "Standard AI Knowledge Chat", included: true },
            { text: "Basic Academic & Code Search", included: true },
            { text: "Analyze 2 Documents per Day", included: true },
            { text: "Generate 1 Video per Day (up to 5s)", included: false },
            { text: "Deep Dive Multi-Source Analysis", included: false },
            { text: "Crucible Red Team Simulations", included: false },
            { text: "Collaborative Workspaces", included: false },
            { text: "Priority Support", included: false },
        ],
        isPopular: false,
    },
    {
        name: "Student",
        icon: BrainCircuit,
        prices: { daily: "₹50", weekly: "₹300", monthly: "₹999", yearly: "₹9,999" },
        description: "For students and researchers who need powerful learning tools.",
        features: [
            { text: "Standard AI Knowledge Chat", included: true },
            { text: "Advanced Academic & Code Search", included: true },
            { text: "Analyze 20 Documents per Day", included: true },
            { text: "Generate 5 Videos per Day (up to 10s)", included: true },
            { text: "Deep Dive Multi-Source Analysis", included: true },
            { text: "Crucible Red Team Simulations", included: false },
            { text: "Collaborative Workspaces", included: false },
            { text: "Priority Support", included: false },
        ],
        isPopular: false,
    },
    {
        name: "Professional",
        icon: Shield,
        prices: { daily: "₹100", weekly: "₹600", monthly: "₹1,999", yearly: "₹19,999" },
        description: "For professionals and power users who need the full suite of tools.",
        features: [
            { text: "Standard AI Knowledge Chat", included: true },
            { text: "Advanced Academic & Code Search", included: true },
            { text: "Unlimited Document Analysis", included: true },
            { text: "Unlimited Video Generation (up to 30s)", included: true },
            { text: "Deep Dive Multi-Source Analysis", included: true },
            { text: "Crucible Red Team Simulations", included: true },
            { text: "Collaborative Workspaces (Up to 5 Users)", included: true },
            { text: "Priority Support", included: true },
        ],
        isPopular: true,
    },
    {
        name: "Enterprise",
        icon: Building,
        prices: { daily: "Custom", weekly: "Custom", monthly: "Custom", yearly: "Custom" },
        description: "For teams and organizations requiring custom solutions.",
        features: [
            { text: "Everything in Professional", included: true },
            { text: "On-Premise Deployment Options", included: true },
            { text: "Dedicated Support & SLAs", included: true },
            { text: "Custom Agent & Tool Development", included: true },
            { text: "Team-based Usage Analytics", included: true },
            { text: "Volume-based Pricing", included: true },
        ],
        isPopular: false,
    }
];

type Duration = "daily" | "weekly" | "monthly" | "yearly";

export default function ProPage() {
    const [durations, setDurations] = useState<Record<string, Duration>>({
        Casual: 'monthly',
        Student: 'monthly',
        Professional: 'monthly',
        Enterprise: 'yearly',
    });
    const [selectedPages, setSelectedPages] = useState<Record<string, boolean>>({});
    const [usageTiers, setUsageTiers] = useState<Record<string, number>>({});

    const handleDurationChange = (tierName: string, value: Duration) => {
        setDurations(prev => ({...prev, [tierName]: value}));
    }

    const handlePageSelection = (pageId: string) => {
        setSelectedPages(prev => ({ ...prev, [pageId]: !prev[pageId] }));
    };

    const handleUsageChange = (pageId: string, value: number) => {
        setUsageTiers(prev => ({ ...prev, [pageId]: value }));
    };

    const calculateCustomPrice = () => {
        return pages.reduce((total, page) => {
            if (selectedPages[page.id]) {
                const tierIndex = usageTiers[page.id] || 0;
                return total + page.tiers[tierIndex].price;
            }
            return total;
        }, 0);
    };

    const generateWhatsAppLink = (tierName: string) => {
        const phoneNumber = "919687820005"; // Assuming Indian country code
        const duration = durations[tierName];
        let message = `Hello! I am interested in the ${tierName} plan`;
        if (tierName === 'Custom') {
            const customPages = pages
                .filter(page => selectedPages[page.id])
                .map(page => {
                    const tierIndex = usageTiers[page.id] || 0;
                    return `${page.name} (${page.tiers[tierIndex].name} usage)`;
                });
            message += ` with the following pages: ${customPages.join(', ')}. The total price is ₹${calculateCustomPrice()}`;
        } else if (tierName !== 'Enterprise') {
            message += ` with a ${duration} subscription.`;
        } else {
            message += '.';
        }
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">AGI-S Plans & Pricing</h1>
        <p className="text-muted-foreground text-lg mt-2 max-w-3xl mx-auto">
          Choose the plan that fits your needs. Unlock the full potential of AGI-S with advanced features, unlimited usage, and priority access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 items-start">
        {tiers.map(tier => {
            const Icon = tier.icon;
            const currentDuration = durations[tier.name];
            const currentPrice = tier.prices[currentDuration];
            
            return (
            <Card key={tier.name} className={cn("flex flex-col h-full", tier.isPopular ? "border-primary border-2 shadow-primary/20 shadow-lg" : "")}>
                <CardHeader className="items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full border-4 border-primary/20 mb-2">
                        <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                    <div className="text-center">
                         <div className="flex items-baseline justify-center gap-2">
                            <span className="text-4xl font-bold">{currentPrice}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {currentPrice !== 'Custom' && `per ${currentDuration.replace('ly', '')}`}
                        </p>
                    </div>

                     {currentPrice !== 'Custom' && (
                        <div>
                            <Select
                                value={currentDuration}
                                onValueChange={(value: Duration) => handleDurationChange(tier.name, value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <ul className="space-y-3 text-sm">
                    {tier.features.map(feature => (
                        <li key={feature.text} className="flex items-start">
                            {feature.included ? 
                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> : 
                                <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            }
                            <span className={cn(!feature.included && "text-muted-foreground line-through")}>{feature.text}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardContent>
                    <Button asChild className="w-full" size="lg" variant={tier.name === 'Enterprise' ? 'outline' : 'default'}>
                        <Link href={generateWhatsAppLink(tier.name)} target="_blank">
                            {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )})}
        <Card className="flex flex-col h-full bg-gradient-to-br from-primary/10 to-primary/20 shadow-lg shadow-primary/20 border-2 border-primary">
            <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full border-4 border-primary/20 mb-2">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <CardTitle className="font-headline text-2xl">Custom Plan</CardTitle>
                <CardDescription>Build your own plan by selecting the features you need.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-primary animate-pulse">₹{calculateCustomPrice()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        per month
                    </p>
                </div>

                <ul className="space-y-4 text-sm">
                    {pages.map(page => {
                        const tierIndex = usageTiers[page.id] || 0;
                        return (
                        <li key={page.id} className="p-2 rounded-lg transition-all duration-300"
                        style={selectedPages[page.id] ? {background: 'rgba(var(--primary-rgb), 0.1)', boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.3)'} : {}}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        id={page.id}
                                        checked={selectedPages[page.id]}
                                        onCheckedChange={() => handlePageSelection(page.id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={page.id} className="cursor-pointer">{page.name}</label>
                                </div>
                                <span>₹{page.tiers[tierIndex].price}</span>
                            </div>
                            {selectedPages[page.id] && (
                                <div className="mt-2">
                                    <Slider
                                        defaultValue={[0]}
                                        max={2}
                                        step={1}
                                        onValueChange={(value) => handleUsageChange(page.id, value[0])}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>Low</span>
                                        <span>Medium</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            )}
                        </li>
                    )})}
                </ul>
            </CardContent>
            <CardContent>
                <Button asChild className="w-full" size="lg">
                    <Link href={generateWhatsAppLink('Custom')} target="_blank">
                        Get Started
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
