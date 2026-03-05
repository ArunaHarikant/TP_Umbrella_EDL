import { Gauge, ThermometerSun, FastForward, Droplets } from "lucide-react";
import type { TelemetryData } from "@/hooks/use-simulation";

interface TelemetryPanelProps {
  telemetry: TelemetryData;
}

export function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6 p-4 h-full glass-panel-glow rounded-xl">
      <h2 className="text-sm text-secondary font-display font-bold tracking-widest flex items-center gap-2 pb-2 border-b border-white/10">
        <Gauge className="w-4 h-4" /> LIVE TELEMETRY
      </h2>

      <div className="flex-1 flex flex-col justify-between py-2">
        <TelemetryReadout 
          label="ALTITUDE" 
          value={telemetry.altitude} 
          unit="m" 
          icon={<FastForward className="-rotate-90 w-5 h-5 text-primary" />} 
          max={125000} 
        />
        
        <TelemetryReadout 
          label="VELOCITY" 
          value={telemetry.velocity} 
          unit="km/h" 
          icon={<FastForward className="w-5 h-5 text-secondary" />} 
          max={21000} 
        />
        
        <TelemetryReadout 
          label="HEAT SHIELD TEMP" 
          value={telemetry.temperature} 
          unit="°C" 
          icon={<ThermometerSun className="w-5 h-5 text-orange-500" />} 
          max={2500} 
          warningThreshold={2000}
        />
        
        <TelemetryReadout 
          label="PROPELLANT" 
          value={telemetry.fuel} 
          unit="%" 
          icon={<Droplets className="w-5 h-5 text-blue-400" />} 
          max={100} 
          criticalThreshold={30}
        />
      </div>
    </div>
  );
}

function TelemetryReadout({ 
  label, 
  value, 
  unit, 
  icon, 
  max, 
  warningThreshold, 
  criticalThreshold 
}: { 
  label: string, 
  value: number, 
  unit: string, 
  icon: React.ReactNode, 
  max: number,
  warningThreshold?: number,
  criticalThreshold?: number
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  let statusColor = "bg-secondary";
  let textColor = "text-white";
  
  if (warningThreshold && value > warningThreshold) {
    statusColor = "bg-primary";
    textColor = "text-primary text-glow-primary";
  } else if (criticalThreshold && value < criticalThreshold) {
    statusColor = "bg-destructive";
    textColor = "text-destructive text-glow-destructive";
  }

  // Format to 0 decimal places if large, 2 if small
  const displayValue = value > 100 ? Math.floor(value).toLocaleString() : value.toFixed(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold tracking-wider">
        <span className="flex items-center gap-1.5">{icon} {label}</span>
      </div>
      
      <div className="flex items-end justify-between font-display">
        <div className={`text-2xl lg:text-3xl font-bold tracking-tight ${textColor}`}>
          {displayValue}
        </div>
        <div className="text-sm text-muted-foreground pb-1">{unit}</div>
      </div>
      
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-1">
        <div 
          className={`h-full ${statusColor} transition-all duration-100 ease-linear shadow-[0_0_8px_currentColor]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
