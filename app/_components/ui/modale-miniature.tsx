"use client";

import { useState, useEffect } from "react";
import { Thumb, STYLE_META, type StyleId } from "@/app/_components/thumbs";
import { showToast } from "./toast";

const STYLES: StyleId[] = ["yellow", "cyan", "truth", "soft", "red", "wakeup"];

type Step = 1 | 2 | 3;

let _open: (() => void) | null = null;
export function openModaleMiniature() { _open?.(); }

export function ModaleMiniature() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [style, setStyle] = useState<StyleId>("yellow");
  const [hook, setHook] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    _open = () => { setOpen(true); setStep(1); setHook(""); setDone(false); };
    return () => { _open = null; };
  }, []);

  // ESC to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (open) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setTimeout(() => { setStep(1); setDone(false); setLoading(false); }, 300);
  }

  function handleGenerate() {
    if (!hook.trim()) { showToast("Écris ton hook d'abord", "error"); return; }
    setStep(3);
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2200);
  }

  function handleSave() {
    showToast("Miniature enregistrée dans ta galerie !");
    handleClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative flex w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-line bg-ink-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <div className="text-[15px] font-semibold">Nouvelle miniature</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-widest text-white/45">
              ÉTAPE {step} / 3 —{" "}
              {step === 1 && "CHOISIR LE STYLE"}
              {step === 2 && "HOOK & TEXTE"}
              {step === 3 && "GÉNÉRATION"}
            </div>
          </div>
          <button onClick={handleClose} className="text-white/45 hover:text-white text-lg">✕</button>
        </div>

        {/* Steps indicator */}
        <div className="flex h-[2px] bg-ink-800">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-colors duration-300 ${s <= step ? "bg-accent-cyan" : ""}`}
            />
          ))}
        </div>

        <div className="overflow-y-auto p-6">
          {/* STEP 1 — Style */}
          {step === 1 && (
            <div>
              <p className="mb-5 text-[13px] text-white/55">
                Quel style pour cette miniature ?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                      style === s ? "border-accent-cyan" : "border-line hover:border-white/20"
                    }`}
                  >
                    <Thumb id={s} />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-4">
                      <div className="text-[11px] font-semibold text-white">
                        {STYLE_META[s].name}
                      </div>
                    </div>
                    {style === s && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-cyan text-black text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Hook */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-mono text-[10px] tracking-[0.18em] text-white/45">
                  TON HOOK (TITRE VIDÉO)
                </label>
                <input
                  autoFocus
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="ex: Comment j'ai signé 50K€ en 90 jours"
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.05]"
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-line">
                <Thumb id={style} hook={hook || undefined} />
              </div>
              <p className="text-[12px] text-white/40">
                Style sélectionné :{" "}
                <span className="text-accent-cyan">{STYLE_META[style].name}</span>
              </p>
            </div>
          )}

          {/* STEP 3 — Generate */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-6 py-4">
              {loading ? (
                <>
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan" />
                    <div className="absolute inset-3 animate-pulse rounded-full bg-accent-cyan/10" />
                  </div>
                  <div className="text-center">
                    <div className="text-[15px] font-semibold">Génération en cours…</div>
                    <div className="mt-1 font-mono text-[11px] tracking-widest text-white/45">
                      MODÈLE EN TRAIN DE TRAVAILLER
                    </div>
                  </div>
                </>
              ) : done ? (
                <>
                  <div className="w-full overflow-hidden rounded-xl border border-line shadow-2xl">
                    <Thumb id={style} hook={hook || undefined} />
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-accent-success">
                    <span>✓</span>
                    <span>Miniature générée avec succès</span>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button
            onClick={step === 1 ? handleClose : () => setStep((s) => (s - 1) as Step)}
            className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[13px] text-white/70 hover:bg-white/[0.05]"
          >
            {step === 1 ? "Annuler" : "← Retour"}
          </button>

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="rounded-lg bg-accent-cyan px-5 py-2 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]"
            >
              Suivant →
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handleGenerate}
              className="rounded-lg bg-accent-cyan px-5 py-2 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]"
            >
              Générer ✦
            </button>
          )}
          {step === 3 && done && (
            <button
              onClick={handleSave}
              className="rounded-lg bg-accent-cyan px-5 py-2 text-[13px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]"
            >
              Enregistrer ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
