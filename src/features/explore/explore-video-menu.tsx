"use client";
import { useEffect, useRef, useState } from "react";
import { EyeOff, MoreHorizontal } from "lucide-react";

export function ExploreVideoMenu({
  onHide,
  onRestore,
}: {
  onHide: () => void;
  onRestore?: () => void;
}) {
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
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className="explore-video-menu" ref={root}>
      <button
        ref={trigger}
        type="button"
        aria-label="Opsi video"
        title="Opsi video"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal size={24} />
      </button>
      {open && (
        <div className="explore-video-menu-panel">
          <button type="button" onClick={onHide}>
            <EyeOff size={18} />
            Tidak tertarik
          </button>
          <p>Sembunyikan video ini dari Jelajahi.</p>
          {onRestore && (
            <button
              type="button"
              onClick={() => {
                onRestore();
                setOpen(false);
              }}
            >
              Tampilkan video tersembunyi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
