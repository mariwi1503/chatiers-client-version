"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { ProfileDialogFrame } from "./profile-dialog-frame";
import { profileWebsite, type ProfileDetails } from "@/lib/profiles";

export function ProfileEditDialog({
  details,
  onSave,
  onClose,
}: {
  details: ProfileDetails;
  onSave: (details: ProfileDetails) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(details);
  const [error, setError] = useState("");
  useDialog(true, onClose);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.bio.trim() || !draft.location.trim()) {
      setError("Bio dan lokasi wajib diisi.");
      return;
    }
    if (draft.website.trim() && !profileWebsite(draft.website)) {
      setError(
        "Gunakan alamat situs yang valid dengan protokol http atau https.",
      );
      return;
    }
    onSave({
      bio: draft.bio.trim(),
      location: draft.location.trim(),
      website: draft.website.trim(),
    });
  }
  return (
    <ProfileDialogFrame onClose={onClose}>
      <section
        className="profile-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h2 id="profile-edit-title">Edit profil</h2>
          <button
            type="button"
            aria-label="Tutup edit profil"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <form onSubmit={submit}>
          <label htmlFor="profile-bio">Bio</label>
          <textarea
            id="profile-bio"
            aria-describedby="profile-bio-count"
            value={draft.bio}
            maxLength={280}
            rows={4}
            onChange={(event) =>
              setDraft({ ...draft, bio: event.target.value })
            }
          />
          <small id="profile-bio-count">{draft.bio.length}/280 karakter</small>
          <label htmlFor="profile-location">Lokasi</label>
          <input
            id="profile-location"
            value={draft.location}
            maxLength={100}
            autoComplete="address-level2"
            onChange={(event) =>
              setDraft({ ...draft, location: event.target.value })
            }
          />
          <label htmlFor="profile-website">Situs bisnis (opsional)</label>
          <input
            id="profile-website"
            value={draft.website}
            maxLength={200}
            inputMode="url"
            placeholder="contoh.id"
            onChange={(event) =>
              setDraft({ ...draft, website: event.target.value })
            }
          />
          {error && (
            <p className="profile-form-error" role="alert">
              {error}
            </p>
          )}
          <p className="profile-local-note">
            Perubahan profil disimpan di browser ini.
          </p>
          <footer>
            <button type="button" className="profile-action" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="profile-action primary">
              Simpan perubahan
            </button>
          </footer>
        </form>
      </section>
    </ProfileDialogFrame>
  );
}
