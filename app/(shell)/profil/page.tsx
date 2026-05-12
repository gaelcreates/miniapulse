"use client";

import { useState, useRef } from "react";
import { showToast } from "@/app/_components/ui/toast";

const INITIAL = {
  nom:      "Marc Lefèvre",
  email:    "trustmedia.fr@gmail.com",
  youtube:  "@marclefevre",
  niche:    "Mindset · Coaching",
  langue:   "fr",
  fuseau:   "Europe/Paris",
};

const LANGUES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
];

const FUSEAUX = [
  "Europe/Paris", "Europe/London", "America/New_York",
  "America/Chicago", "America/Los_Angeles", "Asia/Tokyo",
  "Asia/Dubai", "Africa/Casablanca",
];

const NICHES = [
  "Mindset · Coaching", "SaaS / Tech", "Infopreneur",
  "Sport / Fitness", "Lifestyle", "Finance", "Entertainment", "Autre",
];

function getInitials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

export default function ProfilPage() {
  /* Form state */
  const [nom,     setNom]     = useState(INITIAL.nom);
  const [email,   setEmail]   = useState(INITIAL.email);
  const [youtube, setYoutube] = useState(INITIAL.youtube);
  const [niche,   setNiche]   = useState(INITIAL.niche);
  const [langue,  setLangue]  = useState(INITIAL.langue);
  const [fuseau,  setFuseau]  = useState(INITIAL.fuseau);

  /* Avatar */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Password */
  const [pwOpen,   setPwOpen]   = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew,    setPwNew]    = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  /* YouTube */
  const [ytConnected, setYtConnected] = useState(true);
  const [ytDisconnecting, setYtDisconnecting] = useState(false);

  /* Dirty tracking */
  const isDirty =
    nom !== INITIAL.nom || email !== INITIAL.email || youtube !== INITIAL.youtube ||
    niche !== INITIAL.niche || langue !== INITIAL.langue || fuseau !== INITIAL.fuseau || !!avatarUrl;

  function handleSave() {
    if (!nom.trim()) { showToast("Le nom ne peut pas être vide", "error"); return; }
    if (!email.includes("@")) { showToast("Email invalide", "error"); return; }
    showToast("Profil mis à jour !");
  }

  function handleCancel() {
    setNom(INITIAL.nom); setEmail(INITIAL.email); setYoutube(INITIAL.youtube);
    setNiche(INITIAL.niche); setLangue(INITIAL.langue); setFuseau(INITIAL.fuseau);
    setAvatarUrl(null);
    showToast("Modifications annulées", "info");
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image trop lourde (max 5 Mo)", "error"); return; }
    setAvatarUrl(URL.createObjectURL(file));
    showToast("Photo mise à jour — clique Enregistrer pour sauvegarder");
  }

  function handlePasswordSave() {
    if (!pwCurrent) { showToast("Saisis ton mot de passe actuel", "error"); return; }
    if (pwNew.length < 8) { showToast("Minimum 8 caractères", "error"); return; }
    if (pwNew !== pwConfirm) { showToast("Les mots de passe ne correspondent pas", "error"); return; }
    showToast("Mot de passe mis à jour !");
    setPwOpen(false); setPwCurrent(""); setPwNew(""); setPwConfirm("");
  }

  function handleYtDisconnect() {
    setYtDisconnecting(true);
    setTimeout(() => { setYtConnected(false); setYtDisconnecting(false); showToast("Chaîne YouTube déconnectée", "info"); }, 1200);
  }

  function handleYtConnect() {
    setTimeout(() => { setYtConnected(true); showToast("Chaîne YouTube reconnectée !"); }, 800);
  }

  const initials = getInitials(nom);

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-10">
        <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">PROFIL</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/55">
          Identité, chaîne YouTube, sécurité. Tout ce qui te suit dans le studio.
        </p>
      </div>

      {/* ── Infos principales ── */}
      <section className="rounded-xl border border-line bg-ink-900 p-6">

        {/* Avatar + identité */}
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            <button
              onClick={() => fileRef.current?.click()}
              className="group relative inline-flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-accent-cyan font-semibold text-[28px] text-black ring-2 ring-transparent hover:ring-accent-cyan/50 transition-all"
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                : <span>{initials}</span>
              }
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 16 16" className="h-5 w-5 text-white" fill="none">
                  <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatar} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[22px] font-semibold tracking-tight truncate">{nom || "—"}</div>
            <div className="mt-0.5 font-mono text-[11px] tracking-widest text-white/45 truncate">{email} · MEMBRE DEPUIS NOV 2025</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2.5 py-1 text-[10px] tracking-widest text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />PLAN STUDIO
              </span>
              <span className="inline-flex items-center rounded-full border border-line bg-white/[0.02] px-2.5 py-1 text-[10px] tracking-widest text-white/55">
                {LANGUES.find(l => l.value === langue)?.label} · {fuseau}
              </span>
              {ytConnected && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-success/15 px-2.5 py-1 text-[10px] tracking-widest text-accent-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-success" />YT SYNC ACTIF
                </span>
              )}
            </div>
          </div>

          {isDirty && (
            <span className="shrink-0 rounded-full bg-accent-yellow/15 px-3 py-1 font-mono text-[9px] tracking-widest text-accent-yellow">
              MODIFIÉ
            </span>
          )}
        </div>

        {/* Fields */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nom complet" value={nom} onChange={setNom} placeholder="Ton nom affiché" />
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="ton@email.com" />
          <Field label="Pseudo YouTube" value={youtube} onChange={setYoutube} placeholder="@tonchannel" />

          {/* Niche — select */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/40">NICHE PRINCIPALE</div>
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-[14px] text-white outline-none focus:border-accent-cyan/50 focus:bg-white/[0.03] cursor-pointer"
            >
              {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Langue — select */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/40">LANGUE</div>
            <select
              value={langue}
              onChange={e => setLangue(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-[14px] text-white outline-none focus:border-accent-cyan/50 focus:bg-white/[0.03] cursor-pointer"
            >
              {LANGUES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          {/* Fuseau — select */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/40">FUSEAU HORAIRE</div>
            <select
              value={fuseau}
              onChange={e => setFuseau(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-[14px] text-white outline-none focus:border-accent-cyan/50 focus:bg-white/[0.03] cursor-pointer"
            >
              {FUSEAUX.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button
            onClick={() => setPwOpen(o => !o)}
            className="font-mono text-[11px] tracking-widest text-white/40 hover:text-accent-cyan transition-colors"
          >
            {pwOpen ? "FERMER ×" : "CHANGER LE MOT DE PASSE"}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={!isDirty}
              className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-white/60 hover:bg-white/[0.04] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Enregistrer
            </button>
          </div>
        </div>

        {/* Change password panel */}
        {pwOpen && (
          <div className="mt-5 rounded-xl border border-line bg-white/[0.02] p-5 space-y-3">
            <div className="font-mono text-[10px] tracking-widest text-white/40 mb-4">CHANGER LE MOT DE PASSE</div>
            <Field label="Mot de passe actuel" value={pwCurrent} onChange={setPwCurrent} type="password" placeholder="••••••••" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nouveau mot de passe" value={pwNew} onChange={setPwNew} type="password" placeholder="8 caractères min." />
              <Field label="Confirmer" value={pwConfirm} onChange={setPwConfirm} type="password" placeholder="••••••••" />
            </div>
            {pwNew && pwConfirm && pwNew !== pwConfirm && (
              <div className="font-mono text-[10px] text-accent-danger">Les mots de passe ne correspondent pas</div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setPwOpen(false)} className="rounded-lg border border-line px-4 py-2 text-[12px] text-white/50 hover:text-white transition-colors">Annuler</button>
              <button onClick={handlePasswordSave} className="rounded-lg bg-accent-cyan px-5 py-2 text-[12px] font-bold text-black hover:opacity-90">Mettre à jour</button>
            </div>
          </div>
        )}
      </section>

      {/* ── YouTube ── */}
      <section className="mt-5 rounded-xl border border-line bg-ink-900">
        <div className="border-b border-line px-6 py-4">
          <div className="text-[14px] font-semibold">Chaîne YouTube</div>
          <div className="mt-0.5 text-[12px] text-white/40">
            {ytConnected ? "Sync auto · CTR remonté toutes les 4h" : "Non connectée — les stats CTR ne seront pas disponibles"}
          </div>
        </div>

        {ytConnected ? (
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-danger/20 text-accent-danger">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M21.6 7.2C21.4 6.4 20.7 5.7 19.9 5.5C18.4 5 12 5 12 5S5.6 5 4.1 5.5C3.3 5.7 2.6 6.4 2.4 7.2C2 8.7 2 12 2 12S2 15.3 2.4 16.8C2.6 17.6 3.3 18.3 4.1 18.5C5.6 19 12 19 12 19S18.4 19 19.9 18.5C20.7 18.3 21.4 17.6 21.6 16.8C22 15.3 22 12 22 12S22 8.7 21.6 7.2ZM10 15V9L15 12L10 15Z"/>
                </svg>
              </span>
              <div>
                <div className="text-[15px] font-semibold">{youtube}</div>
                <div className="font-mono text-[10px] tracking-widest text-white/45">42.3K ABONNÉS · 89 VIDÉOS</div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-accent-success/15 px-2.5 py-1 font-mono text-[9px] tracking-widest text-accent-success">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-success animate-pulse" />SYNC
              </span>
            </div>
            <button
              onClick={handleYtDisconnect}
              disabled={ytDisconnecting}
              className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-white/55 hover:border-accent-danger/40 hover:text-accent-danger disabled:opacity-40 transition-colors"
            >
              {ytDisconnecting ? "Déconnexion…" : "Déconnecter"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="text-[14px] text-white/50">Aucune chaîne connectée</div>
            <button
              onClick={handleYtConnect}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-danger px-4 py-2 text-[12px] font-bold text-white hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M21.6 7.2C21.4 6.4 20.7 5.7 19.9 5.5C18.4 5 12 5 12 5S5.6 5 4.1 5.5C3.3 5.7 2.6 6.4 2.4 7.2C2 8.7 2 12 2 12S2 15.3 2.4 16.8C2.6 17.6 3.3 18.3 4.1 18.5C5.6 19 12 19 12 19S18.4 19 19.9 18.5C20.7 18.3 21.4 17.6 21.6 16.8C22 15.3 22 12 22 12S22 8.7 21.6 7.2ZM10 15V9L15 12L10 15Z"/>
              </svg>
              Connecter YouTube
            </button>
          </div>
        )}
      </section>

      {/* ── Danger ── */}
      <section className="mt-5 rounded-xl border border-accent-danger/20 bg-ink-900">
        <div className="border-b border-line px-6 py-4">
          <div className="text-[14px] font-semibold">Zone dangereuse</div>
        </div>
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="text-[13px] text-white/80">Supprimer mon compte</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-widest text-accent-danger/60">IRRÉVERSIBLE · 7 JOURS DE GRÂCE</div>
          </div>
          <button
            onClick={() => showToast("Contacte support@miniapulse.app pour supprimer ton compte", "error")}
            className="rounded-lg border border-accent-danger/40 bg-accent-danger/[0.08] px-4 py-2 text-[12px] font-medium text-accent-danger hover:bg-accent-danger/[0.14] transition-colors"
          >
            Supprimer le compte
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── Field ─── */
function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.18em] text-white/40">{label.toUpperCase()}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.03] transition-colors"
      />
    </div>
  );
}
