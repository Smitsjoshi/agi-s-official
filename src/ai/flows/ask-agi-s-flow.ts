import { flow } from 'genkit';
import { ai } from '../genkit';

export const askAgiS = flow(
  {
    name: 'askAgiS',
    inputSchema: { prompt: 'string' },
    outputSchema: { response: 'string' },
  },
  async ({ prompt }) => {
    const result = await ai.generate({
      prompt,
      model: 'googleai/gemini-pro',
      config: {
        temperature: 0.7,
      },
    });

    return { response: result.text() };
  }
);
