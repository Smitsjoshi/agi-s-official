
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AgentCard } from '@/components/agents/agent-card';
import type { Agent } from '@/lib/types';
import { agentCategories } from '@/lib/agents';

export default async function AgentsPage() {
  const customAgents: Agent[] = []; // Placeholder for custom agents fetched from a DB

  return (
    <div className="space-y-12">
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
        {customAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {Object.entries(agentCategories).map(([category, agents]) => (
        <div key={category}>
          <h2 className="font-headline text-2xl font-bold">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      ))}

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
