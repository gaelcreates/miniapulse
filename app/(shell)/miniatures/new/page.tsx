"use client";

import { useState } from "react";
import { STYLES, PERSONAS } from "@/lib/mocks/styles-personas";

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
  const [personaId, setPersonaId] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function canProceed(s: Step): boolean {
    switch (s) {
      case 1:
        return brief.trim().length > 0;
      case 2:
      case 3:
        return true;
      case 4:
        return styleId !== null;
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
            {step === 4 && <Step4Style styleId={styleId} setStyleId={setStyleId} />}
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
      <div className="mt-2 font-mono text-[11px] text-white/40">
        {brief.length} caractères · obligatoire
      </div>
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

/* ---------------- Step 4 — Style ---------------- */

function Step4Style({
  styleId,
  setStyleId,
}: {
  styleId: string | null;
  setStyleId: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-[28px] leading-tight">Choisis un style</h2>
      <p className="mt-2 text-[14px] text-white/60">
        Le style guide les codes visuels (couleurs, typo, composition).
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {STYLES.map((s) => {
          const isActive = s.id === styleId;
          return (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              className={`group rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-accent-cyan/70 bg-accent-cyan/[0.04] shadow-[0_0_0_1px_rgba(52,224,255,0.4)]"
                  : "border-line bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex gap-1">
                {s.palette.map((color, i) => (
                  <div
                    key={i}
                    className="h-10 flex-1 rounded"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="mt-3 text-[15px] font-semibold">{s.name}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-white/55">
                {s.shortDescription}
              </div>
            </button>
          );
        })}
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
  brief,
  referenceImage,
  inspirationImages,
  style,
  persona,
}: {
  brief: string;
  referenceImage: File | null;
  inspirationImages: File[];
  style: { name: string; shortDescription: string } | null;
  persona: { name: string; shortDescription: string } | null;
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
