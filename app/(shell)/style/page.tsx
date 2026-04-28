"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PersonaBust } from "@/app/_components/persona";
import { Thumb, STYLE_META, type StyleId } from "@/app/_components/thumbs";

const STYLE_ORDER: StyleId[] = ["yellow", "cyan", "truth", "soft", "red", "wakeup"];

const PALETTES: Record<StyleId, string[]> = {
  yellow: ["#0F0F11", "#E8FF3A", "#FF3B30", "#FFFFFF"],
  cyan: ["#0E1822", "#34E0FF", "#FF3B30", "#FFFFFF"],
  truth: ["#0E1018", "#FFFFFF", "#FF3B30", "#0E1018"],
  soft: ["#3A2614", "#F4D23A", "#22C55E", "#FFFFFF"],
  red: ["#3F0606", "#FFFFFF", "#E8FF3A", "#000000"],
  wakeup: ["#0F0814", "#FF1A1A", "#FFFFFF", "#3F0606"],
};

const META: Record<
  StyleId,
  { name: string; desc: string; uses: number; ctr: string }
> = {
  yellow: {
    name: "Bold Yellow",
    desc: "Fond sombre, jaune néon dominant, type Anton ultra. Signature MiniaPulse.",
    uses: 14,
    ctr: "+38%",
  },
  cyan: {
    name: "Tech Cyan",
    desc: "Pour SaaS / building in public. Cyan électrique, dashboard flou, sticker tampon.",
    uses: 9,
    ctr: "+29%",
  },
  truth: {
    name: "Truth Bomb",
    desc: "Mindset / vérité dérangeante. Outline blanc, mot barré rouge, vignette dramatique.",
    uses: 7,
    ctr: "+44%",
  },
  soft: {
    name: "Soft Productivity",
    desc: "Lumière chaude, posture relax, chiffre énorme jaune saturé.",
    uses: 5,
    ctr: "+22%",
  },
  red: {
    name: "Red Conviction",
    desc: "Fond rouge profond, geste passionné, accent jaune sur mot-clé d'action.",
    uses: 4,
    ctr: "+31%",
  },
  wakeup: {
    name: "Wake Up Call",
    desc: "Stratégie / défi. Rouge saturé sur fond noir, sablier, compte à rebours.",
    uses: 8,
    ctr: "+52%",
  },
};

type Tab = "styles" | "personas" | "kit" | "prompts";

function StylePageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const tab = (params.get("tab") || "styles") as Tab;

  const setTab = (t: Tab) => {
    router.replace(`/style?tab=${t}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* hero */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">
            STYLE
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Tes styles visuels et tes personas. La cohérence de chaîne, c&apos;est ce qui sépare une chaîne de 100K d&apos;une chaîne de 10K.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/[0.05]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            Tester un style
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-accent-cyan px-4 py-2.5 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nouveau style
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="border-b border-line">
        <nav className="flex items-center gap-6">
          {([
            ["styles", "Styles", "6"],
            ["personas", "Personas", "4"],
            ["kit", "Brand kit", null],
            ["prompts", "Prompts", "23"],
          ] as Array<[Tab, string, string | null]>).map(([id, label, count]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 py-3 text-[14px] transition-colors ${
                tab === id ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              {label}
              {count && <span className="font-mono text-[11px] text-white/40">{count}</span>}
              {tab === id && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] bg-accent-cyan" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {tab === "styles" && <StylesGrid />}
        {tab === "personas" && <PersonasGrid />}
        {tab === "kit" && <BrandKit />}
        {tab === "prompts" && <PromptsGrid />}
      </div>

      {tab === "styles" && (
        <section className="mt-12">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="text-[18px] font-semibold tracking-tight">
              Aperçu en situation —{" "}
              <Link href="#" className="text-accent-cyan hover:opacity-90">
                Bold Yellow
              </Link>
            </h2>
            <button className="inline-flex items-center gap-1.5 text-[13px] text-white/65 hover:text-white">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              Éditer le style
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-xl ring-1 ring-line">
              <Thumb id="yellow" hook="▶ COMMENT J'AI SIGNÉ" />
            </div>
            <div className="overflow-hidden rounded-xl ring-1 ring-line">
              <Thumb id="yellow" hook="▶ DE 0 À 50K€" />
            </div>
            <div className="overflow-hidden rounded-xl ring-1 ring-line">
              <Thumb id="yellow" hook="▶ MA MÉTHODE" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function StylePage() {
  return (
    <Suspense fallback={<div />}>
      <StylePageInner />
    </Suspense>
  );
}

/* ---------------- Styles grid ---------------- */

function StylesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {STYLE_ORDER.map((id) => {
        const meta = META[id];
        const palette = PALETTES[id];
        const isActive = id === "yellow";
        return (
          <article
            key={id}
            className={`group cursor-pointer rounded-xl border bg-ink-900 p-4 transition-all ${
              isActive
                ? "border-accent-cyan/70 shadow-[0_0_0_1px_rgba(52,224,255,0.4)]"
                : "border-line hover:border-line-strong"
            }`}
          >
            {/* palette */}
            <div className="grid grid-cols-4 gap-2.5">
              {palette.map((c, k) => (
                <div
                  key={k}
                  className="h-[60px] rounded-md ring-1 ring-white/10"
                  style={{ background: c }}
                />
              ))}
            </div>

            {/* meta */}
            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-semibold tracking-tight text-white/95">
                  {meta.name}
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                  {meta.desc}
                </p>
              </div>
              {isActive && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-success/15 px-2 py-0.5 text-[10px] tracking-widest text-accent-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-success" />
                  actif
                </span>
              )}
            </div>

            {/* footer stats */}
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] tracking-widest text-white/45">
              <span>
                <span className="text-white/85">{meta.uses}</span> utilisations
              </span>
              <span>
                <span className="text-accent-success">{meta.ctr}</span>{" "}
                <span className="text-white/40">CTR vs base</span>
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ---------------- Personas ---------------- */

function PersonasGrid() {
  const personas: Array<{
    name: string;
    desc: string;
    primary: boolean;
    expression: "intense" | "shock" | "smirk" | "calm" | "challenge";
    lighting: "neutral" | "warm" | "cool" | "red" | "yellow";
    usage: number;
  }> = [
    { name: "Marc", desc: "32 ans · Brun · Crew-neck premium", primary: true, expression: "intense", lighting: "warm", usage: 87 },
    { name: "Sarah", desc: "29 ans · Châtain clair · Pull col rond", primary: false, expression: "smirk", lighting: "cool", usage: 8 },
    { name: "Léo", desc: "26 ans · Brun · T-shirt", primary: false, expression: "challenge", lighting: "red", usage: 3 },
    { name: "Émilie", desc: "34 ans · Blonde · Blazer", primary: false, expression: "calm", lighting: "neutral", usage: 2 },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {personas.map((p) => (
        <article
          key={p.name}
          className="overflow-hidden rounded-xl border border-line bg-ink-900 transition-colors hover:border-line-strong"
        >
          <div className="aspect-[4/3] bg-ink-800">
            <PersonaBust
              expression={p.expression}
              lighting={p.lighting}
              shirt="#0a0a0a"
              className="h-full w-full"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[16px] font-semibold tracking-tight text-white/95">
                  {p.name}
                </div>
                <p className="mt-1 text-[12.5px] text-white/55">{p.desc}</p>
              </div>
              {p.primary && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] tracking-widest text-accent-cyan">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                  principal
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] tracking-widest text-white/45">
              <span>
                <span className="text-white/85">{p.usage}%</span> usage 30j
              </span>
              <button className="text-white/65 hover:text-white">Modifier →</button>
            </div>
          </div>
        </article>
      ))}

      <article className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-line bg-white/[0.01] text-center transition-colors hover:border-line-strong">
        <div className="px-6 py-10">
          <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white/[0.02] text-white/65">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="mt-3 text-[14px] font-semibold text-white/95">Ajouter un persona</div>
          <p className="mx-auto mt-1 max-w-[240px] text-[12px] text-white/50">
            3 photos suffisent. On verrouille traits, morpho, lumière en 90s.
          </p>
        </div>
      </article>
    </div>
  );
}

/* ---------------- Brand kit ---------------- */

function BrandKit() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="rounded-xl border border-line bg-ink-900 p-5 lg:col-span-7">
        <div className="font-mono text-[10px] tracking-widest text-white/45">PALETTE SIGNATURE</div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: "Ink 950", hex: "#0E0F11" },
            { name: "Cyan", hex: "#34E0FF" },
            { name: "Yellow", hex: "#E8FF3A" },
            { name: "Danger", hex: "#FF3B30" },
            { name: "Orange", hex: "#FF7A1A" },
            { name: "Warm", hex: "#FFB74D" },
            { name: "Success", hex: "#22C55E" },
            { name: "White", hex: "#FFFFFF" },
          ].map((c) => (
            <div key={c.name}>
              <div
                className="h-16 w-full rounded-md ring-1 ring-white/10"
                style={{ background: c.hex }}
              />
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[12.5px] font-medium">{c.name}</span>
                <span className="font-mono text-[10px] text-white/45">{c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-ink-900 lg:col-span-5">
        <div className="border-b border-line px-5 py-3 font-mono text-[10px] tracking-widest text-white/45">
          TYPOGRAPHIE
        </div>
        <div className="divide-y divide-line">
          <div className="px-5 py-5">
            <div className="font-mono text-[10px] tracking-widest text-white/45">DISPLAY</div>
            <div className="mt-1 font-display text-[40px] leading-none tracking-tight">
              ANTON UPPERCASE
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-widest text-white/55">
              52 / 64 / 80 / 112 PX
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="font-mono text-[10px] tracking-widest text-white/45">UI</div>
            <div className="mt-1 text-[24px] leading-tight">Inter Tight Regular</div>
            <div className="mt-2 font-mono text-[11px] tracking-widest text-white/55">
              13 / 14 / 16 / 18 PX
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="font-mono text-[10px] tracking-widest text-white/45">DATA · CODE</div>
            <div className="mt-1 font-mono text-[18px] tracking-widest text-white/85">
              JetBrainsMono · 0xCTR
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-widest text-white/55">
              10 / 11 / 12 PX
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-ink-900 lg:col-span-12">
        <div className="border-b border-line px-5 py-3 font-mono text-[10px] tracking-widest text-white/45">
          CODES VISUELS — NON NÉGOCIABLES
        </div>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Contraste extrême", "Fond sombre + sujet lumineux. Jamais de zone molle."],
            ["Hiérarchie 0.5s", "Un seul focal point. 5-7 mots max. Une émotion."],
            ["Expressions fortes", "Choc · intensité · conviction. Jamais de sourire."],
            ["Typo percutante", "Anton ultra. MAJUSCULES. Un mot en valeur."],
            ["Palette tranchée", "Noir + 1 accent. Pas de dégradés mous."],
            ["Éléments graphiques", "Cercles rouges · flèches · stickers."],
          ].map(([t, d]) => (
            <div key={t} className="bg-ink-900 p-5">
              <div className="text-[14px] font-semibold tracking-tight">{t}</div>
              <p className="mt-1 text-[12.5px] text-white/55">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Prompts ---------------- */

function PromptsGrid() {
  const prompts = [
    { title: "Coaching · résultat chiffré", uses: 28, ctr: "+38%", style: "yellow" as StyleId },
    { title: "SaaS · MRR + dashboard flou", uses: 19, ctr: "+29%", style: "cyan" as StyleId },
    { title: "Mindset · vérité crue barrée", uses: 24, ctr: "+44%", style: "truth" as StyleId },
    { title: "Productivité · chiffre + chaud", uses: 11, ctr: "+22%", style: "soft" as StyleId },
    { title: "Ventes · ultimatum rouge", uses: 16, ctr: "+31%", style: "red" as StyleId },
    { title: "Stratégie · compte à rebours", uses: 9, ctr: "+52%", style: "wakeup" as StyleId },
  ];
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-line md:grid-cols-2 xl:grid-cols-3">
      {prompts.map((p) => {
        const meta = STYLE_META[p.style];
        return (
          <div key={p.title} className="bg-ink-900 p-5 transition-colors hover:bg-ink-800">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 h-9 w-9 shrink-0 rounded-md ring-1 ring-white/10"
                style={{ background: `linear-gradient(135deg, ${meta.swatch} 0%, #000 130%)` }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium text-white/95">{p.title}</div>
                <div className="mt-1 font-mono text-[10px] tracking-widest text-white/45">
                  {meta.name.toUpperCase()} · {p.uses} GÉNÉRATIONS · CTR{" "}
                  <span className="text-accent-success">{p.ctr}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 line-clamp-2 rounded bg-white/[0.03] px-3 py-2 font-mono text-[11px] leading-relaxed text-white/55">
              persona:marc · style:{p.style} · headline:&quot;{`{{accroche}}`}&quot; · accent:{meta.swatch}
            </p>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-md border border-line bg-white/[0.02] py-2 font-mono text-[10px] tracking-widest text-white/70 hover:bg-white/[0.05]">
                DUPLIQUER
              </button>
              <button className="flex-1 rounded-md bg-white/[0.06] py-2 font-mono text-[10px] tracking-widest text-white hover:bg-white/[0.1]">
                UTILISER
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
