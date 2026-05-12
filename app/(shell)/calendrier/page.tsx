"use client";

"use client";

import { useState } from "react";
import { Thumb, type StyleId } from "@/app/_components/thumbs";
import { showToast } from "@/app/_components/ui/toast";

type CalEvent = {
  id: number; day: number; title: string;
  style: StyleId; hook: string;
  status: "planned" | "generated" | "published";
  ctr?: number;
  selectedMinia?: { style: StyleId; hook: string };
};

// Mock galerie — en prod ce serait les vraies miniatures de l'utilisateur
const GALERIE_MOCK: Array<{ id: number; title: string; style: StyleId; hook: string }> = [
  { id:1,  title:"Comment j'ai signé 50K€",         style:"yellow", hook:"▶ J'AI SIGNÉ"  },
  { id:2,  title:"Du MVP à 10K MRR en solo",          style:"cyan",   hook:"10K MRR"      },
  { id:3,  title:"Ce que personne ne te dit",         style:"truth",  hook:"LA VÉRITÉ"    },
  { id:4,  title:"Mon système 4h/jour",               style:"soft",   hook:"4H / JOUR"    },
  { id:5,  title:"Le script pour closer 80%",         style:"red",    hook:"80% CLOSE"    },
  { id:6,  title:"Pourquoi tu vas perdre 6 mois",    style:"wakeup", hook:"PERDRE 6 MOIS"},
  { id:7,  title:"Ma méthode de contenu",             style:"yellow", hook:"MA MÉTHODE"   },
  { id:8,  title:"Les 3 erreurs fatales",             style:"truth",  hook:"3 ERREURS"    },
];

const MONTH = "Avril 2026";
const DAYS_IN_MONTH = 30;
const FIRST_DAY = 2; // Wednesday = 2 (0=Mon)

const EVENTS: CalEvent[] = [
  { id:1,  day:3,  title:"Comment j'ai signé 50K€",          style:"yellow", hook:"▶ J'AI SIGNÉ",    status:"published",  ctr:11.2 },
  { id:2,  day:7,  title:"Du MVP à 10K MRR",                  style:"cyan",   hook:"10K MRR",         status:"published",  ctr:9.4  },
  { id:3,  day:10, title:"Vérité sur l'argent",               style:"truth",  hook:"LA VÉRITÉ",       status:"published",  ctr:13.1 },
  { id:4,  day:14, title:"Ma routine 4h/jour",                style:"soft",   hook:"4H / JOUR",       status:"published",  ctr:8.6  },
  { id:5,  day:17, title:"Script pour closer 80%",            style:"red",    hook:"80% CLOSE",       status:"published",  ctr:10.3 },
  { id:6,  day:21, title:"Pourquoi tu vas perdre 6 mois",    style:"wakeup", hook:"PERDRE 6 MOIS",   status:"published",  ctr:9.8  },
  { id:7,  day:24, title:"Ma méthode de contenu",             style:"yellow", hook:"MA MÉTHODE",      status:"generated"               },
  { id:8,  day:28, title:"Les 3 erreurs fatales",             style:"truth",  hook:"3 ERREURS",       status:"planned"                 },
  { id:9,  day:30, title:"Bilan du mois",                     style:"soft",   hook:"BILAN RÉEL",      status:"planned"                 },
];

const STATUS_STYLE = {
  published: "border-accent-success/40 bg-accent-success/[0.06]",
  generated: "border-accent-cyan/40 bg-accent-cyan/[0.06]",
  planned:   "border-dashed border-line bg-white/[0.01]",
};
const STATUS_LABEL = {
  published: { text:"PUBLIÉ",    cls:"text-accent-success" },
  generated: { text:"PRÊTE",     cls:"text-accent-cyan" },
  planned:   { text:"PLANIFIÉE", cls:"text-white/35" },
};

const DAYS_FR = ["LUN","MAR","MER","JEU","VEN","SAM","DIM"];

