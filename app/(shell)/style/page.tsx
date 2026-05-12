"use client";

import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PersonaBust } from "@/app/_components/persona";
import { Thumb, STYLE_META, type StyleId } from "@/app/_components/thumbs";
import { showToast } from "@/app/_components/ui/toast";

/* ─── styles catalogue ─── */
const STYLES: Array<{
  id: StyleId;
  name: string;
  niche: string;
  categories: string[];
  keywords: string[];
  ctr: string;
}> = [
  { id: "yellow", name: "Infopreneur Impact", niche: "Infopreneur · Coaching",      categories: ["Infopreneur","Coaching"],           keywords: ["argent","€","revenu","income","signer","client","vendre","money","k€","mrr"], ctr: "+62%" },
  { id: "cyan",   name: "SaaS Solo",          niche: "SaaS · Tech · Build",          categories: ["SaaS / Tech","Infopreneur"],        keywords: ["saas","mrr","app","tech","code","startup","produit","software","build","outil"], ctr: "+48%" },
  { id: "truth",  name: "Mindset Vérité",     niche: "Mindset · Influenceur",        categories: ["Influenceur","Coaching","Mindset"], keywords: ["vérité","truth","mensonge","personne","secret","réalité","mindset","erreur"], ctr: "+71%" },
  { id: "soft",   name: "Lifestyle Pro",      niche: "Lifestyle · Influenceur",      categories: ["Influenceur","Entertainment"],     keywords: ["productiv","routine","matin","habitude","quotidien","journée","temps","heure"], ctr: "+39%" },
  { id: "red",    name: "Coach Conviction",   niche: "Coach · Sport · Ventes",       categories: ["Sport","Coaching","Infopreneur"],  keywords: ["coach","sport","vendre","ventes","closer","conviction","perf","résultat"], ctr: "+57%" },
  { id: "wakeup", name: "Stratège Alerte",    niche: "Stratégie · Entrepreneuriat",  categories: ["Sport","Entertainment","Influenceur"], keywords: ["perdre","gagner","stratégie","alerte","urgence","erreur","risque","faillite"], ctr: "+44%" },
];


const HOOK_DB: Array<{ keys: string[]; hooks: string[] }> = [
  { keys: ["argent","€","revenu","money","income"],             hooks: ["50K€ EN 90 JOURS",   "DE 0 À 10K€ / MOIS",   "CE QUI M'A TOUT CHANGÉ"] },
  { keys: ["saas","mrr","app","software","build"],              hooks: ["DE 0 À 10K MRR",      "MON SAAS EN SOLO",     "LE PRODUIT QUI CHANGE TOUT"] },
  { keys: ["productiv","routine","matin","habitude","heure"],   hooks: ["4H PAR JOUR. POINT.", "MA ROUTINE EXACTE",    "PLUS EN MOINS DE TEMPS"] },
  { keys: ["ventes","closer","script","client","signer"],       hooks: ["JE CLOSE 80% DES APPELS","MON SCRIPT EXACT", "LA MÉTHODE QUI VEND"] },
  { keys: ["sport","training","fitness","muscl"],               hooks: ["MA TRANSFORMATION",   "LE VRAI TRAVAIL",      "CE QUE TU NE FAIS PAS"] },
  { keys: ["vérité","truth","mensonge","secret","personne"],    hooks: ["CE QUE PERSONNE NE DIT","LA VÉRITÉ DIFFICILE","ARRÊTE DE TE MENTIR"] },
  { keys: ["stratég","business","entrepreneuriat","croissance"],hooks: ["MON PLAN EXACT",       "L'ERREUR FATALE",     "CE QUE J'AI APPRIS"] },
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

function getRecommended(topic: string, hook: string): StyleId {
  const text = (topic + " " + hook).toLowerCase();
  let best: StyleId = "yellow"; let bestScore = 0;
  for (const s of STYLES) {
    const score = s.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = s.id; }
  }
  return best;
}

/* ─── persona types ─── */
type PersonaData = {
  id: number; name: string; desc: string; primary: boolean;
  expression: "intense"|"shock"|"smirk"|"calm"|"challenge";
  lighting: "neutral"|"warm"|"cool"|"red"|"yellow";
  usage: number;
};

const INITIAL_PERSONAS: PersonaData[] = [
  { id:1, name:"Marc",   desc:"32 ans · Brun · Crew-neck",      primary:true,  expression:"intense",   lighting:"warm",    usage:87 },
  { id:2, name:"Sarah",  desc:"29 ans · Châtain · Pull col rond",primary:false, expression:"smirk",     lighting:"cool",    usage:8  },
  { id:3, name:"Léo",    desc:"26 ans · Brun · T-shirt",         primary:false, expression:"challenge", lighting:"red",     usage:3  },
  { id:4, name:"Émilie", desc:"34 ans · Blonde · Blazer",        primary:false, expression:"calm",      lighting:"neutral", usage:2  },
];

