"use client";

import { Suspense, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PersonaBust } from "@/app/_components/persona";
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

type Tab = "studio"|"personas"|"kit"|"exemples";

/* ═══ PAGE ═══ */

function StylePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const rawTab = params.get("tab") || "studio";
  const tab: Tab = ["studio","personas","kit","exemples"].includes(rawTab) ? rawTab as Tab : "studio";
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

/* ═══ EXEMPLES TAB ═══ */

type ExempleItem = {
  id: number;
  url: string;
  title: string;
  tag: string;
  addedAt: string;
};

const EXEMPLE_TAGS = ["Tous", "Face cam", "Vlog", "Cinématique", "Entertainment", "Podcast", "Autre"];

function ExemplesTab() {
  const [items, setItems]         = useState<ExempleItem[]>([]);
  const [filter, setFilter]       = useState("Tous");
  const [addOpen, setAddOpen]     = useState(false);
  const [preview, setPreview]     = useState<ExempleItem | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const filtered = filter === "Tous" ? items : items.filter(i => i.tag === filter);

  function handleAdd(item: Omit<ExempleItem, "id" | "addedAt">) {
    setItems(p => [...p, { ...item, id: Date.now(), addedAt: "à l'instant" }]);
    setAddOpen(false);
    showToast("Exemple ajouté à ta bibliothèque !");
  }

  function handleDelete(id: number) {
    setItems(p => p.filter(i => i.id !== id));
    setDeleteId(null);
    setPreview(null);
    showToast("Exemple supprimé", "info");
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-white/40">{items.length} EXEMPLES DANS LA BIBLIOTHÈQUE</div>
          <p className="mt-1 text-[13px] text-white/45">Stocke des miniatures qui t&apos;inspirent — elles orienteront la génération IA.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan px-4 py-2 text-[12px] font-bold text-black hover:opacity-90 transition-opacity"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
            <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Ajouter un exemple
        </button>
      </div>

      {/* Filter tags */}
      {items.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {EXEMPLE_TAGS.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                filter === t ? "bg-accent-cyan text-black" : "border border-line text-white/50 hover:text-white"
              }`}>
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div
          onClick={() => setAddOpen(true)}
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-line bg-white/[0.01] px-6 py-20 text-center transition-colors hover:border-accent-cyan/40 hover:bg-accent-cyan/[0.02]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-white/[0.03] text-[24px]">🖼</div>
          <div>
            <div className="text-[15px] font-semibold text-white/80">Aucun exemple pour l&apos;instant</div>
            <p className="mt-1 text-[13px] text-white/40">Clique ici ou sur &quot;Ajouter&quot; pour uploader ta première référence</p>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-line bg-ink-900 cursor-pointer transition-all hover:border-line-strong"
              onClick={() => setPreview(item)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.title} className="aspect-video w-full object-cover" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="p-3 w-full flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-medium text-white">{item.title || "Sans titre"}</div>
                    <div className="font-mono text-[9px] text-white/50">{item.tag}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteId(item.id); }}
                    className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white/60 hover:text-accent-danger text-[11px]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && items.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <div className="text-[13px] text-white/40">Aucun exemple pour ce filtre</div>
          <button onClick={() => setFilter("Tous")} className="text-[12px] text-accent-cyan hover:opacity-80">Voir tous</button>
        </div>
      )}

      {/* Modale ajout */}
      {addOpen && <ModaleAjoutExemple onClose={() => setAddOpen(false)} onAdd={handleAdd} />}

      {/* Preview plein écran */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}>
          <div className="relative w-full max-w-[860px]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 font-mono text-[11px] text-white/40 hover:text-white">
              FERMER ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt={preview.title} className="w-full rounded-xl shadow-2xl" />
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold text-white">{preview.title || "Sans titre"}</div>
                <div className="mt-0.5 font-mono text-[10px] text-white/40">{preview.tag} · {preview.addedAt}</div>
              </div>
              <button
                onClick={() => setDeleteId(preview.id)}
                className="rounded-lg border border-accent-danger/40 bg-accent-danger/[0.08] px-4 py-2 text-[12px] font-medium text-accent-danger hover:bg-accent-danger/[0.14] transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="border-b border-line px-6 py-4">
              <div className="font-mono text-[9px] tracking-widest text-accent-danger mb-1">SUPPRIMER L&apos;EXEMPLE</div>
              <div className="text-[14px] text-white/80">Cette référence sera supprimée définitivement.</div>
            </div>
            <div className="flex gap-2 px-6 py-4">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-line py-2.5 text-[13px] text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 rounded-lg bg-accent-danger py-2.5 text-[13px] font-bold text-white hover:opacity-90 transition-opacity">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Modale ajout exemple ─── */
function ModaleAjoutExemple({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (item: { url: string; title: string; tag: string }) => void;
}) {
  const [url,      setUrl]      = useState<string | null>(null);
  const [title,    setTitle]    = useState("");
  const [tag,      setTag]      = useState("Autre");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { showToast("Fichier non supporté — image uniquement", "error"); return; }
    if (file.size > 8 * 1024 * 1024)    { showToast("Image trop lourde (max 8 Mo)", "error"); return; }
    setUrl(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleSave() {
    if (!url) { showToast("Ajoute une image d'abord", "error"); return; }
    onAdd({ url, title: title.trim(), tag });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[540px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">

        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="text-[14px] font-semibold">Ajouter un exemple de référence</div>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Upload zone */}
          {!url ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragging ? "border-accent-cyan/60 bg-accent-cyan/[0.04]" : "border-line bg-white/[0.01] hover:border-accent-cyan/40 hover:bg-white/[0.02]"
              }`}
            >
              <div className="text-[32px] opacity-50">🖼</div>
              <div>
                <div className="text-[14px] font-medium text-white/70">Glisse une image ici ou clique</div>
                <div className="mt-1 font-mono text-[10px] text-white/30">PNG · JPG · WEBP · max 8 Mo</div>
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Aperçu" className="w-full object-cover max-h-[220px]" />
              <button
                onClick={() => setUrl(null)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/70 hover:text-white text-[12px]"
              >
                ✕
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">TITRE / NOTE <span className="text-white/20">(optionnel)</span></div>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="ex: Miniature Hormozi — chiffre + expression choc"
              className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50" />
          </div>

          {/* Tag */}
          <div>
            <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">FORMAT</div>
            <div className="flex flex-wrap gap-2">
              {EXEMPLE_TAGS.filter(t => t !== "Tous").map(t => (
                <button key={t} onClick={() => setTag(t)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                    tag === t ? "bg-accent-cyan text-black" : "border border-line text-white/50 hover:text-white"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-line px-6 py-4">
          <button onClick={onClose}
            className="flex-1 rounded-lg border border-line py-2.5 text-[13px] text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors">
            Annuler
          </button>
          <button onClick={handleSave}
            className="flex-1 rounded-lg bg-accent-cyan py-2.5 text-[13px] font-bold text-black hover:opacity-90 transition-opacity">
            Ajouter →
          </button>
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
  const [deleteId,  setDeleteId]  = useState<number|null>(null);
  const [editId,    setEditId]    = useState<number|null>(null);
  const personaToDelete = personas.find(p => p.id === deleteId);
  const personaToEdit   = personas.find(p => p.id === editId);

  function handleDelete(id: number) {
    setPersonas(personas.filter(p => p.id !== id));
    setDeleteId(null);
    showToast("Persona supprimé", "info");
  }

  function handleSetPrimary(id: number) {
    setPersonas(personas.map(p => ({...p, primary: p.id === id})));
    showToast("Persona principal mis à jour !");
  }

  function handleAdd(p: Omit<PersonaData,"id"|"usage"|"primary">) {
    setPersonas([...personas, {...p, id: Date.now(), usage: 0, primary: false}]);
    setAddOpen(false);
    showToast(`Persona "${p.name}" créé !`);
  }

  function handleEdit(id: number, updated: Pick<PersonaData,"name"|"desc"|"expression"|"lighting">) {
    setPersonas(personas.map(p => p.id === id ? {...p, ...updated} : p));
    setEditId(null);
    showToast("Persona mis à jour !");
  }

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-widest text-white/40">{personas.length} PERSONAS DISPONIBLES</div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan px-4 py-2 text-[12px] font-bold text-black hover:shadow-[0_0_20px_rgba(52,224,255,0.3)]">
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
                <div>
                  <div className="text-[14px] font-semibold text-white/95">{p.name}</div>
                  {p.desc && <div className="mt-0.5 text-[11px] text-white/40">{p.desc}</div>}
                </div>
                {p.primary
                  ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-cyan/15 px-2 py-0.5 font-mono text-[8px] tracking-widest text-accent-cyan">
                      <span className="h-1 w-1 rounded-full bg-accent-cyan"/>PRINCIPAL
                    </span>
                  : <button onClick={() => handleSetPrimary(p.id)}
                      className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[8px] tracking-widest text-white/30 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors">
                      SET
                    </button>
                }
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                <span className="font-mono text-[9px] tracking-widest text-white/30">{p.usage}% usage</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditId(p.id)}
                    className="rounded-md border border-line bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] tracking-widest text-white/45 hover:border-line-strong hover:text-white transition-colors"
                  >
                    ÉDITER
                  </button>
                  {!p.primary && (
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="rounded-md border border-line bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] tracking-widest text-white/35 hover:border-accent-danger/40 hover:text-accent-danger transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modale ajout */}
      {addOpen && <ModaleAjoutPersona onClose={() => setAddOpen(false)} onAdd={handleAdd} />}

      {/* Modale édition */}
      {editId !== null && personaToEdit && (
        <ModaleEditerPersona
          persona={personaToEdit}
          onClose={() => setEditId(null)}
          onSave={(updated) => handleEdit(editId, updated)}
        />
      )}

      {/* Popup suppression */}
      {deleteId !== null && personaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="border-b border-line px-6 py-4">
              <div className="font-mono text-[9px] tracking-widest text-accent-danger mb-1">SUPPRIMER LE PERSONA</div>
              <div className="text-[15px] font-semibold">{personaToDelete.name}</div>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 overflow-hidden rounded-xl border border-line bg-ink-800">
                <PersonaBust expression={personaToDelete.expression} lighting={personaToDelete.lighting} shirt="#0a0a0a" className="h-[160px] w-full" />
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">
                Ce persona sera définitivement supprimé. Les miniatures existantes ne seront pas affectées.
              </p>
            </div>
            <div className="flex gap-2 border-t border-line px-6 py-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-line bg-white/[0.02] py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 rounded-lg bg-accent-danger py-2.5 text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Modale édition persona ─── */
function ModaleEditerPersona({ persona, onClose, onSave }: {
  persona: PersonaData;
  onClose: () => void;
  onSave: (updated: Pick<PersonaData,"name"|"desc"|"expression"|"lighting">) => void;
}) {
  const [name,       setName]       = useState(persona.name);
  const [desc,       setDesc]       = useState(persona.desc);
  const [expression, setExpression] = useState(persona.expression);
  const [lighting,   setLighting]   = useState(persona.lighting);

  const LIGHTINGS: Array<{id: PersonaData["lighting"]; label: string; color: string}> = [
    {id:"neutral", label:"Neutre", color:"#888"},
    {id:"warm",    label:"Chaud",  color:"#FF9A3C"},
    {id:"cool",    label:"Cool",   color:"#34E0FF"},
    {id:"red",     label:"Rouge",  color:"#EF4444"},
    {id:"yellow",  label:"Jaune",  color:"#E8FF3A"},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex w-full max-w-[640px] overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">

        {/* Preview live */}
        <div className="hidden w-[220px] shrink-0 flex-col bg-ink-900 sm:flex">
          <div className="border-b border-line px-4 py-3">
            <span className="font-mono text-[9px] tracking-widest text-white/35">APERÇU LIVE</span>
          </div>
          <div className="flex-1">
            <PersonaBust expression={expression} lighting={lighting} shirt="#0a0a0a" className="h-full w-full" />
          </div>
          <div className="border-t border-line px-4 py-3 text-center">
            <div className="text-[13px] font-semibold text-white/80">{name || "—"}</div>
            {desc && <div className="mt-0.5 text-[11px] text-white/35">{desc}</div>}
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <div className="text-[14px] font-semibold">Éditer le persona</div>
            <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">NOM</div>
              <input autoFocus value={name} onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-white outline-none focus:border-accent-cyan/50" />
            </div>

            <div>
              <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">DESCRIPTION</div>
              <input value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="32 ans · Brun · Crew-neck"
                className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50" />
            </div>

            <div>
              <div className="mb-3 font-mono text-[10px] tracking-widest text-white/40">EXPRESSION</div>
              <div className="flex flex-wrap gap-2">
                {EXPRESSIONS.map(e => (
                  <button key={e.id} onClick={() => setExpression(e.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-all ${expression === e.id ? "bg-accent-cyan text-black font-bold" : "border border-line text-white/50 hover:text-white"}`}>
                    <span>{e.emoji}</span>{e.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 font-mono text-[10px] tracking-widest text-white/40">ÉCLAIRAGE</div>
              <div className="flex flex-wrap gap-2">
                {LIGHTINGS.map(l => (
                  <button key={l.id} onClick={() => setLighting(l.id)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] transition-all ${lighting === l.id ? "bg-accent-cyan text-black font-bold" : "border border-line text-white/50 hover:text-white"}`}>
                    <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />{l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-line px-6 py-4">
            <button onClick={onClose}
              className="flex-1 rounded-lg border border-line bg-white/[0.02] py-2.5 text-[12px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors">
              Annuler
            </button>
            <button
              onClick={() => { if(!name.trim()){ showToast("Le nom ne peut pas être vide","error"); return; } onSave({name, desc, expression, lighting}); }}
              className="flex-1 rounded-lg bg-accent-cyan py-2.5 text-[12px] font-bold text-black hover:opacity-90 transition-opacity">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
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
