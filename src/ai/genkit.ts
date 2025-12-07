import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    }),
  ],
  model: 'openai/llama3-70b-8192', // Using Groq's Llama 3 70B
});
