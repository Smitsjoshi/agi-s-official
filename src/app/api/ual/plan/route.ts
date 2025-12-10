/**
 * AGI-S UAL™ - AI Action Planning API
 * Copyright © 2024-2025 AGI-S Technologies
 * 
 * Uses Liquid Intelligence™ to plan web automation actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGroqText } from '@/lib/groq';
import type { WebAction } from '@/lib/universal-action-layer';

export async function POST(req: NextRequest) {
    try {
        const { goal, url } = await req.json();

        const prompt = `You are the Universal Action Layer (UAL)™ AI planner. 
Your job is to convert user goals into precise web automation actions.

User Goal: "${goal}"
Target URL: "${url}"

Generate a JSON array of actions to achieve this goal. Available actions:
- navigate: { type: "navigate", url: "https://..." }
- click: { type: "click", selector: "button.submit" }
- type: { type: "type", selector: "input#email", value: "text" }
- scroll: { type: "scroll" }
- wait: { type: "wait", timeout: 1000 }
- screenshot: { type: "screenshot" }

Example output:
[
  { "type": "navigate", "url": "https://google.com" },
  { "type": "type", "selector": "input[name='q']", "value": "AI news" },
  { "type": "click", "selector": "input[type='submit']" },
  { "type": "wait", "timeout": 2000 },
  { "type": "screenshot" }
]

Return ONLY the JSON array, no explanation.`;

        const response = await callGroqText([
            {
                role: 'system',
                content: 'You are UAL™ AI Planner. You convert goals into precise web automation actions. Always return valid JSON arrays.'
            },
            { role: 'user', content: prompt }
        ]);

        // Parse the AI response
        let actions: WebAction[];
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                actions = JSON.parse(jsonMatch[0]);
            } else {
                actions = JSON.parse(response);
            }
        } catch (parseError) {
            // Fallback: create basic actions
            actions = [
                { type: 'navigate', url: url || 'https://google.com' },
                { type: 'wait', timeout: 2000 },
                { type: 'screenshot' }
            ];
        }

        return NextResponse.json({ actions, raw: response });

    } catch (error: any) {
        console.error('UAL Planning Error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
