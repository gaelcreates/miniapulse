type Expression = "intense" | "shock" | "smirk" | "calm" | "challenge";
type Lighting = "neutral" | "warm" | "cool" | "red" | "yellow";

const SKIN: Record<Lighting, string> = {
  neutral: "#E8C8A4",
  warm: "#F2C58A",
  cool: "#D8C2B0",
  red: "#E8A698",
  yellow: "#F4D7A0",
};

const SHADOW: Record<Lighting, string> = {
  neutral: "#A37755",
  warm: "#8C5A2B",
  cool: "#7A6353",
  red: "#7A2A22",
  yellow: "#9A6E1F",
};

export function PersonaBust({
  expression = "intense",
  lighting = "neutral",
  shirt = "#0F0F11",
  className,
}: {
  expression?: Expression;
  lighting?: Lighting;
  shirt?: string;
  className?: string;
}) {
  const skin = SKIN[lighting];
  const shadow = SHADOW[lighting];

  // mouth + eyebrow variants per expression
  const mouth =
    expression === "shock" ? (
      <ellipse cx="100" cy="116" rx="10" ry="13" fill="#1a0a08" />
    ) : expression === "smirk" ? (
      <path
        d="M82 114 Q100 122 118 110"
        stroke="#1a0a08"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    ) : expression === "challenge" ? (
      <path
        d="M82 116 L118 116"
        stroke="#1a0a08"
        strokeWidth="4"
        strokeLinecap="round"
      />
    ) : expression === "calm" ? (
      <path
        d="M86 114 Q100 118 114 114"
        stroke="#1a0a08"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      // intense
      <path
        d="M84 116 Q100 110 116 116"
        stroke="#1a0a08"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    );

  const browL =
    expression === "shock" ? (
      <path
        d="M68 70 Q78 64 90 70"
        stroke="#0a0a0a"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      <path
        d="M68 78 L90 70"
        stroke="#0a0a0a"
        strokeWidth="5"
        strokeLinecap="round"
      />
    );
  const browR =
    expression === "shock" ? (
      <path
        d="M110 70 Q122 64 132 70"
        stroke="#0a0a0a"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      <path
        d="M110 70 L132 78"
        stroke="#0a0a0a"
        strokeWidth="5"
        strokeLinecap="round"
      />
    );

  return (
    <svg
      viewBox="0 0 200 220"
      preserveAspectRatio="xMidYMax meet"
      className={className}
    >
      {/* shoulders / shirt */}
      <path
        d="M-5 220 Q-5 158 38 138 Q70 124 100 124 Q130 124 162 138 Q205 158 205 220 Z"
        fill={shirt}
      />
      <path
        d="M-5 220 Q-5 158 38 138 Q70 124 100 124 Q130 124 162 138 Q205 158 205 220 Z"
        fill="url(#shirtShade)"
        opacity="0.4"
      />

      {/* neck */}
      <path d="M84 132 Q100 142 116 132 L118 122 L82 122 Z" fill={shadow} />

      {/* face shape */}
      <path
        d="M58 78 Q58 118 76 132 Q100 146 124 132 Q142 118 142 78 Q142 38 100 38 Q58 38 58 78 Z"
        fill={skin}
      />
      {/* face shadow side */}
      <path
        d="M100 38 Q142 38 142 78 Q142 118 124 132 Q112 138 100 138 Z"
        fill={shadow}
        opacity="0.18"
      />

      {/* hair (brun, court, structuré) */}
      <path
        d="M52 70 Q50 38 88 30 Q132 26 148 50 Q150 64 144 70 Q138 50 100 48 Q66 50 56 72 Z"
        fill="#171717"
      />
      <path
        d="M62 56 Q86 46 132 50 L132 56 Q104 50 70 60 Z"
        fill="#000"
        opacity="0.6"
      />

      {/* eyebrows */}
      {browL}
      {browR}

      {/* eyes */}
      <circle cx="80" cy="86" r="3.4" fill="#0b0b0b" />
      <circle cx="120" cy="86" r="3.4" fill="#0b0b0b" />
      <circle cx="81" cy="85" r="0.9" fill="#fff" />
      <circle cx="121" cy="85" r="0.9" fill="#fff" />

      {/* nose */}
      <path
        d="M99 92 L96 108 Q100 112 104 108 L101 92"
        fill={shadow}
        opacity="0.45"
      />

      {/* mouth */}
      {mouth}

      {/* jaw shadow */}
      <path
        d="M76 132 Q100 142 124 132 Q120 138 100 140 Q80 138 76 132 Z"
        fill={shadow}
        opacity="0.35"
      />

      <defs>
        <linearGradient id="shirtShade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
