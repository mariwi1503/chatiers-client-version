"use client";

import { useDialog } from "@/hooks/use-dialog";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Handshake,
  Heart,
  Lightbulb,
  MessageCircle,
  Megaphone,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { initialAnnouncements } from "@/data/announcements";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  countComments,
  type Comment,
} from "@/features/comments/comment-thread";
import {
  ANNOUNCEMENT_COLORS,
  ANNOUNCEMENT_ICONS,
  DEFAULT_DURATION,
  EMPTY_DRAFT,
  durationToMs,
  msToDuration,
  remainingMs,
  formatAnnouncementDate,
  type Announcement,
  type AnnouncementDraft,
  type AnnouncementIcon,
} from "@/lib/announcements";

const ICONS: Record<AnnouncementIcon, typeof Megaphone> = {
  megaphone: Megaphone,
  handshake: Handshake,
  calendar: CalendarDays,
  users: Users,
  star: Star,
  bulb: Lightbulb,
};

export function AnnouncementBoard({
  handle,
  variant,
}: {
  handle: string;
  variant: "preview" | "page";
}) {
  const ownProfile = handle === "ardikurniawan";
  const [allItems, setAllItems] = useLocalStorage<Announcement[]>(
    "announcements",
    initialAnnouncements,
  );
  const items = allItems.filter((item) => item.handle === handle);
  const [formOpen, setFormOpen] = useState(false);
  useDialog(formOpen, () => setFormOpen(false));
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [draft, setDraft] = useState<AnnouncementDraft>(EMPTY_DRAFT);
  const [showDate, setShowDate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Announcement | null>(null);
  const [reactions, setReactions] = useLocalStorage<
    Record<string, { liked: boolean; count: number }>
  >("announcement-reactions", {});
  const [allComments] = useLocalStorage<Record<string, Comment[]>>(
    "announcement-comments",
    {},
  );
  const commentCounts = Object.fromEntries(
    Object.entries(allComments).map(([id, comments]) => [
      id,
      countComments(comments),
    ]),
  );

  function openCreate() {
    setEditing(null);
    setDraft({
      ...EMPTY_DRAFT,
      durationDays: DEFAULT_DURATION.days,
      durationHours: DEFAULT_DURATION.hours,
      durationMinutes: DEFAULT_DURATION.minutes,
      durationSeconds: DEFAULT_DURATION.seconds,
    });
    setShowDate(false);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(item: Announcement) {
    setEditing(item);
    let duration = { ...DEFAULT_DURATION };
    if (item.temporary && item.expiresAt) {
      const remaining = remainingMs(item.expiresAt);
      if (remaining > 0) duration = msToDuration(remaining);
    }
    setDraft({
      title: item.title,
      body: item.body,
      color: item.color,
      icon: item.icon,
      eventDate: item.eventDate,
      temporary: item.temporary,
      expiresAt: item.expiresAt,
      durationDays: duration.days,
      durationHours: duration.hours,
      durationMinutes: duration.minutes,
      durationSeconds: duration.seconds,
    });
    setShowDate(Boolean(item.eventDate));
    setFormError("");
    setFormOpen(true);
  }

  async function publish() {
    const title = draft.title.trim();
    const body = draft.body.trim();
    if (!title) {
      setFormError("Judul wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError("");
    // Saat Temporary Post aktif, hitung masa berlaku dari durasi custom
    // (hari/jam/menit/detik). Jika durasi nol, jatuh ke default 7 hari.
    let expiresAt = "";
    if (draft.temporary) {
      let ms = durationToMs(
        draft.durationDays,
        draft.durationHours,
        draft.durationMinutes,
        draft.durationSeconds,
      );
      if (ms <= 0) {
        ms = durationToMs(
          DEFAULT_DURATION.days,
          DEFAULT_DURATION.hours,
          DEFAULT_DURATION.minutes,
          DEFAULT_DURATION.seconds,
        );
      }
      expiresAt = new Date(Date.now() + ms).toISOString();
    }
    const payload = {
      handle,
      title,
      body,
      color: draft.color,
      icon: draft.icon,
      eventDate: showDate ? draft.eventDate : "",
      temporary: draft.temporary,
      expiresAt,
    };
    const next: Announcement = {
      id: editing?.id || crypto.randomUUID(),
      ...payload,
    };
    setAllItems((list) =>
      editing
        ? list.map((item) => (item.id === next.id ? next : item))
        : [next, ...list],
    );
    setFormOpen(false);
    setSaving(false);
  }

  function toggleReact(item: Announcement) {
    setReactions((prev) => {
      const current = prev[item.id] || { liked: false, count: 0 };
      const liked = !current.liked;
      return {
        ...prev,
        [item.id]: {
          liked,
          count: Math.max(0, current.count + (liked ? 1 : -1)),
        },
      };
    });
  }

  function remove(item: Announcement) {
    setAllItems((list) => list.filter((row) => row.id !== item.id));
    setPendingDelete(null);
  }

  const visible =
    variant === "preview" ? (items || []).slice(0, 2) : items || [];

  return (
    <section
      className={`announce ${variant === "page" ? "announce-page" : "announce-preview"}`}
      aria-label="Chatboards"
    >
      {variant === "page" ? (
        <header className="announce-top">
          <Link
            href={`/profile/${handle}`}
            className="profile-icon-btn"
            aria-label="Kembali ke profil"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1>
            <Megaphone size={18} /> Chatboards
          </h1>
          {ownProfile && (
            <button type="button" className="announce-add" onClick={openCreate}>
              <Plus size={16} /> Tambah Chatboard
            </button>
          )}
        </header>
      ) : (
        <div className="announce-head">
          <h3>
            <Megaphone size={16} /> Chatboards
          </h3>
          <Link href={`/profile/${handle}/announcements`}>
            Lihat semua <span aria-hidden="true">›</span>
          </Link>
        </div>
      )}

      <div className="cork">
        {items === null && <p className="announce-status">Memuat chatboard…</p>}
        {items && items.length === 0 && (
          <div className="announce-empty">
            <Megaphone size={22} />
            <p>Belum ada chatboard dari perusahaan ini.</p>
            {ownProfile && (
              <button type="button" onClick={openCreate}>
                Buat chatboard pertama
              </button>
            )}
          </div>
        )}

        {visible.length > 0 && (
          <ul className="note-grid">
            {visible.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <li key={item.id} className={`note note-${item.color}`}>
                  <span
                    className={`note-pin pin-${item.icon}`}
                    aria-hidden="true"
                  />
                  {ownProfile && (
                    <div className="note-tools">
                      <button
                        type="button"
                        aria-label={`Edit ${item.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openEdit(item);
                        }}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Hapus ${item.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPendingDelete(item);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                  <Link
                    href={`/profile/${handle}/announcements/${item.id}`}
                    className="note-link"
                    aria-label={`Buka komentar ${item.title}`}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                    <strong>{item.title}</strong>
                    {item.body && <p>{item.body}</p>}
                    {item.eventDate ? (
                      <small>
                        <CalendarDays size={11} />{" "}
                        {formatAnnouncementDate(item.eventDate)}
                      </small>
                    ) : (
                      <small>
                        <CalendarDays size={11} /> Berlangsung
                      </small>
                    )}
                  </Link>
                  <Link
                    href={`/profile/${handle}/announcements/${item.id}`}
                    className={`note-comment ${item.temporary ? "is-temporary" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Lihat komentar ${item.title}`}
                  >
                    <MessageCircle size={13} />
                    {commentCounts[item.id] ? (
                      <span>{commentCounts[item.id]}</span>
                    ) : null}
                  </Link>
                  <button
                    type="button"
                    className={`note-react ${reactions[item.id]?.liked ? "is-liked" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleReact(item);
                    }}
                    aria-label={
                      reactions[item.id]?.liked
                        ? "Batal suka"
                        : "Sukai chatboard"
                    }
                    aria-pressed={reactions[item.id]?.liked || false}
                  >
                    <Heart
                      size={13}
                      fill={reactions[item.id]?.liked ? "currentColor" : "none"}
                    />
                    {reactions[item.id]?.count ? (
                      <span>{reactions[item.id].count}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {ownProfile && variant === "preview" && items && items.length > 0 && (
        <button
          type="button"
          className="announce-inline-add"
          onClick={openCreate}
        >
          <Plus size={14} /> Tambah chatboard
        </button>
      )}

      {formOpen &&
        createPortal(
          <div
            className="modal-backdrop"
            role="presentation"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="announce-form"
              role="dialog"
              aria-modal="true"
              aria-labelledby="announce-form-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="announce-form-head">
                <h2 id="announce-form-title">
                  {editing ? "Edit Chatboard" : "Buat Chatboard"}
                </h2>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => setFormOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="announce-pickers">
                <div>
                  <span>Warna kartu</span>
                  <div className="swatches">
                    {ANNOUNCEMENT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`swatch swatch-${color} ${draft.color === color ? "is-on" : ""}`}
                        aria-label={`Warna ${color}`}
                        aria-pressed={draft.color === color}
                        onClick={() => setDraft((d) => ({ ...d, color }))}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span>Ikon pin</span>
                  <div className="icon-picks">
                    {ANNOUNCEMENT_ICONS.map((icon) => {
                      const Icon = ICONS[icon];
                      return (
                        <button
                          key={icon}
                          type="button"
                          className={draft.icon === icon ? "is-on" : ""}
                          aria-label={`Ikon ${icon}`}
                          aria-pressed={draft.icon === icon}
                          onClick={() => setDraft((d) => ({ ...d, icon }))}
                        >
                          <Icon size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <label className="job-field">
                <span>Judul</span>
                <input
                  value={draft.title}
                  maxLength={80}
                  placeholder="Judul chatboard"
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, title: event.target.value }))
                  }
                />
              </label>
              <label className="job-field">
                <span>Isi</span>
                <textarea
                  value={draft.body}
                  maxLength={280}
                  placeholder="Tulis chatboard…"
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, body: event.target.value }))
                  }
                />
              </label>
              {showDate ? (
                <label className="job-field">
                  <span>Tanggal</span>
                  <input
                    type="date"
                    value={draft.eventDate}
                    onChange={(event) =>
                      setDraft((d) => ({ ...d, eventDate: event.target.value }))
                    }
                  />
                </label>
              ) : (
                <button
                  type="button"
                  className="announce-date-toggle"
                  onClick={() => setShowDate(true)}
                >
                  <CalendarDays size={14} /> Tambah tanggal (opsional)
                </button>
              )}
              <button
                type="button"
                className={`announce-temp-toggle ${draft.temporary ? "is-on" : ""}`}
                onClick={() =>
                  setDraft((d) => ({ ...d, temporary: !d.temporary }))
                }
                aria-pressed={draft.temporary}
              >
                <span className="announce-temp-switch">
                  <span className="announce-temp-knob" />
                </span>
                <Clock size={14} />
                <span>Temporary Post</span>
              </button>
              {draft.temporary && (
                <div className="announce-duration">
                  <span className="announce-duration-label">
                    <Clock size={13} /> Masa berlaku
                  </span>
                  <div className="announce-duration-grid">
                    <label className="announce-duration-field">
                      <input
                        type="number"
                        min={0}
                        max={365}
                        inputMode="numeric"
                        value={draft.durationDays}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            durationDays: Number(e.target.value) || 0,
                          }))
                        }
                      />
                      <small>Hari</small>
                    </label>
                    <label className="announce-duration-field">
                      <input
                        type="number"
                        min={0}
                        max={23}
                        inputMode="numeric"
                        value={draft.durationHours}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            durationHours: Number(e.target.value) || 0,
                          }))
                        }
                      />
                      <small>Jam</small>
                    </label>
                    <label className="announce-duration-field">
                      <input
                        type="number"
                        min={0}
                        max={59}
                        inputMode="numeric"
                        value={draft.durationMinutes}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            durationMinutes: Number(e.target.value) || 0,
                          }))
                        }
                      />
                      <small>Menit</small>
                    </label>
                    <label className="announce-duration-field">
                      <input
                        type="number"
                        min={0}
                        max={59}
                        inputMode="numeric"
                        value={draft.durationSeconds}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            durationSeconds: Number(e.target.value) || 0,
                          }))
                        }
                      />
                      <small>Detik</small>
                    </label>
                  </div>
                </div>
              )}
              {formError && <p className="announce-form-error">{formError}</p>}
              <div className="announce-form-actions">
                <button
                  type="button"
                  className="announce-publish"
                  disabled={saving}
                  onClick={publish}
                >
                  {saving ? "Menyimpan…" : editing ? "Simpan" : "Terbitkan"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {pendingDelete &&
        createPortal(
          <div
            className="modal-backdrop"
            role="presentation"
            onClick={() => setPendingDelete(null)}
          >
            <div
              className="announce-confirm"
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
            >
              <h2>Hapus chatboard?</h2>
              <p>
                “{pendingDelete.title}” akan dihapus dari Chatboards perusahaan.
              </p>
              <div>
                <button type="button" onClick={() => setPendingDelete(null)}>
                  Batal
                </button>
                <button
                  type="button"
                  className="is-danger"
                  onClick={() => remove(pendingDelete)}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
