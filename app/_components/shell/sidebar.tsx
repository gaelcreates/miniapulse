"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: { text: string; tone: "cyan" | "danger" };
};

const STUDIO: Item[] = [
  {
    href: "/",
    label: "Accueil",
    badge: { text: "3", tone: "cyan" },
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2.5 7L8 2L13.5 7V13.2C13.5 13.6 13.2 13.9 12.8 13.9H10V10H6V13.9H3.2C2.8 13.9 2.5 13.6 2.5 13.2V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/style",
    label: "Style",
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2.5 4.5C2.5 3.4 3.4 2.5 4.5 2.5H11.5C12.6 2.5 13.5 3.4 13.5 4.5V11.5C13.5 12.6 12.6 13.5 11.5 13.5H4.5C3.4 13.5 2.5 12.6 2.5 11.5V4.5Z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 8H13.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 2.5V13.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2.5 13.5V2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M2.5 13.5H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M5.5 11V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M8 11V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M10.5 11V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const ACCOUNT: Item[] = [
  {
    href: "/profil",
    label: "Profil",
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="6" r="2.6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 13.5C3 11 5.2 10 8 10C10.8 10 13 11 13 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/parametres",
    label: "Paramètres",
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 1.5V3.5M8 12.5V14.5M14.5 8H12.5M3.5 8H1.5M12.6 3.4L11.2 4.8M4.8 11.2L3.4 12.6M12.6 12.6L11.2 11.2M4.8 4.8L3.4 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/plan",
    label: "Plan & crédits",
    badge: { text: "PRO", tone: "danger" },
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M9 1.5L3 9H7.5L7 14.5L13 7H8.5L9 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const STYLE_SUB: Array<{ tab: string; label: string }> = [
  { tab: "styles", label: "Styles" },
  { tab: "personas", label: "Personas" },
  { tab: "kit", label: "Brand kit" },
  { tab: "prompts", label: "Prompts" },
];

function NavItem({ item, active }: { item: Item; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
        active
          ? "bg-white/[0.05] text-white"
          : "text-white/55 hover:bg-white/[0.025] hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-accent-cyan" />
      )}
      <span className={`h-4 w-4 ${active ? "text-accent-cyan" : "text-white/55"}`}>
        {item.icon}
      </span>
      <span className="flex-1 text-[13.5px] font-medium tracking-tight">
        {item.label}
      </span>
      {item.badge && (
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none tracking-widest ${
            item.badge.tone === "cyan"
              ? "bg-accent-cyan/15 text-accent-cyan"
              : "bg-accent-danger/15 text-accent-danger"
          }`}
        >
          {item.badge.text}
        </span>
      )}
    </Link>
  );
}

function StyleSubNav({ activeTab }: { activeTab: string }) {
  return (
    <ul className="ml-9 mt-1 space-y-0.5 border-l border-line py-1 pl-3">
      {STYLE_SUB.map((s) => {
        const active = s.tab === activeTab;
        return (
          <li key={s.tab}>
            <Link
              href={`/style?tab=${s.tab}`}
              className={`block rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                active
                  ? "text-accent-cyan"
                  : "text-white/55 hover:text-white"
              }`}
            >
              {s.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarInner() {
  const pathname = usePathname() || "/";
  const search = useSearchParams();
  const tab = search.get("tab") || "styles";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-line bg-ink-950 lg:flex">
      {/* logo */}
      <div className="px-5 pb-3 pt-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan text-black">
            <span className="font-display text-[16px] leading-none">M</span>
          </span>
          <span className="text-[18px] font-semibold tracking-tight">
            MiniaPulse
            <span className="text-accent-cyan">.</span>
          </span>
        </Link>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3">
        <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-accent-cyan py-2.5 text-[13.5px] font-semibold text-black transition-all hover:shadow-[0_8px_28px_-8px_rgba(52,224,255,0.55)]">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="currentColor"/>
          </svg>
          Nouvelle miniature
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <SectionLabel>STUDIO</SectionLabel>
        <div className="mt-1.5 space-y-0.5">
          {STUDIO.map((it) => {
            const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
            return (
              <div key={it.href}>
                <NavItem item={it} active={active} />
                {it.href === "/style" && active && <StyleSubNav activeTab={tab} />}
              </div>
            );
          })}
        </div>

        <SectionLabel className="mt-6">COMPTE</SectionLabel>
        <div className="mt-1.5 space-y-0.5">
          {ACCOUNT.map((it) => (
            <NavItem key={it.href} item={it} active={pathname.startsWith(it.href)} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-line px-4 py-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/55">Crédits</span>
            <span className="font-mono text-[12px] text-white/85">218 / 300</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-accent-cyan"
              style={{ width: "73%" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-white/45">Renouvelle dans 8j</span>
            <Link href="/plan" className="text-[11px] text-accent-cyan hover:opacity-90">
              ↑ Upgrade
            </Link>
          </div>
        </div>

        <button className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.03]">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-cyan font-semibold text-[12px] text-black">
            MC
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] text-white">Marc C.</span>
            <span className="block truncate text-[11px] text-white/45">Plan Studio</span>
          </span>
          <span className="text-white/35 group-hover:text-white">⋯</span>
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-3 font-mono text-[10px] font-medium tracking-[0.18em] text-white/35 ${className}`}
    >
      {children}
    </div>
  );
}

export function Sidebar() {
  return (
    <Suspense
      fallback={
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-line bg-ink-950 lg:block" />
      }
    >
      <SidebarInner />
    </Suspense>
  );
}