export default function CalendrierPage() {
  const [events, setEvents] = useState<CalEvent[]>(EVENTS);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [addDay, setAddDay] = useState<number | null>(null);
  const [addTitle, setAddTitle] = useState("");
  const [addMinia, setAddMinia] = useState<typeof GALERIE_MOCK[0] | null>(null);
  const [showGaleriePicker, setShowGaleriePicker] = useState(false);

  const totalCells = FIRST_DAY + DAYS_IN_MONTH;
  const weeks = Math.ceil(totalCells / 7);

  function eventsForDay(d: number) {
    return events.filter(e => e.day === d);
  }

  function handleAddEvent() {
    if (!addTitle.trim() || !addDay) { showToast("Ajoute un titre", "error"); return; }
    setEvents(p => [...p, {
      id: Date.now(), day: addDay, title: addTitle,
      style: addMinia?.style ?? "yellow",
      hook: addMinia?.hook ?? addTitle.slice(0, 15).toUpperCase(),
      status: addMinia ? "generated" : "planned",
      selectedMinia: addMinia ? { style: addMinia.style, hook: addMinia.hook } : undefined,
    }]);
    setAddTitle(""); setAddDay(null); setAddMinia(null); setShowGaleriePicker(false);
    showToast(addMinia ? "Miniature planifiée avec visuel !" : "Vidéo planifiée !");
  }

  const stats = {
    published: events.filter(e=>e.status==="published").length,
    generated: events.filter(e=>e.status==="generated").length,
    planned:   events.filter(e=>e.status==="planned").length,
    avgCtr: (events.filter(e=>e.ctr).reduce((s,e)=>s+(e.ctr??0),0) / Math.max(events.filter(e=>e.ctr).length,1)).toFixed(1),
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">CALENDRIER</h1>
          <p className="mt-2 text-[14px] text-white/50">Planifie, génère et publie tes miniatures par date de sortie.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-[12px] text-white/50 hover:text-white">← Mars</button>
          <span className="font-mono text-[12px] tracking-widest text-white/70">{MONTH}</span>
          <button className="rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-[12px] text-white/50 hover:text-white">Mai →</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { label:"PUBLIÉES",  value:stats.published, color:"text-accent-success" },
          { label:"PRÊTES",    value:stats.generated, color:"text-accent-cyan" },
          { label:"PLANIFIÉES",value:stats.planned,   color:"text-white/60" },
          { label:"CTR MOYEN", value:`${stats.avgCtr}%`, color:"text-accent-success" },
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-line bg-ink-900 px-4 py-3">
            <div className="font-mono text-[8px] tracking-widest text-white/35">{s.label}</div>
            <div className={`mt-1.5 font-display text-[28px] leading-none tracking-tight ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-xl border border-line">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-line">
          {DAYS_FR.map(d => (
            <div key={d} className="border-r border-line bg-white/[0.02] px-3 py-2 text-center font-mono text-[9px] tracking-widest text-white/35 last:border-r-0">{d}</div>
          ))}
        </div>

        {/* Weeks */}
        {Array.from({length:weeks}).map((_,w) => (
          <div key={w} className="grid grid-cols-7 border-b border-line last:border-b-0">
            {Array.from({length:7}).map((_,d) => {
              const dayNum = w*7 + d - FIRST_DAY + 1;
              const isValid = dayNum >= 1 && dayNum <= DAYS_IN_MONTH;
              const isToday = dayNum === 28;
              const dayEvents = isValid ? eventsForDay(dayNum) : [];

              return (
                <div
                  key={d}
                  onClick={() => isValid && setAddDay(dayNum)}
                  className={`min-h-[100px] border-r border-line p-2 last:border-r-0 transition-colors ${isValid?"cursor-pointer hover:bg-white/[0.02]":"bg-white/[0.01]"} ${isToday?"bg-accent-cyan/[0.04]":""}`}
                >
                  {isValid && (
                    <>
                      <div className={`mb-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold ${isToday?"bg-accent-cyan text-black":"text-white/40"}`}>
                        {dayNum}
                      </div>
                      {dayEvents.map(ev => (
                        <div
                          key={ev.id}
                          onClick={e => { e.stopPropagation(); setSelected(ev); }}
                          className={`mb-1 overflow-hidden rounded border px-1.5 py-1 cursor-pointer hover:opacity-80 transition-opacity ${STATUS_STYLE[ev.status]}`}
                        >
                          <div className="truncate text-[9px] font-medium text-white/80 leading-tight">{ev.title}</div>
                          <div className={`font-mono text-[7px] tracking-widest ${STATUS_LABEL[ev.status].cls}`}>
                            {STATUS_LABEL[ev.status].text}{ev.ctr?` · ${ev.ctr}%`:""}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length === 0 && isValid && (
                        <div className="font-mono text-[8px] text-white/15 mt-1">+ Planifier</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5">
        {Object.entries(STATUS_LABEL).map(([k,v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${k==="published"?"bg-accent-success":k==="generated"?"bg-accent-cyan":"bg-white/20"}`}/>
            <span className={`font-mono text-[9px] tracking-widest ${v.cls}`}>{v.text}</span>
          </div>
        ))}
      </div>

      {/* Event detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div>
                <div className={`font-mono text-[9px] tracking-widest ${STATUS_LABEL[selected.status].cls}`}>{STATUS_LABEL[selected.status].text}</div>
                <div className="text-[14px] font-semibold mt-0.5">{selected.title}</div>
              </div>
              <button onClick={()=>setSelected(null)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="p-5">
              <div className="overflow-hidden rounded-xl ring-1 ring-white/10 mb-4"><Thumb id={selected.style} hook={selected.hook}/></div>
              <div className="grid grid-cols-2 gap-3">
                {selected.ctr && (
                  <div className="rounded-lg border border-line bg-white/[0.02] p-3">
                    <div className="font-mono text-[8px] tracking-widest text-white/35">CTR</div>
                    <div className="mt-1 font-display text-[22px] text-accent-success">{selected.ctr}%</div>
                  </div>
                )}
                <div className="rounded-lg border border-line bg-white/[0.02] p-3">
                  <div className="font-mono text-[8px] tracking-widest text-white/35">DATE</div>
                  <div className="mt-1 font-display text-[22px]">{selected.day} avr.</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t border-line px-5 py-4">
              {selected.status==="planned" && (
                <button onClick={()=>{showToast("Studio ouvert avec ce contexte !","info");setSelected(null);}} className="flex-1 rounded-lg bg-accent-cyan py-2 text-[12px] font-bold text-black">Créer la miniature →</button>
              )}
              {selected.status==="generated" && (
                <button onClick={()=>{showToast("Publication programmée !");setSelected(null);}} className="flex-1 rounded-lg bg-accent-success py-2 text-[12px] font-bold text-black">Publier maintenant →</button>
              )}
              <button onClick={()=>{setEvents(p=>p.filter(e=>e.id!==selected.id));setSelected(null);showToast("Supprimé","info");}} className="rounded-lg border border-line px-4 py-2 text-[12px] text-white/40 hover:text-accent-danger hover:border-accent-danger/40">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Add event modal */}
      {addDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={e => e.target === e.currentTarget && (setAddDay(null), setAddMinia(null), setShowGaleriePicker(false))}>
          <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="text-[14px] font-semibold">Planifier — {addDay} {MONTH}</div>
              <button onClick={() => { setAddDay(null); setAddMinia(null); setShowGaleriePicker(false); }}
                className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Titre */}
              <div>
                <div className="mb-2 font-mono text-[9px] tracking-widest text-white/40">TITRE DE LA VIDÉO</div>
                <input autoFocus value={addTitle} onChange={e => setAddTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !showGaleriePicker && handleAddEvent()}
                  placeholder="ex: Comment j'ai signé 50K€…"
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50" />
              </div>

              {/* Miniature picker */}
              <div>
                <div className="mb-2 font-mono text-[9px] tracking-widest text-white/40">MINIATURE <span className="text-white/20">(optionnel)</span></div>
                {addMinia ? (
                  <div className="flex items-center gap-3 rounded-xl border border-accent-cyan/40 bg-accent-cyan/[0.04] p-3">
                    <div className="w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                      <Thumb id={addMinia.style} hook={addMinia.hook} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium text-white/85">{addMinia.title}</div>
                      <div className="mt-0.5 font-mono text-[9px] text-accent-cyan">✓ SÉLECTIONNÉE</div>
                    </div>
                    <button onClick={() => setAddMinia(null)}
                      className="shrink-0 text-white/35 hover:text-white text-[13px]">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowGaleriePicker(v => !v)}
                    className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left text-[12px] transition-colors ${
                      showGaleriePicker ? "border-accent-cyan/50 bg-accent-cyan/[0.04] text-accent-cyan" : "border-dashed border-line text-white/45 hover:border-line-strong hover:text-white"
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none">
                      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                    {showGaleriePicker ? "Fermer la galerie" : "Choisir depuis ma galerie"}
                  </button>
                )}

                {/* Galerie picker */}
                {showGaleriePicker && !addMinia && (
                  <div className="mt-2 max-h-[220px] overflow-y-auto rounded-xl border border-line bg-ink-900 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {GALERIE_MOCK.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setAddMinia(m); setShowGaleriePicker(false); }}
                          className="group overflow-hidden rounded-lg border border-line bg-ink-800 text-left transition-all hover:border-accent-cyan/50"
                        >
                          <div className="overflow-hidden">
                            <Thumb id={m.style} hook={m.hook} />
                          </div>
                          <div className="px-2 py-1.5">
                            <div className="truncate text-[10px] text-white/65 group-hover:text-white">{m.title}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 border-t border-line px-5 py-4">
              <button onClick={() => { setAddDay(null); setAddMinia(null); setShowGaleriePicker(false); }}
                className="rounded-lg border border-line px-4 py-2 text-[12px] text-white/50 hover:text-white transition-colors">
                Annuler
              </button>
              <button onClick={handleAddEvent}
                className="flex-1 rounded-lg bg-accent-cyan py-2 text-[12px] font-bold text-black hover:opacity-90 transition-opacity">
                Planifier →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
