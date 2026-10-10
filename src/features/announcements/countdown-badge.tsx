"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatCountdown, isExpired } from "@/lib/announcements";

/**
 * Ikon jam sisa waktu berlaku sebuah Temporary Post. Dipakai di dalam area
 * komentar halaman detail Chatboards. Menampilkan tooltip berisi sisa waktu
 * saat di-hover. Tidak menampilkan apa pun ketika chatboard bukan Temporary
 * Post (expiresAt kosong).
 */
export function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) return null;
  const expired = isExpired(expiresAt, now);

  return (
    <span
      className={`comment-countdown ${expired ? "is-expired" : ""}`}
      aria-label={`Sisa waktu ${formatCountdown(expiresAt, now)}`}
      title={formatCountdown(expiresAt, now)}
    >
      <Clock size={13} />
    </span>
  );
}
