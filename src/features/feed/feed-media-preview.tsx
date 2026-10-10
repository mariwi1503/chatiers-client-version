"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { SocialPost } from "@/data/feed";
import { getPostGallery } from "@/data/feed-presentation";
import { getPostVideoSource, isVideoSource } from "@/lib/post-media";
import { useDialog } from "@/hooks/use-dialog";

export function FeedMediaPreview({
  post,
  initialIndex,
  startTime = 0,
  muted = true,
  onToggleMute,
  onClose,
}: {
  post: SocialPost;
  initialIndex: number;
  startTime?: number;
  muted?: boolean;
  onToggleMute?: () => void;
  onClose: () => void;
}) {
  const images = getPostGallery(post);
  const [active, setActive] = useState(initialIndex);
  const [error, setError] = useState("");
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const current = useRef(initialIndex);
  const drag = useRef<{
    x: number;
    left: number;
    index: number;
    moved: boolean;
  } | null>(null);
  function goTo(index: number) {
    const element = track.current;
    if (!element) return;
    element.scrollTo({
      left:
        Math.max(0, Math.min(images.length - 1, index)) * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  useDialog(true, onClose);
  const onArrow = useEffectEvent((event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    goTo(current.current + (event.key === "ArrowRight" ? 1 : -1));
  });
  useEffect(() => {
    if (post.video) return;
    window.addEventListener("keydown", onArrow);
    return () => window.removeEventListener("keydown", onArrow);
  }, [post.video]);

  useEffect(() => {
    const element = video.current;
    const pause = () => {
      if (document.hidden) element?.pause();
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      element?.pause();
      document.removeEventListener("visibilitychange", pause);
    };
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollTo({
        left: current.current * element.clientWidth,
        behavior: "instant",
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return createPortal(
    <div
      className="feed-media-preview-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="feed-media-preview"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-media-preview-title"
      >
        <header className="feed-media-preview-header">
          <div>
            <h2 id="feed-media-preview-title">
              {post.video ? "Pratinjau video" : "Pratinjau gambar"}
            </h2>
            <p>{post.name}</p>
          </div>
          <button type="button" aria-label="Tutup pratinjau" onClick={onClose}>
            <X size={24} />
          </button>
        </header>
        {post.video ? (
          <div className="feed-media-preview-video">
            <video
              ref={video}
              src={getPostVideoSource(post, startTime === 0)}
              poster={isVideoSource(post.image) ? undefined : post.image}
              controls
              tabIndex={0}
              autoPlay
              playsInline
              muted={muted}
              aria-label={post.alt || `Video dari ${post.name}`}
              onLoadedMetadata={(event) => {
                if (startTime > 0)
                  event.currentTarget.currentTime = Math.min(
                    startTime,
                    event.currentTarget.duration || startTime,
                  );
              }}
              onVolumeChange={(event) => {
                if (onToggleMute && event.currentTarget.muted !== muted)
                  onToggleMute();
              }}
              onError={() =>
                setError(
                  "Video belum bisa dimuat. Tutup pratinjau dan coba kembali.",
                )
              }
            />
            {error && <p role="status">{error}</p>}
          </div>
        ) : (
          <>
            <div
              className="feed-media-preview-track"
              ref={track}
              tabIndex={0}
              aria-label="Galeri gambar, geser ke kiri atau kanan"
              onScroll={(event) => {
                const element = event.currentTarget;
                const index = Math.max(
                  0,
                  Math.min(
                    images.length - 1,
                    Math.round(element.scrollLeft / element.clientWidth),
                  ),
                );
                current.current = index;
                setActive(index);
              }}
              onPointerDown={(event) => {
                if (
                  !event.isPrimary ||
                  (event.pointerType === "mouse" && event.button !== 0)
                )
                  return;
                drag.current = {
                  x: event.clientX,
                  left: event.currentTarget.scrollLeft,
                  index: current.current,
                  moved: false,
                };
              }}
              onPointerMove={(event) => {
                if (!drag.current) return;
                const delta = event.clientX - drag.current.x;
                if (Math.abs(delta) > 6 && !drag.current.moved) {
                  drag.current.moved = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  event.currentTarget.style.scrollSnapType = "none";
                }
                if (drag.current.moved)
                  event.currentTarget.scrollLeft = drag.current.left - delta;
              }}
              onPointerUp={(event) => {
                if (!drag.current) return;
                const gesture = drag.current;
                drag.current = null;
                event.currentTarget.style.scrollSnapType = "";
                if (gesture.moved) {
                  const distance = gesture.x - event.clientX;
                  const threshold = Math.min(
                    60,
                    event.currentTarget.clientWidth * 0.15,
                  );
                  goTo(
                    gesture.index +
                      (Math.abs(distance) >= threshold
                        ? Math.sign(distance)
                        : 0),
                  );
                }
              }}
              onPointerCancel={(event) => {
                if (!drag.current) return;
                const index = drag.current.index;
                drag.current = null;
                event.currentTarget.style.scrollSnapType = "";
                goTo(index);
              }}
              onPointerLeave={() => {
                if (!drag.current?.moved) drag.current = null;
              }}
            >
              {images.map((image, index) => (
                <figure
                  className="feed-media-preview-slide"
                  key={`${image.image}-${index}`}
                  aria-hidden={active !== index}
                >
                  <img
                    src={image.image}
                    alt={image.alt}
                    draggable={false}
                    decoding="async"
                    onError={() => setError("Gambar belum bisa dimuat.")}
                  />
                </figure>
              ))}
            </div>
            {error && (
              <p role="status" className="feed-media-preview-error">
                {error}
              </p>
            )}
            {images.length > 1 && (
              <footer className="feed-media-preview-navigation">
                <button
                  type="button"
                  aria-label="Gambar sebelumnya"
                  disabled={active === 0}
                  onClick={() => {
                    goTo(active - 1);
                    track.current?.focus({ preventScroll: true });
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <span role="status" aria-live="polite">
                  {active + 1} / {images.length}
                </span>
                <button
                  type="button"
                  aria-label="Gambar berikutnya"
                  disabled={active === images.length - 1}
                  onClick={() => {
                    goTo(active + 1);
                    track.current?.focus({ preventScroll: true });
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </footer>
            )}
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
