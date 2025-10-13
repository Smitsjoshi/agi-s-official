import { ChatInterface } from "@/components/chat/chat-interface";
import type { Agent } from "@/lib/types";
import { notFound } from "next/navigation";

// Mock data fetching for an agent
const getAgentById = (id: string): Agent | null => {
  const defaultAgents: Agent[] = [
    { id: 'scholar', name: 'Scholar', description: 'An AI expert in academic research...', avatar: '...' },
    { id: 'coder', name: 'Coder', description: 'Your personal software engineering assistant...', avatar: '...' },
    { id: 'analyst', name: 'Analyst', description: 'An AI that provides data analysis...', avatar: '...' },
  ];
  
  const agent = defaultAgents.find(a => a.id === id);
  if (agent) return agent;

  // For custom agents, we'd fetch from a DB. Here we'll mock one.
  if (id) {
    return {
      id,
      name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: `A custom agent for ${id}.`,
      avatar: `https://picsum.photos/seed/${id}/200/200`,
      isCustom: true,
    }
  }

  return null;
}

export default function AgentChatPage({ params }: { params: { id: string } }) {
  const agent = getAgentById(params.id);

  if (!agent) {
    notFound();
  }

  // The chat interface can be enhanced to use the agent's specific persona
  // by passing it as a prop and including it in the initial prompt.
  return (
    <div>
        <div className="mb-4">
            <h1 className="font-headline text-2xl font-bold">Chat with {agent.name}</h1>
            <p className="text-muted-foreground">{agent.description}</p>
        </div>
        <ChatInterface />
    </div>
  );
}
