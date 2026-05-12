"use client";

import { useState } from "react";
import { showToast } from "@/app/_components/ui/toast";

type Range = "7" | "30" | "90";

/* ─── Mock data — données internes plateforme uniquement ─── */

const GEN_DATA: Record<Range, { validated: number[]; rejected: number[] }> = {
  "7": {
    validated: [3, 5, 2, 6, 4, 7, 5],
    rejected:  [1, 2, 1, 1, 2, 1, 2],
  },
  "30": {
    validated: Array.from({ length: 30 }, (_, i) => 2 + Math.round(Math.sin(i / 5) * 2 + i / 8)),
    rejected:  Array.from({ length: 30 }, (_, i) => Math.max(0, Math.round(Math.sin(i / 4) + 1))),
  },
  "90": {
    validated: Array.from({ length: 30 }, (_, i) => 3 + Math.round(Math.sin(i / 4) * 3 + i / 6)),
    rejected:  Array.from({ length: 30 }, (_, i) => Math.max(0, Math.round(Math.cos(i / 5) + 1))),
  },
};

const FORMAT_STATS = [
  { label: "Face cam",      validated: 38, rejected: 8,  color: "#34E0FF" },
  { label: "Vlog",          validated: 24, rejected: 5,  color: "#E8FF3A" },
  { label: "Cinématique",   validated: 18, rejected: 6,  color: "#FF2D2D" },
  { label: "Entertainment", validated: 12, rejected: 3,  color: "#FF7A1A" },
  { label: "Podcast",       validated: 9,  rejected: 2,  color: "#B066FF" },
];

const STYLE_STATS = [
  { label: "Infopreneur Impact", validated: 32, rejected: 5,  swatch: "#F5E632" },
  { label: "Mindset Vérité",     validated: 28, rejected: 9,  swatch: "#FFFFFF" },
  { label: "Coach Conviction",   validated: 22, rejected: 4,  swatch: "#660A0A" },
  { label: "Stratège Alerte",    validated: 18, rejected: 3,  swatch: "#FF2D2D" },
  { label: "SaaS Solo",          validated: 15, rejected: 2,  swatch: "#34E0FF" },
  { label: "Lifestyle Pro",      validated: 10, rejected: 1,  swatch: "#E8C547" },
];

const PERSONA_STATS = [
  { name: "Marc",   initials: "MC", color: "bg-accent-cyan",    validated: 58, rejected: 12 },
  { name: "Sarah",  initials: "SD", color: "bg-accent-yellow",  validated: 27, rejected: 5  },
  { name: "Léo",    initials: "LM", color: "bg-accent-orange",  validated: 14, rejected: 4  },
  { name: "Émilie", initials: "EM", color: "bg-accent-success", validated: 6,  rejected: 3  },
];

