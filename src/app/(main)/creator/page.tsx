'use client';
import { VisionInterface } from "@/components/vision/vision-interface";

export default function CreatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Creator</h1>
        <p className="text-muted-foreground">
          Analyze images/PDFs or generate new visual content with AI.
        </p>
      </div>
      <VisionInterface />
    </div>
  );
}
