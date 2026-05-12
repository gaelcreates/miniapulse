"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; msg: string; type: "success" | "error" | "info" };

let _add: ((msg: string, type?: Toast["type"]) => void) | null = null;

export function showToast(msg: string, type: Toast["type"] = "success") {
  _add?.(msg, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    _add = (msg, type = "success") => {
      const id = Date.now();
      setToasts((p) => [...p, { id, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
    };
    return () => { _add = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-medium shadow-2xl backdrop-blur-sm
            ${t.type === "success" ? "border-accent-success/30 bg-ink-900/95 text-accent-success" : ""}
            ${t.type === "error"   ? "border-accent-danger/30  bg-ink-900/95 text-accent-danger"  : ""}
            ${t.type === "info"    ? "border-accent-cyan/30    bg-ink-900/95 text-accent-cyan"    : ""}
            animate-risein`}
        >
          <span>
            {t.type === "success" && "✓"}
            {t.type === "error"   && "✕"}
            {t.type === "info"    && "·"}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
