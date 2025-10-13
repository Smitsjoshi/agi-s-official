'use server';
/**
 * @fileOverview Implements the "Cosmos" flow, an AI for generating fictional universes.
 *
 * - cosmosFlow - The main flow that generates a structured lorebook for a fictional world.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { CosmosInputSchema, CosmosOutputSchema, type CosmosInput, type CosmosOutput } from '@/lib/types';

// Main prompt to generate the textual content of the lorebook
const cosmosLorePrompt = ai.definePrompt({
  name: 'cosmosLorePrompt',
  input: { schema: CosmosInputSchema },
  output: { schema: CosmosOutputSchema.omit({ images: true, factions: true, characters: true }) },
  prompt: `You are "Cosmos", a master world-builder AI. Your task is to generate a rich, consistent, and imaginative lorebook for a fictional universe based on a high-concept prompt.

  **User's Prompt:**
  {{{prompt}}}

  Based on this prompt, generate the following content:
  1.  **title**: A compelling and evocative name for this universe.
  2.  **tagline**: A short, memorable tagline that captures the world's essence.
  3.  **description**: A one-paragraph overview of the world's core concept, setting, and major conflicts.
  4.  **history**: A summary of the world's history, divided into key ages or events. Give this section a thematic title (e.g., 'The Ashen Ages', 'Era of Expansion').

  Structure your response as a single JSON object conforming to the output schema.`,
});

// Prompt to generate the factions based on the world description
const cosmosFactionPrompt = ai.definePrompt({
  name: 'cosmosFactionPrompt',
  input: { schema: CosmosOutputSchema.pick({ title: true, description: true }) },
  output: { schema: CosmosOutputSchema.pick({ factions: true }) },
  prompt: `You are "Cosmos", a master world-builder AI.
  
  **Universe:** {{title}}
  **Description:** {{description}}

  Based on the universe described above, generate an array of 3 distinct and interesting factions. For each faction, provide:
  - **name**: The name of the faction.
  - **description**: A description of their goals, methods, and power.
  - **emblemUrl**: A placeholder URL for the faction's emblem. Use 'https://picsum.photos/seed/emblem_[faction_name]/200/200'. Replace [faction_name] with a single-word, lowercase version of the faction's name.`,
});

// Prompt to generate characters based on the world description
const cosmosCharacterPrompt = ai.definePrompt({
  name: 'cosmosCharacterPrompt',
  input: { schema: CosmosOutputSchema.pick({ title: true, description: true, factions: true }) },
  output: { schema: CosmosOutputSchema.pick({ characters: true }) },
  prompt: `You are "Cosmos", a master world-builder AI.

  **Universe:** {{title}}
  **Description:** {{description}}
  **Factions:** 
  {{#each factions}}
  - {{name}}: {{description}}
  {{/each}}

  Based on this world, generate an array of 2-3 notable characters. They can be leaders, rebels, explorers, etc. For each character, provide:
  - **name**: The character's full name.
  - **description**: A short biography and their role in the world.
  - **portraitUrl**: A placeholder URL for the character's portrait. Use 'https://picsum.photos/seed/portrait_[character_name]/400/600'. Replace [character_name] with a single-word, lowercase version of the character's name.`,
});


export const cosmosFlow = ai.defineFlow(
  {
    name: 'cosmosFlow',
    inputSchema: CosmosInputSchema,
    outputSchema: CosmosOutputSchema,
  },
  async (input) => {
    // 1. Generate the core lore (title, description, history)
    const loreResponse = await cosmosLorePrompt(input);
    const lore = loreResponse.output;
    if (!lore) throw new Error('Failed to generate core lore.');

    // 2. Generate factions in parallel
    const factionResponse = await cosmosFactionPrompt(lore);
    const factions = factionResponse.output?.factions;
    if (!factions) throw new Error('Failed to generate factions.');

    // 3. Generate characters based on lore and factions
    const characterResponse = await cosmosCharacterPrompt({ ...lore, factions });
    const characters = characterResponse.output?.characters;
    if (!characters) throw new Error('Failed to generate characters.');

    // 4. Generate images in parallel using the generated content
    const [mainImage, mapImage] = await Promise.all([
      ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `A breathtaking, cinematic, ultra-detailed fantasy digital painting of the world of "${lore.title}". Theme: ${lore.tagline}. Do not include any text.`,
      }),
      ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `A detailed, antique, fantasy world map for a world called "${lore.title}". It should have the style of a hand-drawn map from a fantasy novel, with intricate details, old paper texture, and calligraphic labels. Key features might include continents, oceans, mountain ranges, and forests.`,
      }),
    ]);
    
    // In a real implementation, you might generate faction emblems and character portraits here too.
    // For now, we are using the placeholders generated in the prompts.

    if (!mainImage.media.url || !mapImage.media.url) {
      throw new Error('Failed to generate images.');
    }

    // 5. Assemble the final output
    const finalOutput: CosmosOutput = {
        ...lore,
        factions,
        characters,
        images: {
            main: mainImage.media.url,
            map: mapImage.media.url,
        },
    };

    return finalOutput;
  }
);
