import { ai } from './genkit';
import type { AiMode, ChatMessage } from '@/lib/types';

export async function cosmicFlow(
  query: string,
  mode: AiMode,
  chatHistory: ChatMessage[],
  file?: { type: 'image' | 'pdf' | 'csv' | 'json'; data: string },
  options?: any,
): Promise<any> {
  // Construct a prompt that includes history and the current query
  let prompt = query;
  if (chatHistory.length > 0) {
    const historyText = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    prompt = `Previous conversation:\n${historyText}\n\nUser: ${query}`;
  }

  // TODO: Handle file input with Ollama (multimodal support depends on the model)
  if (file) {
    console.warn("File input provided but multimodal support with Ollama needs specific model configuration. Proceeding with text only for now.");
    prompt += `\n\n[User attached a file of type ${file.type}, but I cannot see it yet.]`;
  }

  const result = await ai.generate({
    prompt: prompt,
    model: 'ollama/llama3.2',
    config: {
      temperature: 0.7,
    },
  });

  console.log('Ollama Result:', JSON.stringify(result, null, 2));
  console.log('Ollama Result Text:', result.text);

  return result.text;
}
