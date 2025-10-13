'use server';

import { run, stream } from '@/ai/flows/orchestrator-flow';
import type { AiMode } from '@/lib/types';
import { createCustomAgent } from '@/ai/flows/create-custom-ai-agents';
import { generateVideoFromText } from '@/ai/flows/generate-video-from-text';
import { generateAudioFromText } from '@/ai/flows/tts-flow.ts';
import { continuumFlow } from '@/ai/flows/continuum-flow';
import { aetherFlow } from '@/ai/flows/aether-flow';
import { synthesisFlow } from '@/ai/flows/synthesis-flow';
import { crucibleFlow } from '@/ai/flows/crucible-flow';
import { cosmosFlow } from '@/ai/flows/cosmos-flow';
import { catalystFlow } from '@/ai/flows/catalyst-flow';
import { liveWebAgentFlow } from '@/ai/flows/live-web-agent-flow';
import type { CreateCustomAgentInput } from '@/ai/flows/create-custom-ai-agents';
import type { GenerateAudioInput } from '@/ai/flows/tts-flow';
import type { AetherInput, AetherOutput, ContinuumInput, ContinuumOutput, SynthesisInput, SynthesisOutput, CrucibleInput, CrucibleOutput, CosmosInput, CosmosOutput, CatalystInput, CatalystOutput } from '@/lib/types';


export async function askAi(
  query: string,
  mode: AiMode,
  chatHistory: any[],
  file?: { type: 'image' | 'pdf' | 'csv' | 'json'; data: string },
  options?: any,
) {
  if (mode === 'Canvas') {
    return await liveWebAgentFlow({ goal: query });
  }
  return await run(query, mode, chatHistory, file, options);
}

export async function streamAi(
  query: string,
  mode: AiMode,
  chatHistory: any[],
  file?: { type: 'image' | 'pdf'; data: string }
) {
  // In a real app, this would use model-specific streaming APIs.
  // For now, it just calls the run function.
  const result = await run(query, mode, chatHistory, file);
  return result;
}


export async function createAgentAction(data: CreateCustomAgentInput) {
    try {
        const result = await createCustomAgent(data);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to create agent.' };
    }
}

export async function generateVideoAction(prompt: string) {
    try {
        const result = await generateVideoFromText({ prompt });
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate video.' };
    }
}

export async function generateAudioAction(input: GenerateAudioInput) {
    try {
        const result = await generateAudioFromText(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in TTS Action:", error);
        return { success: false, error: error.message || 'Failed to generate audio.' };
    }
}

export async function generateContinuumAction(input: ContinuumInput): Promise<{ success: boolean; data?: ContinuumOutput, error?: string; }> {
    try {
        const result = await continuumFlow(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in Continuum Action:", error);
        return { success: false, error: error.message || 'Failed to generate the event snapshot.' };
    }
}

export async function generateAetherAction(input: AetherInput): Promise<{ success: boolean; data?: AetherOutput, error?: string; }> {
    try {
        const result = await aetherFlow(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in Aether Action:", error);
        return { success: false, error: error.message || 'Failed to generate the dream analysis.' };
    }
}

export async function generateSynthesisAction(input: SynthesisInput): Promise<{ success: boolean; data?: SynthesisOutput, error?: string; }> {
    try {
        const result = await synthesisFlow(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in Synthesis Action:", error);
        return { success: false, error: error.message || 'Failed to generate the data analysis.' };
    }
}

export async function generateCrucibleAction(input: CrucibleInput): Promise<{ success: boolean; data?: CrucibleOutput, error?: string; }> {
    try {
        const result = await crucibleFlow(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in Crucible Action:", error);
        return { success: false, error: error.message || 'Failed to generate the critique.' };
    }
}

export async function generateCosmosAction(input: CosmosInput): Promise<{ success: boolean; data?: CosmosOutput, error?: string; }> {
    try {
        const result = await cosmosFlow(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in Cosmos Action:", error);
        return { success: false, error: error.message || 'Failed to generate the universe.' };
    }
}

export async function generateCatalystAction(input: CatalystInput): Promise<{ success: boolean; data?: CatalystOutput, error?: string; }> {
    try {
        const result = await catalystFlow(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error in Catalyst Action:", error);
        return { success: false, error: error.message || 'Failed to generate the learning path.' };
    }
}
