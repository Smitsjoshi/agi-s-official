import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        className="relative inline-flex items-center justify-center rounded-lg px-3 py-1.5 overflow-hidden font-headline font-bold"
        style={{
            background: 'linear-gradient(135deg, #ff3b30, #007aff, #34c759)',
            backgroundSize: '200% 200%',
            animation: 'gradient-animation 4s ease infinite',
        }}
      >
        <span className="relative z-10 text-white" style={{mixBlendMode: 'lighten', fontSize: '1.1em'}}>AGI-S</span>
      </div>
    </div>
  );
}
