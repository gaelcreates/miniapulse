"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: { text: string; tone: "cyan" | "danger" | "yellow" };
};

const STUDIO: Item[] = [
  {
    href: "/",
    label: "Accueil",
    badge: { text: "3", tone: "cyan" },
    icon: <svg viewBox="0 0 16 16" fill="none"><path d="M2.5 7L8 2L13.5 7V13.2C13.5 13.6 13.2 13.9 12.8 13.9H10V10H6V13.9H3.2C2.8 13.9 2.5 13.6 2.5 13.2V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  },
  {
    href: "/style",
    label: "Studio",
    icon: <svg viewBox="0 0 16 16" fill="none"><path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  },
  {
    href: "/galerie",
    label: "Galerie",
    icon: <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
  },
  {
    href: "/calendrier",
    label: "Calendrier",
    icon: <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.4"/><path d="M5 2v2M11 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
];

const OPTIM: Item[] = [
  {
    href: "/analytics",
    label: "Analytics",
    icon: <svg viewBox="0 0 16 16" fill="none"><path d="M2.5 13.5V2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2.5 13.5H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M5.5 11V8M8 11V5.5M10.5 11V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
];

const COMPTE: Item[] = [
  {
    href: "/profil",
    label: "Profil",
    icon: <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.6" stroke="currentColor" strokeWidth="1.4"/><path d="M3 13.5C3 11 5.2 10 8 10C10.8 10 13 11 13 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    href: "/parametres",
    label: "Paramètres",
    icon: <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5V3.5M8 12.5V14.5M14.5 8H12.5M3.5 8H1.5M12.6 3.4L11.2 4.8M4.8 11.2L3.4 12.6M12.6 12.6L11.2 11.2M4.8 4.8L3.4 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    href: "/plan",
    label: "Plan & crédits",
    badge: { text: "PRO", tone: "danger" },
    icon: <svg viewBox="0 0 16 16" fill="none"><path d="M9 1.5L3 9H7.5L7 14.5L13 7H8.5L9 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  },
];

function NavItem({ item, active, collapsed }: { item: Item; active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center rounded-md transition-colors ${
        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
      } ${active ? "bg-white/[0.05] text-white" : "text-white/50 hover:bg-white/[0.025] hover:text-white"}`}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-accent-cyan" />
      )}
      {active && collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-accent-cyan" />
      )}
      <span className={`h-4 w-4 shrink-0 ${active ? "text-accent-cyan" : "text-white/50"}`}>{item.icon}</span>

      {!collapsed && (
        <>
          <span className="flex-1 text-[13px] font-medium tracking-tight">{item.label}</span>
          {item.badge && (
            <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none tracking-widest ${
              item.badge.tone === "cyan"   ? "bg-accent-cyan/15 text-accent-cyan" :
              item.badge.tone === "yellow" ? "bg-accent-yellow/15 text-accent-yellow" :
                                             "bg-accent-danger/15 text-accent-danger"
            }`}>{item.badge.text}</span>
          )}
        </>
      )}

      {/* Badge dot in collapsed mode */}
      {collapsed && item.badge && (
        <span className={`absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full ${
          item.badge.tone === "cyan" ? "bg-accent-cyan" :
          item.badge.tone === "yellow" ? "bg-accent-yellow" : "bg-accent-danger"
        }`} />
      )}

      {/* Tooltip on collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg border border-line bg-ink-900 px-3 py-1.5 text-[12px] font-medium text-white shadow-xl group-hover:block z-50">
          {item.label}
          {item.badge && <span className="ml-2 font-mono text-[9px] text-white/50">{item.badge.text}</span>}
        </div>
      )}
    </Link>
  );
}

function SidebarInner({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname() || "/";

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-ink-950 transition-[width] duration-300 lg:flex ${collapsed ? "w-[60px]" : "w-[240px]"}`}>

      {/* Logo + toggle */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2 border-b border-line px-0 py-3">
          <Link href="/" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan text-black hover:opacity-90 transition-opacity">
            <span className="font-display text-[15px] leading-none">M</span>
          </Link>
          <button
            onClick={onToggle}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-white/35 hover:border-line-strong hover:text-white transition-colors"
            title="Agrandir"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3 rotate-180" fill="none">
              <path d="M10 3L6 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-cyan text-black">
              <span className="font-display text-[15px] leading-none">M</span>
            </span>
            <span className="text-[16px] font-semibold tracking-tight">
              MiniaPulse<span className="text-accent-cyan">.</span>
            </span>
          </Link>
          <button
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-white/35 hover:border-line-strong hover:text-white transition-colors"
            title="Réduire"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M10 3L6 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-3 ${collapsed ? "px-2" : "px-3"} space-y-4`}>
        <div>
          {!collapsed && <div className="mb-1.5 px-3 font-mono text-[9px] font-medium tracking-[0.2em] text-white/30">STUDIO</div>}
          <div className="space-y-0.5">
            {STUDIO.map(it => <NavItem key={it.href} item={it} active={isActive(it.href)} collapsed={collapsed} />)}
          </div>
        </div>

        <div>
          {!collapsed && <div className="mb-1.5 px-3 font-mono text-[9px] font-medium tracking-[0.2em] text-white/30">OPTIMISATION</div>}
          {collapsed && <div className="my-1 mx-2 h-px bg-white/[0.06]" />}
          <div className="space-y-0.5">
            {OPTIM.map(it => <NavItem key={it.href} item={it} active={isActive(it.href)} collapsed={collapsed} />)}
          </div>
        </div>

        <div>
          {!collapsed && <div className="mb-1.5 px-3 font-mono text-[9px] font-medium tracking-[0.2em] text-white/30">COMPTE</div>}
          {collapsed && <div className="my-1 mx-2 h-px bg-white/[0.06]" />}
          <div className="space-y-0.5">
            {COMPTE.map(it => <NavItem key={it.href} item={it} active={isActive(it.href)} collapsed={collapsed} />)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!collapsed ? (
        <div className="space-y-3 border-t border-line px-4 py-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/45">Crédits</span>
              <span className="font-mono text-[11px] text-white/75">218 / 300</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-accent-cyan" style={{ width: "73%" }} />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-white/35">Reset dans 8j</span>
              <Link href="/plan" className="text-[10px] text-accent-cyan hover:opacity-80">↑ Upgrade</Link>
            </div>
          </div>
          <button className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.03]">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-cyan font-semibold text-[11px] text-black">MC</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] text-white">Marc C.</span>
              <span className="block truncate text-[10px] text-white/40">Plan Studio</span>
            </span>
            <span className="text-white/30">⋯</span>
          </button>
        </div>
      ) : (
        <div className="border-t border-line px-2 py-3 flex justify-center">
          <Link href="/profil" title="Profil" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-cyan font-semibold text-[11px] text-black hover:opacity-90">
            MC
          </Link>
        </div>
      )}
    </aside>
  );
}

export function Sidebar({ collapsed = false, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  return (
    <Suspense fallback={<aside className={`fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-ink-950 lg:block ${collapsed ? "w-[60px]" : "w-[240px]"}`} />}>
      <SidebarInner collapsed={collapsed} onToggle={onToggle ?? (() => {})} />
    </Suspense>
  );
}
