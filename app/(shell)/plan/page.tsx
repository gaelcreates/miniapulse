export default function PlanPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-10">
        <h1 className="font-display text-[64px] leading-[0.92] tracking-tight sm:text-[80px]">
          PLAN & CRÉDITS
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
          Ton abonnement, tes crédits du mois, tes factures.
        </p>
      </div>

      {/* current plan + credits */}
      <section className="overflow-hidden rounded-xl border border-line bg-ink-900">
        <div className="relative p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent-cyan/10 to-transparent" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">
                PLAN ACTUEL
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <h2 className="font-display text-[44px] leading-none tracking-tight">
                  STUDIO
                </h2>
                <span className="font-mono text-[14px] tracking-widest text-white/55">
                  79€ / MOIS
                </span>
              </div>
              <p className="mt-2 max-w-md text-[13px] text-white/55">
                Le rythme d&apos;un solo qui publie 2 fois par semaine.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] tracking-widest text-accent-cyan">
                  FACTURATION MENSUELLE
                </span>
                <span className="inline-flex items-center rounded-full border border-line bg-white/[0.02] px-2 py-0.5 text-[10px] tracking-widest text-white/65">
                  RENOUVELLE LE 12 MAI
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="rounded-md border border-line bg-white/[0.02] px-4 py-2.5 text-[12px] text-white/75 hover:bg-white/[0.05]">
                Changer de plan
              </button>
              <button className="rounded-md bg-accent-cyan px-4 py-2.5 text-[12px] font-semibold text-black hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]">
                Passer à Agence →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-line p-6">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/45">
              CRÉDITS DU MOIS
            </div>
            <div className="font-mono text-[11px] tracking-widest text-white/55">
              RESET LE 12/05
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[56px] leading-none tracking-tight text-accent-cyan">
              218
            </span>
            <span className="font-display text-[20px] leading-none tracking-tight text-white/55">
              / 300
            </span>
            <span className="ml-auto font-mono text-[11px] tracking-widest text-white/55">
              82 UTILISÉS · 8 JOURS RESTANTS
            </span>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-success"
              style={{ width: "73%" }}
            />
          </div>
        </div>
      </section>

      {/* plans compare */}
      <section className="mt-6 rounded-xl border border-line bg-ink-900">
        <div className="border-b border-line px-5 py-4">
          <div className="text-[14px] font-semibold">Plans disponibles</div>
          <div className="mt-1 text-[12.5px] text-white/45">
            Changement immédiat · proratisé
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
          <PlanCol name="Starter" price="29€" credits="40 / mois" features={["1 persona", "6 styles", "Sync YT"]} />
          <PlanCol name="Studio" price="79€" credits="120 / mois" current features={["4 personas", "Brand kit", "Recos IA", "A/B test"]} />
          <PlanCol name="Agence" price="199€" credits="400 / mois" features={["Personas illimités", "Multi-chaînes", "Exports raw", "Support prio"]} />
        </div>
      </section>

      {/* billing */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-line bg-ink-900 lg:col-span-5">
          <div className="border-b border-line px-5 py-4 text-[14px] font-semibold">
            Méthode de paiement
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-16 items-center justify-center rounded-md bg-gradient-to-br from-ink-700 to-ink-800 ring-1 ring-line">
                <span className="font-display text-[14px] tracking-widest">VISA</span>
              </div>
              <div>
                <div className="font-mono text-[14px] tracking-widest text-white/85">
                  •••• 4242
                </div>
                <div className="mt-0.5 font-mono text-[11px] tracking-widest text-white/45">
                  EXP 12/27 · MARC LEFÈVRE
                </div>
              </div>
            </div>
            <button className="rounded-md border border-line bg-white/[0.02] px-3 py-2 font-mono text-[10px] tracking-widest text-white/70 hover:bg-white/[0.05]">
              MODIFIER
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-ink-900 lg:col-span-7">
          <div className="border-b border-line px-5 py-4">
            <div className="text-[14px] font-semibold">Historique des factures</div>
            <div className="mt-1 text-[12.5px] text-white/45">5 factures · export tout</div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] font-mono text-[10px] tracking-widest text-white/45">
                <th className="px-5 py-3 text-left">RÉFÉRENCE</th>
                <th className="px-5 py-3 text-left">DATE</th>
                <th className="px-5 py-3 text-right">MONTANT</th>
                <th className="px-5 py-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "INV-2026-04", date: "12 avril 2026", amount: "79.00€" },
                { id: "INV-2026-03", date: "12 mars 2026", amount: "79.00€" },
                { id: "INV-2026-02", date: "12 février 2026", amount: "79.00€" },
                { id: "INV-2026-01", date: "12 janvier 2026", amount: "29.00€" },
                { id: "INV-2025-12", date: "12 décembre 2025", amount: "29.00€" },
              ].map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`text-[13px] ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}
                >
                  <td className="px-5 py-3 font-mono text-white/85">{inv.id}</td>
                  <td className="px-5 py-3 text-white/65">{inv.date}</td>
                  <td className="px-5 py-3 text-right font-mono text-white">{inv.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <a href="#" className="font-mono text-[10px] tracking-widest text-white/55 hover:text-white">
                      ↓ PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PlanCol({
  name,
  price,
  credits,
  features,
  current,
}: {
  name: string;
  price: string;
  credits: string;
  features: string[];
  current?: boolean;
}) {
  return (
    <div className={`relative bg-ink-900 p-6 ${current ? "ring-1 ring-inset ring-accent-cyan/40" : ""}`}>
      {current && (
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] tracking-widest text-accent-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
            ACTUEL
          </span>
        </div>
      )}
      <div className="text-[14px] font-semibold tracking-tight">{name}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-[40px] leading-none tracking-tight">{price}</div>
        <div className="font-mono text-[11px] tracking-widest text-white/45">/MOIS</div>
      </div>
      <div className="mt-2 font-mono text-[11px] tracking-widest text-white/55">
        {credits.toUpperCase()}
      </div>
      <ul className="mt-5 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-white/80">
            <svg viewBox="0 0 12 12" className="mt-1 h-3 w-3 shrink-0 text-accent-cyan">
              <path d="M2 6 L5 9 L10 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`mt-6 w-full rounded-md py-2 text-[12px] ${
          current
            ? "border border-line bg-white/[0.02] text-white/55"
            : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
        }`}
      >
        {current ? "Plan actuel" : "Passer à " + name}
      </button>
    </div>
  );
}
