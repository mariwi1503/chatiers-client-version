const timeUnits: Record<string, string> = {
  detik: "s",
  menit: "m",
  jam: "h",
  hari: "d",
  minggu: "w",
  bulan: "mo",
  tahun: "y",
};

/** Format the display without rewriting existing posts in localStorage. */
export function compactPostTime(value: string): string {
  const time = value.trim();
  if (/^baru saja$/i.test(time)) return "baru";
  const match =
    /^(\d+)\s*(detik|menit|jam|hari|minggu|bulan|tahun)(?:\s+lalu)?$/i.exec(
      time,
    );
  return match ? `${match[1]}${timeUnits[match[2].toLowerCase()]}` : time;
}

export function postCity(location: string): string {
  return location.split(",")[0].trim();
}
