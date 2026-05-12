"use client";

import { useState } from "react";
import { STYLES, PERSONAS } from "@/lib/mocks/styles-personas";
import { getExamplesForFormat } from "@/lib/style-examples";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type Status = "form" | "generating" | "result" | "error";

const TOTAL_STEPS = 6;
const STEP_LABELS = [
  "Description",
  "Image à intégrer",
  "Inspirations",
  "Style",
  "Persona",
  "Récap",
];

export default function NewMiniaturePage() {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>("form");

  const [brief, setBrief] = useState("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [inspirationImages, setInspirationImages] = useState<File[]>([]);
  const [styleId, setStyleId] = useState<string | null>(null);
  const [contentFormat, setContentFormat] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#34E0FF");
  const [personaId, setPersonaId] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function canProceed(s: Step): boolean {
    switch (s) {
      case 1:
        return brief.trim().split(/\s+/).filter(Boolean).length >= 30;
      case 2:
      case 3:
        return true;
      case 4:
        return contentFormat !== null && styleId !== null;
      case 5:
        return personaId !== null;
      case 6:
        return true;
    }
  }

  function handleNext() {
    if (!canProceed(step)) return;
    if (step === 6) {
      handleGenerate();
      return;
    }
    setStep((step + 1) as Step);
  }

  function handleBack() {
    if (step === 1) return;
    setStep((step - 1) as Step);
  }

  async function handleGenerate() {
    if (!styleId || !personaId) return;
    setStatus("generating");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("prompt", brief);
      formData.append("styleId", styleId);
      formData.append("contentFormat", contentFormat ?? "");
      formData.append("primaryColor", primaryColor);
      formData.append("personaId", personaId);
      if (referenceImage) {
        formData.append("referenceImage", referenceImage);
      }
      const res = await fetch("/api/miniatures/generate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue");
        setStatus("error");
      } else {
        setImageUrl(data.imageUrl);
        setStatus("result");
      }
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }

  function reset() {
    setStep(1);
    setStatus("form");
    setBrief("");
    setReferenceImage(null);
    setInspirationImages([]);
    setStyleId(null);
    setContentFormat(null);
    setPrimaryColor("#34E0FF");
    setPersonaId(null);
    setImageUrl(null);
    setError(null);
  }

  const selectedStyle = STYLES.find((s) => s.id === styleId) ?? null;
  const selectedPersona = PERSONAS.find((p) => p.id === personaId) ?? null;

  return (
    <div className="mx-auto max-w-[1100px]">
      <h1 className="font-display text-[56px] leading-[0.92] tracking-tight sm:text-[72px]">
        NOUVELLE MINIATURE
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
        Suis les étapes. L&apos;IA générera ta miniature à la fin.
      </p>

      {status === "form" && (
        <>
          <StepIndicator current={step} />

          <div className="mt-10">
            {step === 1 && <Step1Description brief={brief} setBrief={setBrief} />}
            {step === 2 && (
              <Step2ReferenceImage
                referenceImage={referenceImage}
                setReferenceImage={setReferenceImage}
              />
            )}
            {step === 3 && (
              <Step3Inspirations
                inspirationImages={inspirationImages}
                setInspirationImages={setInspirationImages}
              />
            )}
            {step === 4 && (
              <Step4Style
                styleId={styleId} setStyleId={setStyleId}
                contentFormat={contentFormat} setContentFormat={setContentFormat}
                primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
              />
            )}
            {step === 5 && (
              <Step5Persona personaId={personaId} setPersonaId={setPersonaId} />
            )}
            {step === 6 && (
              <Step6Recap
                brief={brief}
                referenceImage={referenceImage}
                inspirationImages={inspirationImages}
                style={selectedStyle}
                persona={selectedPersona}
                contentFormat={contentFormat}
                primaryColor={primaryColor}
              />
            )}
          </div>

          <NavButtons
            step={step}
            canProceed={canProceed(step)}
            onBack={handleBack}
            onNext={handleNext}
          />
        </>
      )}

      {status === "generating" && <GeneratingView />}

      {status === "result" && imageUrl && (
        <ResultView imageUrl={imageUrl} onRestart={reset} />
      )}

      {status === "error" && (
        <ErrorView error={error} onBack={() => setStatus("form")} />
      )}
    </div>
  );
}

