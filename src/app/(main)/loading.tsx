import { Logo } from "@/components/logo";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <Logo className="h-24 w-24 animate-logo-pulse" />
        <div className="absolute inset-0 -z-10 animate-logo-glow rounded-full bg-primary/50 blur-2xl" />
      </div>
    </div>
  );
}
