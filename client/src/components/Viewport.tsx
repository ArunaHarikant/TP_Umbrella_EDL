import edlVideo from '@assets/Untitled_design_1775393203432.mp4';
import roverImage from '@assets/RoverDesign_1775393284054.jpeg';
import { Crosshair, ScanLine } from 'lucide-react';
import { clsx } from 'clsx';
import type { Phase } from '@/hooks/use-simulation';

interface ViewportProps {
  currentPhase: Phase;
  isActive: boolean;
  isAborted: boolean;
}

export function Viewport({ currentPhase, isActive, isAborted }: ViewportProps) {
  return (
    <div className={clsx(
      "relative w-full h-full rounded-xl overflow-hidden glass-panel",
      isAborted && "border-destructive shadow-[0_0_30px_rgba(255,0,0,0.3)]",
      isActive && !isAborted && "border-secondary/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]"
    )}>
      {/* Video Background */}
      <video 
        src={edlVideo} 
        autoPlay 
        muted 
        playsInline 
        loop 
        className={clsx(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
          (!isActive || isAborted) && "opacity-30 grayscale",
          isActive && "opacity-80"
        )}
      />

      {/* HUD Overlays */}
      <div className="absolute inset-0 scanlines pointer-events-none mix-blend-screen" />
      
      {isActive && !isAborted && (
        <>
          <div className="hud-crosshair mix-blend-screen" />
          
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
            <span className="text-red-500 font-display font-bold tracking-widest text-sm text-glow-destructive">REC</span>
          </div>

          <div className="absolute top-6 right-6 font-display text-secondary/80 text-xs text-right tracking-widest">
            <div>CAM-01 / NAV</div>
            <div className="font-mono mt-1 opacity-70">LAT: 18.44°N</div>
            <div className="font-mono opacity-70">LON: 77.45°E</div>
          </div>

          <div className="absolute bottom-6 left-6 font-display text-primary font-bold tracking-widest text-lg text-glow-primary bg-black/40 px-3 py-1 rounded border border-primary/30 backdrop-blur-sm">
            PHASE: {currentPhase}
          </div>

          {/* Random decorative HUD elements */}
          <div className="absolute bottom-6 right-6 text-secondary flex items-center gap-2 opacity-50">
            <ScanLine className="animate-spin-slow w-6 h-6" />
            <div className="flex flex-col">
              <div className="h-1 w-12 bg-secondary mb-1"></div>
              <div className="h-1 w-8 bg-secondary"></div>
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-secondary/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-secondary/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-secondary/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-secondary/50" />
        </>
      )}

      {isAborted && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-[2px]">
          <div className="text-center">
            <div className="text-destructive font-display font-black text-6xl tracking-widest text-glow-destructive mb-4 animate-pulse">
              ABORTED
            </div>
            <div className="text-white font-mono text-sm uppercase tracking-widest bg-black/80 px-4 py-2 inline-block rounded">
              Manual override engaged. Link severed.
            </div>
          </div>
        </div>
      )}

      {!isActive && !isAborted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src={roverImage}
              alt="Rover Design"
              className="w-56 lg:w-72 object-contain drop-shadow-[0_0_24px_rgba(0,242,255,0.35)] opacity-80"
            />
            <div className="text-muted-foreground font-display tracking-widest text-sm">SYSTEM STANDBY</div>
          </div>
        </div>
      )}
    </div>
  );
}
