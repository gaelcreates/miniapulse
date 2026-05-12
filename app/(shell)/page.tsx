"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Thumb, STYLE_META, type StyleId } from "@/app/_components/thumbs";
import { openModaleCreation } from "@/app/_components/ui/modale-creation";
import { showToast } from "@/app/_components/ui/toast";

type Tab = "recentes" | "favoris" | "publiees";

const ALL_THUMBS: Array<{
  hook: string;
  title: string;
  style: StyleId;
  niche: string;
  nicheTone: "yellow" | "cyan" | "danger" | "warm" | "red" | "orange";
  age: string;
  tab: Tab[];
}> = [
  { hook: "▶ COMMENT J'AI SIGNÉ", title: "Comment j'ai signé 50K€ en 90 jours", style: "yellow", niche: "COACHING", nicheTone: "yellow", age: "il y a 3 j", tab: ["recentes", "favoris", "publiees"] },
  { hook: "DU MVP À", title: "Du MVP à 10K MRR en solo", style: "cyan", niche: "SAAS", nicheTone: "cyan", age: "il y a 7 j", tab: ["recentes", "publiees"] },
  { hook: "ÉPISODE 47 — VÉRITÉ", title: "Ce que personne ne te dit sur l'argent", style: "truth", niche: "MINDSET", nicheTone: "danger", age: "il y a 12 j", tab: ["recentes", "favoris", "publiees"] },
  { hook: "▶ MON SYSTÈME", title: "Mon système 4h/jour qui marche", style: "soft", niche: "PRODUCTIVITÉ", nicheTone: "warm", age: "il y a 18 j", tab: ["favoris", "publiees"] },
  { hook: "LE SCRIPT QUI ME FAIT", title: "Le script qui me fait closer 80%", style: "red", niche: "VENTES", nicheTone: "red", age: "il y a 22 j", tab: ["recentes", "publiees"] },
  { hook: "POURQUOI TU VAS", title: "Pourquoi tu vas perdre 6 mois", style: "wakeup", niche: "STRATÉGIE", nicheTone: "orange", age: "il y a 28 j", tab: ["favoris", "publiees"] },
];

const NICHES = ["Tous", "COACHING", "SAAS", "MINDSET", "PRODUCTIVITÉ", "VENTES", "STRATÉGIE"];

