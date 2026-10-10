"use client";
import { useState } from "react";
import { Video, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { SocialPost } from "@/data/feed";
import { PostCommentsOverlay } from "@/features/comments/post-comments-overlay";
import {
  buildSeed,
  countComments,
  toggleLikeById,
  addReplyById,
  VIEWER_IDENTITY,
  type Comment,
} from "@/features/comments/comment-thread";
import { ExploreHeader } from "./explore-header";
import { ExplorePlayer } from "./explore-player";
import { ExploreVideoCard } from "./explore-video-card";

export function ExploreView({
  posts,
  liked,
  saved,
  setLiked,
  setSaved,
  onNotice,
}: {
  posts: SocialPost[];
  liked: number[];
  saved: number[];
  setLiked: (value: number[]) => void;
  setSaved: (value: number[]) => void;
  onNotice: (message: string) => void;
}) {
  const [hidden, setHidden] = useLocalStorage<number[]>("explore-hidden", []);
  const [muted, setMuted] = useLocalStorage<Record<number, boolean>>(
    "post-muted",
    {},
  );
  const [comments, setComments] = useLocalStorage<Record<number, Comment[]>>(
    "post-comments",
    {},
  );
  const [showUndo, setShowUndo] = useState(false);
  const [commentId, setCommentId] = useState<number | null>(null);
  const visible = posts.filter((post) => !hidden.includes(post.id));
  const commentPost = posts.find((post) => post.id === commentId);
  const hiddenCount = posts.filter((post) => hidden.includes(post.id)).length;
  function toggle(
    id: number,
    values: number[],
    setter: (value: number[]) => void,
  ) {
    setter(
      values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
    );
  }
  function commentCount(post: SocialPost) {
    return (
      post.comments +
      (comments[post.id]
        ? Math.max(0, countComments(comments[post.id]) - post.replies.length)
        : 0)
    );
  }
  function toggleMute(id: number) {
    setMuted((previous) => ({ ...previous, [id]: !(previous[id] ?? true) }));
  }
  function copy(post: SocialPost) {
    if (!navigator.clipboard) {
      onNotice("Penyalinan tidak tersedia di browser ini.");
      return;
    }
    navigator.clipboard
      .writeText(`${post.name}: ${post.text}`)
      .then(() => onNotice("Teks postingan berhasil disalin."))
      .catch(() =>
        onNotice("Tidak dapat menyalin. Coba lagi di browser lain."),
      );
  }
  function restoreVideos() {
    setHidden([]);
    setShowUndo(false);
  }
  return (
    <div className="explore-view">
      {visible.length ? (
        <ExplorePlayer
          key={visible.map((post) => post.id).join(",")}
          posts={visible}
          paused={!!commentPost}
          renderVideo={(post, active) => (
            <ExploreVideoCard
              post={post}
              active={active}
              liked={liked.includes(post.id)}
              saved={saved.includes(post.id)}
              muted={muted[post.id] ?? true}
              commentCount={commentCount(post)}
              onLike={() => toggle(post.id, liked, setLiked)}
              onSave={() => toggle(post.id, saved, setSaved)}
              onMute={() => toggleMute(post.id)}
              onCopy={() => copy(post)}
              onComment={() => {
                setCommentId(post.id);
              }}
              onHide={() => {
                setHidden((previous) => [
                  ...previous.filter((id) => id !== post.id),
                  post.id,
                ]);
                setShowUndo(true);
              }}
              onRestore={hiddenCount > 0 ? restoreVideos : undefined}
            />
          )}
        />
      ) : (
        <div className="explore-empty" role="status">
          <ExploreHeader />
          <Video size={32} />
          <h2>
            {posts.length
              ? "Semua video disembunyikan"
              : "Belum ada video bisnis"}
          </h2>
          <p>
            {posts.length
              ? "Tampilkan kembali video untuk melanjutkan Jelajahi."
              : "Video dari jaringan bisnis kamu akan tampil di sini."}
          </p>
          {hiddenCount > 0 && (
            <button type="button" onClick={restoreVideos}>
              Tampilkan video yang disembunyikan
            </button>
          )}
        </div>
      )}
      {showUndo && (
        <div className="explore-undo" role="status">
          <span>Video disembunyikan</span>
          <button
            type="button"
            onClick={() => {
              setHidden((previous) => previous.slice(0, -1));
              setShowUndo(false);
            }}
          >
            Urungkan
          </button>
          <button
            type="button"
            aria-label="Tutup pemberitahuan video"
            onClick={() => setShowUndo(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}
      {commentPost && (
        <PostCommentsOverlay
          post={commentPost}
          liked={liked.includes(commentPost.id)}
          saved={saved.includes(commentPost.id)}
          muted={muted[commentPost.id] ?? true}
          comments={comments[commentPost.id]}
          onToggleLike={() => toggle(commentPost.id, liked, setLiked)}
          onToggleSave={() => toggle(commentPost.id, saved, setSaved)}
          onToggleMute={() => toggleMute(commentPost.id)}
          onNotice={onNotice}
          onClose={() => setCommentId(null)}
          onToggleCommentLike={(id) =>
            setComments((previous) => ({
              ...previous,
              [commentPost.id]: toggleLikeById(
                previous[commentPost.id] ||
                  buildSeed(commentPost.replies, commentPost),
                id,
              ),
            }))
          }
          onAddReply={(parentId, text) =>
            setComments((previous) => ({
              ...previous,
              [commentPost.id]: addReplyById(
                previous[commentPost.id] ||
                  buildSeed(commentPost.replies, commentPost),
                parentId,
                {
                  id: `r-${crypto.randomUUID()}`,
                  ...VIEWER_IDENTITY,
                  text,
                  side: "right",
                  likes: 0,
                  liked: false,
                  replies: [],
                },
              ),
            }))
          }
          onAddComment={(text) =>
            setComments((previous) => ({
              ...previous,
              [commentPost.id]: [
                ...(previous[commentPost.id] ||
                  buildSeed(commentPost.replies, commentPost)),
                {
                  id: `c-${crypto.randomUUID()}`,
                  ...VIEWER_IDENTITY,
                  text,
                  side: "right",
                  likes: 0,
                  liked: false,
                  replies: [],
                },
              ],
            }))
          }
        />
      )}
    </div>
  );
}
