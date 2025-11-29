import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';
import * as dotenv from 'dotenv';

dotenv.config();

export const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: 'llama3.2' }],
      serverAddress: 'http://127.0.0.1:11434', // default ollama local address
    }),
  ],
  model: 'ollama/llama3.2',
});
