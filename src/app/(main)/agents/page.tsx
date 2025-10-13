
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentCard } from '@/components/agents/agent-card';
import type { Agent } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mock function to get agents
async function getAgents(): Promise<Agent[]> {
  const scholarAvatar = PlaceHolderImages.find(p => p.id === 'scholar-avatar');
  const coderAvatar = PlaceHolderImages.find(p => p.id === 'coder-avatar');
  const analystAvatar = PlaceHolderImages.find(p => p.id === 'analyst-avatar');

  return [
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'An AI expert in academic research, capable of searching through millions of papers.',
      avatar: scholarAvatar?.imageUrl || `https://picsum.photos/seed/scholar/200/200`,
    },
    {
      id: 'coder',
      name: 'Coder',
      description: 'Your personal software engineering assistant for generating components and code.',
      avatar: coderAvatar?.imageUrl || `https://picsum.photos/seed/coder/200/200`,
    },
    {
      id: 'analyst',
      name: 'Analyst',
      description: 'An AI that provides deep data analysis and insights from various sources.',
      avatar: analystAvatar?.imageUrl || `https://picsum.photos/seed/analyst/200/200`,
    },
  ];
}

export default async function AgentsPage() {
  const agents = await getAgents();
  
  const customAgents = []; // Placeholder for custom agents fetched from a DB

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Meet the Agents</h1>
        <p className="text-muted-foreground">
          Interact with specialized AI agents or create your own.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="flex flex-col items-center justify-center p-6 border-dashed hover:border-primary hover:bg-muted/50 transition-colors">
            <Link href="/agents/new" className="text-center">
                <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 font-headline text-lg font-semibold">Create New Agent</h2>
                <p className="mt-1 text-sm text-muted-foreground">Build a custom AI assistant</p>
            </Link>
        </Card>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {customAgents.length > 0 && (
        <div>
          <h2 className="font-headline text-2xl font-bold">Your Custom Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {customAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