const EXPRESSIONS: Array<{ id: PersonaData["expression"]; label: string; emoji: string }> = [
  { id:"intense",   label:"Conviction", emoji:"🎯" },
  { id:"shock",     label:"Choc",       emoji:"😱" },
  { id:"smirk",     label:"Confiance",  emoji:"😏" },
  { id:"calm",      label:"Autorité",   emoji:"🧠" },
  { id:"challenge", label:"Défi",       emoji:"⚡" },
];

type CreationStep = 1|2|3|4|5;

type Tab = "studio"|"personas"|"kit"|"prompts";

/* ═══ PAGE ═══ */

function StylePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const rawTab = params.get("tab") || "studio";
  const tab: Tab = ["studio","personas","kit","prompts"].includes(rawTab) ? rawTab as Tab : "studio";
  const setTab = (t: Tab) => router.replace(`/style?tab=${t}`, { scroll: false });

  // Creation state
  const [step, setStep] = useState<CreationStep>(1);
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [hookSugg, setHookSugg] = useState<string[]>([]);
  const [style, setStyle] = useState<StyleId>("yellow");
  const [personaId, setPersonaId] = useState<number|null>(null);
  const [expression, setExpression] = useState<PersonaData["expression"]>("intense");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  // Personas state
  const [personas, setPersonas] = useState<PersonaData[]>(INITIAL_PERSONAS);
  const [addPersonaOpen, setAddPersonaOpen] = useState(false);

  function resetCreation() {
    setStep(1); setTopic(""); setHook(""); setStyle("yellow");
    setPersonaId(null); setExpression("intense");
    setGenerating(false); setDone(false);
  }

  function goNext() {
    if (step === 1) {
      if (!topic.trim()) { showToast("Décris le sujet de ta vidéo", "error"); return; }
      const sugg = suggestHooks(topic);
      setHookSugg(sugg);
      if (!hook) { setHook(sugg[0]); }
      setStyle(getRecommended(topic, hook || sugg[0]));
    }
    if (step === 2 && !hook.trim()) { showToast("Écris le hook de ta miniature", "error"); return; }
    setStep(s => Math.min(s+1,5) as CreationStep);
  }

  function handleGenerate() {
    setStep(5); setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2400);
  }

  function handleSave() {
    showToast("Miniature enregistrée dans ta galerie !");
    resetCreation();
    router.push("/");
  }

  const stepMeta: Record<CreationStep,{label:string;hint:string}> = {
    1:{ label:"Sujet",    hint:"De quoi parle ta vidéo ?" },
    2:{ label:"Hook",     hint:"Le texte visible sur la miniature" },
    3:{ label:"Style",    hint:"Le code visuel" },
    4:{ label:"Persona",  hint:"Qui apparaît ?" },
    5:{ label:"Générer",  hint:"Ton résultat" },
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Page header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">STUDIO</h1>
          <p className="mt-2 text-[14px] text-white/50">Crée, gère tes styles et personas.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-line">
        <nav className="flex items-center gap-6">
          {([
            ["studio",   "Créer une miniature", null],
            ["personas", "Personas",   String(personas.length)],
            ["kit",      "Brand kit",  null],
            ["prompts",  "Prompts",    "23"],
          ] as Array<[Tab,string,string|null]>).map(([id,label,count]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 py-3 text-[14px] transition-colors ${tab===id ? "text-white" : "text-white/45 hover:text-white/80"}`}
            >
              {id==="studio" && <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan" />}
              {label}
              {count && <span className="font-mono text-[11px] text-white/35">{count}</span>}
              {tab===id && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-accent-cyan" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-0">
        {tab === "studio"   && <CreationStudio step={step} setStep={setStep} topic={topic} setTopic={setTopic} hook={hook} setHook={setHook} hookSugg={hookSugg} style={style} setStyle={setStyle} personaId={personaId} setPersonaId={setPersonaId} expression={expression} setExpression={setExpression} generating={generating} setGenerating={setGenerating} done={done} setDone={setDone} goNext={goNext} handleGenerate={handleGenerate} handleSave={handleSave} resetCreation={resetCreation} personas={personas} stepMeta={stepMeta} />}
        {tab === "personas" && <PersonasTab personas={personas} setPersonas={setPersonas} addOpen={addPersonaOpen} setAddOpen={setAddPersonaOpen} />}
        {tab === "kit"      && <BrandKit />}
        {tab === "prompts"  && <PromptsGrid />}
      </div>
    </div>
  );
}

export default function StylePage() {
  return <Suspense fallback={<div />}><StylePageInner /></Suspense>;
}

/* ═══ CREATION STUDIO (Tab "studio") ═══ */

function CreationStudio({
  step, setStep, topic, setTopic, hook, setHook, hookSugg,
  style, setStyle, personaId, setPersonaId, expression, setExpression,
  generating, setGenerating, done, setDone, goNext, handleGenerate, handleSave, resetCreation,
  personas, stepMeta,
}: {
  step: CreationStep; setStep: (s:CreationStep)=>void;
  topic: string; setTopic: (v:string)=>void;
  hook: string; setHook: (v:string)=>void;
  hookSugg: string[];
  style: StyleId; setStyle: (v:StyleId)=>void;
  personaId: number|null; setPersonaId: (v:number|null)=>void;
  expression: PersonaData["expression"]; setExpression: (v:PersonaData["expression"])=>void;
  generating: boolean; setGenerating: (v:boolean)=>void;
  done: boolean; setDone: (v:boolean)=>void;
  goNext: ()=>void; handleGenerate: ()=>void; handleSave: ()=>void; resetCreation: ()=>void;
  personas: PersonaData[];
  stepMeta: Record<CreationStep,{label:string;hint:string}>;
}) {
  return (
    <div className="flex h-[calc(100vh-240px)] min-h-[560px] gap-0 overflow-hidden border border-line bg-ink-950">

      {/* ─── LEFT: wizard ─── */}
      <div className="flex w-[400px] shrink-0 flex-col border-r border-line">

        {/* Step indicator */}
        <div className="border-b border-line px-6 py-4">
          <div className="flex items-center gap-0">
            {([1,2,3,4,5] as CreationStep[]).map((s,i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => s < step && setStep(s)}
                  className={`flex items-center gap-1.5 ${s < step ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    s < step  ? "bg-accent-success/20 text-accent-success" :
                    s === step ? "bg-accent-cyan text-black" :
                                "bg-white/[0.06] text-white/30"
                  }`}>
                    {s < step ? "✓" : s}
                  </div>
                  <span className={`font-mono text-[9px] tracking-widest ${s===step ? "text-white" : "text-white/25"}`}>
                    {stepMeta[s].label.toUpperCase()}
                  </span>
                </button>
                {i < 4 && <span className="mx-2 text-white/15 text-[10px]">›</span>}
              </div>
            ))}
          </div>
          {step < 5 && (
            <div className="mt-2 text-[12px] text-white/40">{stepMeta[step].hint}</div>
          )}
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* STEP 1 — Sujet */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/40">DE QUOI PARLE CETTE VIDÉO ?</div>
                <textarea
                  autoFocus
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  rows={3}
                  placeholder="ex: Comment j'ai signé mes 3 premiers clients coaching sans audience"
                  className="w-full resize-none rounded-lg border border-line bg-white/[0.03] px-4 py-3 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50 leading-relaxed"
                />
                <div className="mt-1 font-mono text-[9px] text-white/25">Plus c&apos;est précis, meilleur sera le hook généré</div>
              </div>

              {topic.trim().length > 8 && (
                <div>
                  <div className="mb-2.5 flex items-center gap-2">
                    <div className="font-mono text-[10px] tracking-[0.18em] text-white/40">HOOKS SUGGÉRÉS</div>
                    <span className="rounded bg-accent-cyan/15 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-accent-cyan">IA</span>
                  </div>
                  <div className="space-y-2">
                    {suggestHooks(topic).map(h => (
                      <button
                        key={h}
                        onClick={() => setHook(h)}
                        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                          hook === h ? "border-accent-cyan/60 bg-accent-cyan/[0.06]" : "border-line bg-white/[0.02] hover:border-line-strong"
                        }`}
                      >
                        <span className="font-display text-[14px] tracking-tight text-white/90">{h}</span>
                        {hook === h
                          ? <span className="font-mono text-[8px] text-accent-cyan">✓</span>
                          : <span className="font-mono text-[8px] text-white/25">CHOISIR</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Hook */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/40">TON HOOK</div>
                <input
                  autoFocus
                  value={hook}
                  onChange={e => setHook(e.target.value)}
                  placeholder="Max 5-7 mots, MAJUSCULES"
                  className="w-full rounded-lg border border-line bg-white/[0.03] px-4 py-3 font-display text-[20px] tracking-tight text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50"
                />
                <div className={`mt-1 font-mono text-[9px] ${hook.split(" ").filter(Boolean).length > 7 ? "text-accent-danger" : "text-white/25"}`}>
                  {hook.split(" ").filter(Boolean).length} / 7 mots recommandés
                </div>
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/40">VARIANTES</div>
                {hookSugg.map(h => (
                  <button
                    key={h}
                    onClick={() => setHook(h)}
                    className={`mb-2 flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left transition-all ${
                      hook === h ? "border-accent-cyan/60 bg-accent-cyan/[0.06]" : "border-line bg-white/[0.02] hover:border-line-strong"
                    }`}
                  >
                    <span className="font-display text-[13px] tracking-tight text-white/85">{h}</span>
                    {hook === h ? <span className="font-mono text-[8px] text-accent-cyan">ACTIF</span> : <span className="font-mono text-[8px] text-white/25">UTILISER</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Style */}
          {step === 3 && (
            <div>
              <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-white/40">STYLE VISUEL</div>
              <div className="space-y-2">
                {STYLES.map(s => {
                  const isRec = s.id === getRecommended(topic, hook);
                  const isSel = style === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all ${
                        isSel ? "border-accent-cyan/70 bg-accent-cyan/[0.05]" : "border-line bg-white/[0.02] hover:border-line-strong"
                      }`}
                    >
                      <div className="w-[88px] shrink-0 overflow-hidden rounded ring-1 ring-white/10">
                        <Thumb id={s.id} hook={hook} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-[12px] text-white/95">{s.name}</span>
                          {isRec && <span className="rounded bg-accent-yellow/20 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-accent-yellow">⚡ RECO</span>}
                          {isSel && <span className="rounded bg-accent-cyan/20 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-accent-cyan">✓</span>}
                        </div>
                        <div className="mt-0.5 font-mono text-[8px] tracking-widest text-white/30">{s.niche.toUpperCase()}</div>
                        <div className="mt-0.5 font-mono text-[8px] text-accent-success">{s.ctr} CTR</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — Persona */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-white/40">QUI APPARAÎT ?</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPersonaId(null)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 transition-all ${personaId===null ? "border-accent-cyan/60 bg-accent-cyan/[0.05]" : "border-line bg-white/[0.02] hover:border-line-strong"}`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white/30 text-[16px]">○</div>
                    <span className="font-mono text-[9px] tracking-widest text-white/40">SANS PERSONA</span>
                    {personaId===null && <span className="font-mono text-[8px] text-accent-cyan">✓</span>}
                  </button>
                  {personas.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setPersonaId(p.id); setExpression(p.expression); }}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 transition-all ${personaId===p.id ? "border-accent-cyan/60 bg-accent-cyan/[0.05]" : "border-line bg-white/[0.02] hover:border-line-strong"}`}
                    >
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-ink-800">
                        <PersonaBust expression={p.expression} lighting={p.lighting} shirt="#0a0a0a" className="h-full w-full" />
                      </div>
                      <span className="text-[12px] font-semibold text-white/80">{p.name}</span>
                      {p.primary && <span className="font-mono text-[7px] text-accent-cyan tracking-widest">PRINCIPAL</span>}
                      {personaId===p.id && <span className="font-mono text-[8px] text-accent-cyan">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              {personaId !== null && (
                <div>
                  <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/40">EXPRESSION</div>
                  <div className="flex flex-wrap gap-2">
                    {EXPRESSIONS.map(e => (
                      <button
                        key={e.id}
                        onClick={() => setExpression(e.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-all ${expression===e.id ? "bg-accent-cyan text-black font-semibold" : "border border-line text-white/50 hover:text-white"}`}
                      >
                        <span>{e.emoji}</span>{e.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Génération */}
          {step === 5 && (
            <div className="flex flex-col items-center gap-5 py-6">
              {generating && (
                <>
                  <div className="relative h-14 w-14">
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan" />
                    <div className="absolute inset-3 animate-pulse rounded-full bg-accent-cyan/10" />
                  </div>
                  <div className="text-center">
                    <div className="text-[14px] font-semibold">Génération en cours…</div>
                    <div className="mt-1 font-mono text-[10px] tracking-widest text-white/35">MODÈLE IA EN TRAVAIL</div>
                  </div>
                  <div className="w-full space-y-2 rounded-lg border border-line bg-white/[0.02] p-4 text-[12px]">
                    {[["STYLE", STYLES.find(s=>s.id===style)?.name??""],[" HOOK",hook],["PERSONA",personaId ? personas.find(p=>p.id===personaId)?.name??"":"Aucun"]].map(([k,v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="font-mono text-[9px] tracking-widest text-white/30">{k}</span>
                        <span className="text-white/60">{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {done && (
                <>
                  <div className="flex items-center gap-2 text-[12px] text-accent-success"><span>✓</span> Miniature générée</div>
                  <button
                    onClick={() => { setDone(false); setGenerating(true); setTimeout(()=>{setGenerating(false);setDone(true);},1800); }}
                    className="text-[11px] text-white/35 hover:text-white"
                  >
                    ↺ Régénérer une variante
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button
            onClick={step===1 ? resetCreation : ()=>setStep((step-1) as CreationStep)}
            className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] text-white/55 hover:bg-white/[0.05] hover:text-white"
          >
            {step===1 ? "Réinitialiser" : "← Retour"}
          </button>

          {step < 4 && (
            <button onClick={goNext} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black hover:shadow-[0_0_20px_rgba(52,224,255,0.3)]">
              Continuer →
            </button>
          )}
          {step===4 && (
            <button onClick={handleGenerate} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black hover:shadow-[0_0_20px_rgba(52,224,255,0.3)]">
              Générer ✦
            </button>
          )}
          {step===5 && done && (
            <button onClick={handleSave} className="rounded-lg bg-accent-success px-5 py-2 text-[12px] font-bold text-black">
              Enregistrer ✓
            </button>
          )}
        </div>
      </div>

      {/* ─── RIGHT: live preview ─── */}
      <div className="flex flex-1 flex-col bg-ink-900">
        <div className="border-b border-line px-5 py-3">
          <span className="font-mono text-[10px] tracking-widest text-white/30">APERÇU EN DIRECT</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="w-full max-w-[480px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
            {hook
              ? <Thumb id={style} hook={hook} />
              : <div className="aspect-video w-full bg-ink-800 flex flex-col items-center justify-center gap-2">
                  <div className="font-mono text-[10px] tracking-widest text-white/20">APERÇU</div>
                  <div className="font-mono text-[11px] tracking-widest text-white/15">Décris ta vidéo pour commencer</div>
                </div>
            }
          </div>

          {/* Meta pills */}
          {(hook || style) && (
            <div className="flex flex-wrap justify-center gap-2 w-full max-w-[480px]">
              {hook && (
                <div className="flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-3 py-2">
                  <span className="font-mono text-[8px] tracking-widest text-white/30">HOOK</span>
                  <span className="font-display text-[12px] tracking-tight text-white/75">{hook}</span>
                </div>
              )}
              {hook && (
                <div className="flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-3 py-2">
                  <span className="font-mono text-[8px] tracking-widest text-white/30">STYLE</span>
                  <span className="text-[12px] text-white/65">{STYLES.find(s=>s.id===style)?.name}</span>
                </div>
              )}
              {hook && (
                <div className="flex items-center gap-2 rounded-lg border border-accent-success/20 bg-accent-success/[0.04] px-3 py-2">
                  <span className="font-mono text-[8px] tracking-widest text-accent-success">CTR ESTIMÉ</span>
                  <span className="font-semibold text-[13px] text-accent-success">{STYLES.find(s=>s.id===style)?.ctr} vs baseline</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ PERSONAS TAB ═══ */

type PhotoSlot = "face"|"left"|"right";
const PHOTO_SLOTS: Array<{id:PhotoSlot;label:string;hint:string;icon:string}> = [
  {id:"face", label:"Face frontale", hint:"Regard droit, lumière neutre", icon:"👁"},
  {id:"left", label:"Profil gauche",  hint:"Tête tournée à gauche",        icon:"↩"},
  {id:"right",label:"Profil droit",   hint:"Tête tournée à droite",        icon:"↪"},
];

function PersonasTab({ personas, setPersonas, addOpen, setAddOpen }: {
  personas: PersonaData[];
  setPersonas: (p:PersonaData[])=>void;
  addOpen: boolean;
  setAddOpen: (v:boolean)=>void;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);

  function handleDelete(id:number) {
    if (deleteConfirm===id) {
      setPersonas(personas.filter(p=>p.id!==id));
      showToast("Persona supprimé","info"); setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(()=>setDeleteConfirm(null),3000);
    }
  }

  function handleSetPrimary(id:number) {
    setPersonas(personas.map(p=>({...p,primary:p.id===id})));
    showToast("Persona principal mis à jour !");
  }

  function handleAdd(p:Omit<PersonaData,"id"|"usage"|"primary">) {
    setPersonas([...personas,{...p,id:Date.now(),usage:0,primary:false}]);
    setAddOpen(false);
    showToast(`Persona "${p.name}" créé !`);
  }

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-widest text-white/40">{personas.length} PERSONAS DISPONIBLES</div>
        <button onClick={()=>setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan px-4 py-2 text-[12px] font-bold text-black hover:shadow-[0_0_20px_rgba(52,224,255,0.3)]">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Ajouter un persona
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {personas.map(p => (
          <article key={p.id} className="overflow-hidden rounded-xl border border-line bg-ink-900 transition-colors hover:border-line-strong">
            <div className="aspect-[4/3] bg-ink-800">
              <PersonaBust expression={p.expression} lighting={p.lighting} shirt="#0a0a0a" className="h-full w-full" />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[14px] font-semibold text-white/95">{p.name}</div>
                {p.primary
                  ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-cyan/15 px-2 py-0.5 font-mono text-[8px] tracking-widest text-accent-cyan"><span className="h-1 w-1 rounded-full bg-accent-cyan"/>PRINCIPAL</span>
                  : <button onClick={()=>handleSetPrimary(p.id)} className="rounded-full border border-line px-2 py-0.5 font-mono text-[8px] tracking-widest text-white/30 hover:text-accent-cyan hover:border-accent-cyan/40">SET</button>
                }
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2 font-mono text-[9px] tracking-widest text-white/30">
                <span>{p.usage}% usage</span>
                <div className="flex gap-2">
                  <button onClick={()=>showToast("Éditeur persona bientôt disponible","info")} className="hover:text-white">Éditer</button>
                  {!p.primary && (
                    <button onClick={()=>handleDelete(p.id)} className={`transition-colors ${deleteConfirm===p.id?"text-accent-danger":"hover:text-accent-danger"}`}>
                      {deleteConfirm===p.id?"CONFIRMER ?":"✕"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {addOpen && <ModaleAjoutPersona onClose={()=>setAddOpen(false)} onAdd={handleAdd} />}
    </div>
  );
}

/* ─── Modal ajout persona ─── */
function ModaleAjoutPersona({ onClose, onAdd }: {
  onClose:()=>void;
  onAdd:(p:Omit<PersonaData,"id"|"usage"|"primary">)=>void;
}) {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [name, setName] = useState(""); const [desc, setDesc] = useState("");
  const [expression, setExpression] = useState<PersonaData["expression"]>("intense");
  const [lighting, setLighting] = useState<PersonaData["lighting"]>("warm");
  const [photos, setPhotos] = useState<Record<PhotoSlot,string|null>>({face:null,left:null,right:null});
  const [generating, setGenerating] = useState(false); const [done, setDone] = useState(false);
  const fileRefs = useRef<Record<PhotoSlot,HTMLInputElement|null>>({face:null,left:null,right:null});
  const allPhotos = photos.face && photos.left && photos.right;

  const LIGHTINGS: Array<{id:PersonaData["lighting"];label:string;color:string}> = [
    {id:"neutral",label:"Neutre",color:"#888"},{id:"warm",label:"Chaud",color:"#FF9A3C"},
    {id:"cool",label:"Cool",color:"#34E0FF"},{id:"red",label:"Rouge",color:"#EF4444"},{id:"yellow",label:"Jaune",color:"#E8FF3A"},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="flex w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <div className="text-[14px] font-semibold">Nouveau persona</div>
            <div className="mt-0.5 font-mono text-[9px] tracking-widest text-white/40">ÉTAPE {step}/4 — {["INFOS","3 PHOTOS","PERSONNALISATION","CONFIRMATION"][step-1]}</div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>
        <div className="flex h-[2px] bg-ink-800">{[1,2,3,4].map(s=><div key={s} className={`flex-1 transition-colors ${s<=step?"bg-accent-cyan":""}`}/>)}</div>

        <div className="overflow-y-auto p-6">
          {step===1 && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">NOM</div>
                <input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Marc, Sarah, Alex…" className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50"/>
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">DESCRIPTION</div>
                <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="32 ans · Brun · Crew-neck" className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50"/>
              </div>
              <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/[0.04] p-4">
                <div className="font-mono text-[9px] tracking-widest text-accent-cyan mb-2">💡 COMMENT ÇA MARCHE</div>
                <p className="text-[12px] text-white/55 leading-relaxed">3 photos de ta tête suffisent. Le modèle apprend ta morphologie exacte et la reproduit sur chaque miniature en illustration poster.</p>
              </div>
            </div>
          )}

          {step===2 && (
            <div>
              <p className="mb-5 text-[12px] text-white/50">Upload 3 photos de ta tête — fond uni, bonne lumière, visage entier visible.</p>
              <div className="grid grid-cols-3 gap-4">
                {PHOTO_SLOTS.map(slot => {
                  const has = !!photos[slot.id];
                  return (
                    <div key={slot.id}>
                      <input ref={el=>{fileRefs.current[slot.id]=el;}} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)setPhotos(p=>({...p,[slot.id]:URL.createObjectURL(f)}));}}/>
                      <button onClick={()=>fileRefs.current[slot.id]?.click()} className={`group relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 transition-all ${has?"border-accent-success":"border-dashed border-line hover:border-accent-cyan/50"}`}>
                        {has
                          ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={photos[slot.id]!} alt={slot.label} className="h-full w-full object-cover"/><div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 text-[11px] text-white">Changer</div><div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-success text-[9px] font-bold text-black">✓</div></>
                          : <div className="flex h-full flex-col items-center justify-center gap-2 p-2"><span className="text-2xl opacity-30">{slot.icon}</span><span className="font-mono text-[8px] tracking-widest text-white/30 text-center">UPLOADER</span></div>
                        }
                      </button>
                      <div className="mt-1.5 text-center">
                        <div className="text-[11px] font-medium text-white/70">{slot.label}</div>
                        <div className="text-[10px] text-white/30">{slot.hint}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step===3 && (
            <div className="space-y-5">
              {!done && !generating && (
                <>
                  <div>
                    <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">EXPRESSION PAR DÉFAUT</div>
                    <div className="flex flex-wrap gap-2">{EXPRESSIONS.map(e=><button key={e.id} onClick={()=>setExpression(e.id)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition-all ${expression===e.id?"bg-accent-cyan text-black font-bold":"border border-line text-white/50 hover:text-white"}`}><span>{e.emoji}</span>{e.label}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">ÉCLAIRAGE</div>
                    <div className="flex flex-wrap gap-2">{LIGHTINGS.map(l=><button key={l.id} onClick={()=>setLighting(l.id)} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] transition-all ${lighting===l.id?"bg-accent-cyan text-black font-bold":"border border-line text-white/50 hover:text-white"}`}><span className="h-2 w-2 rounded-full" style={{background:l.color}}/>{l.label}</button>)}</div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <PersonaBust expression={expression} lighting={lighting} shirt="#0a0a0a" className="h-[200px] w-full"/>
                  </div>
                </>
              )}
              {generating && <div className="flex flex-col items-center gap-4 py-8"><div className="relative h-12 w-12"><div className="absolute inset-0 animate-spin rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan"/></div><div className="text-[13px] text-white/70 font-mono tracking-widest">ANALYSE EN COURS…</div></div>}
              {done && <div className="overflow-hidden rounded-xl border border-accent-success/30"><PersonaBust expression={expression} lighting={lighting} shirt="#0a0a0a" className="h-[200px] w-full"/></div>}
            </div>
          )}

          {step===4 && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-accent-success/30"><PersonaBust expression={expression} lighting={lighting} shirt="#0a0a0a" className="h-[200px] w-full"/></div>
              <div className="rounded-xl border border-line bg-ink-900 p-4 grid grid-cols-2 gap-3 text-[12px]">
                {[["NOM",name||"—"],["EXPRESSION",EXPRESSIONS.find(e=>e.id===expression)?.label??""],[" ÉCLAIRAGE",lighting]].map(([k,v])=>(
                  <div key={k}><div className="font-mono text-[8px] tracking-widest text-white/30 mb-1">{k}</div><div className="text-white/80">{v}</div></div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button onClick={step===1?onClose:()=>{setStep(s=>(s-1) as 1|2|3|4);setDone(false);setGenerating(false);}} className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] text-white/60 hover:bg-white/[0.05]">
            {step===1?"Annuler":"← Retour"}
          </button>
          {step===1 && <button onClick={()=>{if(!name.trim()){showToast("Donne un nom","error");return;}setStep(2);}} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black">Suivant →</button>}
          {step===2 && <button onClick={()=>{if(!allPhotos){showToast("Upload les 3 photos","error");return;}setStep(3);}} className={`rounded-lg px-5 py-2 text-[12px] font-bold ${allPhotos?"bg-accent-cyan text-black":"bg-white/[0.06] text-white/40 cursor-not-allowed"}`}>Suivant →</button>}
          {step===3 && !generating && !done && <button onClick={()=>{setGenerating(true);setTimeout(()=>{setGenerating(false);setDone(true);},2200);}} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black">Générer ✦</button>}
          {step===3 && done && <button onClick={()=>setStep(4)} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black">Confirmer →</button>}
          {step===4 && <button onClick={()=>onAdd({name:name||"Nouveau",desc:desc||"Persona personnalisé",expression,lighting})} className="rounded-lg bg-accent-success px-5 py-2 text-[12px] font-bold text-black">✓ Enregistrer</button>}
        </div>
      </div>
    </div>
  );
}

/* ═══ BRAND KIT ═══ */
function BrandKit() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="rounded-xl border border-line bg-ink-900 p-5 lg:col-span-7">
        <div className="font-mono text-[10px] tracking-widest text-white/40 mb-4">PALETTE SIGNATURE</div>
        <div className="grid grid-cols-4 gap-3">
          {[{name:"Ink 950",hex:"#0E0F11"},{name:"Cyan",hex:"#34E0FF"},{name:"Yellow",hex:"#E8FF3A"},{name:"Danger",hex:"#FF3B30"},{name:"Orange",hex:"#FF7A1A"},{name:"Warm",hex:"#FFB74D"},{name:"Success",hex:"#22C55E"},{name:"White",hex:"#FFFFFF"}].map(c=>(
            <div key={c.name}>
              <div className="h-14 w-full rounded-md ring-1 ring-white/10" style={{background:c.hex}}/>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-[11px] font-medium">{c.name}</span>
                <span className="font-mono text-[9px] text-white/40">{c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-line bg-ink-900 lg:col-span-5">
        <div className="border-b border-line px-5 py-3 font-mono text-[10px] tracking-widest text-white/40">TYPOGRAPHIE</div>
        <div className="divide-y divide-line">
          <div className="px-5 py-4"><div className="font-mono text-[9px] tracking-widest text-white/40">DISPLAY</div><div className="mt-1 font-display text-[36px] leading-none tracking-tight">ANTON</div></div>
          <div className="px-5 py-4"><div className="font-mono text-[9px] tracking-widest text-white/40">UI</div><div className="mt-1 text-[22px] leading-tight">Inter Tight</div></div>
          <div className="px-5 py-4"><div className="font-mono text-[9px] tracking-widest text-white/40">DATA</div><div className="mt-1 font-mono text-[16px] tracking-widest">JetBrains Mono</div></div>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-ink-900 lg:col-span-12">
        <div className="border-b border-line px-5 py-3 font-mono text-[10px] tracking-widest text-white/40">CODES VISUELS — NON NÉGOCIABLES</div>
        <div className="grid grid-cols-2 gap-px bg-line xl:grid-cols-3">
          {[["Contraste extrême","Fond sombre + sujet lumineux. Jamais de zone molle."],["Hiérarchie 0.5s","Un seul focal point. 5-7 mots max. Une émotion."],["Expressions fortes","Choc · intensité · conviction. Jamais de sourire commercial."],["Typo percutante","Anton ultra. MAJUSCULES. Un mot en valeur."],["Palette tranchée","Noir + 1 accent. Pas de dégradés mous."],["Éléments graphiques","Cercles rouges · flèches · stickers."]].map(([t,d])=>(
            <div key={t} className="bg-ink-900 p-5"><div className="text-[13px] font-semibold">{t}</div><p className="mt-1 text-[12px] text-white/50">{d}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ PROMPTS ═══ */
function PromptsGrid() {
  const prompts = [
    {title:"Coaching · résultat chiffré",    uses:28,ctr:"+38%",style:"yellow" as StyleId},
    {title:"SaaS · MRR + dashboard flou",    uses:19,ctr:"+29%",style:"cyan"   as StyleId},
    {title:"Mindset · vérité crue barrée",   uses:24,ctr:"+44%",style:"truth"  as StyleId},
    {title:"Productivité · chiffre + chaud", uses:11,ctr:"+22%",style:"soft"   as StyleId},
    {title:"Ventes · ultimatum rouge",        uses:16,ctr:"+31%",style:"red"    as StyleId},
    {title:"Stratégie · compte à rebours",   uses:9, ctr:"+52%",style:"wakeup" as StyleId},
  ];
  return (
    <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-line md:grid-cols-2 xl:grid-cols-3">
      {prompts.map(p => {
        const meta = STYLE_META[p.style];
        return (
          <div key={p.title} className="bg-ink-900 p-5 hover:bg-ink-800 transition-colors">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-8 w-8 shrink-0 rounded-md ring-1 ring-white/10" style={{background:`linear-gradient(135deg,${meta.swatch} 0%,#000 130%)`}}/>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-white/95">{p.title}</div>
                <div className="mt-0.5 font-mono text-[9px] tracking-widest text-white/40">{meta.name.toUpperCase()} · {p.uses} GEN · <span className="text-accent-success">{p.ctr} CTR</span></div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>showToast("Prompt dupliqué !")} className="flex-1 rounded-md border border-line bg-white/[0.02] py-1.5 font-mono text-[9px] tracking-widest text-white/60 hover:bg-white/[0.05]">DUPLIQUER</button>
              <button onClick={()=>showToast("Prompt appliqué !","info")} className="flex-1 rounded-md bg-white/[0.06] py-1.5 font-mono text-[9px] tracking-widest text-white hover:bg-white/[0.1]">UTILISER</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
