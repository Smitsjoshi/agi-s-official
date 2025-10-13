'use client';

import { CreateAgentForm } from "@/components/agents/create-agent-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewAgentPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Create a New Agent</h1>
        <p className="text-muted-foreground">
          Define a persona and knowledge base for your custom AI assistant.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
            <CardDescription>Fill out the details below to build your agent.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAgentForm />
        </CardContent>
      </Card>
    </div>
  );
}
