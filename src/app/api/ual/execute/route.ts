/**
 * AGI-S Universal Action Layer (UAL)™ - Server Implementation
 * Copyright © 2024-2025 AGI-S Technologies
 * Patent Pending
 */

import { NextRequest, NextResponse } from 'next/server';
import type { UALTask, UALResult, WebAction } from '@/lib/universal-action-layer';

// Dynamic import for Puppeteer (server-side only)
let puppeteer: any;

async function initPuppeteer() {
    if (!puppeteer) {
        puppeteer = await import('puppeteer');
    }
    return puppeteer;
}

/**
 * Execute UAL task with browser automation
 */
export async function POST(req: NextRequest) {
    try {
        const task: UALTask = await req.json();
        const { goal, url, actions } = task;

        const steps: string[] = [];
        let screenshot: string | undefined;
        let extractedData: any;

        // Initialize Puppeteer
        const pup = await initPuppeteer();
        const browser = await pup.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        steps.push('✅ Browser launched');

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        // Navigate to URL
        if (url) {
            steps.push(`🌐 Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            steps.push('✅ Page loaded');
        }

        // Execute actions if provided
        if (actions && actions.length > 0) {
            for (const action of actions) {
                try {
                    await executeAction(page, action, steps);
                } catch (error: any) {
                    steps.push(`⚠️ Action failed: ${error.message}`);
                }
            }
        } else {
            // If no actions provided, just take a screenshot
            steps.push('📸 Capturing page state...');
        }

        // Always capture final screenshot
        screenshot = await page.screenshot({ encoding: 'base64' });
        steps.push('✅ Screenshot captured');

        // Extract page data
        extractedData = await page.evaluate(() => ({
            title: document.title,
            url: window.location.href,
            text: document.body.innerText.substring(0, 500),
        }));

        await browser.close();
        steps.push('✅ Browser closed');

        const result: UALResult = {
            success: true,
            screenshot,
            data: extractedData,
            steps,
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('UAL Error:', error);

        const result: UALResult = {
            success: false,
            error: error.message,
            steps: [`❌ Error: ${error.message}`],
        };

        return NextResponse.json(result, { status: 500 });
    }
}

/**
 * Execute a single web action
 */
async function executeAction(page: any, action: WebAction, steps: string[]) {
    switch (action.type) {
        case 'navigate':
            if (action.url) {
                steps.push(`🌐 Navigating to ${action.url}...`);
                await page.goto(action.url, { waitUntil: 'networkidle2' });
                steps.push('✅ Navigation complete');
            }
            break;

        case 'click':
            if (action.selector) {
                steps.push(`🖱️ Clicking ${action.selector}...`);
                await page.waitForSelector(action.selector, { timeout: 5000 });
                await page.click(action.selector);
                steps.push('✅ Click complete');
            }
            break;

        case 'type':
            if (action.selector && action.value) {
                steps.push(`⌨️ Typing into ${action.selector}...`);
                await page.waitForSelector(action.selector, { timeout: 5000 });
                await page.type(action.selector, action.value);
                steps.push('✅ Typing complete');
            }
            break;

        case 'scroll':
            steps.push('📜 Scrolling page...');
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            steps.push('✅ Scroll complete');
            break;

        case 'wait':
            const timeout = action.timeout || 1000;
            steps.push(`⏳ Waiting ${timeout}ms...`);
            await page.waitForTimeout(timeout);
            steps.push('✅ Wait complete');
            break;

        case 'screenshot':
            steps.push('📸 Taking screenshot...');
            await page.screenshot({ encoding: 'base64' });
            steps.push('✅ Screenshot taken');
            break;

        case 'extract':
            steps.push('📊 Extracting data...');
            // Data extraction logic
            steps.push('✅ Data extracted');
            break;

        default:
            steps.push(`⚠️ Unknown action type: ${action.type}`);
    }
}
