"use client";

import { useState } from "react";
import { Thumb, type StyleId } from "@/app/_components/thumbs";
import { showToast } from "@/app/_components/ui/toast";

type ABStatus = "running" | "winner" | "draft";

type ABTest = {
  id: number;
  title: string;
  styleA: StyleId; hookA: string;
  styleB: StyleId; hookB: string;
  impressionsA: number; impressionsB: number;
  ctrA: number; ctrB: number;
  status: ABStatus;
  daysLeft?: number;
  startDate: string;
};

const TESTS: ABTest[] = [
  {
    id: 1,
    title: "Vidéo : Comment j'ai signé 50K€",
    styleA: "yellow", hookA: "▶ COMMENT J'AI SIGNÉ",
    styleB: "truth",  hookB: "LA VÉRITÉ SUR L'ARGENT",
    impressionsA: 8420, impressionsB: 8310,
    ctrA: 11.2, ctrB: 13.8,
    status: "winner", startDate: "12 avr.",
  },
  {
    id: 2,
    title: "Vidéo : Du MVP à 10K MRR",
    styleA: "cyan", hookA: "DE 0 À 10K MRR",
    styleB: "red",  hookB: "10K MRR EN SOLO",
    impressionsA: 3200, impressionsB: 3180,
    ctrA: 9.1, ctrB: 8.4,
    status: "running", daysLeft: 4, startDate: "24 avr.",
  },
  {
    id: 3,
    title: "Vidéo : Ma routine matinale",
    styleA: "soft", hookA: "MA ROUTINE EXACTE",
    styleB: "soft", hookB: "4H PAR JOUR. POINT.",
    impressionsA: 0, impressionsB: 0,
    ctrA: 0, ctrB: 0,
    status: "draft", startDate: "—",
  },
];

const STATS = [
  { label: "TESTS LANCÉS",    value: "8",     delta: "", accent: false },
  { label: "TAUX DE VICTOIRE", value: "75%",  delta: "6 / 8 tests conclusifs", accent: false },
  { label: "GAIN CTR MOYEN",  value: "+2.6pts", delta: "sur les tests terminés", accent: true },
  { label: "TESTS ACTIFS",    value: "1",     delta: "4 jours restants", accent: false },
];

