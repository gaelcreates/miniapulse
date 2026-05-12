"use client";

import { useState, useMemo } from "react";
import { Thumb, type StyleId } from "@/app/_components/thumbs";
import { showToast } from "@/app/_components/ui/toast";

const STYLES: StyleId[] = ["yellow","cyan","truth","soft","red","wakeup"];
const STYLE_NAMES: Record<StyleId,string> = {
  yellow:"Infopreneur Impact", cyan:"SaaS Solo", truth:"Mindset Vérité",
  soft:"Lifestyle Pro", red:"Coach Conviction", wakeup:"Stratège Alerte",
};
const NICHES = ["Tous","Infopreneur","SaaS / Tech","Mindset","Coaching","Sport","Influenceur","Entertainment"];
const SORTS = ["Plus récents","CTR décroissant","CTR croissant","Favoris"];

type Item = {
  id: number; title: string; hook: string; style: StyleId;
  niche: string; ctr: number; date: string; fav: boolean; published: boolean;
};

const GALLERY: Item[] = [
  { id:1,  title:"Comment j'ai signé 50K€ en 90 jours",    hook:"▶ COMMENT J'AI SIGNÉ",  style:"yellow", niche:"Infopreneur", ctr:11.2, date:"28 avr.",  fav:true,  published:true  },
  { id:2,  title:"Du MVP à 10K MRR en solo",                hook:"DU MVP À",               style:"cyan",   niche:"SaaS / Tech", ctr:9.4,  date:"21 avr.",  fav:false, published:true  },
  { id:3,  title:"Ce que personne ne te dit sur l'argent",  hook:"VÉRITÉ CRUE",            style:"truth",  niche:"Mindset",     ctr:13.1, date:"14 avr.",  fav:true,  published:true  },
  { id:4,  title:"Mon système 4h/jour qui marche",          hook:"▶ MON SYSTÈME",          style:"soft",   niche:"Coaching",    ctr:8.6,  date:"7 avr.",   fav:false, published:true  },
  { id:5,  title:"Le script qui me fait closer 80%",        hook:"LE SCRIPT",              style:"red",    niche:"Coaching",    ctr:10.3, date:"1 avr.",   fav:true,  published:true  },
  { id:6,  title:"Pourquoi tu vas perdre 6 mois",           hook:"POURQUOI TU VAS",        style:"wakeup", niche:"Infopreneur", ctr:9.8,  date:"24 mars",  fav:false, published:true  },
  { id:7,  title:"Ma routine matinale de CEO solo",         hook:"MA ROUTINE",             style:"soft",   niche:"Coaching",    ctr:7.4,  date:"17 mars",  fav:false, published:false },
  { id:8,  title:"J'ai testé 12 outils IA en 30 jours",    hook:"12 OUTILS IA",           style:"cyan",   niche:"SaaS / Tech", ctr:8.9,  date:"10 mars",  fav:true,  published:true  },
  { id:9,  title:"La vérité sur le personal branding",      hook:"LA VÉRITÉ",              style:"truth",  niche:"Influenceur", ctr:11.7, date:"3 mars",   fav:false, published:true  },
  { id:10, title:"Comment j'ai 3x mon CA sans pub",         hook:"3X CA",                  style:"yellow", niche:"Infopreneur", ctr:12.4, date:"24 fév.",  fav:true,  published:true  },
  { id:11, title:"5 erreurs qui te coûtent des clients",    hook:"5 ERREURS FATALES",      style:"red",    niche:"Coaching",    ctr:9.1,  date:"17 fév.",  fav:false, published:true  },
  { id:12, title:"Mon bilan 2025 — chiffres réels",         hook:"MON BILAN RÉEL",         style:"yellow", niche:"Infopreneur", ctr:14.2, date:"10 fév.",  fav:true,  published:true  },
];

