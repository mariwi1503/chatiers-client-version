export const ANNOUNCEMENT_COLORS = [
  "purple",
  "yellow",
  "pink",
  "blue",
  "green",
  "white",
] as const;
export const ANNOUNCEMENT_ICONS = [
  "megaphone",
  "handshake",
  "calendar",
  "users",
  "star",
  "bulb",
] as const;

export type AnnouncementColor = (typeof ANNOUNCEMENT_COLORS)[number];
export type AnnouncementIcon = (typeof ANNOUNCEMENT_ICONS)[number];

export type Announcement = {
  id: string;
  handle: string;
  title: string;
  body: string;
  color: AnnouncementColor;
  icon: AnnouncementIcon;
  eventDate: string;
  temporary: boolean;
  expiresAt: string;
};

export type AnnouncementDraft = {
  title: string;
  body: string;
  color: AnnouncementColor;
  icon: AnnouncementIcon;
  eventDate: string;
  temporary: boolean;
  expiresAt: string;
  durationDays: number;
  durationHours: number;
  durationMinutes: number;
  durationSeconds: number;
};

/**
 * Masa berlaku sebuah Temporary Post sejak diterbitkan. Chatboard sementara
 * otomatis dianggap berakhir setelah durasi ini terlewati.
 */
export const TEMPORARY_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/** Durasi default sebuah Temporary Post baru (7 hari). */
export const DEFAULT_DURATION = { days: 7, hours: 0, minutes: 0, seconds: 0 };

export const EMPTY_DRAFT: AnnouncementDraft = {
  title: "",
  body: "",
  color: "purple",
  icon: "megaphone",
  eventDate: "",
  temporary: false,
  expiresAt: "",
  durationDays: DEFAULT_DURATION.days,
  durationHours: DEFAULT_DURATION.hours,
  durationMinutes: DEFAULT_DURATION.minutes,
  durationSeconds: DEFAULT_DURATION.seconds,
};

/** Konversi isian durasi custom menjadi milidetik. */
export function durationToMs(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
): number {
  return (
    Math.max(0, Math.floor(days)) * 86400_000 +
    Math.max(0, Math.floor(hours)) * 3600_000 +
    Math.max(0, Math.floor(minutes)) * 60_000 +
    Math.max(0, Math.floor(seconds)) * 1000
  );
}

/** Pecah milidetik menjadi isian durasi (dipakai untuk memulihkan isian saat edit). */
export function msToDuration(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (!Number.isFinite(ms) || ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** ISO timestamp masa berlaku untuk sebuah Temporary Post baru. */
export function computeExpiresAt(
  temporary: boolean,
  from: Date = new Date(),
): string {
  if (!temporary) return "";
  return new Date(from.getTime() + TEMPORARY_DURATION_MS).toISOString();
}

/**
 * Sisa waktu berlaku dalam milidetik. Nilai negatif berarti sudah berakhir.
 */
export function remainingMs(
  expiresAt: string,
  now: number = Date.now(),
): number {
  if (!expiresAt) return 0;
  const target = new Date(expiresAt).getTime();
  if (Number.isNaN(target)) return 0;
  return target - now;
}

export function isExpired(
  expiresAt: string,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) return false;
  return remainingMs(expiresAt, now) <= 0;
}

/**
 * Label hitungan mundur yang ramah tampilan: "6d 23j", "4j 12m", "9m 3d", "3d",
 * atau "Berakhir" ketika sudah lewat masa berlakunya.
 */
export function formatCountdown(
  expiresAt: string,
  now: number = Date.now(),
): string {
  if (!expiresAt) return "";
  const ms = remainingMs(expiresAt, now);
  if (ms <= 0) return "Berakhir";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}h ${hours}j`;
  if (hours > 0) return `${hours}j ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}d`;
  return `${seconds}d`;
}

export function formatAnnouncementDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
