"use client";
import { useEffect, useRef, useState } from "react";
import { Expand, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { SocialPost } from "@/data/feed";
import { getPostVideoSource, isVideoSource } from "@/lib/post-media";

export function PostMedia({
  post,
  muted = true,
  onToggleMute,
  reel = false,
  active = true,
  autoPlay = false,
  onPreview,
}: {
  post: SocialPost;
  muted?: boolean;
  onToggleMute?: () => void;
  reel?: boolean;
  active?: boolean;
  autoPlay?: boolean;
  onPreview?: (currentTime: number) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const isVideoUrl = isVideoSource(post.image);
  const openPreview = () => onPreview?.(video.current?.currentTime ?? 0);
  const togglePlay = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      pausedByUser.current = false;
      element.play().catch(() => setError("Video belum bisa diputar."));
    } else {
      pausedByUser.current = true;
      element.pause();
    }
  };
  useEffect(() => {
    if (!active) video.current?.pause();
    else if (autoPlay && !pausedByUser.current && !document.hidden)
      video.current?.play().catch(() => {});
  }, [active, autoPlay]);
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) video.current?.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  if (!post.video)
    return onPreview ? (
      <button
        type="button"
        className="post-image-preview-button"
        aria-label={`Pratinjau gambar dari ${post.name}`}
        onClick={openPreview}
      >
        <img src={post.image} alt={post.alt} loading="lazy" decoding="async" />
      </button>
    ) : (
      <img
        src={post.image}
        alt={post.alt}
        loading={post.id === 1 ? "eager" : "lazy"}
        decoding="async"
      />
    );
  return (
    <>
      <video
        ref={video}
        src={getPostVideoSource(post, reel)}
        poster={isVideoUrl ? undefined : post.image}
        aria-label={post.alt || "Video bisnis"}
        preload={autoPlay && active ? "metadata" : "none"}
        playsInline
        loop={reel}
        muted={muted}
        onClick={onPreview ? openPreview : togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError("Video belum bisa dimuat.")}
      />
      {(!playing || reel) && (
        <button
          type="button"
          className={`reel-play ${playing ? "is-playing" : ""}`}
          aria-label={playing ? "Jeda video" : "Putar video"}
          onClick={onPreview ? openPreview : togglePlay}
        >
          {playing ? (
            <Pause size={22} />
          ) : (
            <Play size={reel ? 30 : 26} fill="currentColor" />
          )}
        </button>
      )}
      {onPreview && (
        <button
          type="button"
          className="post-video-preview-button"
          aria-label="Pratinjau video"
          onClick={openPreview}
        >
          <Expand size={18} />
        </button>
      )}
      {onToggleMute && (
        <button
          type="button"
          className={`${reel ? "reel-sound-toggle" : "sound-toggle"} ${muted ? "is-muted" : ""}`}
          aria-label={muted ? "Bunyikan suara" : "Bisukan suara"}
          aria-pressed={!muted}
          onClick={onToggleMute}
        >
          {muted ? (
            <VolumeX size={reel ? 18 : 9} />
          ) : (
            <Volume2 size={reel ? 18 : 9} />
          )}
        </button>
      )}
      {error && (
        <span role="status" className="media-error">
          {error}
        </span>
      )}
    </>
  );
}
