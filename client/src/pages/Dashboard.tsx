import { Header } from "@/components/Header";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { Viewport } from "@/components/Viewport";
import { ControlsAndLogs } from "@/components/ControlsAndLogs";
import { PhaseTracker } from "@/components/PhaseTracker";
import { useSimulation } from "@/hooks/use-simulation";
import { useEffect } from "react";

export default function Dashboard() {
  const {
    isActive,
    isAborted,
    currentPhase,
    currentPhaseIndex,
    missionTimeFormatted,
    telemetry,
    logs,
    initiate,
    abort,
    reset
  } = useSimulation();

  // Handle ambient background glow based on phase
  useEffect(() => {
    if (isAborted) {
      document.body.style.boxShadow = "inset 0 0 100px rgba(255,0,0,0.2)";
    } else if (isActive && currentPhaseIndex > 1 && currentPhaseIndex < 8) {
      // Heating up during aero and shield
      document.body.style.boxShadow = "inset 0 0 150px rgba(255,77,0,0.15)";
    } else {
      document.body.style.boxShadow = "none";
    }
    return () => { document.body.style.boxShadow = "none" };
  }, [isActive, isAborted, currentPhaseIndex]);

  return (
    <div className="flex flex-col h-screen w-full bg-transparent overflow-hidden">
      <Header 
        missionTimeFormatted={missionTimeFormatted}
        currentPhase={currentPhase}
        isActive={isActive}
        isAborted={isAborted}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 relative z-10">
        
        {/* Left: Telemetry (Col 1-3) */}
        <section className="hidden lg:block lg:col-span-3">
          <TelemetryPanel telemetry={telemetry} />
        </section>

        {/* Center: Video Viewport (Col 4-9) */}
        <section className="col-span-1 lg:col-span-6 h-[40vh] lg:h-auto">
          <Viewport 
            currentPhase={currentPhase} 
            isActive={isActive} 
            isAborted={isAborted} 
          />
        </section>

        {/* Right: Controls & Logs (Col 10-12) */}
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
          {/* Mobile Telemetry Quick View */}
          <div className="lg:hidden h-32 shrink-0">
            <TelemetryPanel telemetry={telemetry} />
          </div>
          
          <div className="flex-1 min-h-0">
             <ControlsAndLogs 
               logs={logs}
               isActive={isActive}
               isAborted={isAborted}
               onInitiate={initiate}
               onAbort={abort}
               onReset={reset}
             />
          </div>
        </section>

      </main>

      <PhaseTracker 
        currentPhaseIndex={currentPhaseIndex} 
        isActive={isActive} 
      />
    </div>
  );
}
