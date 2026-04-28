export default function ProfilPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-10">
        <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">
          PROFIL
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
          Identité, chaîne YouTube, langue. Tout ce qui te suit dans le studio.
        </p>
      </div>

      <section className="rounded-xl border border-line bg-ink-900 p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-cyan font-semibold text-[28px] text-black">
              MC
            </span>
            <button className="absolute -bottom-2 -right-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink-900 text-white/85 hover:bg-ink-800">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <div className="text-[24px] font-semibold tracking-tight">Marc Lefèvre</div>
            <div className="mt-1 font-mono text-[11px] tracking-widest text-white/55">
              TRUSTMEDIA.FR@GMAIL.COM · MEMBRE DEPUIS NOV 2025
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] tracking-widest text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                PLAN STUDIO
              </span>
              <span className="inline-flex items-center rounded-full border border-line bg-white/[0.02] px-2 py-0.5 text-[10px] tracking-widest text-white/65">
                FR · CET
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-success/15 px-2 py-0.5 text-[10px] tracking-widest text-accent-success">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-success" />
                SYNC YT ACTIF
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nom complet" value="Marc Lefèvre" />
          <Field label="Email" value="trustmedia.fr@gmail.com" />
          <Field label="Pseudo YouTube" value="@marclefevre" />
          <Field label="Niche principale" value="Mindset · Coaching" />
          <Field label="Langue" value="Français · English" />
          <Field label="Fuseau" value="Europe/Paris" />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="rounded-md border border-line bg-white/[0.02] px-4 py-2 text-[12px] text-white/70 hover:bg-white/[0.05]">
            Annuler
          </button>
          <button className="rounded-md bg-accent-cyan px-4 py-2 text-[12px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]">
            Enregistrer
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-ink-900">
        <div className="border-b border-line px-6 py-4">
          <div className="text-[14px] font-semibold">Chaîne YouTube connectée</div>
          <div className="mt-1 text-[12.5px] text-white/45">
            Sync auto · CTR remonté toutes les 4h
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-danger/20 text-accent-danger">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M21.6 7.2C21.4 6.4 20.7 5.7 19.9 5.5C18.4 5 12 5 12 5C12 5 5.6 5 4.1 5.5C3.3 5.7 2.6 6.4 2.4 7.2C2 8.7 2 12 2 12C2 12 2 15.3 2.4 16.8C2.6 17.6 3.3 18.3 4.1 18.5C5.6 19 12 19 12 19C12 19 18.4 19 19.9 18.5C20.7 18.3 21.4 17.6 21.6 16.8C22 15.3 22 12 22 12C22 12 22 8.7 21.6 7.2ZM10 15V9L15 12L10 15Z"/>
              </svg>
            </span>
            <div>
              <div className="text-[15px] font-semibold">@marclefevre</div>
              <div className="font-mono text-[11px] tracking-widest text-white/55">
                42.3K ABONNÉS · 89 VIDÉOS
              </div>
            </div>
          </div>
          <button className="rounded-md border border-line bg-white/[0.02] px-3 py-2 text-[12px] text-white/70 hover:bg-white/[0.05]">
            Gérer →
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">
        {label.toUpperCase()}
      </div>
      <input
        defaultValue={value}
        className="mt-1.5 w-full rounded-md border border-line bg-white/[0.02] px-3 py-2 text-[14px] text-white outline-none focus:border-accent-cyan/50 focus:bg-white/[0.04]"
      />
    </div>
  );
}