/* ---------------- Step indicator ---------------- */

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-1">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === current;
          const isDone = stepNum < current;
          return (
            <div key={stepNum} className="flex-1">
              <div
                className={`h-[3px] rounded-full transition-colors ${
                  isActive
                    ? "bg-accent-cyan"
                    : isDone
                    ? "bg-accent-cyan/40"
                    : "bg-white/10"
                }`}
              />
              <div
                className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${
                  isActive ? "text-accent-cyan" : "text-white/40"
                }`}
              >
                {stepNum.toString().padStart(2, "0")} · {STEP_LABELS[i]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Step 1 — Description ---------------- */

function Step1Description({
  brief,
  setBrief,
}: {
  brief: string;
  setBrief: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-[28px] leading-tight">
        Décris la vidéo en détail
      </h2>
      <p className="mt-2 text-[14px] text-white/60">
        Titre exact, sujet, ton, message principal. Plus c&apos;est précis, mieux c&apos;est.
      </p>
      <label className="mt-6 block text-[12px] font-semibold uppercase tracking-wider text-white/60">
        Brief
      </label>
      <textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={10}
        placeholder="Ex : Vidéo intitulée 'Pourquoi j'ai quitté mon CDI pour entreprendre'. Ton sérieux et inspirant. Message principal : la sécurité du CDI est une illusion. Je veux un visage marquant et un gros texte en accroche."
        className="mt-2 block w-full rounded-md border border-line bg-white/[0.02] px-4 py-3 text-[14px] text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none"
      />
      {(() => {
        const words = brief.trim().split(/\s+/).filter(Boolean).length;
        const ok = words >= 30;
        return (
          <div className={`mt-2 flex items-center gap-2 font-mono text-[11px] ${ok ? "text-accent-success" : "text-white/40"}`}>
            <span>{words} / 30 mots minimum</span>
            {ok && <span>✓</span>}
            {!ok && words > 0 && <span className="text-white/30">— encore {30 - words} mot{30 - words > 1 ? "s" : ""}</span>}
          </div>
        );
      })()}
    </div>
  );
}

/* ---------------- Step 2 — Reference image ---------------- */

function Step2ReferenceImage({
  referenceImage,
  setReferenceImage,
}: {
  referenceImage: File | null;
  setReferenceImage: (v: File | null) => void;
}) {
  const previewUrl = referenceImage ? URL.createObjectURL(referenceImage) : null;

  return (
    <div>
      <h2 className="font-display text-[28px] leading-tight">
        Image à intégrer{" "}
        <span className="text-[14px] font-sans font-normal text-white/40">
          · facultatif
        </span>
      </h2>
      <p className="mt-2 text-[14px] text-white/60">
        Une image (visage, produit, objet) que tu veux retrouver dans la miniature.
        L&apos;IA l&apos;intégrera dans la composition.
      </p>
      <div className="mt-6">
        <label className="block cursor-pointer rounded-md border border-dashed border-line bg-white/[0.02] p-8 text-center transition hover:border-accent-cyan/50 hover:bg-white/[0.04]">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setReferenceImage(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
          {previewUrl ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Image de référence"
                className="mx-auto max-h-[280px] rounded"
              />
              <div className="mt-3 font-mono text-[11px] text-white/60">
                {referenceImage?.name} · clique pour changer
              </div>
            </div>
          ) : (
            <div className="text-[14px] text-white/60">
              Glisse une image ici, ou clique pour choisir
              <div className="mt-1 font-mono text-[11px] text-white/40">
                PNG · JPG · WEBP
              </div>
            </div>
          )}
        </label>
        {referenceImage && (
          <button
            onClick={() => setReferenceImage(null)}
            className="mt-3 font-mono text-[11px] text-accent-danger hover:underline"
          >
            Retirer l&apos;image
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 3 — Inspirations ---------------- */

function Step3Inspirations({
  inspirationImages,
  setInspirationImages,
}: {
  inspirationImages: File[];
  setInspirationImages: (v: File[]) => void;
}) {
  function handleAdd(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 4 - inspirationImages.length);
    setInspirationImages([...inspirationImages, ...newFiles]);
  }
  function handleRemove(idx: number) {
    setInspirationImages(inspirationImages.filter((_, i) => i !== idx));
  }
  return (
    <div>
      <h2 className="font-display text-[28px] leading-tight">
        Inspirations{" "}
        <span className="text-[14px] font-sans font-normal text-white/40">
          · facultatif
        </span>
      </h2>
      <p className="mt-2 text-[14px] text-white/60">
        Quelques miniatures qui t&apos;inspirent (jusqu&apos;à 4). Stockées pour
        référence — pas envoyées à l&apos;IA pour cette version.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {inspirationImages.map((file, idx) => (
          <div
            key={idx}
            className="group relative aspect-video overflow-hidden rounded border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(file)}
              alt={`Inspiration ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => handleRemove(idx)}
              className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white opacity-0 transition group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
        {inspirationImages.length < 4 && (
          <label className="flex aspect-video cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white/[0.02] text-[12px] text-white/40 transition hover:border-accent-cyan/50 hover:text-white/60">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(e) => handleAdd(e.target.files)}
              className="sr-only"
            />
            + Ajouter
          </label>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 4 — Style (format + couleur) ---------------- */

// ── Colour utilities ──────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    const tt = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (tt < 1/6) return p + (q - p) * 6 * tt;
    if (tt < 1/2) return q;
    if (tt < 2/3) return p + (q - p) * (2/3 - tt) * 6;
    return p;
  };
  if (s === 0) {
    const v = Math.round(ln * 255).toString(16).padStart(2, "0");
    return `#${v}${v}${v}`;
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const r = Math.round(hue2rgb(p, q, hn + 1/3) * 255).toString(16).padStart(2, "0");
  const g = Math.round(hue2rgb(p, q, hn) * 255).toString(16).padStart(2, "0");
  const b = Math.round(hue2rgb(p, q, hn - 1/3) * 255).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

function generatePalette(primary: string): string[] {
  const [h, s, l] = hexToHsl(primary);
  const bg      = hslToHex(h, Math.min(s, 25), 8);
  const accent  = hslToHex((h + 150) % 360, Math.min(s + 10, 90), Math.min(l + 10, 65));
  const surface = hslToHex(h, Math.min(s, 20), 14);
  return [bg, primary, accent, surface];
}

// ── Format types ─────────────────────────────────────────────────────────────

type ContentFormat = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  defaultStyle: string;   // maps to STYLES id
  defaultColor: string;
};

