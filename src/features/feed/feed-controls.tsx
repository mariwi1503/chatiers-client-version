"use client";

import type { PostKind } from "@/data/feed";
import { postKinds } from "@/data/opportunities";
import { LocationSearch } from "@/components/location-search";

export type FeedMode = "all" | "following";
export type KindFilter = "all" | PostKind;

export function FeedControls({
  mode,
  onModeChange,
  kind,
  onKindChange,
  region,
  onRegionChange,
  locations,
  showFollowing,
}: {
  mode: FeedMode;
  onModeChange: (mode: FeedMode) => void;
  kind: KindFilter;
  onKindChange: (kind: KindFilter) => void;
  region: string;
  onRegionChange: (region: string) => void;
  locations: string[];
  showFollowing: boolean;
}) {
  return (
    <div className="home-feed-controls">
      <div className="home-feed-toolbar">
        {showFollowing ? (
          <div
            className="feed-mode-switch"
            role="group"
            aria-label="Sumber feed"
          >
            {(
              [
                { value: "all", label: "Semua" },
                { value: "following", label: "Mengikuti" },
              ] as const
            ).map((item) => (
              <button
                type="button"
                key={item.value}
                aria-pressed={mode === item.value}
                className={mode === item.value ? "active" : ""}
                onClick={() => onModeChange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="feed-context-label">Postingan tersimpan</span>
        )}
        <LocationSearch
          locations={locations}
          value={region}
          onChange={onRegionChange}
        />
      </div>
      <div
        className="feed-kind-filters"
        role="group"
        aria-label="Jenis peluang"
      >
        {[{ value: "all" as const, label: "Semua jenis" }, ...postKinds].map(
          (item) => (
            <button
              type="button"
              key={item.value}
              aria-pressed={kind === item.value}
              className={kind === item.value ? "active" : ""}
              onClick={() => onKindChange(item.value)}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
