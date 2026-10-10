"use client";

import Link from "next/link";

export const BRAND_LOGO_SRC = "/chatiers-logo.png";

export function BrandLogo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`brand-logo ${compact ? "is-compact" : ""} ${className}`.trim()}
      aria-label="chatiers, beranda"
    >
      <img src={BRAND_LOGO_SRC} alt="chatiers" />
    </Link>
  );
}
