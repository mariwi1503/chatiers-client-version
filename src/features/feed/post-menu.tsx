"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, MoreHorizontal } from "lucide-react";

export function PostMenu({ onCopy }: { onCopy: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className="post-menu" ref={root}>
      <button
        ref={trigger}
        type="button"
        aria-label="Opsi postingan"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal size={20} />
      </button>
      {open && (
        <div className="post-menu-panel">
          <button
            type="button"
            onClick={() => {
              onCopy();
              setOpen(false);
              trigger.current?.focus();
            }}
            aria-label="Salin teks postingan"
          >
            <Copy size={18} /> Salin teks
          </button>
        </div>
      )}
    </div>
  );
}
