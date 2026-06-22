import { clsx } from "clsx";

interface Rover3DProps {
  visible: boolean;
  phase: string;
}

/* A single rocker-bogie wheel: machined-metal rim, grouser tread fins,
   bolt-circle hubcap. The spinning parts live in their own <g> so they
   rotate about their own centre; the light sheen stays fixed on top. */
function Wheel({ cx, cy, r, far, spin }: { cx: number; cy: number; r: number; far?: boolean; spin?: boolean }) {
  const fins = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    fins.push(
      <line
        key={i}
        x1={cx + (r - 4) * Math.cos(a)}
        y1={cy + (r - 4) * Math.sin(a)}
        x2={cx + r * Math.cos(a)}
        y2={cy + r * Math.sin(a)}
        stroke="#2c2f33"
        strokeWidth={far ? 1.5 : 2.5}
        strokeLinecap="round"
      />
    );
  }
  const bolts = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    bolts.push(
      <circle key={k} cx={cx + r * 0.42 * Math.cos(a)} cy={cy + r * 0.42 * Math.sin(a)} r={far ? 1.3 : 2} fill="#4a4f56" />
    );
  }
  return (
    <>
      <g className={clsx("rover-wheel", spin && "spin")}>
        <circle cx={cx} cy={cy} r={r} fill={far ? "url(#wheelFar)" : "url(#wheelNear)"} stroke="#3a3e44" strokeWidth="2" />
        {fins}
        <circle cx={cx} cy={cy} r={r * 0.62} fill="url(#hub)" stroke="#5c626b" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#9aa0a8" strokeWidth="1" />
        {bolts}
        <circle cx={cx} cy={cy} r={r * 0.16} fill="#5c626b" />
      </g>
      {/* fixed light sheen (outside the spinning group) */}
      <circle cx={cx - r * 0.32} cy={cy - r * 0.34} r={r * 0.2} fill="#ffffff" opacity={far ? 0.12 : 0.28} />
    </>
  );
}

