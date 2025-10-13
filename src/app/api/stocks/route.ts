import { NextResponse } from 'next/server';

// Mock data to simulate Alpha Vantage API response
const mockStockData = [
  { symbol: 'AAPL', price: 172.5, change: 1.25, changePercent: 0.73 },
  { symbol: 'GOOGL', price: 140.8, change: -0.5, changePercent: -0.35 },
  { symbol: 'MSFT', price: 370.95, change: 2.1, changePercent: 0.57 },
  { symbol: 'AMZN', price: 145.18, change: -1.8, changePercent: -1.22 },
  { symbol: 'TSLA', price: 240.5, change: 5.6, changePercent: 2.39 },
];

export async function GET() {
  // In a real app, you would fetch from the Alpha Vantage API here
  // using an API key from environment variables.
  // const url = `https://www.alphavantage.co/query?function=...&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  // const response = await fetch(url);
  // const data = await response.json();
  
  return NextResponse.json(mockStockData);
}
