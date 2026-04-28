import { PersonaBust } from "./persona";

export type StyleId =
  | "yellow"
  | "cyan"
  | "truth"
  | "soft"
  | "red"
  | "wakeup";

export const STYLE_META: Record<
  StyleId,
  {
    name: string;
    niche: string;
    ctr: string;
    swatch: string;
    desc: string;
  }
> = {
  yellow: {
    name: "Bold Yellow",
    niche: "Coaching",
    ctr: "+62%",
    swatch: "#E8FF3A",
    desc: "Jaune néon incliné, cercle rouge, flèche manuscrite.",
  },
  cyan: {
    name: "Tech Cyan",
    niche: "SaaS",
    ctr: "+48%",
    swatch: "#34E0FF",
    desc: "Dashboard flou, MRR cyan, sticker tampon « EN SOLO ».",
  },
  truth: {
    name: "Truth Bomb",
    niche: "Mindset",
    ctr: "+71%",
    swatch: "#FF3B30",
    desc: "Mot barré rouge + un mot outline géant. Vérité crue.",
  },
  soft: {
    name: "Soft Productivity",
    niche: "Productivité",
    ctr: "+39%",
    swatch: "#FFB74D",
    desc: "Lumière chaude, chiffre écrasant, sticker « 100% RÉEL ».",
  },
  red: {
    name: "Red Conviction",
    niche: "Ventes",
    ctr: "+57%",
    swatch: "#FF1A1A",
    desc: "Fond rouge profond, gros pourcentage, mot incliné jaune.",
  },
  wakeup: {
    name: "Wake Up Call",
    niche: "Stratégie",
    ctr: "+44%",
    swatch: "#FF7A1A",
    desc: "Sablier, compte à rebours, mot rouge frappant.",
  },
};

function Sticker({
  children,
  rotation = -8,
  className = "",
}: {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center font-display tracking-wider px-2 py-1 border-[3px] border-black bg-white text-black text-[10px] sm:text-xs ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        boxShadow: "3px 3px 0 #000",
      }}
    >
      {children}
    </div>
  );
}

function ManuscriptArrow({
  className,
  color = "#FF1A1A",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none">
      <path
        d="M8 18 C 30 8, 60 22, 78 50 C 90 68, 92 78, 90 86"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M78 78 L92 88 L78 92"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function HookLabel({ hook }: { hook?: string }) {
  if (!hook) return null;
  return (
    <div className="pointer-events-none absolute left-2.5 top-2.5 z-30 max-w-[60%]">
      <div
        className="font-display text-[11px] sm:text-[13px] leading-tight tracking-[0.05em] text-white"
        style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.85)" }}
      >
        {hook}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- */
/* 6 styles                                                        */
/* -------------------------------------------------------------- */

export function ThumbYellow() {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a0a0a] ring-1 ring-white/5">
      {/* gritty bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,#1f1f1f_0%,#0a0a0a_60%)]" />
      <div className="absolute inset-0 opacity-40 mix-blend-overlay [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_3px)]" />

      {/* persona right */}
      <div className="absolute -right-3 bottom-0 h-[96%] w-[46%]">
        <PersonaBust
          expression="intense"
          lighting="warm"
          shirt="#1B1B1F"
          className="h-full w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* big yellow text */}
      <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
        <div
          className="font-display leading-[0.78] -rotate-[4deg] text-[#E8FF3A] text-[58px] sm:text-[84px]"
          style={{ textShadow: "5px 5px 0 #000" }}
        >
          50K€
        </div>
        <div
          className="font-display text-white text-[16px] sm:text-[22px] mt-1 -rotate-[2deg] tracking-wide"
          style={{ textShadow: "3px 3px 0 #000" }}
        >
          EN 90 JOURS
        </div>
      </div>

      {/* red circle around K€ */}
      <div className="absolute left-[38%] top-[24%] w-16 h-16 sm:w-20 sm:h-20 border-[4px] border-[#FF1A1A] rounded-full rotate-[18deg]" />

      {/* arrow */}
      <ManuscriptArrow className="absolute right-[42%] top-[8%] w-20 h-16" />

    </div>
  );
}

