import { useState, useEffect, useRef, useCallback } from "react";
import { useCreateLog } from "./use-logs";

export const PHASES = [
  "CRUISE", "ENTRY", "AERO", "CHUTE", "SHIELD", "RADAR", 
  "SHELL", "DESC", "CRANE", "ROVER", "DEPLOY", "TOUCH"
] as const;

export type Phase = typeof PHASES[number];

export interface TelemetryData {
  altitude: number; // meters
  velocity: number; // km/h
  temperature: number; // Celsius
  fuel: number; // percentage
}

// Target values for the END of each phase
const PHASE_TARGETS: Record<Phase, TelemetryData> = {
  CRUISE: { altitude: 125000, velocity: 21000, temperature: -60, fuel: 100 },
  ENTRY:  { altitude: 120000, velocity: 20500, temperature: 1200, fuel: 98 },
  AERO:   { altitude: 80000, velocity: 15000, temperature: 2100, fuel: 95 },
  CHUTE:  { altitude: 11000, velocity: 1500, temperature: 800, fuel: 95 },
  SHIELD: { altitude: 8000, velocity: 600, temperature: 300, fuel: 95 },
  RADAR:  { altitude: 5000, velocity: 400, temperature: 150, fuel: 95 },
  SHELL:  { altitude: 3000, velocity: 300, temperature: 80, fuel: 95 },
  DESC:   { altitude: 1500, velocity: 250, temperature: 40, fuel: 80 },
  CRANE:  { altitude: 100, velocity: 50, temperature: 20, fuel: 60 },
  ROVER:  { altitude: 20, velocity: 10, temperature: 15, fuel: 55 },
  DEPLOY: { altitude: 5, velocity: 2, temperature: 10, fuel: 50 },
  TOUCH:  { altitude: 0, velocity: 0, temperature: 5, fuel: 45 },
};

const TICK_RATE_MS = 100;
const SECONDS_PER_PHASE = 5;
const TICKS_PER_PHASE = (SECONDS_PER_PHASE * 1000) / TICK_RATE_MS;

export function useSimulation() {
  const [isActive, setIsActive] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [missionTimeMs, setMissionTimeMs] = useState(0);
  const [localLogs, setLocalLogs] = useState<{ id: number, phase: string, message: string, timestamp: string }[]>([]);
  
  const [telemetry, setTelemetry] = useState<TelemetryData>(PHASE_TARGETS["CRUISE"]);
  
  const createLog = useCreateLog();
  const nextLogId = useRef(1);

  const addLog = useCallback((phase: string, message: string) => {
    const timestamp = new Date().toISOString();
    setLocalLogs(prev => [{
      id: nextLogId.current++,
      phase,
      message,
      timestamp
    }, ...prev].slice(0, 50)); // Keep last 50 logs in UI
    
    // Also sync to backend
    createLog.mutate({ phase, message });
  }, [createLog]);

  useEffect(() => {
    if (!isActive || isAborted) return;

    const interval = setInterval(() => {
      setMissionTimeMs(prev => {
        const nextMs = prev + TICK_RATE_MS;
        
        // Calculate new phase
        const phaseFloat = nextMs / (SECONDS_PER_PHASE * 1000);
        const nextPhaseIdx = Math.min(Math.floor(phaseFloat), PHASES.length - 1);
        
        if (nextPhaseIdx !== currentPhaseIndex && nextPhaseIdx < PHASES.length) {
          setCurrentPhaseIndex(nextPhaseIdx);
          addLog(PHASES[nextPhaseIdx], `Entered ${PHASES[nextPhaseIdx]} phase.`);
        }

        // Reached the end
        if (phaseFloat >= PHASES.length) {
          setIsActive(false);
          addLog("TOUCH", "Touchdown confirmed. EDL Complete.");
          return prev;
        }

        // Interpolate telemetry
        const startPhaseIdx = Math.max(0, nextPhaseIdx - 1);
        const startTarget = PHASE_TARGETS[PHASES[startPhaseIdx]];
        const endTarget = PHASE_TARGETS[PHASES[nextPhaseIdx]];
        
        // Progress within current phase (0.0 to 1.0)
        const phaseProgress = phaseFloat % 1;

        setTelemetry({
          altitude: startTarget.altitude + (endTarget.altitude - startTarget.altitude) * phaseProgress,
          velocity: startTarget.velocity + (endTarget.velocity - startTarget.velocity) * phaseProgress,
          temperature: startTarget.temperature + (endTarget.temperature - startTarget.temperature) * phaseProgress,
          fuel: startTarget.fuel + (endTarget.fuel - startTarget.fuel) * phaseProgress,
        });

        return nextMs;
      });
    }, TICK_RATE_MS);

    return () => clearInterval(interval);
  }, [isActive, isAborted, currentPhaseIndex, addLog]);

  const initiate = () => {
    if (isActive) return;
    setMissionTimeMs(0);
    setCurrentPhaseIndex(0);
    setIsActive(true);
    setIsAborted(false);
    setTelemetry(PHASE_TARGETS["CRUISE"]);
    setLocalLogs([]);
    addLog("CRUISE", "EDL Sequence Initiated. Systems nominal.");
  };

  const abort = () => {
    if (!isActive || isAborted) return;
    setIsAborted(true);
    setIsActive(false);
    addLog(PHASES[currentPhaseIndex], "CRITICAL: MISSION ABORTED BY OPERATOR.");
  };

  const reset = () => {
    setIsActive(false);
    setIsAborted(false);
    setMissionTimeMs(0);
    setCurrentPhaseIndex(0);
    setTelemetry(PHASE_TARGETS["CRUISE"]);
    setLocalLogs([]);
  };

  // Format mission time as +HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isActive,
    isAborted,
    currentPhase: PHASES[currentPhaseIndex],
    currentPhaseIndex,
    missionTimeFormatted: formatTime(missionTimeMs),
    telemetry,
    logs: localLogs,
    initiate,
    abort,
    reset
  };
}
