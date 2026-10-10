"use client";

import { translateDemo } from "@/lib/demo-translation";

import { useEffect, useRef, useState } from "react";
import { Heart, CornerUpLeft, Send, X, Languages, Clock } from "lucide-react";
import { ProfileLink } from "@/components/profile-link";

function renderMentions(text: string) {
  const parts = text.split(/(@[\w]+)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="mention">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export type CommentIdentity = {
  name: string;
  handle?: string;
  initials?: string;
  color?: string;
  role?: string;
  company?: string;
};

export type Comment = {
  id: string;
  name: string;
  handle?: string;
  initials?: string;
  color?: string;
  role?: string;
  company?: string;
  text: string;
  side: "left" | "right";
  likes: number;
  liked: boolean;
  replies: Comment[];
  /** ISO timestamp komentar dibuat. Tidak ada → "Baru saja". */
  createdAt?: string;
};

/** Identitas penonton (viewer) yang sedang membaca feed. */
export const VIEWER_IDENTITY: CommentIdentity = {
  name: "Ardi Kurniawan",
  handle: "ardikurniawan",
  initials: "AK",
  color: "yellow",
  role: "Pemilik Bisnis",
  company: "Kopi Nusantara",
};

export type TranslationState = {
  text: string;
  loading: boolean;
  error?: string;
};

/**
 * Label waktu relatif dalam Bahasa Indonesia: "Baru saja", "5 menit lalu",
 * "2 jam lalu", "3 hari lalu", dst. Tidak ada createdAt → "Baru saja".
 */
export function timeAgo(iso?: string, now: number = Date.now()): string {
  if (!iso) return "Baru saja";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Baru saja";
  const diff = now - then;
  if (diff < 0) return "Baru saja";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Baru saja";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} hari lalu`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk} minggu lalu`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} bulan lalu`;
  return `${Math.floor(day / 365)} tahun lalu`;
}

/**
 * Timestamp stabil untuk komentar seed. minutesAgo diturunkan dari teks +
 * indeks (bukan acak), sehingga label waktu tidak berubah saat komponen
 * dirender ulang.
 */
function seedCreatedAt(text: string, index: number): string {
  let h = (index + 1) * 1009;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  const minutesAgo = 4 + (Math.abs(h) % 240); // 4..243 menit lalu
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

export function buildSeed(
  replies: string[] | undefined,
  creator: CommentIdentity,
): Comment[] {
  return (replies || []).map((text, i) => ({
    id: `seed-${i}`,
    name: creator.name,
    handle: creator.handle,
    initials: creator.initials,
    color: creator.color,
    role: creator.role,
    company: creator.company,
    text,
    side: "left" as const,
    likes: 0,
    liked: false,
    replies: [],
    createdAt: seedCreatedAt(text, i),
  }));
}

export function toggleLikeById(comments: Comment[], id: string): Comment[] {
  return comments.map((c) => {
    if (c.id === id) {
      const liked = !c.liked;
      return { ...c, liked, likes: Math.max(0, c.likes + (liked ? 1 : -1)) };
    }
    return { ...c, replies: toggleLikeById(c.replies, id) };
  });
}

export function addReplyById(
  comments: Comment[],
  parentId: string,
  reply: Comment,
): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, reply] };
    return { ...c, replies: addReplyById(c.replies, parentId, reply) };
  });
}

export function countComments(comments: Comment[]): number {
  return comments.reduce((sum, c) => sum + 1 + countComments(c.replies), 0);
}

type NodeProps = {
  comment: Comment;
  onToggleLike: (id: string) => void;
  onReply: (c: Comment) => void;
  replyTargetId: string | null;
  translations: Record<string, TranslationState>;
  onTranslate: (comment: Comment) => void;
};

