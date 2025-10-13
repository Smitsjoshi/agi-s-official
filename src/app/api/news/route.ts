import { NextResponse } from 'next/server';

// Mock data to simulate NewsAPI response
const mockNewsData = [
  {
    title: 'AI breakthrough in protein folding could revolutionize medicine',
    source: 'Tech Chronicle',
    publishedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    url: '#',
  },
  {
    title: 'Global markets react to new economic data',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    url: '#',
  },
  {
    title: 'Next-generation quantum computers achieve new milestone',
    source: 'Science Today',
    publishedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    url: '#',
  },
];

export async function GET() {
  // In a real app, you would fetch from the NewsAPI here
  // using an API key from environment variables.
  // const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
  // const response = await fetch(url);
  // const data = await response.json();
  
  return NextResponse.json(mockNewsData);
}
