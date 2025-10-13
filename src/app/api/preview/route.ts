import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // In a real implementation, you would use a library like 'open-graph-scraper'
  // to fetch the OG data from the provided URL.
  // const ogs = require('open-graph-scraper');
  // const { result } = await ogs({ url });

  // Mocking the response for demonstration purposes
  const mockPreview = {
    title: `Preview for ${url}`,
    description: `This is a mock description of the content at the provided URL. A real preview would be more descriptive.`,
    image: `https://picsum.photos/seed/${encodeURIComponent(url)}/400/200`,
  };

  return NextResponse.json(mockPreview);
}