function AccueilInner() {
  const [tab, setTab] = useState<Tab>("recentes");
  const [filterOpen, setFilterOpen] = useState(false);
  const [nicheFilter, setNicheFilter] = useState("Tous");
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() ?? "";

  const items = useMemo(() => {
    return ALL_THUMBS.filter((r) => {
      const matchTab = r.tab.includes(tab);
      const matchNiche = nicheFilter === "Tous" || r.niche === nicheFilter;
      const matchQ = !q || r.title.toLowerCase().includes(q) || r.niche.toLowerCase().includes(q);
      return matchTab && matchNiche && matchQ;
    });
  }, [tab, nicheFilter, q]);

  function handleExport() {
    showToast("Export CSV en cours…", "info");
    setTimeout(() => showToast("miniatures_export.csv téléchargé !"), 1800);
  }

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
          <Link
            href="/miniatures/new"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/[0.05]"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            Générer une variation
          </Link>
          <Link
            href="/miniatures/new"
            className="inline-flex items-center gap-2 rounded-md bg-accent-cyan px-4 py-2.5 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nouvelle miniature
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="MINIATURES CE MOIS" value="47" delta={{ text: "+12", note: "objectif 60", positive: true }} spark={[28,30,33,32,35,38,39,41,43,42,45,47]} />
        <Kpi label="CTR MOYEN ESTIMÉ" value="11.4%" delta={{ text: "+2.1pts", note: "vs baseline 8.3%", positive: true }} spark={[8.6,8.8,9.1,9.4,9.6,10,10.2,10.5,10.8,11,11.2,11.4]} />
        <Kpi label="CRÉDITS RESTANTS" value="218" accent note="sur 300 / mois" spark={[300,285,270,260,252,245,240,235,230,225,222,218]} />
        <Kpi label="STYLE PRÉFÉRÉ" value="Bold Yellow" valueSize="md" note="14 utilisations" spark={[1,2,3,4,5,7,8,9,10,12,13,14]} />
      </div>

      {/* Mes miniatures */}
      <section className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[22px] font-semibold tracking-tight">Mes miniatures</h2>
            <span className="text-[13px] text-white/45">{items.length} résultat{items.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="flex items-center gap-1">
            {([ ["recentes","Récentes",null], ["favoris","Favoris","12"], ["publiees","Publiées","28"] ] as Array<[Tab,string,string|null]>).map(([id,label,count]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-[13px] transition-colors ${tab === id ? "text-white" : "text-white/45 hover:text-white/80"}`}
              >
                {label}
                {count && <span className="font-mono text-[11px] text-white/40">{count}</span>}
                {tab === id && <span className="absolute inset-x-3 -bottom-px h-[2px] bg-accent-cyan" />}
              </button>
            ))}

            <div className="ml-3 flex items-center gap-2">
              {/* Filtrer dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen((o) => !o)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] transition-colors ${filterOpen || nicheFilter !== "Tous" ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan" : "border-line bg-white/[0.02] text-white/65 hover:bg-white/[0.04] hover:text-white"}`}
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                    <path d="M2 5h12M4 8h8M6 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {nicheFilter === "Tous" ? "Filtrer" : nicheFilter}
                </button>
                {filterOpen && (
                  <div className="absolute right-0 top-full z-10 mt-1.5 w-44 overflow-hidden rounded-xl border border-line bg-ink-900 shadow-2xl">
                    {NICHES.map((n) => (
                      <button
                        key={n}
                        onClick={() => { setNicheFilter(n); setFilterOpen(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-white/[0.04] ${nicheFilter === n ? "text-accent-cyan" : "text-white/70"}`}
                      >
                        {nicheFilter === n && <span className="text-[10px]">✓</span>}
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/65 hover:bg-white/[0.04] hover:text-white"
              >
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M8 2v9M4 8l4 4 4-4M3 14h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Exporter
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-line" />

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <div className="text-[40px]">○</div>
            <div className="text-[15px] font-medium text-white/60">Aucune miniature trouvée</div>
            <button onClick={() => { setNicheFilter("Tous"); }} className="mt-1 text-[12px] text-accent-cyan hover:opacity-80">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((r) => (
              <ThumbCard key={r.title} r={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function AccueilPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] animate-pulse" />}>
      <AccueilInner />
    </Suspense>
  );
}

function ThumbCard({ r }: { r: typeof ALL_THUMBS[0] }) {
  const [fav, setFav] = useState(r.tab.includes("favoris"));

  return (
    <div className="group relative block cursor-pointer">
      <div
        onClick={openModaleCreation}
        className="overflow-hidden rounded-xl ring-1 ring-line transition-all group-hover:ring-line-strong"
      >
        <Thumb id={r.style} hook={r.hook} />
      </div>
      {/* fav button */}
      <button
        onClick={() => {
          setFav((f) => !f);
          showToast(fav ? "Retiré des favoris" : "Ajouté aux favoris ♥", fav ? "info" : "success");
        }}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-[13px] backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
      >
        {fav ? "♥" : "♡"}
      </button>
      <div className="mt-3">
        <div className="text-[14px] font-medium text-white/95">{r.title}</div>
        <div className="mt-1.5 flex items-center gap-2.5 text-[12px] text-white/45">
          <NicheTag tone={r.nicheTone}>{r.niche}</NicheTag>
          <span>·</span>
          <span className="text-white/65">{STYLE_META[r.style].name}</span>
          <span className="ml-auto font-mono text-[11px] text-white/40">{r.age}</span>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, valueSize = "lg", accent, delta, note, spark }: { label: string; value: string; valueSize?: "lg" | "md"; accent?: boolean; delta?: { text: string; note: string; positive?: boolean }; note?: string; spark: number[] }) {
  return (
    <div className="rounded-xl border border-line bg-ink-900 p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">{label}</div>
      <div className={`mt-3 font-display tracking-tight ${accent ? "text-accent-cyan" : "text-white"} ${valueSize === "lg" ? "text-[44px] leading-none" : "text-[28px] leading-tight"}`}>
        {value}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {delta && (
            <div className="flex items-baseline gap-2">
              <span className={`font-mono text-[11px] ${delta.positive ? "text-accent-success" : "text-accent-danger"}`}>
                {delta.positive ? "↑" : "↓"} {delta.text}
              </span>
              <span className="truncate text-[11px] text-white/45">{delta.note}</span>
            </div>
          )}
          {!delta && note && <div className="text-[11px] text-white/45">{note}</div>}
        </div>
        <Sparkline data={spark} accent={accent} />
      </div>
    </div>
  );
}

function Sparkline({ data, accent }: { data: number[]; accent?: boolean }) {
  const w = 80, h = 24;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const step = w / (data.length - 1);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-20 shrink-0" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={accent ? "#34E0FF" : "rgba(255,255,255,0.45)"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function NicheTag({ children, tone }: { children: React.ReactNode; tone: string }) {
  const map: Record<string, string> = {
    yellow: "bg-accent-yellow/20 text-accent-yellow",
    cyan: "bg-accent-cyan/20 text-accent-cyan",
    danger: "bg-accent-danger/20 text-accent-danger",
    warm: "bg-accent-warm/20 text-accent-warm",
    red: "bg-accent-danger/20 text-accent-danger",
    orange: "bg-accent-orange/20 text-accent-orange",
  };
  return <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] tracking-widest ${map[tone] ?? ""}`}>{children}</span>;
}
