"use client";

import { useState } from "react";
import { MapPin, Search, Check, ChevronDown, X } from "lucide-react";

/**
 * Menu pencarian lokasi yang dapat diakses dari header feed.
 * Pengguna mengetik untuk mencari kota/wilayah, lalu memilih untuk
 * memfilter konten (postingan dan lowongan) berdasarkan lokasi.
 */
export function LocationSearch({
  locations,
  value,
  onChange,
}: {
  locations: string[];
  value: string;
  onChange: (loc: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const locationLabel = (loc: string) =>
    ["all", "Public"].includes(loc) ? "Semua lokasi" : loc;
  const filtered = locations.filter((loc) =>
    locationLabel(loc).toLowerCase().includes(normalized),
  );
  const label = locationLabel(value);

  function select(loc: string) {
    onChange(loc);
    setQuery("");
    setOpen(false);
  }

  return (
    <>
      {open && (
        <div
          className="location-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`location-search ${open ? "is-open" : ""}`}>
        <button
          type="button"
          className="location-trigger"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Cari lokasi"
          onClick={() => setOpen((v) => !v)}
        >
          <MapPin size={15} />
          <span>{label}</span>
          <ChevronDown
            size={13}
            className={`location-chevron ${open ? "is-open" : ""}`}
          />
        </button>
        {open && (
          <div
            className="location-menu"
            role="listbox"
            aria-label="Pilih lokasi"
          >
            <label className="location-input">
              <Search size={14} />
              <input
                type="search"
                autoFocus
                aria-label="Cari lokasi"
                placeholder="Cari kota atau wilayah..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  className="location-clear"
                  onClick={() => setQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </label>
            <div className="location-options">
              {filtered.length > 0 ? (
                filtered.map((loc) => (
                  <button
                    key={loc}
                    role="option"
                    aria-selected={value === loc}
                    className={value === loc ? "active" : ""}
                    onClick={() => select(loc)}
                  >
                    <MapPin size={12} />
                    {locationLabel(loc)}
                    {value === loc && <Check size={13} />}
                  </button>
                ))
              ) : (
                <p className="location-empty" role="status">
                  Lokasi tidak ditemukan.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
