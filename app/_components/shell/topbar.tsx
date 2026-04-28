"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/": "Accueil",
  "/style": "Style",
  "/analytics": "Analytics",
  "/profil": "Profil",
  "/parametres": "Paramètres",
  "/plan": "Plan & crédits",
};

export function Topbar() {
  const pathname = usePathname() || "/";
  const key =
    Object.keys(TITLES)
      .filter((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k)))
      .sort((a, b) => b.length - a.length)[0] || "/";
  const title = TITLES[key];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-ink-950/85 px-6 backdrop-blur-xl">
      {/* breadcrumbs */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] text-white/40">MiniaPulse</span>
        <span className="text-white/25">/</span>
        <span className="text-[14px] text-white">{title}</span>
        <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.02] px-2.5 py-1 text-[12px] text-white/65">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent-success" />
          </span>
          Synchronisé · YouTube Studio
        </span>
      </div>

      {/* search */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden h-9 w-[340px] items-center gap-2 rounded-md border border-line bg-white/[0.02] px-3 text-white/55 md:flex xl:w-[420px]">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            placeholder="Rechercher une miniature, un style…"
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
          />
          <kbd className="rounded border border-line bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-white/55">
            ⌘K
          </kbd>
        </div>

        {/* notifications */}
        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-white/65 hover:bg-white/[0.04] hover:text-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <path d="M3 12C3 12 4 11 4 8.5C4 5 6 3 8 3C10 3 12 5 12 8.5C12 11 13 12 13 12H3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M7 14H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-danger" />
        </button>
      </div>
    </header>
  );
}