const CONTENT_FORMATS: ContentFormat[] = [
  { id:"facecam",      label:"Face cam",       emoji:"🎙", desc:"Plan serré sur le visage. Expression forte, réaction, authenticité.",             defaultStyle:"truth-bomb",        defaultColor:"#FFFFFF" },
  { id:"vlog",         label:"Vlog",            emoji:"📸", desc:"Atmosphère, lieu de vie, coulisses. Lifestyle authentique et spontané.",          defaultStyle:"soft-productivity", defaultColor:"#E8C547" },
  { id:"cinematique",  label:"Cinématique",     emoji:"🎬", desc:"Large, dramatique, haute production. Impression blockbuster.",                    defaultStyle:"red-conviction",    defaultColor:"#FF2D2D" },
  { id:"entertainment",label:"Entertainment",   emoji:"⚡", desc:"Énergie maximale, action, surprise. Émotion visible en 0,3 seconde.",             defaultStyle:"wake-up-call",      defaultColor:"#FF2D2D" },
  { id:"podcast",      label:"Podcast / Talk",  emoji:"🎤", desc:"Interview, connexion, profondeur. Format conversation deux personnes.",           defaultStyle:"truth-bomb",        defaultColor:"#FFFFFF" },
];

// ── Component ─────────────────────────────────────────────────────────────────

