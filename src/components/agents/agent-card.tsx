import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <Image src={agent.avatar} alt={agent.name} width={64} height={64} className="rounded-full" data-ai-hint="abstract avatar" />
        <div>
          <CardTitle className="font-headline text-lg">{agent.name}</CardTitle>
          {agent.isCustom && <Badge variant="outline">Custom</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{agent.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/agents/${agent.id}`}>
            Chat Now <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
