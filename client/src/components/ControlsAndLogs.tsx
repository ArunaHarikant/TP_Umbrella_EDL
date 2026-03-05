import { Terminal, Play, SquareSquare, RefreshCcw } from "lucide-react";
import { clsx } from "clsx";
import { format } from "date-fns";

interface ControlsAndLogsProps {
  logs: { id: number; phase: string; message: string; timestamp: string }[];
  isActive: boolean;
  isAborted: boolean;
  onInitiate: () => void;
  onAbort: () => void;
  onReset: () => void;
}

export function ControlsAndLogs({ logs, isActive, isAborted, onInitiate, onAbort, onReset }: ControlsAndLogsProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls */}
      <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
        <h2 className="text-xs text-muted-foreground font-display font-bold tracking-widest mb-1">COMMAND UPLINK</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onInitiate}
            disabled={isActive || isAborted}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg font-display font-bold text-sm tracking-wider
              bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 hover:border-secondary hover:shadow-[0_0_15px_rgba(0,242,255,0.3)]
              active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-secondary/10 disabled:hover:shadow-none"
          >
            <Play className="w-6 h-6" />
            INITIATE EDL
          </button>

          <button
            onClick={onAbort}
            disabled={!isActive || isAborted}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg font-display font-bold text-sm tracking-wider
              bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 hover:border-destructive hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]
              active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-destructive/10 disabled:hover:shadow-none"
          >
            <SquareSquare className="w-6 h-6" />
            ABORT
          </button>
        </div>

        {(isAborted || (!isActive && logs.length > 0)) && (
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-display font-bold text-xs tracking-wider
              bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 mt-2"
          >
            <RefreshCcw className="w-4 h-4" />
            RESET TELEMETRY
          </button>
        )}
      </div>

      {/* Logs */}
      <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <h2 className="text-xs text-secondary font-display font-bold tracking-widest flex items-center gap-2">
            <Terminal className="w-4 h-4" /> MISSION LOGS
          </h2>
          <span className="text-[10px] font-mono text-muted-foreground">{logs.length} ENTRIES</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs flex flex-col gap-2 relative">
          {logs.length === 0 ? (
            <div className="text-muted-foreground text-center mt-10 tracking-widest opacity-50">
              NO DATA AWAITING UPLINK
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className={clsx(
                  "p-2 rounded bg-white/5 border-l-2 flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-300",
                  log.message.includes("ABORTED") ? "border-destructive text-destructive bg-destructive/10" :
                  log.message.includes("Touchdown") ? "border-green-500 text-green-400 bg-green-500/10" :
                  "border-secondary/50 text-white/80 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between opacity-70 text-[10px]">
                  <span>{format(new Date(log.timestamp), 'HH:mm:ss.SSS')}</span>
                  <span className="font-display font-bold tracking-wider text-primary">{log.phase}</span>
                </div>
                <div>{log.message}</div>
              </div>
            ))
          )}
          
          {/* Fading bottom edge for scroll */}
          <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