export function ThumbCyan() {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#070b10] ring-1 ring-white/5">
      {/* dashboard blurred bg */}
      <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_30%,#0d2030_0%,#050709_70%)]" />
      <div className="absolute inset-0 opacity-50 blur-[6px]">
        <div className="absolute left-4 top-4 right-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 rounded-md bg-white/5 border border-white/10"
            />
          ))}
        </div>
        <div className="absolute left-4 right-4 bottom-4 h-16 rounded-md bg-white/5 border border-white/10 overflow-hidden">
          <svg viewBox="0 0 200 60" className="w-full h-full">
            <polyline
              points="0,50 30,40 60,42 90,28 120,30 150,18 180,12 200,8"
              fill="none"
              stroke="#34E0FF"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* persona */}
      <div className="absolute -right-2 bottom-0 h-[94%] w-[44%]">
        <PersonaBust
          expression="smirk"
          lighting="cool"
          shirt="#0E1A22"
          className="h-full w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* big cyan text */}
      <div className="absolute left-4 top-[18%]">
        <div
          className="font-display leading-[0.82] text-[#34E0FF] text-[64px] sm:text-[88px]"
          style={{
            textShadow: "0 0 20px rgba(52,224,255,0.45), 4px 4px 0 #000",
          }}
        >
          10K
        </div>
        <div
          className="font-display text-white text-[20px] sm:text-[28px] -mt-1 tracking-widest"
          style={{ textShadow: "3px 3px 0 #000" }}
        >
          MRR
        </div>
      </div>

      {/* tampon EN SOLO */}
      <div className="absolute left-[6%] bottom-[10%]">
        <div
          className="font-display tracking-[0.15em] px-3 py-1 border-[3px] border-[#34E0FF] text-[#34E0FF] text-[12px] sm:text-[14px]"
          style={{
            transform: "rotate(-12deg)",
            textShadow: "0 0 8px rgba(52,224,255,0.5)",
            boxShadow: "inset 0 0 0 1px rgba(52,224,255,0.2)",
          }}
        >
          EN SOLO
        </div>
      </div>

    </div>
  );
}

export function ThumbTruth() {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/5">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_70%_50%,#1a1a1a_0%,#000_70%)]" />

      {/* persona left */}
      <div className="absolute -left-3 bottom-0 h-[94%] w-[42%]">
        <PersonaBust
          expression="challenge"
          lighting="neutral"
          shirt="#0a0a0a"
          className="h-full w-full"
        />
      </div>

      {/* PERSONNE barré */}
      <div className="absolute left-[36%] top-[14%] right-3">
        <div className="relative inline-block">
          <div className="font-display text-white text-[28px] sm:text-[40px] tracking-tight leading-none">
            PERSONNE
          </div>
          <div className="absolute left-[-4px] right-[-4px] top-1/2 h-[5px] sm:h-[6px] bg-[#FF1A1A] -rotate-[6deg] rounded-sm" />
        </div>
        <div className="font-display text-white text-[14px] sm:text-[18px] tracking-widest mt-1 opacity-90">
          NE TE DIRA QUE
        </div>
      </div>

      {/* L'ARGENT outline géant */}
      <div className="absolute left-[34%] right-2 bottom-[6%]">
        <div className="font-display stroke-text-thick text-[64px] sm:text-[96px] leading-[0.8] tracking-tight">
          L&apos;ARGENT.
        </div>
      </div>

    </div>
  );
}

export function ThumbSoft() {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1a1208] ring-1 ring-white/5">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_30%_40%,#3a2a14_0%,#0d0905_75%)]" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_30%_40%,rgba(255,200,80,0.18)_0%,transparent_60%)]" />

      <div className="absolute -right-2 bottom-0 h-[96%] w-[44%]">
        <PersonaBust
          expression="calm"
          lighting="warm"
          shirt="#221710"
          className="h-full w-full"
        />
      </div>

      {/* Big 4H */}
      <div className="absolute left-3 top-[16%]">
        <div
          className="font-display leading-[0.78] text-[#FFD23A] text-[88px] sm:text-[124px]"
          style={{ textShadow: "5px 5px 0 #000, 0 0 30px rgba(255,180,40,0.4)" }}
        >
          4H
        </div>
        <div
          className="font-display text-white text-[14px] sm:text-[18px] tracking-[0.2em] -mt-1"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          PAR JOUR. POINT.
        </div>
      </div>

      {/* sticker 100% RÉEL */}
      <div className="absolute left-[44%] bottom-[12%]">
        <Sticker rotation={-10}>100% RÉEL</Sticker>
      </div>

    </div>
  );
}

