/** Browser-only persistence. Versioned keys make future data migrations explicit. */
import { validStoredValue } from "@/lib/storage-validation";

export const STORAGE_PREFIX = "chatiers:v1:";
export const STORAGE_EVENT = "chatiers:storage";
const memory = new Map<string, string>();
const unavailable = new Set<string>();

function matchesShape(value: unknown, sample: unknown): boolean {
  if (sample === null) return value === null || typeof value === "object";
  if (Array.isArray(sample))
    return (
      Array.isArray(value) &&
      (sample.length === 0 ||
        value.every((item) => matchesShape(item, sample[0])))
    );
  if (typeof sample === "object")
    return (
      !!value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.entries(sample as Record<string, unknown>).every(
        ([key, example]) =>
          matchesShape((value as Record<string, unknown>)[key], example),
      )
    );
  return typeof value === typeof sample;
}

export function readStorage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const fullKey = STORAGE_PREFIX + key;
  let raw: string | null = null;
  try {
    raw = unavailable.has(fullKey)
      ? (memory.get(fullKey) ?? null)
      : window.localStorage.getItem(fullKey);
  } catch {
    raw = memory.get(fullKey) ?? null;
  }
  if (raw === null) return fallback;
  try {
    const value: unknown = JSON.parse(raw);
    return matchesShape(value, JSON.parse(fallback)) &&
      validStoredValue(key, value)
      ? raw
      : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: string): void {
  const fullKey = STORAGE_PREFIX + key;
  memory.set(fullKey, value);
  try {
    window.localStorage.setItem(fullKey, value);
    unavailable.delete(fullKey);
  } catch {
    unavailable.add(fullKey);
    window.dispatchEvent(new Event("chatiers:storage-unavailable"));
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: fullKey }));
}

export function subscribeStorage(
  key: string,
  callback: () => void,
): () => void {
  const fullKey = STORAGE_PREFIX + key;
  const onStorage = (event: StorageEvent) => {
    if (event.key === fullKey || event.key === null) {
      memory.delete(fullKey);
      unavailable.delete(fullKey);
      callback();
    }
  };
  const onLocal = (event: Event) => {
    if ((event as CustomEvent<string>).detail === fullKey) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_EVENT, onLocal);
  };
}
