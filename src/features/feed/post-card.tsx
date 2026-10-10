"use client";
import { Heart, MessageCircle, Repeat2, Bookmark, MapPin } from "lucide-react";
import type { SocialPost } from "@/data/feed";
import { ProfileLink } from "@/components/profile-link";
import { PostMedia } from "@/components/post-media";
import Link from "next/link";
import { compactPostTime, postCity } from "@/lib/post-metadata";
import { getPostCategory } from "@/data/feed-presentation";
import { FeedMediaGallery } from "@/features/feed/feed-media-gallery";
import { PostMenu } from "@/features/feed/post-menu";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useState } from "react";
import { FeedMediaPreview } from "@/features/feed/feed-media-preview";

export function PostCard({
  post,
  liked,
  saved,
  commentCount,
  onLike,
  onSave,
  onComment,
  onNotice,
  muted,
  onToggleMute,
  profile = false,
  children,
}: {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  commentCount: number;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
  onNotice: (message: string) => void;
  muted?: boolean;
  onToggleMute?: () => void;
  profile?: boolean;
  children?: React.ReactNode;
}) {
  const [reposts, setReposts] = useLocalStorage<number[]>("post-reposts", []);
  const reposted = reposts.includes(post.id);
  const category = getPostCategory(post);
  const [preview, setPreview] = useState<{
    index: number;
    time: number;
  } | null>(null);
  const media = post.image && (
    <div className={`post-media ${post.video ? "is-video" : ""}`}>
      <PostMedia
        post={post}
        muted={muted}
        onToggleMute={onToggleMute}
        active={!preview}
        onPreview={(time) => setPreview({ index: 0, time })}
      />
      <span className="location">
        <MapPin size={12} />
        {post.location}
      </span>
      <span className="image-index">
        0{post.id} / {post.video ? "VIDEO" : "BISNIS"}
      </span>
    </div>
  );
  function copyText() {
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
  return (
    <article
      id={`post-${post.id}`}
      className={`post ${profile ? "profile-feed-card" : ""}`}
    >
      <div className="post-body">
        <ProfileLink handle={post.handle} className="profile-avatar-link">
          <span className={`avatar ${post.color}`}>{post.initials}</span>
        </ProfileLink>
        <div className="post-content">
          <div className="post-header post-card-header">
            <div className="post-author-row">
              <strong>
                <ProfileLink handle={post.handle}>{post.name}</ProfileLink>
              </strong>
              <span
                className="post-time"
                title={`${post.time} · ${post.location}`}
                aria-label={`${post.time} · ${post.location}`}
              >
                {[compactPostTime(post.time), postCity(post.location)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
            <PostMenu onCopy={copyText} />
            <small className="post-business-info">
              <span>
                {post.role} @ {post.company}
              </span>
              {!profile && (
                <span className={`post-category category-${category.kind}`}>
                  {category.label}
                </span>
              )}
            </small>
          </div>
          <p className="post-text">{post.text}</p>
          <div className="tags" aria-label="Topik postingan">
            {post.tags
              .split(/\s+/)
              .filter(Boolean)
              .map((tag, index) => (
                <Link
                  href={`/?q=${encodeURIComponent(tag)}`}
                  key={`${tag}-${index}`}
                >
                  {tag}
                </Link>
              ))}
          </div>
          {!profile &&
            (post.video ? (
              media
            ) : (
              <FeedMediaGallery
                post={post}
                onPreview={(index) => setPreview({ index, time: 0 })}
              />
            ))}
        </div>
      </div>
      {profile && media}
      <div className="post-actions">
        <button
          className={liked ? "is-liked" : ""}
          onClick={onLike}
          aria-label="Sukai postingan"
          aria-pressed={liked}
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button onClick={onComment} aria-label="Buka komentar">
          <MessageCircle size={20} />
          {commentCount}
        </button>
        <button
          className={reposted ? "is-reposted" : ""}
          aria-label="Repost postingan"
          aria-pressed={reposted}
          onClick={() => {
            setReposts((previous) =>
              previous.includes(post.id)
                ? previous.filter((id) => id !== post.id)
                : [...previous, post.id],
            );
            onNotice(
              reposted
                ? "Repost dibatalkan."
                : "Postingan ditandai sebagai repost di perangkat ini.",
            );
          }}
        >
          <Repeat2 size={20} />
          {reposted ? 1 : 0}
        </button>
        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          aria-label="Simpan postingan"
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      {children}
      {preview && (
        <FeedMediaPreview
          post={post}
          initialIndex={preview.index}
          startTime={preview.time}
          muted={muted}
          onToggleMute={onToggleMute}
          onClose={() => setPreview(null)}
        />
      )}
    </article>
  );
}