export function ThumbRed() {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#3a0606] ring-1 ring-white/5">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_30%_50%,#5a0a0a_0%,#1a0303_70%)]" />
      <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:repeating-linear-gradient(45deg,rgba(0,0,0,0.4)_0,rgba(0,0,0,0.4)_1px,transparent_1px,transparent_4px)]" />

      <div className="absolute -right-2 bottom-0 h-[96%] w-[42%]">
        <PersonaBust
          expression="challenge"
          lighting="red"
          shirt="#1a0303"
          className="h-full w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
        />
      </div>

      <div className="absolute left-3 top-[12%]">
        <div
          className="font-display leading-[0.78] text-white text-[88px] sm:text-[128px]"
          style={{ textShadow: "5px 5px 0 #000" }}
        >
          80<span className="text-[60px] sm:text-[80px]">%</span>
        </div>
      </div>

      <div className="absolute left-3 bottom-[14%]">
        <div
          className="font-display text-[#E8FF3A] text-[28px] sm:text-[44px] -rotate-[6deg] leading-none tracking-tight"
          style={{ textShadow: "4px 4px 0 #000" }}
        >
          CLOSER.
        </div>
        <div className="font-display text-white text-[12px] sm:text-[14px] tracking-[0.2em] mt-1 opacity-90">
          OU CRÈVE.
        </div>
      </div>

      <ManuscriptArrow
        className="absolute right-[40%] top-[6%] w-24 h-20"
        color="#E8FF3A"
      />

    </div>
  );
}

export function ThumbWakeUp() {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a0608] ring-1 ring-white/5">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_60%,#2a0a0a_0%,#050203_70%)]" />

      <div className="absolute -left-3 bottom-0 h-[94%] w-[40%]">
        <PersonaBust
          expression="shock"
          lighting="red"
          shirt="#0a0608"
          className="h-full w-full"
        />
      </div>

      {/* PERDRE */}
      <div className="absolute left-[36%] top-[14%]">
        <div
          className="font-display leading-[0.8] text-[#FF1A1A] text-[60px] sm:text-[88px]"
          style={{ textShadow: "5px 5px 0 #000" }}
        >
          PERDRE
        </div>
        <div className="font-display text-white text-[16px] sm:text-[22px] tracking-[0.2em] mt-1 opacity-90">
          OU GAGNER ?
        </div>
      </div>

      {/* Sablier */}
      <div className="absolute right-3 top-3">
        <svg viewBox="0 0 40 56" className="w-10 h-14 sm:w-14 sm:h-20">
          <path
            d="M6 4 H34 V14 L22 28 L34 42 V52 H6 V42 L18 28 L6 14 Z"
            stroke="#E8FF3A"
            strokeWidth="2.5"
            fill="none"
          />
          <path d="M10 8 H30 L22 22 Z" fill="#FF1A1A" opacity="0.85" />
          <path d="M10 48 H30 L22 36 Z" fill="#FF1A1A" opacity="0.45" />
        </svg>
      </div>

      {/* Compte à rebours */}
      <div className="absolute right-3 bottom-3">
        <div
          className="font-mono text-[10px] sm:text-[12px] tracking-[0.2em] px-2 py-1 bg-[#FF1A1A] text-black border-[2px] border-black"
          style={{ boxShadow: "3px 3px 0 #000" }}
        >
          T-180D
        </div>
      </div>

    </div>
  );
}

export function Thumb({ id, hook }: { id: StyleId; hook?: string }) {
  const inner = (() => {
    switch (id) {
      case "yellow":
        return <ThumbYellow />;
      case "cyan":
        return <ThumbCyan />;
      case "truth":
        return <ThumbTruth />;
      case "soft":
        return <ThumbSoft />;
      case "red":
        return <ThumbRed />;
      case "wakeup":
        return <ThumbWakeUp />;
    }
  })();
  return (
    <div className="relative">
      {inner}
      <HookLabel hook={hook} />
    </div>
  );
}
