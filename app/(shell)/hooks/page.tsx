"use client";

import { useState, useMemo } from "react";
import { showToast } from "@/app/_components/ui/toast";

type HookCategory = "Résultat" | "Curiosité" | "Urgence" | "Autorité" | "Peur" | "Social proof";

type Hook = {
  id: number;
  text: string;
  category: HookCategory;
  uses: number;
  ctr: number | null;
  custom: boolean;
  fav: boolean;
};

const CAT_COLORS: Record<HookCategory, string> = {
  "Résultat":     "bg-accent-yellow/15 text-accent-yellow  border-accent-yellow/20",
  "Curiosité":    "bg-accent-cyan/15   text-accent-cyan    border-accent-cyan/20",
  "Urgence":      "bg-accent-danger/15 text-accent-danger  border-accent-danger/20",
  "Autorité":     "bg-white/[0.06]     text-white/60       border-white/10",
  "Peur":         "bg-accent-orange/15 text-accent-orange  border-accent-orange/20",
  "Social proof": "bg-accent-success/15 text-accent-success border-accent-success/20",
};

const CAT_HINTS: Record<HookCategory, string> = {
  "Résultat":     "Chiffre + transformation. Montre ce que tu as accompli.",
  "Curiosité":    "Ouvre une question. L'audience doit cliquer pour avoir la réponse.",
  "Urgence":      "Deadline, compte à rebours, erreur à ne pas faire.",
  "Autorité":     "Positionne ton expertise. Credibility-first.",
  "Peur":         "Déclenche la peur de manquer ou de se tromper.",
  "Social proof": "Chiffres de preuve sociale. Ce que les autres font.",
};

const HOOKS_DATA: Hook[] = [
  { id:1,  text:"50K€ EN 90 JOURS",               category:"Résultat",     uses:14, ctr:11.2, custom:false, fav:true  },
  { id:2,  text:"DE 0 À 10K MRR",                  category:"Résultat",     uses:9,  ctr:9.4,  custom:false, fav:false },
  { id:3,  text:"MA TRANSFORMATION EN 6 MOIS",     category:"Résultat",     uses:5,  ctr:8.7,  custom:false, fav:false },
  { id:4,  text:"CE QUE PERSONNE NE TE DIT",        category:"Curiosité",    uses:12, ctr:13.1, custom:false, fav:true  },
  { id:5,  text:"LE SECRET QUE J'AI CACHÉ",         category:"Curiosité",    uses:7,  ctr:11.8, custom:false, fav:false },
  { id:6,  text:"VOICI POURQUOI TU ÉCHOUES",        category:"Curiosité",    uses:4,  ctr:10.2, custom:false, fav:false },
  { id:7,  text:"ARRÊTE ÇA MAINTENANT",             category:"Urgence",      uses:8,  ctr:9.8,  custom:false, fav:true  },
  { id:8,  text:"T-30 JOURS POUR CHANGER",          category:"Urgence",      uses:3,  ctr:8.4,  custom:false, fav:false },
  { id:9,  text:"L'ERREUR QUI TUE TON BUSINESS",   category:"Urgence",      uses:6,  ctr:10.9, custom:false, fav:false },
  { id:10, text:"J'AI TESTÉ 100 STRATÉGIES",        category:"Autorité",     uses:4,  ctr:7.6,  custom:false, fav:false },
  { id:11, text:"MON RETOUR APRÈS 3 ANS",           category:"Autorité",     uses:6,  ctr:8.1,  custom:false, fav:false },
  { id:12, text:"LA MÉTHODE QUI M'A RENDU LIBRE",  category:"Autorité",     uses:3,  ctr:9.2,  custom:false, fav:true  },
  { id:13, text:"POURQUOI TU VAS ÉCHOUER",          category:"Peur",         uses:9,  ctr:12.4, custom:false, fav:true  },
  { id:14, text:"TU FAIS CETTE ERREUR TOUS LES JOURS",category:"Peur",      uses:5,  ctr:10.7, custom:false, fav:false },
  { id:15, text:"1000 ABONNÉS EN 30 JOURS",         category:"Social proof", uses:7,  ctr:8.9,  custom:false, fav:false },
  { id:16, text:"MES CLIENTS FONT X3 EN 60J",       category:"Social proof", uses:4,  ctr:9.4,  custom:false, fav:false },
];

