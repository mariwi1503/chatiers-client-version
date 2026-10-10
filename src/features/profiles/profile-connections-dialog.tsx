"use client";

import { X, Users } from "lucide-react";
import type { ChatiersUser } from "@/data/feed";
import Link from "next/link";
import { useDialog } from "@/hooks/use-dialog";
import { ProfileDialogFrame } from "./profile-dialog-frame";
import { VIEWER_HANDLE } from "@/lib/profiles";

export function ProfileConnectionsDialog({
  title,
  accounts,
  followed,
  onToggle,
  onClose,
}: {
  title: string;
  accounts: ChatiersUser[];
  followed: Record<string, boolean>;
  onToggle: (handle: string) => void;
  onClose: () => void;
}) {
  useDialog(true, onClose);
  return (
    <ProfileDialogFrame onClose={onClose}>
      <section
        className="profile-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-connections-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h2 id="profile-connections-title">
            {title} <small>{accounts.length}</small>
          </h2>
          <button
            type="button"
            aria-label="Tutup daftar koneksi"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <div className="profile-connections-list">
          {accounts.length === 0 && (
            <div className="empty-state">
              <Users size={24} />
              <h3>Belum ada koneksi</h3>
              <p>Ikuti pelaku bisnis untuk mulai membangun jaringanmu.</p>
            </div>
          )}
          {accounts.map((account) => (
            <div className="profile-connection" key={account.handle}>
              <Link href={`/profile/${account.handle}`} onClick={onClose}>
                <span className={`avatar ${account.color}`}>
                  {account.initials}
                </span>
                <span>
                  <strong>{account.name}</strong>
                  <small>{account.company}</small>
                </span>
              </Link>
              {account.handle !== VIEWER_HANDLE && (
                <button
                  type="button"
                  className={`profile-action ${followed[account.handle] ? "" : "primary"}`}
                  aria-label={`${followed[account.handle] ? "Batal mengikuti" : "Ikuti"} ${account.name}`}
                  aria-pressed={!!followed[account.handle]}
                  onClick={() => onToggle(account.handle)}
                >
                  {followed[account.handle] ? "Mengikuti" : "Ikuti"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </ProfileDialogFrame>
  );
}
