'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Link, Loader2 } from 'lucide-react';
import { useState } from 'react';

async function fetchPreview(url: string) {
    // In a real app, this would be an API call to a backend route
    // that fetches OpenGraph data for the URL.
    // e.g., const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    // const data = await res.json();
    // For this mock, we'll just show the URL.
    return {
        title: `Preview for ${url}`,
        description: 'This is a mock preview. A real implementation would show a summary of the page.',
        image: `https://picsum.photos/seed/${url}/400/200`,
    };
}


export function SourcePreview({ url, title }: { url: string; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !previewData) {
      setIsLoading(true);
      const data = await fetchPreview(url);
      setPreviewData(data);
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Link className="h-3 w-3 mr-1.5" />
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin" />
          </div>
        ) : previewData ? (
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{previewData.title}</h4>
              <p className="text-sm text-muted-foreground">{previewData.description}</p>
            </div>
            {previewData.image && <img src={previewData.image} alt="Preview" className="rounded-md" />}
            <Button asChild variant="link" className="p-0 h-auto justify-start">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Visit Page
              </a>
            </Button>
          </div>
        ) : (
          <p>Could not load preview.</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
