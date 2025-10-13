import { VideoGenForm } from "@/components/video/video-gen-form";

export default function MediaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Media</h1>
        <p className="text-muted-foreground">
          Generate video from text or process audio with AI.
        </p>
      </div>
      <VideoGenForm />
    </div>
  );
}