function Step4Style({
  styleId, setStyleId,
  contentFormat, setContentFormat,
  primaryColor, setPrimaryColor,
}: {
  styleId: string | null; setStyleId: (v: string) => void;
  contentFormat: string | null; setContentFormat: (v: string) => void;
  primaryColor: string; setPrimaryColor: (v: string) => void;
}) {
  const palette = generatePalette(primaryColor);
  const [previewFormat, setPreviewFormat] = useState<string | null>(null);

  const PRESET_COLORS = [
    { hex: "#34E0FF", label: "Cyan" },
    { hex: "#F5E632", label: "Jaune" },
    { hex: "#FF2D2D", label: "Rouge" },
    { hex: "#FFFFFF", label: "Blanc" },
    { hex: "#7BB17A", label: "Vert" },
    { hex: "#FF7A1A", label: "Orange" },
    { hex: "#B066FF", label: "Violet" },
    { hex: "#FF66A3", label: "Rose" },
  ];

  function selectFormat(fmt: ContentFormat) {
    setContentFormat(fmt.id);
    setStyleId(fmt.defaultStyle);
    setPrimaryColor(fmt.defaultColor);
  }

  return (
    <div className="space-y-10">

      {/* ── Section 1 : Format ── */}
      <div>
        <h2 className="font-display text-[28px] leading-tight">01 · Format de contenu</h2>
        <p className="mt-2 text-[14px] text-white/55">
          Quel type de vidéo ? Clique pour sélectionner — survole pour voir des exemples.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CONTENT_FORMATS.map((fmt) => {
            const isActive = contentFormat === fmt.id;
            const examples = getExamplesForFormat(fmt.id);
            const isPreviewing = previewFormat === fmt.id;

            return (
              <div key={fmt.id} className="relative">
                <button
                  onClick={() => selectFormat(fmt)}
                  onMouseEnter={() => examples.length > 0 && setPreviewFormat(fmt.id)}
                  onMouseLeave={() => setPreviewFormat(null)}
                  className={`relative flex w-full flex-col gap-2 overflow-hidden rounded-xl border text-left transition-all ${
                    isActive
                      ? "border-accent-cyan/70 bg-accent-cyan/[0.06] shadow-[0_0_0_1px_rgba(52,224,255,0.35)]"
                      : "border-line bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Exemples en fond au hover */}
                  {examples.length > 0 && isPreviewing && (
                    <div className="absolute inset-0 z-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={examples[0]}
                        alt={fmt.label}
                        className="h-full w-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 p-4">
                    <div className="flex items-start justify-between">
                      <span className="text-[24px] leading-none">{fmt.emoji}</span>
                      {examples.length > 0 && (
                        <span className="font-mono text-[8px] tracking-widest text-white/25">
                          {examples.length} ex.
                        </span>
                      )}
                    </div>
                    <span className={`mt-2 block text-[14px] font-semibold ${isActive ? "text-accent-cyan" : "text-white"}`}>
                      {fmt.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-white/45">{fmt.desc}</span>
                  </div>

                  {isActive && (
                    <span className="absolute right-2.5 top-2.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-accent-cyan text-[9px] font-bold text-black">✓</span>
                  )}
                </button>

                {/* Strip d'exemples sous la card au hover */}
                {examples.length > 1 && isPreviewing && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 flex gap-1 overflow-x-auto rounded-xl border border-line bg-ink-900/95 p-2 backdrop-blur-sm">
                    {examples.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt={`Exemple ${i + 1}`}
                        className="h-14 w-24 shrink-0 rounded-md object-cover ring-1 ring-white/10"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Exemples du format sélectionné */}
        {contentFormat && getExamplesForFormat(contentFormat).length > 0 && (
          <div className="mt-4">
            <div className="mb-2 font-mono text-[10px] tracking-widest text-white/35">
              EXEMPLES — {CONTENT_FORMATS.find(f => f.id === contentFormat)?.label?.toUpperCase()}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {getExamplesForFormat(contentFormat).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`Exemple ${i + 1}`}
                  className="h-20 w-36 shrink-0 rounded-xl object-cover ring-1 ring-white/10 transition hover:ring-accent-cyan/40"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Section 2 : Couleur primaire ── */}
      <div>
        <h2 className="font-display text-[28px] leading-tight">02 · Couleur primaire</h2>
        <p className="mt-2 text-[14px] text-white/55">
          Choisis une couleur — la palette complète se génère automatiquement.
        </p>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Presets rapides */}
          <div className="flex-1">
            <div className="mb-3 font-mono text-[10px] tracking-widest text-white/35">PRESETS RAPIDES</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setPrimaryColor(c.hex)}
                  title={c.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${
                    primaryColor.toLowerCase() === c.hex.toLowerCase()
                      ? "border-white scale-110 shadow-lg"
                      : "border-transparent"
                  }`}
                  style={{ background: c.hex }}
                >
                  {primaryColor.toLowerCase() === c.hex.toLowerCase() && (
                    <span className="text-[11px] font-bold" style={{ color: c.hex === "#FFFFFF" ? "#000" : "#000", mixBlendMode: "difference" }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom color picker */}
            <div className="mt-4">
              <div className="mb-2 font-mono text-[10px] tracking-widest text-white/35">COULEUR PERSONNALISÉE</div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 transition hover:border-accent-cyan/40">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0 outline-none"
                />
                <span className="font-mono text-[13px] uppercase text-white/70">{primaryColor}</span>
                <span className="ml-auto text-[11px] text-white/35">Cliquer pour choisir</span>
              </label>
            </div>
          </div>

          {/* Palette générée */}
          <div className="lg:w-[320px]">
            <div className="mb-3 font-mono text-[10px] tracking-widest text-white/35">PALETTE GÉNÉRÉE AUTOMATIQUEMENT</div>
            <div className="overflow-hidden rounded-xl border border-line">
              {[
                { color: palette[0], role: "Fond",     hex: palette[0] },
                { color: palette[1], role: "Primaire", hex: palette[1] },
                { color: palette[2], role: "Accent",   hex: palette[2] },
                { color: palette[3], role: "Surface",  hex: palette[3] },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-line last:border-b-0 px-4 py-2.5">
                  <div className="h-8 w-8 shrink-0 rounded-md ring-1 ring-white/10" style={{ background: row.color }} />
                  <span className="flex-1 text-[12px] text-white/70">{row.role}</span>
                  <span className="font-mono text-[11px] text-white/35">{row.hex.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Live preview mini-thumb */}
            <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/10" style={{ background: palette[0] }}>
              <div className="flex aspect-video items-center justify-center gap-3 p-4">
                <div className="font-display text-[28px] leading-none" style={{ color: palette[1] }}>50K€</div>
                <div className="font-display text-[20px] leading-none" style={{ color: palette[2] }}>→</div>
              </div>
            </div>
            <div className="mt-1 text-center font-mono text-[9px] text-white/25">APERÇU RAPIDE</div>
          </div>
        </div>

        {/* Style de base choisi automatiquement */}
        {styleId && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3">
            <span className="font-mono text-[10px] tracking-widest text-white/35">STYLE DE BASE</span>
            <span className="text-[13px] font-medium text-white/80">
              {STYLES.find(s => s.id === styleId)?.name}
            </span>
            <span className="text-[12px] text-white/40">—</span>
            <span className="text-[12px] text-white/45">
              {STYLES.find(s => s.id === styleId)?.shortDescription}
            </span>
            <button
              onClick={() => {}}
              className="ml-auto font-mono text-[9px] text-accent-cyan hover:opacity-80"
            >
              CHANGER ▾
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 5 — Persona ---------------- */

function Step5Persona({
  personaId,
  setPersonaId,
}: {
  personaId: string | null;
  setPersonaId: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-[28px] leading-tight">
        Choisis le personnage
      </h2>
      <p className="mt-2 text-[14px] text-white/60">
        Le persona qui apparaîtra dans la miniature. Obligatoire.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {PERSONAS.map((p) => {
          const isActive = p.id === personaId;
          return (
            <button
              key={p.id}
              onClick={() => setPersonaId(p.id)}
              className={`rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-accent-cyan/70 bg-accent-cyan/[0.04] shadow-[0_0_0_1px_rgba(52,224,255,0.4)]"
                  : "border-line bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="text-[15px] font-semibold">{p.name}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-white/55">
                {p.shortDescription}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Step 6 — Recap ---------------- */

function Step6Recap({
  brief, referenceImage, inspirationImages, style, persona, contentFormat, primaryColor,
}: {
  brief: string; referenceImage: File | null; inspirationImages: File[];
  style: { name: string; shortDescription: string } | null;
  persona: { name: string; shortDescription: string } | null;
  contentFormat: string | null; primaryColor: string;
}) {
  return (
    <div>
      <h2 className="font-display text-[28px] leading-tight">Récap</h2>
      <p className="mt-2 text-[14px] text-white/60">
        Vérifie. Si tout est bon, lance la génération (~30 secondes).
      </p>
      <div className="mt-6 space-y-4">
        <RecapRow label="Description">
          <div className="whitespace-pre-wrap text-[13px] text-white/85">{brief}</div>
        </RecapRow>
        <RecapRow label="Image à intégrer">
          {referenceImage ? (
            <div className="font-mono text-[12px] text-white/70">
              {referenceImage.name}
            </div>
          ) : (
            <span className="text-[12px] italic text-white/40">aucune</span>
          )}
        </RecapRow>
        <RecapRow label="Inspirations">
          {inspirationImages.length > 0 ? (
            <div className="font-mono text-[12px] text-white/70">
              {inspirationImages.length} image
              {inspirationImages.length > 1 ? "s" : ""}
            </div>
          ) : (
            <span className="text-[12px] italic text-white/40">aucune</span>
          )}
        </RecapRow>
        <RecapRow label="Format">
          <div className="flex items-center gap-2 text-[13px] text-white/85">
            <span>{CONTENT_FORMATS.find(f => f.id === contentFormat)?.emoji}</span>
            <span>{CONTENT_FORMATS.find(f => f.id === contentFormat)?.label ?? "—"}</span>
          </div>
        </RecapRow>
        <RecapRow label="Couleur">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded ring-1 ring-white/20" style={{ background: primaryColor }} />
            <span className="font-mono text-[12px] text-white/70">{primaryColor.toUpperCase()}</span>
          </div>
        </RecapRow>
        <RecapRow label="Style">
          <div className="text-[13px] text-white/85">
            {style?.name ?? "—"}
            <span className="ml-2 text-[12px] text-white/50">
              {style?.shortDescription}
            </span>
          </div>
        </RecapRow>
        <RecapRow label="Persona">
          <div className="text-[13px] text-white/85">
            {persona?.name ?? "—"}
            <span className="ml-2 text-[12px] text-white/50">
              {persona?.shortDescription}
            </span>
          </div>
        </RecapRow>
      </div>
    </div>
  );
}

function RecapRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-line pb-3">
      <div className="font-mono text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ---------------- Nav buttons ---------------- */

function NavButtons({
  step,
  canProceed,
  onBack,
  onNext,
}: {
  step: Step;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const isLast = step === 6;
  return (
    <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
      <button
        onClick={onBack}
        disabled={step === 1}
        className="font-mono text-[12px] uppercase tracking-wider text-white/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Précédent
      </button>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="inline-flex items-center gap-2 rounded-md bg-accent-cyan px-6 py-3 text-[14px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLast ? "Générer la miniature" : "Suivant →"}
      </button>
    </div>
  );
}

/* ---------------- Generating view ---------------- */

function GeneratingView() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center text-center">
      <div className="font-display text-[40px] leading-tight">
        GÉNÉRATION EN COURS
      </div>
      <div className="mt-4 font-mono text-[12px] uppercase tracking-wider text-white/60">
        ~30 secondes · OpenAI gpt-image-2
      </div>
      <div className="mt-8 h-1 w-64 overflow-hidden rounded bg-white/5">
        <div className="h-full w-1/2 animate-progress bg-accent-cyan" />
      </div>
    </div>
  );
}

/* ---------------- Result view ---------------- */

function ResultView({
  imageUrl,
  onRestart,
}: {
  imageUrl: string;
  onRestart: () => void;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-[36px] leading-tight">TA MINIATURE</h2>
      <div className="mt-6 overflow-hidden rounded-lg border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Miniature générée" className="w-full" />
      </div>
      <div className="mt-6 flex gap-3">
        <a
          href={imageUrl}
          download
          className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/[0.05]"
        >
          ⬇ Télécharger
        </a>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-md bg-accent-cyan px-4 py-2.5 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]"
        >
          Nouvelle miniature
        </button>
      </div>
    </div>
  );
}

/* ---------------- Error view ---------------- */

function ErrorView({
  error,
  onBack,
}: {
  error: string | null;
  onBack: () => void;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-[36px] leading-tight text-accent-danger">
        ÇA A PLANTÉ
      </h2>
      <pre className="mt-4 whitespace-pre-wrap rounded-md border border-accent-danger/40 bg-accent-danger/10 p-4 font-mono text-[12px] text-accent-danger">
        {error}
      </pre>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/[0.05]"
      >
        ← Retour au formulaire
      </button>
    </div>
  );
}
