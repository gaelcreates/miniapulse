"use client";

import { useState } from "react";

export default function ParametresPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-10">
        <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">
          PARAMÈTRES
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
          Apparence, notifications, sync YouTube. Tout ce qui ne devrait pas te déranger pendant que tu produis.
        </p>
      </div>

      <div className="space-y-6">
        <Section title="Apparence">
          <Toggle label="Thème sombre" desc="Appliqué partout. Le mode clair débarque en mai." defaultOn />
          <Toggle label="Animations réduites" desc="Désactive les transitions sur la page." />
          <Toggle label="Densité compacte" desc="Plus de données par écran. Moins d'espace blanc." />
        </Section>

        <Section title="Notifications">
          <Toggle label="Miniature publiée" desc="Email + in-app à chaque publication détectée." defaultOn />
          <Toggle label="Pic de CTR" desc="Quand une miniature dépasse +60% vs baseline." defaultOn />
          <Toggle label="Alertes A/B" desc="Résultats des tests au seuil de significativité." defaultOn />
          <Toggle label="Recos IA hebdo" desc="Email du lundi matin avec 3 actions." />
        </Section>

        <Section title="Sync YouTube Studio">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="text-[14px] text-white/95">Fréquence de synchronisation</div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-white/55">
                CTR ET IMPRESSIONS REMONTÉS DEPUIS YT
              </div>
            </div>
            <select
              defaultValue="4h"
              className="rounded-md border border-line bg-white/[0.02] px-3 py-2 font-mono text-[12px] tracking-widest text-white/85 outline-none focus:border-accent-cyan/50"
            >
              <option value="1h">TOUTES LES HEURES</option>
              <option value="4h">TOUTES LES 4H</option>
              <option value="24h">UNE FOIS PAR JOUR</option>
              <option value="manual">MANUEL</option>
            </select>
          </div>
          <div className="px-5 pb-5 font-mono text-[10px] tracking-widest text-white/45">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent-success align-middle animate-pulse-dot" />
            DERNIÈRE SYNC IL Y A 4 MIN · 89 VIDÉOS · 4 NOUVELLES IMPRESSIONS
          </div>
        </Section>

        <Section title="Équipe" subtitle="3 membres sur 5 — plan Studio">
          <Member name="Marc Lefèvre" email="trustmedia.fr@gmail.com" role="Owner" initials="MC" color="bg-accent-cyan" />
          <Member name="Sarah Dubois" email="sarah@studio.fr" role="Editor" initials="SD" color="bg-accent-yellow" />
          <Member name="Léo Martin" email="leo@studio.fr" role="Viewer" initials="LM" color="bg-accent-orange" />
          <div className="px-5 py-3">
            <button className="rounded-md border border-line bg-white/[0.02] px-3 py-2 font-mono text-[10px] tracking-widest text-white/70 hover:bg-white/[0.05]">
              + INVITER UN COLLABORATEUR
            </button>
          </div>
        </Section>

        <Section title="Zone dangereuse" tone="danger">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="text-[14px] text-white/95">Exporter toutes mes données</div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-white/55">
                ZIP · MINIATURES + PROMPTS + ANALYTICS
              </div>
            </div>
            <button className="rounded-md border border-line bg-white/[0.02] px-3 py-2 text-[12px] text-white/70 hover:bg-white/[0.05]">
              Exporter
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
            <div>
              <div className="text-[14px] text-white/95">Supprimer mon compte</div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-accent-danger/80">
                IRRÉVERSIBLE · 7 JOURS DE GRÂCE
              </div>
            </div>
            <button className="rounded-md border border-accent-danger/40 bg-accent-danger/10 px-3 py-2 text-[12px] text-accent-danger hover:bg-accent-danger/15">
              Supprimer
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  tone = "default",
  children,
}: {
  title: string;
  subtitle?: string;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-ink-900 ${
        tone === "danger" ? "border-accent-danger/30" : "border-line"
      }`}
    >
      <div className="border-b border-line px-5 py-4">
        <div className="text-[14px] font-semibold">{title}</div>
        {subtitle && (
          <div className="mt-0.5 text-[12.5px] text-white/45">{subtitle}</div>
        )}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  desc,
  defaultOn,
}: {
  label: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <div className="text-[14px] text-white/95">{label}</div>
        <div className="mt-0.5 text-[12.5px] text-white/55">{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          on ? "bg-accent-cyan" : "bg-white/[0.08]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Member({
  name,
  email,
  role,
  initials,
  color,
}: {
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color} font-semibold text-[12px] text-black`}
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-white/95">{name}</div>
        <div className="font-mono text-[11px] tracking-widest text-white/45">
          {email.toUpperCase()}
        </div>
      </div>
      <span
        className={`rounded-full border px-2 py-0.5 text-[10px] tracking-widest ${
          role === "Owner"
            ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
            : "border-line bg-white/[0.02] text-white/65"
        }`}
      >
        {role.toUpperCase()}
      </span>
      <button className="font-mono text-[11px] text-white/45 hover:text-white">⋯</button>
    </div>
  );
}