function CommentNode({
  comment,
  onToggleLike,
  onReply,
  replyTargetId,
  translations,
  onTranslate,
}: NodeProps) {
  const isReplyTarget = replyTargetId === comment.id;
  const translation = translations[comment.id];
  const roleLine = [comment.role, comment.company].filter(Boolean).join(" · ");
  const ago = timeAgo(comment.createdAt);

  return (
    <div
      className={`comment-node${isReplyTarget ? " is-reply-target" : ""}`}
      id={`comment-${comment.id}`}
    >
      <div className={`comment-row chat-${comment.side}`}>
        {comment.initials && (
          <ProfileLink
            handle={comment.handle || ""}
            className="profile-avatar-link"
          >
            <span className={`avatar ${comment.color || "yellow"}`}>
              {comment.initials}
            </span>
          </ProfileLink>
        )}
        <div className="chat-bubble">
          <div className="comment-head">
            <span className="comment-author">
              <strong>
                <ProfileLink handle={comment.handle || ""}>
                  {comment.name}
                </ProfileLink>
              </strong>
              {roleLine && <span className="comment-sep" aria-hidden="true" />}
              {roleLine && <span className="comment-role">{roleLine}</span>}
            </span>
            <span className="comment-time">
              <Clock size={10} /> {ago}
            </span>
          </div>
          <span className="comment-text">{renderMentions(comment.text)}</span>
          {translation?.text && (
            <div className="comment-translation">
              <small>Terjemahan</small>
              <p>{translation.text}</p>
            </div>
          )}
          {translation?.loading && (
            <span className="comment-translating">Menerjemahkan…</span>
          )}
          {translation?.error && (
            <span className="comment-translate-error">{translation.error}</span>
          )}
          <div className="comment-actions">
            <button
              type="button"
              className={comment.liked ? "is-liked" : ""}
              onClick={() => onToggleLike(comment.id)}
              aria-label={comment.liked ? "Batal suka" : "Sukai komentar"}
              aria-pressed={comment.liked}
            >
              <Heart size={13} fill={comment.liked ? "currentColor" : "none"} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
            <button
              type="button"
              onClick={() => onReply(comment)}
              aria-label="Balas komentar"
            >
              <CornerUpLeft size={13} /> <span>Balas</span>
            </button>
            <button
              type="button"
              className={`comment-translate-btn ${translation?.text ? "is-on" : ""}`}
              onClick={() => onTranslate(comment)}
              aria-pressed={!!translation?.text}
              aria-label={
                translation?.text
                  ? "Sembunyikan terjemahan"
                  : "Lihat terjemahan"
              }
            >
              <Languages size={13} />{" "}
              <span>{translation?.text ? "Sembunyikan" : "Terjemahkan"}</span>
            </button>
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((r) => (
            <CommentNode
              key={r.id}
              comment={r}
              onToggleLike={onToggleLike}
              onReply={onReply}
              replyTargetId={replyTargetId}
              translations={translations}
              onTranslate={onTranslate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({
  comments,
  onToggleLike,
  onAddReply,
  onAddComment,
}: {
  comments: Comment[];
  viewerName: string;
  onToggleLike: (id: string) => void;
  onAddReply: (parentId: string, text: string) => void;
  onAddComment: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [translations, setTranslations] = useState<
    Record<string, TranslationState>
  >({});
  const inputRef = useRef<HTMLInputElement>(null);
  const replying = replyTarget !== null;
  const activeDraft = replying ? replyDraft : draft;

  useEffect(() => {
    if (!replyTarget) return;
    inputRef.current?.focus();
    document
      .getElementById(`comment-${replyTarget.id}`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [replyTarget]);

  function handleReply(c: Comment) {
    setReplyTarget(c);
    setReplyDraft("");
  }

  function cancelReply() {
    setReplyTarget(null);
    setReplyDraft("");
  }

  function submitReply(parentId: string) {
    if (!replyDraft.trim()) return;
    const tag = replyTarget
      ? `@${replyTarget.handle || replyTarget.name} `
      : "";
    onAddReply(parentId, `${tag}${replyDraft.trim()}`);
    setReplyDraft("");
    setReplyTarget(null);
  }

  async function handleTranslate(comment: Comment) {
    const existing = translations[comment.id];
    // Sudah ada terjemahan → toggle sembunyikan.
    if (existing?.text) {
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[comment.id];
        return next;
      });
      return;
    }
    // Sedang memuat → abaikan klik ganda.
    if (existing?.loading) return;
    setTranslations((prev) => ({
      ...prev,
      [comment.id]: { text: "", loading: true },
    }));
    const translation = translateDemo(comment.text);
    setTranslations((previous) => ({
      ...previous,
      [comment.id]: translation
        ? { text: translation, loading: false }
        : {
            text: "",
            loading: false,
            error: "Terjemahan demo belum tersedia untuk komentar ini.",
          },
    }));
  }

  return (
    <div className="comment-thread">
      <div className="chat-list">
        {comments.length === 0 && (
          <p className="chat-empty">Belum ada komentar. Mulai percakapan.</p>
        )}
        {comments.map((c) => (
          <CommentNode
            key={c.id}
            comment={c}
            onToggleLike={onToggleLike}
            onReply={handleReply}
            replyTargetId={replyTarget?.id ?? null}
            translations={translations}
            onTranslate={handleTranslate}
          />
        ))}
      </div>
      <form
        className={replying ? "is-reply" : undefined}
        onSubmit={(e) => {
          e.preventDefault();
          if (replying && replyTarget) {
            submitReply(replyTarget.id);
            return;
          }
          if (!draft.trim()) return;
          onAddComment(draft.trim());
          setDraft("");
        }}
      >
        {replying && replyTarget && (
          <div className="reply-banner">
            <CornerUpLeft size={12} />
            <span>
              Membalas{" "}
              <strong>@{replyTarget.handle || replyTarget.name}</strong>
            </span>
            <button
              type="button"
              className="reply-cancel"
              aria-label="Batal balas"
              onClick={cancelReply}
            >
              <X size={14} />
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          aria-label={
            replying && replyTarget
              ? `Balas ${replyTarget.name}`
              : "Tulis komentar"
          }
          placeholder={
            replying && replyTarget
              ? `Balas ${replyTarget.name}…`
              : "Tulis komentar yang baik…"
          }
          value={activeDraft}
          onChange={(e) =>
            replying ? setReplyDraft(e.target.value) : setDraft(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Escape" && replying) {
              e.preventDefault();
              cancelReply();
            }
          }}
        />
        <button
          type="submit"
          disabled={!activeDraft.trim()}
          aria-label={replying ? "Kirim balasan" : "Kirim komentar"}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
