"use client";

import { useState } from "react";
import { STYLE_META, type StyleId } from "@/app/_components/thumbs";

type Range = "7" | "30" | "90" | "180";

const RANGES: Record<Range, number[]> = {
  "7": [12, 14, 11, 16, 18, 15, 19],
  "30": Array.from({ length: 30 }, (_, i) => 6 + Math.round(Math.sin(i / 4) * 4) + i / 2),
  "90": Array.from({ length: 60 }, (_, i) => 4 + Math.round(Math.sin(i / 6) * 4 + Math.cos(i / 3) * 3) + i / 4),
  "180": Array.from({ length: 90 }, (_, i) => 5 + Math.round(Math.sin(i / 8) * 5 + Math.cos(i / 4) * 4) + i / 6),
};

const TOP_STYLES: Array<{ id: StyleId; ctr: string }> = [
  { id: "wakeup", ctr: "+52%" },
  { id: "truth", ctr: "+44%" },
  { id: "yellow", ctr: "+38%" },
  { id: "red", ctr: "+31%" },
  { id: "cyan", ctr: "+29%" },
  { id: "soft", ctr: "+22%" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("90");
  const data = RANGES[range];
  const total = data.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* hero */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">
            ANALYTICS
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Comprends ce qui marche. Mesuré sur tes 6 derniers mois — données YouTube Studio synchronisées.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/[0.05]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2v9M4 8l4 4 4-4M3 14h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="MINIATURES GÉNÉRÉES"
          value="897"
          accent
          delta={{ text: "+18%", note: "vs période préc.", positive: true }}
          spark={[400, 450, 500, 540, 580, 620, 660, 700, 740, 780, 830, 897]}
        />
        <Kpi
          label="CTR MOYEN MESURÉ"
          value="11.4%"
          delta={{ text: "+2.1pts", note: "baseline 8.3%", positive: true }}
          spark={[8.5, 8.8, 9.1, 9.3, 9.6, 9.9, 10.2, 10.5, 10.8, 11.0, 11.2, 11.4]}
        />
        <Kpi
          label="VUES ADDITIONNELLES"
          value="2.4M"
          delta={{ text: "+412K", note: "estimé via CTR delta", positive: true }}
          spark={[1.0, 1.2, 1.3, 1.4, 1.6, 1.7, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4]}
        />
        <Kpi
          label="TEMPS ÉCONOMISÉ"
          value="68h"
          note="vs création manuelle"
          spark={[30, 35, 40, 44, 48, 52, 55, 58, 62, 64, 66, 68]}
        />
      </div>

      {/* chart + top styles */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-line bg-ink-900 p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-semibold tracking-tight">
                Miniatures générées
              </h2>
              <div className="mt-1 text-[12.5px] text-white/45">
                {total} sur les {range} derniers jours
              </div>
            </div>
            <div className="flex items-center rounded-md border border-line bg-white/[0.02] p-0.5">
              {(["7", "30", "90", "180"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    r === range
                      ? "bg-white/[0.08] text-white"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {r}j
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <AreaChart data={data} />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-ink-900 p-5">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight">Top styles</h2>
            <div className="mt-1 text-[12.5px] text-white/45">par CTR</div>
          </div>
          <ul className="mt-5 divide-y divide-line">
            {TOP_STYLES.map((s, i) => {
              const meta = STYLE_META[s.id];
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-white/40">
                      0{i + 1}
                    </span>
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ background: meta.swatch }}
                    />
                    <span className="text-[14px] text-white/95">{meta.name}</span>
                  </div>
                  <span className="font-mono text-[13px] font-medium text-accent-success">
                    {s.ctr}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* niche breakdown + recos */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-line bg-ink-900 p-5">
          <h2 className="text-[18px] font-semibold tracking-tight">Répartition par niche</h2>
          <div className="mt-1 text-[12.5px] text-white/45">part des miniatures</div>
          <div className="mt-5">
            <Donut />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-ink-900 xl:col-span-2">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[18px] font-semibold tracking-tight">Recommandations IA</h2>
            <div className="mt-1 text-[12.5px] text-white/45">
              contextuelles · niche-aware
            </div>
          </div>
          <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            <Reco
              tone="cyan"
              badge="OPPORTUNITÉ"
              title="Persona Sarah sous-utilisée"
              text="Elle apparaît dans 1 miniature sur 12. Audience féminine peu adressée — test 2 vidéos cette semaine."
              cta="Lancer un test"
            />
            <Reco
              tone="yellow"
              badge="MOMENTUM"
              title="Wake Up Call cartonne"
              text="+52% vs baseline. Programme 2 miniatures dans cette direction."
              cta="Dupliquer le style"
            />
            <Reco
              tone="danger"
              badge="ALERTE"
              title="Truth Bomb sur-représentée"
              text="6 sur 12 miniatures. Risque de fatigue — alterne avec Bold Yellow."
              cta="Voir le plan"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- KPI ---------------- */

function Kpi({
  label,
  value,
  accent,
  delta,
  note,
  spark,
}: {
  label: string;
  value: string;
  accent?: boolean;
  delta?: { text: string; note: string; positive?: boolean };
  note?: string;
  spark: number[];
}) {
  return (
    <div className="rounded-xl border border-line bg-ink-900 p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">{label}</div>
      <div
        className={`mt-3 font-display text-[44px] leading-none tracking-tight ${
          accent ? "text-accent-cyan" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {delta ? (
            <div className="flex items-baseline gap-2">
              <span
                className={`font-mono text-[11px] ${
                  delta.positive ? "text-accent-success" : "text-accent-danger"
                }`}
              >
                {delta.positive ? "↑" : "↓"} {delta.text}
              </span>
              <span className="truncate text-[11px] text-white/45">{delta.note}</span>
            </div>
          ) : (
            <div className="text-[11px] text-white/45">{note}</div>
          )}
        </div>
        <Sparkline data={spark} accent={accent} />
      </div>
    </div>
  );
}

function Sparkline({ data, accent }: { data: number[]; accent?: boolean }) {
  const w = 80;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const path = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const color = accent ? "#34E0FF" : "rgba(255,255,255,0.45)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-20 shrink-0" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Area chart ---------------- */

function AreaChart({ data }: { data: number[] }) {
  const w = 800;
  const h = 280;
  const pad = { top: 10, right: 10, bottom: 24, left: 0 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.1;
  const step = innerW / (data.length - 1);

  const linePath = data
    .map((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top + innerH - (v / max) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${pad.left + (data.length - 1) * step} ${pad.top + innerH} L${pad.left} ${pad.top + innerH} Z`;

  const ticks = 5;
  const yTicks = Array.from({ length: ticks }, (_, i) => i / (ticks - 1));

  // x labels
  const xLabels = (() => {
    if (data.length <= 7) return ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
    if (data.length <= 30) return ["1", "5", "10", "15", "20", "25", "30"];
    if (data.length <= 60) return ["J-90", "J-75", "J-60", "J-45", "J-30", "J-15", "J0"];
    return ["J-180", "J-150", "J-120", "J-90", "J-60", "J-30", "J0"];
  })();

  const last = data[data.length - 1];
  const lastX = pad.left + (data.length - 1) * step;
  const lastY = pad.top + innerH - (last / max) * innerH;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34E0FF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#34E0FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal dotted grid */}
      {yTicks.map((t, i) => {
        const y = pad.top + innerH - t * innerH;
        return (
          <line
            key={i}
            x1={pad.left}
            x2={w - pad.right}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        );
      })}

      {/* area */}
      <path d={areaPath} fill="url(#areaFill)" />
      <path d={linePath} fill="none" stroke="#34E0FF" strokeWidth="2" strokeLinejoin="round" />

      {/* end point */}
      <circle cx={lastX} cy={lastY} r="6" fill="#34E0FF" opacity="0.2" />
      <circle cx={lastX} cy={lastY} r="3.2" fill="#34E0FF" />

      {/* x labels */}
      {xLabels.map((lbl, i) => {
        const x = pad.left + (innerW / (xLabels.length - 1)) * i;
        return (
          <text
            key={i}
            x={x}
            y={h - 6}
            textAnchor="middle"
            className="fill-white/35"
            style={{ font: "10px var(--font-mono), monospace", letterSpacing: "0.16em" }}
          >
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------------- Donut ---------------- */

function Donut() {
  const data = [
    { name: "Mindset", pct: 30, color: "#FF3B30" },
    { name: "SaaS", pct: 22, color: "#34E0FF" },
    { name: "Coaching", pct: 18, color: "#E8FF3A" },
    { name: "Ventes", pct: 14, color: "#FF1A1A" },
    { name: "Stratégie", pct: 10, color: "#FF7A1A" },
    { name: "Productivité", pct: 6, color: "#FFB74D" },
  ];

  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="h-44 w-44 -rotate-90">
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="22" />
          {data.map((d) => {
            const len = (d.pct / 100) * c;
            const dasharray = `${len} ${c - len}`;
            const seg = (
              <circle
                key={d.name}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth="22"
                strokeDasharray={dasharray}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[32px] leading-none">897</span>
          <span className="font-mono text-[10px] tracking-widest text-white/45">
            MINIATURES
          </span>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5">
        {data.map((d) => (
          <li
            key={d.name}
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/65"
          >
            <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
            <span className="flex-1 truncate">{d.name.toUpperCase()}</span>
            <span className="text-white/45">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Reco ---------------- */

function Reco({
  tone,
  badge,
  title,
  text,
  cta,
}: {
  tone: "cyan" | "yellow" | "danger";
  badge: string;
  title: string;
  text: string;
  cta: string;
}) {
  const map = {
    cyan: "text-accent-cyan",
    yellow: "text-accent-yellow",
    danger: "text-accent-danger",
  } as const;
  return (
    <div className="bg-ink-900 p-5">
      <div className={`font-mono text-[10px] tracking-[0.22em] ${map[tone]}`}>{badge}</div>
      <h3 className="mt-3 text-[16px] font-semibold leading-tight tracking-tight">{title}</h3>
      <p className="mt-2 text-[12.5px] text-white/55">{text}</p>
      <button className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-white/85 hover:text-white">
        {cta} →
      </button>
    </div>
  );
}
