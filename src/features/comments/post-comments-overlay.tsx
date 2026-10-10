"use client";

import { createPortal } from "react-dom";
import { useDialog } from "@/hooks/use-dialog";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
  X,
} from "lucide-react";
import { PostMedia } from "@/components/post-media";
import type { SocialPost } from "@/data/feed";
import { ProfileLink } from "@/components/profile-link";
import {
  CommentThread,
  buildSeed,
  countComments,
  type Comment,
} from "@/features/comments/comment-thread";

type Props = {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  muted: boolean;
  comments: Comment[] | undefined;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleMute: () => void;
  onNotice: (msg: string) => void;
  onClose: () => void;
  onToggleCommentLike: (id: string) => void;
  onAddReply: (parentId: string, text: string) => void;
  onAddComment: (text: string) => void;
};

export function PostCommentsOverlay({
  post,
  liked,
  saved,
  muted,
  comments,
  onToggleLike,
  onToggleSave,
  onToggleMute,
  onNotice,
  onClose,
  onToggleCommentLike,
  onAddReply,
  onAddComment,
}: Props) {
  useDialog(true, onClose);

  const addedCount = comments
    ? Math.max(0, countComments(comments) - (post.replies || []).length)
    : 0;

  function share() {
    if (navigator.clipboard)
      navigator.clipboard
        .writeText(`${post.name}: ${post.text}`)
        .then(() => onNotice("Teks postingan berhasil disalin."))
        .catch(() =>
          onNotice("Tidak dapat menyalin. Coba lagi di browser lain."),
        );
    else onNotice("Penyalinan tidak tersedia di browser ini.");
  }

  return createPortal(
    <div
      className="post-comments-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Komentar postingan"
    >
      <header className="post-comments-bar">
        <button type="button" aria-label="Kembali" onClick={onClose}>
          <X size={20} />
        </button>
        <span>Komentar</span>
        <button
          type="button"
          aria-label="Informasi postingan"
          onClick={() =>
            onNotice("Postingan bisnis · Dibagikan untuk jaringan chatiers.")
          }
        >
          <MoreHorizontal size={20} />
        </button>
      </header>
      <div className="post-comments-scroll">
        <article className="post post-comments-post">
          <div className="post-body">
            <ProfileLink handle={post.handle} className="profile-avatar-link">
              <span className={`avatar ${post.color}`}>{post.initials}</span>
            </ProfileLink>
            <div className="post-content">
              <div className="post-header">
                <div>
                  <strong>
                    <ProfileLink handle={post.handle}>
                      {post.name}
                    </ProfileLink>{" "}
                  </strong>
                  <small>
                    @{post.handle}{" "}
                    <span>
                      · {post.role} di {post.company}
                    </span>{" "}
                    <span>· {post.time}</span>
                  </small>
                </div>
              </div>
              <p className="post-text">{post.text}</p>
              <button
                className="tags"
                onClick={() => onNotice(`Topik postingan: ${post.tags}`)}
              >
                {post.tags}
              </button>
              {post.image && (
                <div className={`post-media ${post.video ? "is-video" : ""}`}>
                  <PostMedia
                    post={post}
                    muted={muted}
                    onToggleMute={onToggleMute}
                  />
                  <span className="location">
                    <MapPin size={12} />
                    {post.location}
                  </span>
                  <span className="image-index">
                    0{post.id} / {post.video ? "VIDEO" : "BISNIS"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="post-actions">
            <button
              className={liked ? "is-liked" : ""}
              onClick={onToggleLike}
              aria-label="Sukai postingan"
              aria-pressed={liked}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
              {post.likes + (liked ? 1 : 0)}
            </button>
            <button aria-label="Komentar">
              <MessageCircle size={20} />
              {post.comments + addedCount}
            </button>
            <button aria-label="Bagikan postingan" onClick={share}>
              <Send size={19} />
            </button>
            <button
              className={`save-button ${saved ? "is-saved" : ""}`}
              aria-label="Simpan postingan"
              aria-pressed={saved}
              onClick={onToggleSave}
            >
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </article>
        <div className="post-comments-thread">
          <CommentThread
            comments={comments || buildSeed(post.replies, post)}
            viewerName="Ardi"
            onToggleLike={onToggleCommentLike}
            onAddReply={onAddReply}
            onAddComment={onAddComment}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