/* ═══ PAGE ═══ */

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30");
  const d = GEN_DATA[range];

  const totalValidated = d.validated.reduce((a, b) => a + b, 0);
  const totalRejected  = d.rejected.reduce((a, b) => a + b, 0);
  const totalGenerated = totalValidated + totalRejected;
  const validationRate = totalGenerated > 0 ? Math.round((totalValidated / totalGenerated) * 100) : 0;
  const timeSaved      = totalValidated * 3; // 3 min saved per validated thumbnail

  return (
    <div className="mx-auto max-w-[1400px]">

      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">ANALYTICS</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/55">
            Données internes plateforme — générations, validations, refus.
          </p>
        </div>
        <button
          onClick={() => { showToast("Export CSV en cours…", "info"); setTimeout(() => showToast("analytics_export.csv téléchargé !"), 1800); }}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path d="M8 2v9M4 8l4 4 4-4M3 14h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label="GÉNÉRÉES" value={String(totalGenerated)} accent="cyan"
          spark={d.validated.map((v, i) => v + d.rejected[i])}
          note={`sur ${range} derniers jours`} />
        <Kpi label="VALIDÉES" value={String(totalValidated)} accent="success"
          spark={d.validated}
          note="enregistrées dans la galerie" />
        <Kpi label="REFUSÉES" value={String(totalRejected)} accent="danger"
          spark={d.rejected}
          note="non enregistrées" />
        <Kpi label="TAUX DE VALIDATION" value={`${validationRate}%`} accent="none"
          spark={d.validated.map((v, i) => {
            const t = v + d.rejected[i];
            return t > 0 ? Math.round((v / t) * 100) : 0;
          })}
          note={`${timeSaved}min économisées`} />
      </div>

      {/* Chart */}
      <section className="mt-6 rounded-xl border border-line bg-ink-900 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight">Générations dans le temps</h2>
            <div className="mt-1 flex items-center gap-4 text-[12px] text-white/45">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-success" />Validées</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-danger" />Refusées</span>
            </div>
          </div>
          <div className="flex items-center rounded-lg border border-line bg-white/[0.02] p-0.5">
            {(["7","30","90"] as Range[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${r === range ? "bg-white/[0.08] text-white" : "text-white/45 hover:text-white"}`}>
                {r}j
              </button>
            ))}
          </div>
        </div>
        <StackedChart validated={d.validated} rejected={d.rejected} range={range} />
      </section>

      {/* Format + Style breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Par format */}
        <section className="rounded-xl border border-line bg-ink-900 p-5">
          <h2 className="text-[18px] font-semibold tracking-tight">Par format</h2>
          <div className="mt-1 text-[12px] text-white/40">validées vs refusées</div>
          <div className="mt-5 space-y-4">
            {FORMAT_STATS.map(f => {
              const total = f.validated + f.rejected;
              const rate  = Math.round((f.validated / total) * 100);
              return (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                      <span className="text-[13px] text-white/85">{f.label}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-accent-success">{f.validated} ✓</span>
                      <span className="text-accent-danger">{f.rejected} ✕</span>
                      <span className="text-white/35 w-8 text-right">{rate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full bg-accent-success transition-all duration-700"
                      style={{ width: `${rate}%`, background: f.color + "99" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Par style */}
        <section className="rounded-xl border border-line bg-ink-900 p-5">
          <h2 className="text-[18px] font-semibold tracking-tight">Par style</h2>
          <div className="mt-1 text-[12px] text-white/40">validées vs refusées</div>
          <div className="mt-5 space-y-4">
            {STYLE_STATS.map(s => {
              const total = s.validated + s.rejected;
              const rate  = Math.round((s.validated / total) * 100);
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm ring-1 ring-white/10" style={{ background: s.swatch }} />
                      <span className="text-[13px] text-white/85">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-accent-success">{s.validated} ✓</span>
                      <span className="text-accent-danger">{s.rejected} ✕</span>
                      <span className="text-white/35 w-8 text-right">{rate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${rate}%`, background: s.swatch + "88" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Personas + Credits */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Personas */}
        <section className="rounded-xl border border-line bg-ink-900 p-5 xl:col-span-2">
          <h2 className="text-[18px] font-semibold tracking-tight">Par persona</h2>
          <div className="mt-1 text-[12px] text-white/40">utilisation dans les générations</div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PERSONA_STATS.map(p => {
              const total = p.validated + p.rejected;
              const rate  = Math.round((p.validated / total) * 100);
              return (
                <div key={p.name} className="rounded-xl border border-line bg-white/[0.02] p-4 text-center">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${p.color} font-bold text-[13px] text-black`}>
                    {p.initials}
                  </span>
                  <div className="mt-2 text-[14px] font-semibold">{p.name}</div>
                  <div className="mt-3 space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between"><span className="text-white/40">Générées</span><span>{total}</span></div>
                    <div className="flex justify-between"><span className="text-accent-success">Validées</span><span className="text-accent-success">{p.validated}</span></div>
                    <div className="flex justify-between"><span className="text-accent-danger">Refusées</span><span className="text-accent-danger">{p.rejected}</span></div>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full bg-accent-success" style={{ width: `${rate}%` }} />
                  </div>
                  <div className="mt-1 font-mono text-[9px] text-white/35">{rate}% validées</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Crédits + temps */}
        <section className="rounded-xl border border-line bg-ink-900 p-5">
          <h2 className="text-[18px] font-semibold tracking-tight">Utilisation</h2>
          <div className="mt-1 text-[12px] text-white/40">ce mois</div>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-widest text-white/40">CRÉDITS</span>
                <span className="font-mono text-[11px] text-white/70">82 / 300</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="h-full rounded-full bg-accent-cyan" style={{ width: "27%" }} />
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-white/35">218 crédits restants · reset dans 8j</div>
            </div>

            <div className="rounded-xl border border-line bg-white/[0.02] p-4">
              <div className="font-mono text-[9px] tracking-widest text-white/35 mb-1">TEMPS ÉCONOMISÉ</div>
              <div className="font-display text-[36px] leading-none text-accent-success">{timeSaved}<span className="text-[18px] text-white/40">min</span></div>
              <div className="mt-1 text-[11px] text-white/40">vs création manuelle (~3 min/miniature)</div>
            </div>

            <div className="rounded-xl border border-line bg-white/[0.02] p-4">
              <div className="font-mono text-[9px] tracking-widest text-white/35 mb-1">TAUX MOYEN</div>
              <div className="font-display text-[36px] leading-none">{validationRate}<span className="text-[18px] text-white/40">%</span></div>
              <div className="mt-1 text-[11px] text-white/40">de tes générations sont validées</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── KPI card ─── */
function Kpi({ label, value, accent, spark, note }: {
  label: string; value: string;
  accent: "cyan" | "success" | "danger" | "none";
  spark: number[]; note?: string;
}) {
  const colors = { cyan: "text-accent-cyan", success: "text-accent-success", danger: "text-accent-danger", none: "text-white" };
  const sparkColors = { cyan: "#34E0FF", success: "#22C55E", danger: "#EF4444", none: "rgba(255,255,255,0.45)" };
  return (
    <div className="rounded-xl border border-line bg-ink-900 p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] text-white/40">{label}</div>
      <div className={`mt-3 font-display text-[40px] leading-none tracking-tight ${colors[accent]}`}>{value}</div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-[11px] text-white/40">{note}</div>
        <Sparkline data={spark} color={sparkColors[accent]} />
      </div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 24;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const step = w / Math.max(data.length - 1, 1);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-20 shrink-0" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Stacked bar chart ─── */
function StackedChart({ validated, rejected, range }: {
  validated: number[]; rejected: number[]; range: Range;
}) {
  const maxVal = Math.max(...validated.map((v, i) => v + rejected[i]), 1);
  const labels7  = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const getLabel = (i: number, total: number) => {
    if (range === "7") return labels7[i] ?? "";
    if (i === 0) return `J-${total}`;
    if (i === total - 1) return "Auj.";
    if (i % Math.floor(total / 4) === 0) return `J-${total - i}`;
    return "";
  };

  return (
    <div className="flex items-end gap-1 h-[180px]">
      {validated.map((v, i) => {
        const r = rejected[i] ?? 0;
        const total = v + r;
        const vH = total > 0 ? (v / maxVal) * 100 : 0;
        const rH = total > 0 ? (r / maxVal) * 100 : 0;
        const lbl = getLabel(i, validated.length);
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1 justify-end h-full">
            <div className="w-full flex flex-col justify-end rounded-sm overflow-hidden"
              style={{ height: `${Math.max(vH + rH, 2)}%` }}>
              <div className="w-full rounded-sm bg-accent-danger/60 transition-all" style={{ height: `${rH > 0 ? (rH / (vH + rH)) * 100 : 0}%` }} />
              <div className="w-full bg-accent-success/70 transition-all" style={{ height: `${vH > 0 ? (vH / (vH + rH)) * 100 : 0}%` }} />
            </div>
            {lbl && <span className="font-mono text-[8px] tracking-wider text-white/30 whitespace-nowrap">{lbl}</span>}
            {/* Tooltip */}
            {total > 0 && (
              <div className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
                <div className="rounded-lg border border-line bg-ink-900 px-3 py-2 text-center shadow-xl">
                  <div className="font-mono text-[9px] text-accent-success">{v} validées</div>
                  <div className="font-mono text-[9px] text-accent-danger">{r} refusées</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
