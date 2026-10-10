"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Membungkus avatar atau nama pengguna menjadi tautan menuju halaman profil.
 * `stopPropagation` mencegah klik memicu handler induk (mis. buka kapsyon Reel).
 */
export function ProfileLink({
  handle,
  className,
  children,
  title,
}: {
  handle: string;
  className?: string;
  children: ReactNode;
  title?: string;
}) {
  return (
    <Link
      href={`/profile/${handle}`}
      className={className}
      title={title}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
}