export default function GaleriePage() {
  const [items, setItems] = useState<Item[]>(GALLERY);
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState("Tous");
  const [styleFilter, setStyleFilter] = useState<StyleId|"tous">("tous");
  const [sort, setSort] = useState(SORTS[0]);
  const [view, setView] = useState<"grid"|"list">("grid");
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);
  const [deleteBulkConfirm, setDeleteBulkConfirm] = useState(false);

  function handleDelete(id: number) {
    setItems(p => p.filter(i => i.id !== id));
    setSelected(p => p.filter(x => x !== id));
    setDeleteConfirm(null);
    showToast("Miniature supprimée", "info");
  }

  function handleDeleteSelected() {
    setItems(p => p.filter(i => !selected.includes(i.id)));
    showToast(`${selected.length} miniature(s) supprimée(s)`, "info");
    setSelected([]);
    setDeleteBulkConfirm(false);
  }

  const itemToDelete = items.find(i => i.id === deleteConfirm);

  const filtered = useMemo(() => {
    let r = items.filter(i => {
      if (q && !i.title.toLowerCase().includes(q.toLowerCase()) && !i.hook.toLowerCase().includes(q.toLowerCase())) return false;
      if (niche !== "Tous" && i.niche !== niche) return false;
      if (styleFilter !== "tous" && i.style !== styleFilter) return false;
      return true;
    });
    if (sort === "CTR décroissant") r = [...r].sort((a,b) => b.ctr - a.ctr);
    if (sort === "CTR croissant")   r = [...r].sort((a,b) => a.ctr - b.ctr);
    if (sort === "Favoris")         r = [...r].filter(i => i.fav);
    return r;
  }, [items, q, niche, styleFilter, sort]);

  function toggleFav(id:number) {
    setItems(p => p.map(i => i.id===id ? {...i,fav:!i.fav} : i));
  }

  function toggleSelect(id:number) {
    setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  }

  const avgCtr = (filtered.reduce((s,i)=>s+i.ctr,0)/Math.max(filtered.length,1)).toFixed(1);

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">GALERIE</h1>
          <p className="mt-2 text-[14px] text-white/50">{items.length} miniatures · CTR moyen <span className="text-accent-success">{avgCtr}%</span></p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-white/40">{selected.length} sélectionnée(s)</span>
              <button onClick={() => { showToast(`${selected.length} miniature(s) exportées !`); setSelected([]); }} className="inline-flex items-center gap-1.5 rounded-lg border border-accent-cyan/40 bg-accent-cyan/[0.06] px-3 py-2 text-[12px] font-semibold text-accent-cyan hover:bg-accent-cyan/[0.1]">
                ↓ Exporter
              </button>
              <button
                onClick={() => setDeleteBulkConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent-danger/40 bg-accent-danger/[0.06] px-3 py-2 text-[12px] font-semibold text-accent-danger hover:bg-accent-danger/[0.1]"
              >
                ✕ Supprimer
              </button>
              <button onClick={() => setSelected([])} className="rounded-lg border border-line px-3 py-2 text-[12px] text-white/40 hover:text-white">
                Annuler
              </button>
            </div>
          )}
          <button onClick={() => setView(v => v==="grid"?"list":"grid")} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white/[0.02] text-white/50 hover:text-white">
            {view==="grid" ? "☰" : "⊞"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex h-9 min-w-[240px] items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-3 focus-within:border-accent-cyan/40">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-white/35" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher…" className="flex-1 bg-transparent text-[12px] text-white placeholder:text-white/25 outline-none"/>
          {q && <button onClick={()=>setQ("")} className="text-white/30 hover:text-white text-[11px]">✕</button>}
        </div>

        {/* Niche */}
        <select value={niche} onChange={e=>setNiche(e.target.value)} className="h-9 rounded-lg border border-line bg-ink-900 px-3 font-mono text-[10px] tracking-widest text-white/65 outline-none">
          {NICHES.map(n=><option key={n}>{n}</option>)}
        </select>

        {/* Style filter */}
        <select value={styleFilter} onChange={e=>setStyleFilter(e.target.value as StyleId|"tous")} className="h-9 rounded-lg border border-line bg-ink-900 px-3 font-mono text-[10px] tracking-widest text-white/65 outline-none">
          <option value="tous">Tous les styles</option>
          {STYLES.map(s=><option key={s} value={s}>{STYLE_NAMES[s]}</option>)}
        </select>

        {/* Sort */}
        <select value={sort} onChange={e=>setSort(e.target.value)} className="h-9 rounded-lg border border-line bg-ink-900 px-3 font-mono text-[10px] tracking-widest text-white/65 outline-none">
          {SORTS.map(s=><option key={s}>{s}</option>)}
        </select>

        <span className="ml-auto font-mono text-[10px] tracking-widest text-white/30">{filtered.length} RÉSULTAT{filtered.length!==1?"S":""}</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <div className="text-[40px] opacity-20">○</div>
          <div className="text-[14px] text-white/40">Aucune miniature ne correspond</div>
          <button onClick={()=>{setQ("");setNiche("Tous");setStyleFilter("tous");}} className="text-[12px] text-accent-cyan hover:opacity-80">Réinitialiser les filtres</button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map(item => (
            <div key={item.id} className={`group relative overflow-hidden rounded-xl border transition-all ${selected.includes(item.id)?"border-accent-cyan/60 ring-1 ring-accent-cyan/20":"border-line hover:border-line-strong"}`}>
              {/* Checkbox */}
              <button onClick={()=>toggleSelect(item.id)} className={`absolute left-2.5 top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded border text-[9px] font-bold transition-all ${selected.includes(item.id)?"border-accent-cyan bg-accent-cyan text-black":"border-white/20 bg-black/40 text-transparent group-hover:text-white/40"}`}>
                ✓
              </button>

              {/* Thumb */}
              <div className="overflow-hidden"><Thumb id={item.style} hook={item.hook} /></div>

              {/* Meta */}
              <div className="bg-ink-900 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-white/90">{item.title}</div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[9px] tracking-widest text-white/35">
                      <span className="text-white/55">{STYLE_NAMES[item.style]}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                      {!item.published && <span className="text-accent-yellow">BROUILLON</span>}
                    </div>
                  </div>
                  <button onClick={()=>toggleFav(item.id)} className={`shrink-0 text-[16px] transition-colors ${item.fav?"text-accent-yellow":"text-white/20 hover:text-white/50"}`}>
                    {item.fav?"★":"☆"}
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`font-mono text-[11px] font-bold ${item.ctr>=10?"text-accent-success":item.ctr>=8?"text-accent-yellow":"text-white/50"}`}>
                      {item.ctr}% CTR
                    </div>
                    {item.ctr >= 11 && <span className="rounded bg-accent-success/15 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-accent-success">TOP</span>}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={()=>showToast("A/B test créé !","info")} className="rounded border border-line px-2 py-1 font-mono text-[8px] tracking-widest text-white/40 hover:text-white hover:border-line-strong">A/B</button>
                    <button onClick={()=>showToast("Miniature dupliquée !")} className="rounded border border-line px-2 py-1 font-mono text-[8px] tracking-widest text-white/40 hover:text-white hover:border-line-strong">DUP</button>
                    <button onClick={()=>setDeleteConfirm(item.id)} className="rounded border border-line px-2 py-1 font-mono text-[8px] tracking-widest text-white/30 hover:text-accent-danger hover:border-accent-danger/40 transition-colors">✕</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-white/[0.02] font-mono text-[9px] tracking-widest text-white/35">
                <th className="px-4 py-3 text-left">MINIATURE</th>
                <th className="px-4 py-3 text-left">TITRE</th>
                <th className="px-4 py-3 text-left">STYLE</th>
                <th className="px-4 py-3 text-left">NICHE</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3 text-right">DATE</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item,i) => (
                <tr key={item.id} className={`border-b border-line text-[12px] ${i%2===0?"":"bg-white/[0.01]"} hover:bg-white/[0.03]`}>
                  <td className="px-4 py-2">
                    <div className="w-16 overflow-hidden rounded ring-1 ring-white/10"><Thumb id={item.style} /></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="max-w-[280px]">
                      <div className="truncate text-white/85">{item.title}</div>
                      {!item.published && <span className="font-mono text-[8px] text-accent-yellow">BROUILLON</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-white/55">{STYLE_NAMES[item.style]}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[8px] tracking-widest text-white/40">{item.niche}</span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`font-mono font-bold ${item.ctr>=10?"text-accent-success":item.ctr>=8?"text-accent-yellow":"text-white/50"}`}>{item.ctr}%</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-white/35">{item.date}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <button onClick={()=>toggleFav(item.id)} className={`text-[14px] ${item.fav?"text-accent-yellow":"text-white/20 hover:text-white/50"}`}>{item.fav?"★":"☆"}</button>
                      <button onClick={()=>showToast("A/B test créé !","info")} className="rounded border border-line px-2 py-1 font-mono text-[8px] text-white/40 hover:text-white">A/B</button>
                      <button onClick={()=>setDeleteConfirm(item.id)} className="rounded border border-line px-2 py-1 font-mono text-[8px] text-white/30 hover:text-accent-danger hover:border-accent-danger/40">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── POPUP suppression unitaire ── */}
      {deleteConfirm !== null && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="border-b border-line px-6 py-4">
              <div className="font-mono text-[9px] tracking-widest text-accent-danger mb-1">SUPPRIMER LA MINIATURE</div>
              <div className="text-[15px] font-semibold text-white leading-snug">{itemToDelete.title}</div>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 overflow-hidden rounded-xl ring-1 ring-white/10">
                <Thumb id={itemToDelete.style} hook={itemToDelete.hook} />
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">
                Cette miniature sera définitivement supprimée de ta galerie. Cette action est <span className="text-white/80 font-medium">irréversible</span>.
              </p>
            </div>
            <div className="flex gap-2 border-t border-line px-6 py-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-line bg-white/[0.02] py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(itemToDelete.id)}
                className="flex-1 rounded-lg bg-accent-danger py-2.5 text-[13px] font-bold text-white hover:opacity-90"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POPUP suppression multiple ── */}
      {deleteBulkConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setDeleteBulkConfirm(false)}>
          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="border-b border-line px-6 py-4">
              <div className="font-mono text-[9px] tracking-widest text-accent-danger mb-1">SUPPRESSION MULTIPLE</div>
              <div className="text-[15px] font-semibold text-white">{selected.length} miniature{selected.length > 1 ? "s" : ""} sélectionnée{selected.length > 1 ? "s" : ""}</div>
            </div>
            <div className="px-6 py-5">
              <div className="flex gap-2 overflow-hidden mb-4">
                {items.filter(i => selected.includes(i.id)).slice(0,4).map(i => (
                  <div key={i.id} className="flex-1 overflow-hidden rounded-lg ring-1 ring-white/10">
                    <Thumb id={i.style} />
                  </div>
                ))}
                {selected.length > 4 && (
                  <div className="flex-1 flex items-center justify-center rounded-lg bg-white/[0.03] border border-line">
                    <span className="font-mono text-[11px] text-white/40">+{selected.length - 4}</span>
                  </div>
                )}
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">
                Ces {selected.length} miniature{selected.length > 1 ? "s" : ""} seront définitivement supprimées. Cette action est <span className="text-white/80 font-medium">irréversible</span>.
              </p>
            </div>
            <div className="flex gap-2 border-t border-line px-6 py-4">
              <button
                onClick={() => setDeleteBulkConfirm(false)}
                className="flex-1 rounded-lg border border-line bg-white/[0.02] py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 rounded-lg bg-accent-danger py-2.5 text-[13px] font-bold text-white hover:opacity-90"
              >
                Supprimer les {selected.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
