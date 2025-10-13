
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, BarChart, FileText, Bot, UploadCloud } from 'lucide-react';
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

export default async function DashboardPage() {
    const stocks = await getStockData();
    const news = await getNewsData();

  const newsImage = PlaceHolderImages.find(img => img.id === 'discover-news-1');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Business Dashboard</h1>
        <p className="text-muted-foreground">
          Your AI-powered command center for market intelligence and data analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><BarChart /> Market Intelligence</CardTitle>
                <CardDescription>Live market data and top business headlines.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-semibold mb-2 px-2">Market Trends</h3>
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
                 </div>
                 <div>
                    <h3 className="font-semibold mb-2 px-2">Top Headlines</h3>
                    <div className="space-y-4">
                        {newsImage && <Image src={newsImage.imageUrl} alt="News" width={600} height={400} className="rounded-lg aspect-video object-cover" data-ai-hint={newsImage.imageHint} />}
                        {news.map((item: any, index: number) => (
                        <div key={index} className="flex flex-col gap-1">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-sm">{item.title}</a>
                            <p className="text-xs text-muted-foreground">{item.source} &middot; {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</p>
                        </div>
                        ))}
                    </div>
                 </div>
            </CardContent>
             <CardFooter>
             <Button variant="outline"><Bot className="mr-2" /> Analyze Market</Button>
          </CardFooter>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Bot /> Your Data Analyst</CardTitle>
                <CardDescription>Upload your data to get AI-powered insights.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/synthesis" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Analyze Your Data</span></p>
                        <p className="text-xs text-muted-foreground">CSV or JSON files</p>
                    </div>
                </Link>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/synthesis">Go to Synthesis</Link>
                </Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}
