import { clsx } from "clsx";

interface Rover3DProps {
  visible: boolean;
  phase: string;
}

export function Rover3D({ visible, phase }: Rover3DProps) {
  const isDeploying = phase === "ROVER";
  const isDriving = phase === "DEPLOY" || phase === "TOUCH";

  return (
    <div
      className={clsx(
        "absolute bottom-16 left-1/2 transition-all duration-[2000ms] ease-out pointer-events-none",
        visible ? "opacity-100 translate-x-[-50%] translate-y-0" : "opacity-0 translate-x-[60%] translate-y-8"
      )}
      style={{ filter: "drop-shadow(0 0 18px rgba(0,242,255,0.5))" }}
    >
      <svg
        viewBox="0 0 340 160"
        width="280"
        height="130"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(isDriving && "animate-rover-drive")}
      >
        {/* === SUSPENSION ARMS (rocker-bogie) === */}
        {/* Left rocker arm */}
        <line x1="80" y1="100" x2="130" y2="85" stroke="#d0d0d0" strokeWidth="5" strokeLinecap="round" />
        <line x1="130" y1="85" x2="160" y2="100" stroke="#d0d0d0" strokeWidth="4" strokeLinecap="round" />
        {/* Left bogie front */}
        <line x1="80" y1="100" x2="50" y2="112" stroke="#d0d0d0" strokeWidth="5" strokeLinecap="round" />
        <line x1="50" y1="112" x2="20" y2="100" stroke="#d0d0d0" strokeWidth="4" strokeLinecap="round" />

        {/* Right rocker arm */}
        <line x1="260" y1="100" x2="210" y2="85" stroke="#d0d0d0" strokeWidth="5" strokeLinecap="round" />
        <line x1="210" y1="85" x2="180" y2="100" stroke="#d0d0d0" strokeWidth="4" strokeLinecap="round" />
        {/* Right bogie front */}
        <line x1="260" y1="100" x2="290" y2="112" stroke="#d0d0d0" strokeWidth="5" strokeLinecap="round" />
        <line x1="290" y1="112" x2="320" y2="100" stroke="#d0d0d0" strokeWidth="4" strokeLinecap="round" />

        {/* Center body mount arms */}
        <line x1="130" y1="85" x2="130" y2="68" stroke="#b8b8b8" strokeWidth="4" strokeLinecap="round" />
        <line x1="210" y1="85" x2="210" y2="68" stroke="#b8b8b8" strokeWidth="4" strokeLinecap="round" />

        {/* === MAIN BODY === */}
        {/* Body shadow/depth */}
        <rect x="118" y="42" width="106" height="50" rx="3" fill="#4a3e1a" opacity="0.6" transform="translate(4,4)" />
        {/* Main gold chassis */}
        <rect x="118" y="42" width="106" height="50" rx="3" fill="#b8952a" />
        {/* Body highlight */}
        <rect x="118" y="42" width="106" height="12" rx="3" fill="#d4aa32" opacity="0.7" />
        {/* Body panel lines */}
        <line x1="170" y1="42" x2="170" y2="92" stroke="#9a7a1e" strokeWidth="1.5" opacity="0.6" />
        <rect x="126" y="50" width="20" height="16" rx="2" fill="#1a1a2e" opacity="0.8" />
        <rect x="196" y="50" width="20" height="16" rx="2" fill="#1a1a2e" opacity="0.8" />

        {/* === SOLAR PANEL (angled on top) === */}
        <g transform="rotate(-5, 170, 42)">
          <rect x="112" y="22" width="118" height="22" rx="2" fill="#1a2a6e" />
          {/* Panel cells */}
          {[0,1,2,3,4,5,6].map(i => (
            <line key={i} x1={118 + i * 16} y1="22" x2={118 + i * 16} y2="44" stroke="#2a3a8e" strokeWidth="1" />
          ))}
          <line x1="112" y1="33" x2="230" y2="33" stroke="#2a3a8e" strokeWidth="1" />
          {/* Cell sheen */}
          <rect x="112" y="22" width="118" height="8" rx="2" fill="white" opacity="0.08" />
          {/* Panel border */}
          <rect x="112" y="22" width="118" height="22" rx="2" fill="none" stroke="#3a4a9e" strokeWidth="1.5" />
        </g>

        {/* Panel mount strut */}
        <rect x="162" y="38" width="6" height="8" fill="#8a8a8a" />
        <rect x="174" y="38" width="6" height="8" fill="#8a8a8a" />

        {/* Camera mast */}
        <rect x="155" y="28" width="4" height="16" fill="#9a9a9a" rx="1" />
        <circle cx="157" cy="26" r="5" fill="#444" />
        <circle cx="157" cy="26" r="3" fill="#1a1a2e" />
        <circle cx="157" cy="26" r="1.5" fill="#00f2ff" opacity="0.8" />

        {/* === WHEELS (6 total, 3 per side shown from side) === */}
        {/* Using layered circles for 3D wheel look */}
        {/* Left side - front wheel */}
        <circle cx="20" cy="118" r="18" fill="#555" />
        <circle cx="20" cy="118" r="18" fill="none" stroke="#888" strokeWidth="4" />
        <circle cx="20" cy="118" r="12" fill="#6a6a6a" />
        <circle cx="20" cy="118" r="8" fill="#c87941" />
        <circle cx="20" cy="118" r="4" fill="#a05a2a" />
        {/* Treads */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => (
          <line
            key={angle}
            x1={20 + 14 * Math.cos(angle * Math.PI / 180)}
            y1={118 + 14 * Math.sin(angle * Math.PI / 180)}
            x2={20 + 18 * Math.cos(angle * Math.PI / 180)}
            y2={118 + 18 * Math.sin(angle * Math.PI / 180)}
            stroke="#333" strokeWidth="2"
          />
        ))}

        {/* Left side - middle wheel */}
        <circle cx="80" cy="120" r="18" fill="#555" />
        <circle cx="80" cy="120" r="18" fill="none" stroke="#888" strokeWidth="4" />
        <circle cx="80" cy="120" r="12" fill="#6a6a6a" />
        <circle cx="80" cy="120" r="8" fill="#c87941" />
        <circle cx="80" cy="120" r="4" fill="#a05a2a" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => (
          <line
            key={angle}
            x1={80 + 14 * Math.cos(angle * Math.PI / 180)}
            y1={120 + 14 * Math.sin(angle * Math.PI / 180)}
            x2={80 + 18 * Math.cos(angle * Math.PI / 180)}
            y2={120 + 18 * Math.sin(angle * Math.PI / 180)}
            stroke="#333" strokeWidth="2"
          />
        ))}

        {/* Left side - rear wheel */}
        <circle cx="160" cy="118" r="18" fill="#555" />
        <circle cx="160" cy="118" r="18" fill="none" stroke="#888" strokeWidth="4" />
        <circle cx="160" cy="118" r="12" fill="#6a6a6a" />
        <circle cx="160" cy="118" r="8" fill="#c87941" />
        <circle cx="160" cy="118" r="4" fill="#a05a2a" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => (
          <line
            key={angle}
            x1={160 + 14 * Math.cos(angle * Math.PI / 180)}
            y1={118 + 14 * Math.sin(angle * Math.PI / 180)}
            x2={160 + 18 * Math.cos(angle * Math.PI / 180)}
            y2={118 + 18 * Math.sin(angle * Math.PI / 180)}
            stroke="#333" strokeWidth="2"
          />
        ))}

        {/* Right side wheels (slightly behind, smaller for perspective) */}
        <circle cx="180" cy="118" r="15" fill="#484848" />
        <circle cx="180" cy="118" r="15" fill="none" stroke="#777" strokeWidth="3" />
        <circle cx="180" cy="118" r="8" fill="#5e5e5e" />
        <circle cx="180" cy="118" r="5" fill="#b06930" />

        <circle cx="260" cy="120" r="15" fill="#484848" />
        <circle cx="260" cy="120" r="15" fill="none" stroke="#777" strokeWidth="3" />
        <circle cx="260" cy="120" r="8" fill="#5e5e5e" />
        <circle cx="260" cy="120" r="5" fill="#b06930" />

        <circle cx="320" cy="118" r="15" fill="#484848" />
        <circle cx="320" cy="118" r="15" fill="none" stroke="#777" strokeWidth="3" />
        <circle cx="320" cy="118" r="8" fill="#5e5e5e" />
        <circle cx="320" cy="118" r="5" fill="#b06930" />

        {/* Ground line */}
        <line x1="0" y1="136" x2="340" y2="136" stroke="#ff4d00" strokeWidth="1" opacity="0.4" strokeDasharray="6,4" />

        {/* Dust particles when driving */}
        {isDriving && (
          <>
            <circle cx="10" cy="132" r="2" fill="#c87941" opacity="0.6" className="animate-ping" />
            <circle cx="30" cy="130" r="1.5" fill="#c87941" opacity="0.4" />
          </>
        )}
      </svg>

      {/* Phase label */}
      <div className="text-center mt-1">
        <span className="text-xs font-display tracking-widest text-secondary opacity-80">
          {phase === "ROVER" ? "ROVER ROLLOUT" : phase === "DEPLOY" ? "MOBILITY DEPLOY" : "SURFACE OPS"}
        </span>
      </div>
    </div>
  );
}
