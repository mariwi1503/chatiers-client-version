"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Copy, Bookmark } from "lucide-react";
import { ProfileLink } from "@/components/profile-link";
import { PostMedia } from "@/components/post-media";
import type { SocialPost } from "@/data/feed";
import { compactPostTime, postCity } from "@/lib/post-metadata";
import { ExploreVideoMenu } from "./explore-video-menu";

export function ExploreVideoCard({
  post,
  active,
  liked,
  saved,
  muted,
  commentCount,
  onLike,
  onSave,
  onMute,
  onComment,
  onCopy,
  onHide,
  onRestore,
}: {
  post: SocialPost;
  active: boolean;
  liked: boolean;
  saved: boolean;
  muted: boolean;
  commentCount: number;
  onLike: () => void;
  onSave: () => void;
  onMute: () => void;
  onComment: () => void;
  onCopy: () => void;
  onHide: () => void;
  onRestore?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="explore-video-card">
      <div className="explore-video-media">
        <PostMedia
          post={post}
          reel
          autoPlay
          active={active}
          muted={muted}
          onToggleMute={onMute}
        />
      </div>
      <div className="explore-video-info">
        <div className="explore-video-author">
          <ProfileLink handle={post.handle} className="profile-avatar-link">
            <span className={`avatar ${post.color}`}>{post.initials}</span>
          </ProfileLink>
          <div>
            <div className="explore-author-line">
              <strong>
                <ProfileLink handle={post.handle}>{post.name}</ProfileLink>
              </strong>
              <span title={`${post.time} · ${post.location}`}>
                {compactPostTime(post.time)} · {postCity(post.location)}
              </span>
            </div>
            <small>
              {post.company} · {post.role}
            </small>
          </div>
        </div>
        <p
          className={`explore-video-description ${expanded ? "is-expanded" : ""}`}
        >
          {post.text}
        </p>
        <button
          className="explore-description-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Lebih sedikit" : "Selengkapnya"}
        </button>
        <div className="explore-video-tags" aria-label="Topik postingan">
          {post.tags
            .split(/\s+/)
            .filter(Boolean)
            .map((tag, index) => (
              <Link
                key={`${tag}-${index}`}
                href={`/?q=${encodeURIComponent(tag)}`}
              >
                {tag}
              </Link>
            ))}
        </div>
      </div>
      <div className="explore-video-actions">
        <button
          type="button"
          aria-label="Sukai postingan"
          aria-pressed={liked}
          className={liked ? "is-liked" : ""}
          onClick={onLike}
        >
          <Heart size={24} fill={liked ? "currentColor" : "none"} />
          <span>{post.likes + (liked ? 1 : 0)}</span>
        </button>
        <button type="button" aria-label="Buka komentar" onClick={onComment}>
          <MessageCircle size={24} />
          <span>{commentCount}</span>
        </button>
        <button
          type="button"
          aria-label="Salin teks postingan"
          title="Salin teks postingan"
          onClick={onCopy}
        >
          <Copy size={22} />
          <span>Salin</span>
        </button>
        <button
          type="button"
          aria-label="Simpan postingan"
          aria-pressed={saved}
          className={saved ? "is-saved" : ""}
          onClick={onSave}
        >
          <Bookmark size={24} fill={saved ? "currentColor" : "none"} />
          <span>Simpan</span>
        </button>
        <ExploreVideoMenu onHide={onHide} onRestore={onRestore} />
      </div>
    </article>
  );
}
