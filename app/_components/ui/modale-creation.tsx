"use client";

import { useState, useEffect } from "react";
import { Thumb, type StyleId } from "@/app/_components/thumbs";
import { PersonaBust } from "@/app/_components/persona";
import { showToast } from "./toast";

/* ─── singleton open ─── */
let _open: (() => void) | null = null;
export function openModaleCreation() { _open?.(); }

/* ─── styles catalogue ─── */
const STYLES: Array<{
  id: StyleId;
  name: string;
  niche: string;
  keywords: string[];
}> = [
  { id: "yellow", name: "Infopreneur Impact", niche: "Infopreneur · Coaching",   keywords: ["argent","€","revenu","income","signer","client","vendre","money","k€","mrr"] },
  { id: "cyan",   name: "SaaS Solo",          niche: "SaaS · Tech · Build",      keywords: ["saas","mrr","app","tech","code","startup","produit","software","build","outil"] },
  { id: "truth",  name: "Mindset Vérité",     niche: "Mindset · Influenceur",    keywords: ["vérité","truth","mensonge","personne","secret","réalité","mindset","erreur"] },
  { id: "soft",   name: "Lifestyle Pro",      niche: "Lifestyle · Influenceur",  keywords: ["productiv","routine","matin","habitude","quotidien","journée","temps","heure"] },
  { id: "red",    name: "Coach Conviction",   niche: "Coach · Sport · Ventes",   keywords: ["coach","sport","vendre","ventes","closer","conviction","perf","résultat","close"] },
  { id: "wakeup", name: "Stratège Alerte",    niche: "Stratégie · Entrepreneuriat", keywords: ["perdre","gagner","stratégie","alerte","urgence","mistake","risque","faillite"] },
];

function getRecommended(topic: string, hook: string): StyleId {
  const text = (topic + " " + hook).toLowerCase();
  let best: StyleId = "yellow";
  let bestScore = 0;
  for (const s of STYLES) {
    const score = s.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = s.id; }
  }
  return best;
}

const HOOK_DB: Array<{ keys: string[]; hooks: string[] }> = [
  { keys: ["argent","€","revenu","money","income"],        hooks: ["50K€ EN 90 JOURS","DE 0 À 10K€ / MOIS","CE QUI M'A TOUT CHANGÉ"] },
  { keys: ["saas","mrr","app","software","build"],         hooks: ["DE 0 À 10K MRR","MON SAAS EN SOLO","LE PRODUIT QUI CHANGE TOUT"] },
  { keys: ["productiv","routine","matin","habitude","heure"], hooks: ["4H PAR JOUR. POINT.","MA ROUTINE EXACTE","PLUS EN MOINS DE TEMPS"] },
  { keys: ["ventes","closer","script","client","signer"],  hooks: ["JE CLOSE 80% DES APPELS","MON SCRIPT EXACT","LA MÉTHODE QUI VEND"] },
  { keys: ["sport","training","fitness","muscl"],          hooks: ["MA TRANSFORMATION RÉELLE","LE VRAI TRAVAIL","CE QUE TU NE FAIS PAS"] },
  { keys: ["vérité","truth","mensonge","secret","personne"], hooks: ["CE QUE PERSONNE NE DIT","LA VÉRITÉ DIFFICILE","ARRÊTE DE TE MENTIR"] },
  { keys: ["stratég","business","entrepreneuriat","croissance"], hooks: ["MON PLAN EXACT","L'ERREUR FATALE","CE QUE J'AI APPRIS"] },
];

function suggestHooks(topic: string): string[] {
  if (!topic.trim()) return ["MON EXPÉRIENCE RÉELLE", "CE QUE PERSONNE NE DIT", "LA MÉTHODE QUI MARCHE"];
  const t = topic.toLowerCase();
  for (const row of HOOK_DB) {
    if (row.keys.some(k => t.includes(k))) return row.hooks;
  }
  const words = topic.trim().toUpperCase().split(" ").slice(0, 3).join(" ");
  return [`MON EXPÉRIENCE : ${words}`, `LA VÉRITÉ SUR ${words}`, `COMMENT J'AI RÉUSSI`];
}

type Step = 1 | 2 | 3 | 4 | 5;

type Persona = {
  id: number;
  name: string;
  expression: "intense" | "shock" | "smirk" | "calm" | "challenge";
  lighting: "neutral" | "warm" | "cool" | "red" | "yellow";
};

const PERSONAS: Persona[] = [
  { id: 1, name: "Marc",   expression: "intense",   lighting: "warm"    },
  { id: 2, name: "Sarah",  expression: "smirk",     lighting: "cool"    },
  { id: 3, name: "Léo",    expression: "challenge", lighting: "red"     },
  { id: 4, name: "Émilie", expression: "calm",      lighting: "neutral" },
];

