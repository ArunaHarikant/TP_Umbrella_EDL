import { PHASES, type Phase } from "@/hooks/use-simulation";
import { Check, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PhaseTrackerProps {
  currentPhaseIndex: number;
  isActive: boolean;
}

export function PhaseTracker({ currentPhaseIndex, isActive }: PhaseTrackerProps) {
  return (
    <div className="h-24 lg:h-28 glass-panel border-t border-x-0 border-b-0 w-full px-4 lg:px-8 py-4 shrink-0 flex flex-col justify-center relative z-10">
      <div className="flex items-center justify-between w-full relative">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full" />
        
        {/* Active track line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(0,242,255,0.5)]"
          style={{ width: `${(currentPhaseIndex / (PHASES.length - 1)) * 100}%` }}
        />

        {PHASES.map((phase, idx) => {
          const isCompleted = idx < currentPhaseIndex;
          const isCurrent = idx === currentPhaseIndex && isActive;
          const isUpcoming = idx > currentPhaseIndex;
          
          return (
            <div key={phase} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={clsx(
                "w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                isCompleted ? "bg-secondary border-secondary text-black" :
                isCurrent ? "bg-background border-primary shadow-[0_0_15px_rgba(255,77,0,0.6)] animate-pulse" :
                "bg-background border-white/20 text-white/30"
              )}>
                {isCompleted ? <Check className="w-3 h-3 lg:w-4 lg:h-4" /> : 
                 isCurrent ? <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-primary" /> : 
                 <span className="text-[10px] lg:text-xs font-display">{idx + 1}</span>}
              </div>
              
              <span className={clsx(
                "absolute top-8 lg:top-10 text-[9px] lg:text-[11px] font-display font-bold tracking-widest transition-colors duration-300",
                isCompleted ? "text-secondary" :
                isCurrent ? "text-primary text-glow-primary" :
                "text-muted-foreground opacity-50"
              )}>
                {phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
