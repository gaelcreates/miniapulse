import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-line bg-ink-900 ${
        hover ? "transition-colors hover:border-line-strong hover:bg-ink-800" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line px-5 py-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-[0.22em] text-white/45">
          {title.toUpperCase()}
        </span>
        {hint && <span className="text-[12px] text-white/40">{hint}</span>}
      </div>
      {action}
    </div>
  );
}

export function KPI({
  label,
  value,
  delta,
  accent,
  spark,
}: {
  label: string;
  value: string;
  delta?: { value: string; positive?: boolean };
  accent?: boolean;
  spark?: number[];
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-ink-900 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.22em] text-white/45">
          {label.toUpperCase()}
        </span>
        {delta && (
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[10px] tracking-widest ${
              delta.positive
                ? "bg-accent-success/15 text-accent-success"
                : "bg-accent-danger/15 text-accent-danger"
            }`}
          >
            {delta.positive ? "▲" : "▼"} {delta.value}
          </span>
        )}
      </div>
      <div
        className={`mt-3 font-display text-[40px] leading-none tracking-tight ${
          accent ? "text-accent-cyan" : "text-white"
        }`}
      >
        {value}
      </div>
      {spark && <Sparkline points={spark} accent={accent} className="mt-4 w-full" />}
    </div>
  );
}

export function Sparkline({
  points,
  accent,
  className,
}: {
  points: number[];
  accent?: boolean;
  className?: string;
}) {
  const w = 200;
  const h = 36;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const last = points[points.length - 1];
  const lastY = h - ((last - min) / range) * (h - 4) - 2;
  const color = accent ? "#34E0FF" : "#FFFFFF";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${accent ? "c" : "w"}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w} ${h} L0 ${h} Z`} fill={`url(#sg-${accent ? "c" : "w"})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={w} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "cyan" | "danger" | "success" | "yellow";
}) {
  const map = {
    neutral: "border-line bg-white/[0.02] text-white/65",
    cyan: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
    danger: "border-accent-danger/40 bg-accent-danger/10 text-accent-danger",
    success: "border-accent-success/40 bg-accent-success/10 text-accent-success",
    yellow: "border-accent-yellow/40 bg-accent-yellow/10 text-accent-yellow",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function Pill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 ${className}`}
    >
      {children}
    </span>
  );
}