const EXPRESSIONS: Array<{ id: Persona["expression"]; label: string; emoji: string }> = [
  { id: "intense",   label: "Conviction",  emoji: "🎯" },
  { id: "shock",     label: "Choc",        emoji: "😱" },
  { id: "smirk",     label: "Confiance",   emoji: "😏" },
  { id: "calm",      label: "Autorité",    emoji: "🧠" },
  { id: "challenge", label: "Défi",        emoji: "⚡" },
];

/* ═══ MODAL ═══ */

export function ModaleCreation() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [hookSuggestions, setHookSuggestions] = useState<string[]>([]);
  const [style, setStyle] = useState<StyleId>("yellow");
  const [personaId, setPersonaId] = useState<number | null>(null);
  const [expression, setExpression] = useState<Persona["expression"]>("intense");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    _open = () => {
      setOpen(true);
      setStep(1);
      setTopic(""); setHook(""); setStyle("yellow");
      setPersonaId(null); setExpression("intense");
      setGenerating(false); setDone(false);
    };
    return () => { _open = null; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (open) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setTimeout(() => { setStep(1); setDone(false); setGenerating(false); }, 300);
  }

  function goNext() {
    if (step === 1) {
      if (!topic.trim()) { showToast("Décris le sujet de ta vidéo", "error"); return; }
      const sugg = suggestHooks(topic);
      setHookSuggestions(sugg);
      if (!hook) setHook(sugg[0]);
      const rec = getRecommended(topic, hook || sugg[0]);
      setStyle(rec);
    }
    if (step === 2 && !hook.trim()) { showToast("Écris le hook de ta miniature", "error"); return; }
    setStep((s) => Math.min(s + 1, 5) as Step);
  }

  function handleGenerate() {
    setStep(5);
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2400);
  }

  function handleSave() {
    showToast("Miniature enregistrée dans ta galerie !");
    handleClose();
  }

  const stepLabels: Record<Step, string> = {
    1: "Sujet", 2: "Hook", 3: "Style", 4: "Persona", 5: "Génération",
  };

  const selectedPersona = PERSONAS.find(p => p.id === personaId);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative flex h-[88vh] w-full max-w-[900px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">

        {/* ─── LEFT: FORM ─── */}
        <div className="flex w-[420px] shrink-0 flex-col border-r border-line">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <div>
              <div className="text-[15px] font-semibold">Créer une miniature</div>
              <div className="mt-0.5 flex items-center gap-2">
                {([1,2,3,4,5] as Step[]).map((s) => (
                  <div
                    key={s}
                    onClick={() => s < step && setStep(s)}
                    className={`flex items-center gap-1.5 transition-all ${s < step ? "cursor-pointer" : ""}`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold transition-all ${
                      s < step  ? "bg-accent-success text-black" :
                      s === step ? "bg-accent-cyan text-black" :
                                  "bg-white/[0.08] text-white/35"
                    }`}>
                      {s < step ? "✓" : s}
                    </div>
                    <span className={`text-[10px] font-mono tracking-widest ${s === step ? "text-white" : "text-white/30"}`}>
                      {stepLabels[s].toUpperCase()}
                    </span>
                    {s < 5 && <span className="text-white/15 text-[10px]">›</span>}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleClose} className="text-white/40 hover:text-white text-lg leading-none">✕</button>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">

            {/* ── STEP 1: SUJET ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/45">DE QUOI PARLE CETTE VIDÉO ?</div>
                  <textarea
                    autoFocus
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={3}
                    placeholder="ex: Comment j'ai signé mes 3 premiers clients en coaching sans audience ni publicité"
                    className="w-full resize-none rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.04] leading-relaxed"
                  />
                  <div className="mt-1.5 font-mono text-[10px] text-white/30">Décris le contenu réel de ta vidéo — plus c'est précis, mieux le hook sera généré</div>
                </div>

                {topic.trim().length > 8 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">HOOKS SUGGÉRÉS</div>
                      <span className="rounded bg-accent-cyan/15 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-accent-cyan">IA</span>
                    </div>
                    <div className="space-y-2">
                      {suggestHooks(topic).map((h) => (
                        <button
                          key={h}
                          onClick={() => setHook(h)}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                            hook === h
                              ? "border-accent-cyan/60 bg-accent-cyan/[0.06]"
                              : "border-line bg-white/[0.02] hover:border-line-strong"
                          }`}
                        >
                          <span className="font-display text-[15px] tracking-tight text-white/90">{h}</span>
                          {hook === h && <span className="font-mono text-[9px] text-accent-cyan">✓ CHOISI</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: HOOK ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/45">TON HOOK — CE QUI APPARAÎT SUR LA MINIATURE</div>
                  <input
                    autoFocus
                    value={hook}
                    onChange={(e) => setHook(e.target.value)}
                    placeholder="Max 5-7 mots, MAJUSCULES recommandées"
                    className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3.5 font-display text-[20px] tracking-tight text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50"
                  />
                  <div className={`mt-1.5 font-mono text-[10px] ${hook.split(" ").filter(Boolean).length > 7 ? "text-accent-danger" : "text-white/30"}`}>
                    {hook.split(" ").filter(Boolean).length} / 7 mots recommandés
                  </div>
                </div>

                <div>
                  <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/45">VARIANTES</div>
                  <div className="space-y-2">
                    {hookSuggestions.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHook(h)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                          hook === h
                            ? "border-accent-cyan/60 bg-accent-cyan/[0.06]"
                            : "border-line bg-white/[0.02] hover:border-line-strong"
                        }`}
                      >
                        <span className="font-display text-[14px] tracking-tight text-white/85">{h}</span>
                        {hook === h
                          ? <span className="font-mono text-[9px] text-accent-cyan">ACTIF</span>
                          : <span className="font-mono text-[9px] text-white/30">UTILISER</span>
                        }
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-white/[0.02] px-4 py-3">
                  <div className="font-mono text-[9px] tracking-widest text-white/35 mb-1.5">POURQUOI UN BON HOOK ?</div>
                  <p className="text-[12px] text-white/50 leading-relaxed">Le hook est le seul texte visible en 0.3s. Il doit déclencher une émotion ou une question immédiate. Max 7 mots, MAJUSCULES.</p>
                </div>
              </div>
            )}

            {/* ── STEP 3: STYLE ── */}
            {step === 3 && (
              <div>
                <div className="mb-4 font-mono text-[10px] tracking-[0.18em] text-white/45">CHOISIR LE STYLE VISUEL</div>
                <div className="space-y-2">
                  {STYLES.map((s) => {
                    const isRec = s.id === getRecommended(topic, hook);
                    const isSelected = style === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-accent-cyan/70 bg-accent-cyan/[0.05]"
                            : "border-line bg-white/[0.02] hover:border-line-strong"
                        }`}
                      >
                        {/* Mini thumb */}
                        <div className="w-[100px] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                          <Thumb id={s.id} hook={hook} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[13px] text-white/95">{s.name}</span>
                            {isRec && (
                              <span className="rounded bg-accent-yellow/20 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-accent-yellow">⚡ RECOMMANDÉ</span>
                            )}
                            {isSelected && (
                              <span className="rounded bg-accent-cyan/20 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-accent-cyan">✓ CHOISI</span>
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[9px] tracking-widest text-white/35">{s.niche.toUpperCase()}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 4: PERSONA ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-white/45">QUI APPARAÎT ?</div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* No persona */}
                    <button
                      onClick={() => setPersonaId(null)}
                      className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition-all ${
                        personaId === null
                          ? "border-accent-cyan/60 bg-accent-cyan/[0.05]"
                          : "border-line bg-white/[0.02] hover:border-line-strong"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/[0.04] text-white/40 text-[18px]">○</div>
                      <span className="font-mono text-[10px] tracking-widest text-white/50">SANS PERSONA</span>
                      {personaId === null && <span className="font-mono text-[8px] text-accent-cyan">✓ CHOISI</span>}
                    </button>

                    {PERSONAS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setPersonaId(p.id); setExpression(p.expression); }}
                        className={`flex flex-col items-center gap-2 rounded-xl border py-3 transition-all ${
                          personaId === p.id
                            ? "border-accent-cyan/60 bg-accent-cyan/[0.05]"
                            : "border-line bg-white/[0.02] hover:border-line-strong"
                        }`}
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-ink-800">
                          <PersonaBust expression={p.expression} lighting={p.lighting} shirt="#0a0a0a" className="h-full w-full" />
                        </div>
                        <span className="text-[13px] font-semibold text-white/85">{p.name}</span>
                        {personaId === p.id && <span className="font-mono text-[8px] text-accent-cyan">✓ CHOISI</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {personaId !== null && (
                  <div>
                    <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-white/45">EXPRESSION</div>
                    <div className="flex flex-wrap gap-2">
                      {EXPRESSIONS.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setExpression(e.id)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-all ${
                            expression === e.id
                              ? "bg-accent-cyan text-black font-semibold"
                              : "border border-line text-white/55 hover:text-white"
                          }`}
                        >
                          <span>{e.emoji}</span>
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 5: GÉNÉRATION ── */}
            {step === 5 && (
              <div className="flex flex-col items-center gap-6 py-8">
                {generating ? (
                  <>
                    <div className="relative h-16 w-16">
                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan" />
                      <div className="absolute inset-3 animate-pulse rounded-full bg-accent-cyan/10" />
                    </div>
                    <div className="text-center">
                      <div className="text-[15px] font-semibold">Génération en cours…</div>
                      <div className="mt-1 font-mono text-[11px] tracking-widest text-white/40">MODÈLE IA EN TRAIN DE TRAVAILLER</div>
                    </div>
                    {/* Summary */}
                    <div className="w-full space-y-2 rounded-xl border border-line bg-white/[0.02] p-4">
                      {[
                        ["STYLE", STYLES.find(s => s.id === style)?.name ?? ""],
                        ["HOOK", hook],
                        ["PERSONA", personaId ? PERSONAS.find(p => p.id === personaId)?.name ?? "" : "Aucun"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="font-mono text-[9px] tracking-widest text-white/35">{k}</span>
                          <span className="text-[12px] text-white/70">{v}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : done ? (
                  <>
                    <div className="flex items-center gap-2 text-[13px] text-accent-success"><span>✓</span><span>Miniature générée</span></div>
                    <div className="w-full overflow-hidden rounded-xl border border-accent-success/30 shadow-xl">
                      <Thumb id={style} hook={hook} />
                    </div>
                    <button
                      onClick={() => { setDone(false); setGenerating(true); setTimeout(() => { setGenerating(false); setDone(true); }, 2000); }}
                      className="text-[12px] text-white/45 hover:text-white"
                    >
                      ↺ Régénérer une variante
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <button
              onClick={step === 1 ? handleClose : () => setStep((s) => (s - 1) as Step)}
              className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white"
            >
              {step === 1 ? "Annuler" : "← Retour"}
            </button>

            {step < 4 && (
              <button
                onClick={goNext}
                className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black hover:shadow-[0_0_24px_rgba(52,224,255,0.3)]"
              >
                Continuer →
              </button>
            )}
            {step === 4 && (
              <button
                onClick={handleGenerate}
                className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black hover:shadow-[0_0_24px_rgba(52,224,255,0.3)]"
              >
                Générer ✦
              </button>
            )}
            {step === 5 && done && (
              <button
                onClick={handleSave}
                className="rounded-lg bg-accent-success px-5 py-2 text-[12px] font-bold text-black"
              >
                Enregistrer ✓
              </button>
            )}
          </div>
        </div>

        {/* ─── RIGHT: LIVE PREVIEW ─── */}
        <div className="flex flex-1 flex-col bg-ink-900">
          <div className="border-b border-line px-5 py-3">
            <span className="font-mono text-[10px] tracking-widest text-white/35">APERÇU EN DIRECT</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <div className="w-full max-w-[400px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
              {hook ? (
                <Thumb id={style} hook={hook} />
              ) : (
                <div className="aspect-video w-full bg-ink-800 flex items-center justify-center">
                  <span className="font-mono text-[11px] tracking-widest text-white/20">TON HOOK APPARAÎTRA ICI</span>
                </div>
              )}
            </div>

            {/* Live meta */}
            <div className="w-full max-w-[400px] space-y-2">
              {hook && (
                <div className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2">
                  <span className="font-mono text-[9px] tracking-widest text-white/35">HOOK</span>
                  <span className="font-display text-[13px] tracking-tight text-white/80">{hook}</span>
                </div>
              )}
              {style && hook && (
                <div className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2">
                  <span className="font-mono text-[9px] tracking-widest text-white/35">STYLE</span>
                  <span className="text-[12px] text-white/70">{STYLES.find(s => s.id === style)?.name}</span>
                </div>
              )}
              {personaId && (
                <div className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2">
                  <span className="font-mono text-[9px] tracking-widest text-white/35">PERSONA</span>
                  <span className="text-[12px] text-white/70">
                    {PERSONAS.find(p => p.id === personaId)?.name} · {EXPRESSIONS.find(e => e.id === expression)?.label}
                  </span>
                </div>
              )}
            </div>

            {/* CTR hint */}
            {style && hook && (
              <div className="w-full max-w-[400px] rounded-lg border border-accent-success/20 bg-accent-success/[0.04] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-widest text-accent-success">CTR ESTIMÉ</span>
                  <span className="font-semibold text-[13px] text-accent-success">
                    {STYLES.find(s => s.id === style)?.id === "truth" ? "+71%" :
                     STYLES.find(s => s.id === style)?.id === "red" ? "+57%" :
                     STYLES.find(s => s.id === style)?.id === "yellow" ? "+62%" :
                     STYLES.find(s => s.id === style)?.id === "wakeup" ? "+44%" :
                     STYLES.find(s => s.id === style)?.id === "cyan" ? "+48%" : "+39%"}
                    {" "}vs baseline
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
