"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/** Render above the app shell, including columns that establish CSS containment. */
export function ProfileDialogFrame({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return createPortal(
    <div className="profile-dialog-backdrop" onClick={onClose}>
      {children}
    </div>,
    document.body,
  );
}
