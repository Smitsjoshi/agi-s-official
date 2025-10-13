
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, BarChart, FileText, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

async function getStockData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stocks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stock data');
  return res.json();
}

async function getNewsData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/news`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch news data');
  return res.json();
}

export default async function DiscoverPage() {
  const stocks = await getStockData();
  const news = await getNewsData();

  const newsImage = PlaceHolderImages.find(img => img.id === 'discover-news-1');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Discover</h1>
        <p className="text-muted-foreground">
          Your daily brief of market trends and top headlines, powered by AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><BarChart /> Market Trends</CardTitle>
            <CardDescription>Live stock market data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock: any) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell className={cn('text-right font-medium', stock.change > 0 ? 'text-green-500' : 'text-red-500')}>
                      <span className="flex items-center justify-end gap-1">
                        {stock.change > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
             <Button variant="outline"><Bot className="mr-2" /> Analyze Market</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><FileText /> Top Headlines</CardTitle>
            <CardDescription>The latest news from around the world.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {newsImage && <Image src={newsImage.imageUrl} alt="News" width={600} height={400} className="rounded-lg aspect-video object-cover" data-ai-hint={newsImage.imageHint} />}
            {news.map((item: any, index: number) => (
              <div key={index} className="flex flex-col gap-1">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{item.title}</a>
                <p className="text-sm text-muted-foreground">{item.source} &middot; {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline"><Bot className="mr-2" /> Summarize News</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
