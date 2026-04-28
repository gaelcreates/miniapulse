import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E0F11",
          900: "#15161A",
          800: "#1A1C20",
          700: "#22242A",
          600: "#2C2F36",
          500: "#383B43",
        },
        accent: {
          cyan: "#34E0FF",
          danger: "#FF3B30",
          success: "#22C55E",
          yellow: "#E8FF3A",
          orange: "#FF7A1A",
          warm: "#FFB74D",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.85)" },
        },
        ringPulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(52,224,255,0.55)" },
          "100%": { boxShadow: "0 0 0 14px rgba(52,224,255,0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatySlow: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        risein: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        progress: {
          "0%": { width: "0%" },
          "60%": { width: "92%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-rev": "marqueeReverse 42s linear infinite",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        "ring-pulse": "ringPulse 1.8s ease-out infinite",
        floaty: "floaty 5s ease-in-out infinite",
        "floaty-slow": "floatySlow 7s ease-in-out infinite",
        "spin-slow": "spinSlow 22s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
        risein: "risein 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        scan: "scan 2.4s linear infinite",
        progress: "progress 2.6s cubic-bezier(0.2, 0.7, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