export default function ABTestsPage() {
  const [tests, setTests] = useState<ABTest[]>(TESTS);

  function handleLaunch(id: number) {
    setTests(p => p.map(t => t.id === id ? { ...t, status: "running", daysLeft: 7, startDate: "Aujourd'hui" } : t));
    showToast("A/B test lancé ! Résultats dans 7 jours.");
  }

  function handleStop(id: number) {
    setTests(p => p.map(t => t.id === id ? { ...t, status: "winner" } : t));
    showToast("Test arrêté — variante A déclarée gagnante.", "info");
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">A/B TESTS</h1>
          <p className="mt-2 text-[14px] text-white/50">Compare deux miniatures sur la même vidéo. Le meilleur CTR gagne, automatiquement.</p>
        </div>
        <button
          onClick={() => showToast("Crée d'abord 2 miniatures dans le Studio", "info")}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan px-5 py-2.5 text-[12px] font-bold text-black hover:shadow-[0_0_24px_rgba(52,224,255,0.3)]"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Nouveau test
        </button>
      </div>

      {/* KPIs */}
      <div className="mb-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map(s => (
          <div key={s.label} className="rounded-xl border border-line bg-ink-900 p-5">
            <div className="font-mono text-[9px] tracking-[0.18em] text-white/40">{s.label}</div>
            <div className={`mt-3 font-display text-[40px] leading-none tracking-tight ${s.accent ? "text-accent-success" : "text-white"}`}>{s.value}</div>
            {s.delta && <div className="mt-2 text-[11px] text-white/40">{s.delta}</div>}
          </div>
        ))}
      </div>

      {/* Tests list */}
      <div className="space-y-4">
        {tests.map(test => {
          const lift = test.status !== "draft" ? (test.ctrB - test.ctrA).toFixed(1) : null;
          const winnerSide = test.ctrA >= test.ctrB ? "A" : "B";
          return (
            <div key={test.id} className={`overflow-hidden rounded-xl border bg-ink-900 ${test.status === "running" ? "border-accent-cyan/30" : test.status === "winner" ? "border-line" : "border-dashed border-line"}`}>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status={test.status} daysLeft={test.daysLeft} />
                  <span className="text-[13px] font-medium text-white/85">{test.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-white/30">Depuis le {test.startDate}</span>
                  {test.status === "running" && (
                    <button onClick={() => handleStop(test.id)} className="rounded border border-line px-3 py-1 font-mono text-[9px] tracking-widest text-white/50 hover:border-accent-danger/40 hover:text-accent-danger">
                      ARRÊTER
                    </button>
                  )}
                  {test.status === "draft" && (
                    <button onClick={() => handleLaunch(test.id)} className="rounded bg-accent-cyan px-3 py-1 font-mono text-[9px] tracking-widest font-bold text-black">
                      LANCER →
                    </button>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="grid grid-cols-2 gap-px bg-line">
                {(["A","B"] as const).map(side => {
                  const isA = side === "A";
                  const style = isA ? test.styleA : test.styleB;
                  const hook  = isA ? test.hookA  : test.hookB;
                  const ctr   = isA ? test.ctrA   : test.ctrB;
                  const impr  = isA ? test.impressionsA : test.impressionsB;
                  const isWinner = test.status === "winner" && winnerSide === side;
                  const isLoser  = test.status === "winner" && winnerSide !== side;

                  return (
                    <div key={side} className={`bg-ink-900 p-4 ${isLoser ? "opacity-50" : ""}`}>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-6 w-6 items-center justify-center rounded font-mono text-[11px] font-bold ${isWinner ? "bg-accent-success text-black" : "bg-white/[0.06] text-white/60"}`}>{side}</span>
                          {isWinner && <span className="font-mono text-[9px] tracking-widest text-accent-success">✓ GAGNANTE</span>}
                        </div>
                        {test.status !== "draft" && (
                          <span className={`font-mono text-[12px] font-bold ${ctr >= 10 ? "text-accent-success" : ctr >= 7 ? "text-accent-yellow" : "text-white/50"}`}>
                            {ctr > 0 ? `${ctr}% CTR` : "—"}
                          </span>
                        )}
                      </div>

                      {/* Thumbnail */}
                      <div className="overflow-hidden rounded-lg ring-1 ring-white/10">
                        <Thumb id={style} hook={hook} />
                      </div>

                      {/* Stats */}
                      {test.status !== "draft" && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-line bg-white/[0.02] p-2.5">
                            <div className="font-mono text-[8px] tracking-widest text-white/35">IMPRESSIONS</div>
                            <div className="mt-1 font-display text-[18px] leading-none">{impr > 0 ? impr.toLocaleString("fr") : "—"}</div>
                          </div>
                          <div className="rounded-lg border border-line bg-white/[0.02] p-2.5">
                            <div className="font-mono text-[8px] tracking-widest text-white/35">CTR</div>
                            <div className={`mt-1 font-display text-[18px] leading-none ${ctr >= 10 ? "text-accent-success" : ""}`}>{ctr > 0 ? `${ctr}%` : "—"}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer — lift indicator */}
              {test.status !== "draft" && lift !== null && parseFloat(lift) !== 0 && (
                <div className="border-t border-line px-5 py-3 flex items-center gap-3">
                  <div className={`font-mono text-[11px] font-bold ${parseFloat(lift) > 0 ? "text-accent-success" : "text-accent-danger"}`}>
                    Variante B {parseFloat(lift) > 0 ? `+${lift}pts` : `${lift}pts`} vs A
                  </div>
                  {test.status === "winner" && (
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full rounded-full bg-accent-success" style={{ width: `${Math.min((test.ctrB / Math.max(test.ctrA,test.ctrB)) * 100, 100)}%`, transition: "width 1s ease" }} />
                    </div>
                  )}
                  {test.status === "running" && (
                    <span className="font-mono text-[9px] text-white/30">Données en cours de collecte…</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Explainer */}
      <div className="mt-8 rounded-xl border border-line bg-ink-900 p-6">
        <div className="font-mono text-[10px] tracking-widest text-white/40 mb-4">COMMENT ÇA MARCHE</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["1. Crée 2 variantes", "Génère 2 miniatures pour la même vidéo dans le Studio. Des hooks ou styles différents."],
            ["2. Lance le test", "MiniaPulse alterne les deux thumbnails sur ta vidéo YouTube via l'API YouTube Studio."],
            ["3. Le gagnant s'impose", "Après 7 jours (ou au seuil stat. de 95%), la miniature avec le meilleur CTR est déclarée gagnante."],
          ].map(([t,d]) => (
            <div key={t}>
              <div className="text-[13px] font-semibold text-white/85 mb-1">{t}</div>
              <p className="text-[12px] text-white/45 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, daysLeft }: { status: ABStatus; daysLeft?: number }) {
  if (status === "running") return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2.5 py-1 font-mono text-[9px] tracking-widest text-accent-cyan">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
      EN COURS · {daysLeft}J
    </span>
  );
  if (status === "winner") return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-success/15 px-2.5 py-1 font-mono text-[9px] tracking-widest text-accent-success">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-success" />
      TERMINÉ
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[9px] tracking-widest text-white/35">
      BROUILLON
    </span>
  );
}
