"use client";

import { useState } from "react";
import { showToast } from "@/app/_components/ui/toast";

/* ─── Types ─── */
type Member = { id: number; name: string; email: string; role: "Owner" | "Editor" | "Viewer"; initials: string; color: string };

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "Marc Lefèvre",  email: "trustmedia.fr@gmail.com", role: "Owner",  initials: "MC", color: "bg-accent-cyan"   },
  { id: 2, name: "Sarah Dubois",  email: "sarah@studio.fr",         role: "Editor", initials: "SD", color: "bg-accent-yellow" },
  { id: 3, name: "Léo Martin",    email: "leo@studio.fr",           role: "Viewer", initials: "LM", color: "bg-accent-orange" },
];

/* ═══ PAGE ═══ */

export default function ParametresPage() {
  /* Apparence */
  const [darkMode,    setDarkMode]    = useState(true);
  const [reducedAnim, setReducedAnim] = useState(false);
  const [compact,     setCompact]     = useState(false);

  /* Notifications */
  const [notifPub,  setNotifPub]  = useState(true);
  const [notifCtr,  setNotifCtr]  = useState(true);
  const [notifAb,   setNotifAb]   = useState(true);
  const [notifReco, setNotifReco] = useState(false);

  /* YouTube */
  const [syncFreq, setSyncFreq] = useState("4h");

  /* Équipe */
  const [members, setMembers]       = useState<Member[]>(INITIAL_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOpen,  setInviteOpen]  = useState(false);
  const [memberMenu,  setMemberMenu]  = useState<number | null>(null);

  /* ── Handlers ── */
  function saveSection(section: string) {
    showToast(`${section} sauvegardé !`);
  }

  function handleSyncChange(v: string) {
    setSyncFreq(v);
    showToast(`Sync réglée sur "${SYNC_LABELS[v]}"`, "info");
  }

  function handleInvite() {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      showToast("Adresse email invalide", "error"); return;
    }
    const initials = inviteEmail.slice(0, 2).toUpperCase();
    const colors = ["bg-accent-cyan", "bg-accent-yellow", "bg-accent-orange", "bg-accent-success"];
    setMembers(p => [...p, {
      id: Date.now(), name: inviteEmail.split("@")[0], email: inviteEmail,
      role: "Editor", initials, color: colors[p.length % colors.length],
    }]);
    setInviteEmail(""); setInviteOpen(false);
    showToast("Invitation envoyée !");
  }

  function handleRemoveMember(id: number) {
    setMembers(p => p.filter(m => m.id !== id));
    setMemberMenu(null);
    showToast("Membre retiré", "info");
  }

  function handleChangeRole(id: number, role: Member["role"]) {
    setMembers(p => p.map(m => m.id === id ? { ...m, role } : m));
    setMemberMenu(null);
    showToast("Rôle mis à jour !");
  }

  const SYNC_LABELS: Record<string, string> = {
    "1h": "toutes les heures", "4h": "toutes les 4h",
    "24h": "une fois par jour", "manual": "manuel",
  };

  return (
    <div className="mx-auto max-w-[1100px]" onClick={() => setMemberMenu(null)}>
      <div className="mb-10">
        <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">PARAMÈTRES</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
          Apparence, notifications, sync YouTube. Tout ce qui ne devrait pas te déranger pendant que tu produis.
        </p>
      </div>

      <div className="space-y-5">

        {/* ── Apparence ── */}
        <Section title="Apparence">
          <Toggle label="Thème sombre" desc="Actif partout. Le mode clair arrive prochainement." value={darkMode} onChange={setDarkMode} />
          <Toggle label="Animations réduites" desc="Désactive les transitions et effets de mouvement." value={reducedAnim} onChange={setReducedAnim} />
          <Toggle label="Densité compacte" desc="Plus de données par écran, moins d'espacement." value={compact} onChange={setCompact} />
          <SectionFooter onSave={() => saveSection("Apparence")} />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          <Toggle label="Miniature publiée" desc="Email + in-app à chaque publication détectée." value={notifPub} onChange={setNotifPub} />
          <Toggle label="Pic de CTR" desc="Quand une miniature dépasse +60% vs ta baseline." value={notifCtr} onChange={setNotifCtr} />
          <Toggle label="Alertes A/B" desc="Résultats de tes tests au seuil de significativité." value={notifAb} onChange={setNotifAb} />
          <Toggle label="Recos IA hebdo" desc="Email du lundi matin avec 3 actions prioritaires." value={notifReco} onChange={setNotifReco} />
          <SectionFooter onSave={() => saveSection("Notifications")} />
        </Section>

        {/* ── YouTube ── */}
        <Section title="Sync YouTube Studio">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="text-[14px] text-white/90">Fréquence de synchronisation</div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-white/40">CTR ET IMPRESSIONS REMONTÉS DEPUIS YT STUDIO</div>
            </div>
            <select
              value={syncFreq}
              onChange={e => handleSyncChange(e.target.value)}
              className="rounded-lg border border-line bg-ink-800 px-3 py-2 font-mono text-[11px] tracking-widest text-white/80 outline-none focus:border-accent-cyan/50 cursor-pointer"
            >
              <option value="1h">TOUTES LES HEURES</option>
              <option value="4h">TOUTES LES 4H</option>
              <option value="24h">UNE FOIS PAR JOUR</option>
              <option value="manual">MANUEL</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-5 pb-4 font-mono text-[10px] tracking-widest text-white/40">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-success animate-pulse" />
            DERNIÈRE SYNC IL Y A 4 MIN · 89 VIDÉOS · 4 NOUVELLES IMPRESSIONS
          </div>
        </Section>

        {/* ── Équipe ── */}
        <Section title="Équipe" subtitle={`${members.length} membres sur 5 — Plan Studio`}>
          {members.map(m => (
            <div key={m.id} className="relative flex items-center gap-4 px-5 py-3.5">
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.color} font-semibold text-[11px] text-black`}>
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-white/90">{m.name}</div>
                <div className="font-mono text-[10px] tracking-widest text-white/40">{m.email}</div>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] tracking-widest ${
                m.role === "Owner"
                  ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                  : m.role === "Editor"
                  ? "border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow"
                  : "border-line bg-white/[0.02] text-white/50"
              }`}>
                {m.role.toUpperCase()}
              </span>
              {m.role !== "Owner" && (
                <div className="relative">
                  <button
                    onClick={e => { e.stopPropagation(); setMemberMenu(memberMenu === m.id ? null : m.id); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-white/35 hover:border-line-strong hover:text-white transition-colors"
                  >
                    ⋯
                  </button>
                  {memberMenu === m.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-line bg-ink-900 shadow-2xl" onClick={e => e.stopPropagation()}>
                      {(["Editor","Viewer"] as Member["role"][]).filter(r => r !== m.role).map(role => (
                        <button key={role} onClick={() => handleChangeRole(m.id, role)} className="flex w-full items-center px-4 py-2.5 text-left text-[12px] text-white/70 hover:bg-white/[0.04] hover:text-white">
                          Passer {role}
                        </button>
                      ))}
                      <button onClick={() => handleRemoveMember(m.id)} className="flex w-full items-center border-t border-line px-4 py-2.5 text-left text-[12px] text-accent-danger hover:bg-accent-danger/[0.06]">
                        Retirer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Invite form */}
          {members.length < 5 && (
            <div className="border-t border-line px-5 py-4">
              {inviteOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleInvite()}
                    placeholder="email@exemple.com"
                    className="flex-1 rounded-lg border border-line bg-white/[0.03] px-3 py-2 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-accent-cyan/50"
                  />
                  <button onClick={handleInvite} className="rounded-lg bg-accent-cyan px-4 py-2 text-[12px] font-semibold text-black hover:opacity-90">
                    Inviter
                  </button>
                  <button onClick={() => { setInviteOpen(false); setInviteEmail(""); }} className="rounded-lg border border-line px-3 py-2 text-[12px] text-white/50 hover:text-white">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setInviteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-white/60 hover:border-line-strong hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                    <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Inviter un collaborateur
                </button>
              )}
            </div>
          )}
        </Section>

        {/* ── Zone dangereuse ── */}
        <Section title="Zone dangereuse" tone="danger">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="text-[14px] text-white/90">Exporter toutes mes données</div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-white/45">ZIP · MINIATURES + ANALYTICS + PERSONAS</div>
            </div>
            <button
              onClick={() => { showToast("Export en cours…", "info"); setTimeout(() => showToast("miniapulse_data.zip téléchargé !"), 2000); }}
              className="rounded-lg border border-line bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Exporter
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
            <div>
              <div className="text-[14px] text-white/90">Supprimer mon compte</div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-accent-danger/70">IRRÉVERSIBLE · 7 JOURS DE GRÂCE</div>
            </div>
            <button
              onClick={() => showToast("Contacte support@miniapulse.app pour supprimer ton compte", "error")}
              className="rounded-lg border border-accent-danger/40 bg-accent-danger/[0.08] px-4 py-2 text-[12px] font-medium text-accent-danger hover:bg-accent-danger/[0.14] transition-colors"
            >
              Supprimer
            </button>
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, subtitle, tone = "default", children }: {
  title: string; subtitle?: string; tone?: "default" | "danger"; children: React.ReactNode;
}) {
  return (
    <section className={`overflow-hidden rounded-xl border bg-ink-900 ${tone === "danger" ? "border-accent-danger/25" : "border-line"}`}>
      <div className="border-b border-line px-5 py-4">
        <div className="text-[14px] font-semibold">{title}</div>
        {subtitle && <div className="mt-0.5 text-[12px] text-white/40">{subtitle}</div>}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </section>
  );
}

/* ─── Section footer with save ─── */
function SectionFooter({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end px-5 py-3">
      <button
        onClick={onSave}
        className="rounded-lg bg-accent-cyan px-4 py-1.5 text-[12px] font-semibold text-black hover:opacity-90 transition-opacity"
      >
        Sauvegarder
      </button>
    </div>
  );
}

/* ─── Toggle ─── */
function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <div>
        <div className="text-[14px] text-white/90">{label}</div>
        <div className="mt-0.5 text-[12px] text-white/45">{desc}</div>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none ${
          value ? "border-accent-cyan bg-accent-cyan" : "border-white/15 bg-white/[0.06]"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            value ? "translate-x-[18px]" : "translate-x-[1px]"
          }`}
        />
      </button>
    </div>
  );
}
