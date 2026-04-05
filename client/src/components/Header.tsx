import { Orbit, Satellite, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

interface HeaderProps {
  missionTimeFormatted: string;
  currentPhase: string;
  isActive: boolean;
  isAborted: boolean;
}

export function Header({ missionTimeFormatted, currentPhase, isActive, isAborted }: HeaderProps) {
  return (
    <header className="h-16 lg:h-20 glass-panel border-b border-x-0 border-t-0 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0 relative">
      {/* Logo & Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 relative group cursor-pointer">
          <Orbit className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-1000" />
          {isActive && !isAborted && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full animate-ping" />
          )}
        </div>
        <div>
          <h1 className="text-lg lg:text-xl font-display font-bold text-white tracking-widest text-glow-primary">Team Project Umbrella</h1>
          <p className="text-[10px] text-primary tracking-[0.2em] uppercase font-semibold">EDL Command</p>
        </div>
      </div>

      {/* Center Status */}
      <div className="hidden md:flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <Satellite className="w-4 h-4 text-secondary" />
          <span className="text-xs text-secondary tracking-widest font-display">LINK STABLE</span>
        </div>
        <div className="px-6 py-1 rounded-full bg-black/50 border border-white/10 flex items-center gap-2">
          <span className={clsx(
            "w-2 h-2 rounded-full",
            isActive && !isAborted ? "bg-green-500 animate-pulse" : 
            isAborted ? "bg-destructive animate-pulse" : "bg-muted-foreground"
          )} />
          <span className={clsx(
            "text-sm font-bold font-display tracking-widest",
            isAborted ? "text-destructive" : "text-white"
          )}>
            {isAborted ? "SYSTEM ABORTED" : isActive ? "SEQUENCE RUNNING" : "AWAITING COMMAND"}
          </span>
        </div>
      </div>

      {/* Clock & Phase */}
      <div className="flex flex-col items-end">
        <div className={clsx(
          "text-2xl lg:text-3xl font-display font-black tracking-wider",
          isAborted ? "text-destructive text-glow-destructive" : "text-white"
        )}>
          T{missionTimeFormatted}
        </div>
        <div className="flex items-center gap-2">
          {isAborted && <AlertTriangle className="w-4 h-4 text-destructive" />}
          <span className="text-xs text-muted-foreground tracking-[0.1em]">PHASE: <span className="text-secondary font-bold font-display">{currentPhase}</span></span>
        </div>
      </div>
    </header>
  );
}