export function Rover3D({ visible, phase }: Rover3DProps) {
  const isDeploying = phase === "ROVER";   // rolling out of the lander
  const isDriving = phase === "DEPLOY";    // mobility deploy / driving
  const wheelsTurning = isDeploying || isDriving;

  return (
    <div
      className={clsx(
        "absolute bottom-16 left-1/2 transition-all ease-out pointer-events-none",
        visible ? "opacity-100 translate-x-[-50%] translate-y-0" : "opacity-0 translate-x-[80%] translate-y-6"
      )}
      style={{ transitionDuration: "2200ms", filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.45))" }}
    >
      <svg
        viewBox="0 0 360 180"
        width="300"
        height="150"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(isDriving && "animate-rover-drive")}
      >
        <defs>
          <linearGradient id="goldBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3cd63" />
            <stop offset="0.45" stopColor="#cda12f" />
            <stop offset="1" stopColor="#8a6a1a" />
          </linearGradient>
          <linearGradient id="goldFoil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e8c25a" />
            <stop offset="0.5" stopColor="#b8902a" />
            <stop offset="1" stopColor="#dcb44e" />
          </linearGradient>
          <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34499c" />
            <stop offset="1" stopColor="#0f1840" />
          </linearGradient>
          <radialGradient id="wheelNear" cx="0.38" cy="0.32" r="0.78">
            <stop offset="0" stopColor="#f4f6f9" />
            <stop offset="0.4" stopColor="#bdc3cb" />
            <stop offset="1" stopColor="#585e67" />
          </radialGradient>
          <radialGradient id="wheelFar" cx="0.38" cy="0.32" r="0.78">
            <stop offset="0" stopColor="#c6cad0" />
            <stop offset="0.5" stopColor="#868c94" />
            <stop offset="1" stopColor="#3a3f45" />
          </radialGradient>
          <radialGradient id="hub" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#eaedf1" />
            <stop offset="1" stopColor="#787e86" />
          </radialGradient>
          <radialGradient id="emblem" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd27a" />
            <stop offset="0.6" stopColor="#c46a2a" />
            <stop offset="1" stopColor="#7a3a18" />
          </radialGradient>
        </defs>

        {/* Lander deploy ramp the rover rolls out from (right side, fades after rollout) */}
        <g className={clsx("rover-ramp", isDeploying ? "show" : "")}>
          <polygon points="250,148 360,118 360,150 250,150" fill="#00f2ff" opacity="0.12" />
          <line x1="250" y1="148" x2="360" y2="118" stroke="#00f2ff" strokeWidth="2" opacity="0.45" />
        </g>

        {/* ground contact shadow */}
        <ellipse cx="170" cy="152" rx="150" ry="9" fill="#000000" opacity="0.28" />

        {/* === Far (right-side) wheels — smaller, recede behind body === */}
        <Wheel cx={96} cy={128} r={18} far spin={wheelsTurning} />
        <Wheel cx={190} cy={128} r={18} far spin={wheelsTurning} />
        <Wheel cx={284} cy={128} r={18} far spin={wheelsTurning} />

        {/* === Rocker-bogie suspension (silver articulated arms) === */}
        <g stroke="#cfd4da" strokeLinecap="round" fill="none">
          <line x1="170" y1="100" x2="170" y2="106" strokeWidth="6" />
          <line x1="152" y1="100" x2="66" y2="130" strokeWidth="6" />
          <line x1="152" y1="100" x2="208" y2="108" strokeWidth="6" />
          <line x1="208" y1="108" x2="162" y2="130" strokeWidth="5" />
          <line x1="208" y1="108" x2="258" y2="130" strokeWidth="5" />
        </g>
        <circle cx="170" cy="100" r="6" fill="#aeb4bc" stroke="#7d838b" strokeWidth="1.5" />
        <circle cx="208" cy="108" r="4.5" fill="#aeb4bc" stroke="#7d838b" strokeWidth="1.5" />

        {/* === Main gold / brass body box (HADES warm-electronics chassis) === */}
        <rect x="78" y="56" width="184" height="46" rx="4" fill="url(#goldBody)" stroke="#6e540f" strokeWidth="1.5" />
        {/* foil seams */}
        <rect x="78" y="56" width="184" height="11" rx="4" fill="#ffffff" opacity="0.16" />
        <line x1="120" y1="56" x2="120" y2="102" stroke="#9a7a1e" strokeWidth="1" opacity="0.5" />
        <line x1="206" y1="56" x2="206" y2="102" stroke="#9a7a1e" strokeWidth="1" opacity="0.5" />
        {/* warm electronics box (left end) */}
        <rect x="80" y="70" width="22" height="22" rx="2" fill="url(#goldFoil)" stroke="#6e540f" strokeWidth="1" />
        {/* mission emblem */}
        <circle cx="150" cy="80" r="12" fill="url(#emblem)" stroke="#f0d28a" strokeWidth="1.5" />
        <circle cx="150" cy="80" r="5" fill="#3a1d0e" opacity="0.7" />

        {/* === Flat solar panel on top === */}
        <g transform="rotate(-4 170 47)">
          <rect x="62" y="40" width="216" height="16" rx="2" fill="url(#solar)" stroke="#d9b24c" strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <line key={i} x1={62 + i * 19.6} y1="40" x2={62 + i * 19.6} y2="56" stroke="#1c2a66" strokeWidth="1" opacity="0.8" />
          ))}
          <line x1="62" y1="48" x2="278" y2="48" stroke="#1c2a66" strokeWidth="1" opacity="0.8" />
          <rect x="62" y="40" width="216" height="5" rx="2" fill="#ffffff" opacity="0.1" />
        </g>

        {/* === Near (left-side) wheels — larger, in front === */}
        <Wheel cx={66} cy={132} r={24} spin={wheelsTurning} />
        <Wheel cx={162} cy={132} r={24} spin={wheelsTurning} />
        <Wheel cx={258} cy={132} r={24} spin={wheelsTurning} />

        {/* Dust kicked up behind the wheels while moving */}
        {wheelsTurning && (
          <>
            <circle cx="296" cy="146" r="3" fill="#d99a5a" opacity="0.55" className="animate-ping" />
            <circle cx="312" cy="142" r="2" fill="#c87941" opacity="0.4" className="animate-ping" />
            <circle cx="284" cy="148" r="2.2" fill="#e0a868" opacity="0.5" />
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
