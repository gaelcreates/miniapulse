"use client";

import { Suspense, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PersonaBust } from "@/app/_components/persona";
import { STYLE_META, type StyleId } from "@/app/_components/thumbs";
import { showToast } from "@/app/_components/ui/toast";

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

type Tab = "studio"|"personas"|"kit"|"prompts"|"exemples";

/* ═══ PAGE ═══ */

function StylePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const rawTab = params.get("tab") || "studio";
  const tab: Tab = ["studio","personas","kit","prompts","exemples"].includes(rawTab) ? rawTab as Tab : "studio";
  const setTab = (t: Tab) => router.replace(`/style?tab=${t}`, { scroll: false });

  const [personas, setPersonas] = useState<PersonaData[]>(INITIAL_PERSONAS);
  const [addPersonaOpen, setAddPersonaOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6">
        <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">STUDIO</h1>
        <p className="mt-2 text-[14px] text-white/50">Crée, gère tes styles et personas.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-line">
        <nav className="flex items-center gap-6">
          {([
            ["studio",   "Créer une miniature", null],
            ["personas", "Personas",   String(personas.length)],
            ["kit",      "Brand kit",  null],
            ["prompts",  "Prompts",    "23"],
            ["exemples", "Exemples",   null],
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
        {tab === "studio"   && <StudioLanding />}
        {tab === "personas" && <PersonasTab personas={personas} setPersonas={setPersonas} addOpen={addPersonaOpen} setAddOpen={setAddPersonaOpen} />}
        {tab === "kit"      && <BrandKit />}
        {tab === "prompts"  && <PromptsGrid />}
        {tab === "exemples" && <ExemplesTab />}
      </div>
    </div>
  );
}

export default function StylePage() {
  return <Suspense fallback={<div />}><StylePageInner /></Suspense>;
}

/* ═══ STUDIO LANDING (Tab "studio") ═══ */

function StudioLanding() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-8 rounded-xl border border-dashed border-line bg-white/[0.01] py-20 px-6 text-center">
      <div className="space-y-2">
        <div className="font-mono text-[10px] tracking-widest text-accent-cyan">CRÉATION DE MINIATURE</div>
        <h2 className="font-display text-[48px] leading-tight">PRÊT À CRÉER ?</h2>
        <p className="mx-auto max-w-md text-[14px] text-white/55">
          Lance le parcours guidé : brief, image à intégrer, inspirations, style, persona — puis génération IA.
        </p>
      </div>
      <Link
        href="/miniatures/new"
        className="inline-flex items-center gap-2 rounded-md bg-accent-cyan px-6 py-3 text-[14px] font-bold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Lancer le studio
      </Link>
      <div className="font-mono text-[10px] tracking-widest text-white/30">
        ~ 30 SECONDES PAR MINIATURE · GPT-IMAGE-2
      </div>
    </div>
  );
}

/* ═══ EXEMPLES TAB (placeholder) ═══ */

function ExemplesTab() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-line bg-white/[0.01] py-20 px-6 text-center">
      <div className="font-mono text-[10px] tracking-widest text-white/40">BIBLIOTHÈQUE</div>
      <h2 className="font-display text-[36px] leading-tight">EXEMPLES DE RÉFÉRENCE</h2>
      <p className="mx-auto max-w-md text-[14px] text-white/50">
        Stocke des miniatures qui t&apos;inspirent. Elles seront disponibles dans le studio pour orienter la génération.
      </p>
      <div className="font-mono text-[10px] tracking-widest text-white/30">
        BIENTÔT DISPONIBLE
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
