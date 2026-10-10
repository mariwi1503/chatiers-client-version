"use client";

import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import { readStorage, subscribeStorage, writeStorage } from "@/lib/storage";

/** SSR always renders the seed. Hydration then restores and subscribes to browser data. */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const fallback = JSON.stringify(initial);
  const subscribe = useCallback(
    (callback: () => void) => subscribeStorage(key, callback),
    [key],
  );
  const getSnapshot = useCallback(
    () => readStorage(key, fallback),
    [key, fallback],
  );
  const getServerSnapshot = useCallback(() => fallback, [fallback]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => JSON.parse(raw) as T, [raw]);
  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (action) => {
      const current = JSON.parse(readStorage(key, fallback)) as T;
      const next =
        typeof action === "function"
          ? (action as (previous: T) => T)(current)
          : action;
      writeStorage(key, JSON.stringify(next));
    },
    [key, fallback],
  );
  return [value, setValue];
}
