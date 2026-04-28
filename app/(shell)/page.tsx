"use client";

import { useState } from "react";
import { Thumb, STYLE_META, type StyleId } from "@/app/_components/thumbs";

type Tab = "recentes" | "favoris" | "publiees";

const RECENT: Array<{
  hook: string;
  title: string;
  style: StyleId;
  niche: string;
  nicheTone: "yellow" | "cyan" | "danger" | "warm" | "red" | "orange";
  age: string;
}> = [
  { hook: "▶ COMMENT J'AI SIGNÉ", title: "Comment j'ai signé 50K€ en 90 jours", style: "yellow", niche: "COACHING", nicheTone: "yellow", age: "il y a 3 j" },
  { hook: "DU MVP À", title: "Du MVP à 10K MRR en solo", style: "cyan", niche: "SAAS", nicheTone: "cyan", age: "il y a 7 j" },
  { hook: "ÉPISODE 47 — VÉRITÉ", title: "Ce que personne ne te dit sur l'argent", style: "truth", niche: "MINDSET", nicheTone: "danger", age: "il y a 12 j" },
  { hook: "▶ MON SYSTÈME", title: "Mon système 4h/jour qui marche", style: "soft", niche: "PRODUCTIVITÉ", nicheTone: "warm", age: "il y a 18 j" },
  { hook: "LE SCRIPT QUI ME FAIT", title: "Le script qui me fait closer 80%", style: "red", niche: "VENTES", nicheTone: "red", age: "il y a 22 j" },
  { hook: "POURQUOI TU VAS", title: "Pourquoi tu vas perdre 6 mois", style: "wakeup", niche: "STRATÉGIE", nicheTone: "orange", age: "il y a 28 j" },
];

export default function AccueilPage() {
  const [tab, setTab] = useState<Tab>("recentes");

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* hero */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">
            BONJOUR, MARC
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
            3 miniatures générées cette semaine. Ton CTR moyen est{" "}
            <span className="font-semibold text-white">+34% vs ta baseline YouTube</span>{" "}
            — continue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/[0.05]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            Générer une variation
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-accent-cyan px-4 py-2.5 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nouvelle miniature
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="MINIATURES CE MOIS"
          value="47"
          delta={{ text: "+12", note: "objectif 60", positive: true }}
          spark={[28, 30, 33, 32, 35, 38, 39, 41, 43, 42, 45, 47]}
        />
        <Kpi
          label="CTR MOYEN ESTIMÉ"
          value="11.4%"
          delta={{ text: "+2.1pts", note: "vs baseline 8.3%", positive: true }}
          spark={[8.6, 8.8, 9.1, 9.4, 9.6, 10.0, 10.2, 10.5, 10.8, 11.0, 11.2, 11.4]}
        />
        <Kpi
          label="CRÉDITS RESTANTS"
          value="218"
          accent
          note="sur 300 / mois"
          spark={[300, 285, 270, 260, 252, 245, 240, 235, 230, 225, 222, 218]}
        />
        <Kpi
          label="STYLE PRÉFÉRÉ"
          value="Bold Yellow"
          valueSize="md"
          note="14 utilisations"
          spark={[1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14]}
        />
      </div>

      {/* Mes miniatures */}
      <section className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight">Mes miniatures</h2>
            <span className="text-[13px] text-white/45">6 récentes</span>
          </div>

          <div className="flex items-center gap-1">
            {([
              ["recentes", "Récentes", null],
              ["favoris", "Favoris", "12"],
              ["publiees", "Publiées", "28"],
            ] as Array<[Tab, string, string | null]>).map(([id, label, count]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors ${
                  tab === id ? "text-white" : "text-white/45 hover:text-white/80"
                }`}
              >
                {label}
                {count && <span className="font-mono text-[11px] text-white/40">{count}</span>}
                {tab === id && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] bg-accent-cyan" />
                )}
              </button>
            ))}
            <div className="ml-3 flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/65 hover:bg-white/[0.04] hover:text-white">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M2 5h12M4 8h8M6 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                Filtrer
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/65 hover:bg-white/[0.04] hover:text-white">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M8 2v9M4 8l4 4 4-4M3 14h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Exporter
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-line" />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {RECENT.map((r) => (
            <a key={r.title} href="#" className="group block">
              <div className="overflow-hidden rounded-xl ring-1 ring-line transition-all group-hover:ring-line-strong">
                <Thumb id={r.style} hook={r.hook} />
              </div>
              <div className="mt-3">
                <div className="text-[14px] font-medium text-white/95">{r.title}</div>
                <div className="mt-1.5 flex items-center gap-2.5 text-[12px] text-white/45">
                  <NicheTag tone={r.nicheTone}>{r.niche}</NicheTag>
                  <span>·</span>
                  <span className="text-white/65">{STYLE_META[r.style].name}</span>
                  <span className="ml-auto font-mono text-[11px] text-white/40">{r.age}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  valueSize = "lg",
  accent,
  delta,
  note,
  spark,
}: {
  label: string;
  value: string;
  valueSize?: "lg" | "md";
  accent?: boolean;
  delta?: { text: string; note: string; positive?: boolean };
  note?: string;
  spark: number[];
}) {
  return (
    <div className="rounded-xl border border-line bg-ink-900 p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">{label}</div>
      <div
        className={`mt-3 font-display tracking-tight ${
          accent ? "text-accent-cyan" : "text-white"
        } ${valueSize === "lg" ? "text-[44px] leading-none" : "text-[28px] leading-tight"}`}
      >
        {value}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {delta && (
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
          )}
          {!delta && note && (
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

function NicheTag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "yellow" | "cyan" | "danger" | "warm" | "red" | "orange";
}) {
  const map = {
    yellow: "bg-accent-yellow/20 text-accent-yellow",
    cyan: "bg-accent-cyan/20 text-accent-cyan",
    danger: "bg-accent-danger/20 text-accent-danger",
    warm: "bg-accent-warm/20 text-accent-warm",
    red: "bg-accent-danger/20 text-accent-danger",
    orange: "bg-accent-orange/20 text-accent-orange",
  };
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] tracking-widest ${map[tone]}`}>
      {children}
    </span>
  );
}