const ALL_CATS: (HookCategory | "Tous")[] = ["Tous","Résultat","Curiosité","Urgence","Autorité","Peur","Social proof"];

export default function HooksPage() {
  const [hooks, setHooks] = useState<Hook[]>(HOOKS_DATA);
  const [cat, setCat] = useState<HookCategory|"Tous">("Tous");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"uses"|"ctr"|"alpha">("ctr");
  const [addOpen, setAddOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [newCat, setNewCat] = useState<HookCategory>("Résultat");

  const filtered = useMemo(() => {
    let r = hooks.filter(h => {
      if (cat !== "Tous" && h.category !== cat) return false;
      if (q && !h.text.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "uses") r = [...r].sort((a,b) => b.uses - a.uses);
    if (sort === "ctr")  r = [...r].sort((a,b) => (b.ctr??0) - (a.ctr??0));
    if (sort === "alpha") r = [...r].sort((a,b) => a.text.localeCompare(b.text));
    return r;
  }, [hooks, cat, q, sort]);

  function toggleFav(id: number) {
    setHooks(p => p.map(h => h.id===id ? {...h, fav:!h.fav} : h));
  }

  function deleteHook(id: number) {
    setHooks(p => p.filter(h => h.id!==id));
    showToast("Hook supprimé","info");
  }

  function addHook() {
    if (!newText.trim()) { showToast("Écris ton hook","error"); return; }
    setHooks(p => [...p, { id:Date.now(), text:newText.toUpperCase().trim(), category:newCat, uses:0, ctr:null, custom:true, fav:false }]);
    setNewText(""); setAddOpen(false);
    showToast("Hook ajouté à ta banque !");
  }

  const topCTR = [...hooks].sort((a,b)=>(b.ctr??0)-(a.ctr??0)).slice(0,3);

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">HOOKS</h1>
          <p className="mt-2 text-[14px] text-white/50">Ta banque de hooks classés par type et performance CTR.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan px-5 py-2.5 text-[12px] font-bold text-black hover:shadow-[0_0_24px_rgba(52,224,255,0.3)]">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Ajouter un hook
        </button>
      </div>

      {/* Top performers */}
      <div className="mb-8">
        <div className="mb-3 font-mono text-[10px] tracking-widest text-white/35">TOP 3 — CTR LE PLUS ÉLEVÉ</div>
        <div className="grid grid-cols-3 gap-3">
          {topCTR.map((h,i) => (
            <div key={h.id} className={`rounded-xl border p-4 ${i===0?"border-accent-yellow/40 bg-accent-yellow/[0.04]":"border-line bg-ink-900"}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-mono text-[10px] font-bold ${i===0?"text-accent-yellow":i===1?"text-white/50":"text-white/30"}`}>#{i+1}</span>
                <span className={`font-mono text-[11px] font-bold ${h.ctr&&h.ctr>=10?"text-accent-success":"text-white/50"}`}>{h.ctr}% CTR</span>
              </div>
              <div className="mt-2 font-display text-[15px] leading-snug tracking-tight text-white/90">{h.text}</div>
              <div className={`mt-2 inline-block rounded-full border px-2 py-0.5 font-mono text-[8px] tracking-widest ${CAT_COLORS[h.category]}`}>{h.category.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category tabs + filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all ${cat===c?"bg-accent-cyan text-black":"border border-line text-white/50 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex h-8 items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-3 focus-within:border-accent-cyan/40">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher…" className="w-32 bg-transparent text-[11px] text-white placeholder:text-white/25 outline-none"/>
            {q && <button onClick={()=>setQ("")} className="text-white/30 text-[10px]">✕</button>}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value as "uses"|"ctr"|"alpha")} className="h-8 rounded-lg border border-line bg-ink-900 px-2 font-mono text-[9px] tracking-widest text-white/55 outline-none">
            <option value="ctr">Par CTR</option>
            <option value="uses">Par utilisations</option>
            <option value="alpha">Alphabétique</option>
          </select>
        </div>
      </div>

      {/* Hook cards grouped by category */}
      {cat === "Tous" ? (
        (["Résultat","Curiosité","Urgence","Autorité","Peur","Social proof"] as HookCategory[]).map(c => {
          const group = filtered.filter(h => h.category === c);
          if (!group.length) return null;
          return (
            <div key={c} className="mb-8">
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-widest ${CAT_COLORS[c]}`}>{c.toUpperCase()}</span>
                <span className="text-[11px] text-white/30">{CAT_HINTS[c]}</span>
              </div>
              <HookGrid hooks={group} onFav={toggleFav} onDelete={deleteHook} />
            </div>
          );
        })
      ) : (
        <div>
          <div className="mb-4 text-[12px] text-white/40">{CAT_HINTS[cat as HookCategory]}</div>
          <HookGrid hooks={filtered} onFav={toggleFav} onDelete={deleteHook} />
        </div>
      )}

      {/* Add modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={e=>e.target===e.currentTarget&&setAddOpen(false)}>
          <div className="w-full max-w-[480px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="text-[14px] font-semibold">Ajouter un hook</div>
              <button onClick={()=>setAddOpen(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="mb-2 font-mono text-[9px] tracking-widest text-white/40">TEXTE DU HOOK</div>
                <input autoFocus value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHook()} placeholder="ex: 100K VUES EN 30 JOURS" className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 font-display text-[18px] tracking-tight text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50 uppercase"/>
              </div>
              <div>
                <div className="mb-2 font-mono text-[9px] tracking-widest text-white/40">CATÉGORIE</div>
                <div className="flex flex-wrap gap-2">
                  {(["Résultat","Curiosité","Urgence","Autorité","Peur","Social proof"] as HookCategory[]).map(c => (
                    <button key={c} onClick={()=>setNewCat(c)} className={`rounded-full px-3 py-1.5 text-[11px] transition-all ${newCat===c?"bg-accent-cyan text-black font-bold":"border border-line text-white/50 hover:text-white"}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between border-t border-line px-6 py-4">
              <button onClick={()=>setAddOpen(false)} className="rounded-lg border border-line px-4 py-2 text-[12px] text-white/50 hover:bg-white/[0.04]">Annuler</button>
              <button onClick={addHook} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black">Ajouter →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HookGrid({ hooks, onFav, onDelete }: { hooks: Hook[]; onFav:(id:number)=>void; onDelete:(id:number)=>void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {hooks.map(h => (
        <div key={h.id} className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-900 px-4 py-3 transition-all hover:border-line-strong">
          <div className="min-w-0 flex-1">
            <div className="font-display text-[14px] tracking-tight text-white/90 leading-snug">{h.text}</div>
            <div className="mt-1.5 flex items-center gap-3 font-mono text-[9px] text-white/35">
              <span>{h.uses} util.</span>
              {h.ctr !== null
                ? <span className={h.ctr >= 10 ? "text-accent-success" : ""}>{h.ctr}% CTR</span>
                : <span>Pas encore utilisé</span>
              }
              {h.custom && <span className="text-accent-cyan">CUSTOM</span>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={()=>{ showToast("Hook copié dans le Studio !","info"); }} title="Utiliser" className="flex h-7 w-7 items-center justify-center rounded border border-line text-white/40 hover:text-accent-cyan hover:border-accent-cyan/40 text-[12px]">→</button>
            <button onClick={()=>onFav(h.id)} className={`flex h-7 w-7 items-center justify-center rounded border border-line text-[13px] ${h.fav?"text-accent-yellow border-accent-yellow/30":"text-white/30 hover:text-accent-yellow"}`}>{h.fav?"★":"☆"}</button>
            {h.custom && <button onClick={()=>onDelete(h.id)} className="flex h-7 w-7 items-center justify-center rounded border border-line text-white/25 hover:text-accent-danger hover:border-accent-danger/30 text-[11px]">✕</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
