"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function ShellClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className={`flex min-h-screen flex-col transition-[padding] duration-300 ${collapsed ? "lg:pl-[60px]" : "lg:pl-[240px]"}`}>
        <Topbar />
        <main className="flex-1 px-6 py-8 sm:px-10 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
