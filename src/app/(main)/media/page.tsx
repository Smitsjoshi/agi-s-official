'use client';

import { TTSForm } from "@/components/media/tts-form";
import { VideoGenForm } from "@/components/video/video-gen-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Mic } from 'lucide-react';


export default function MediaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Media Generation Suite</h1>
        <p className="text-muted-foreground">
          Generate video from text or synthesize realistic speech with AI.
        </p>
      </div>

      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="video"><Video className="mr-2"/> Text-to-Video</TabsTrigger>
          <TabsTrigger value="tts"><Mic className="mr-2"/> Text-to-Speech</TabsTrigger>
        </TabsList>
        <TabsContent value="video" className="mt-6">
          <VideoGenForm />
        </TabsContent>
        <TabsContent value="tts" className="mt-6">
          <TTSForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
