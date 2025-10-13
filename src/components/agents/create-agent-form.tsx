'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createAgentAction } from '@/app/actions';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  persona: z.string().min(20, 'Persona description must be at least 20 characters.'),
  knowledgeBaseUrls: z.array(z.object({ value: z.string().url('Please enter a valid URL.') })),
});

export function CreateAgentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      persona: '',
      knowledgeBaseUrls: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'knowledgeBaseUrls',
    control: form.control,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const data = {
        ...values,
        knowledgeBaseUrls: values.knowledgeBaseUrls.map(item => item.value).filter(Boolean),
    };
    const result = await createAgentAction(data);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Agent Created!',
        description: `Agent "${values.name}" has been created.`,
      });
      // In a real app, you'd get a real ID. We'll use a slug of the name.
      const newAgentId = values.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/agents/${newAgentId}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Marketing Guru" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="persona"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the agent's personality, expertise, and communication style..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Knowledge Base URLs</FormLabel>
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`knowledgeBaseUrls.${index}.value`}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Input {...field} placeholder="https://example.com/docs" />
                            </FormControl>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add URL
            </Button>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Create Agent'
          )}
        </Button>
      </form>
    </Form>
  );
}
