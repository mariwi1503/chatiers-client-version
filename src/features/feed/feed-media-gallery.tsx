"use client";

import { useRef, useState } from "react";
import { getPostGallery } from "@/data/feed-presentation";
import type { SocialPost } from "@/data/feed";

export function FeedMediaGallery({
  post,
  onPreview,
}: {
  post: SocialPost;
  onPreview: (index: number) => void;
}) {
  const images = getPostGallery(post);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  if (!images.length) return null;

  function goTo(index: number) {
    const element = track.current;
    const item = element?.children[index] as HTMLElement | undefined;
    if (!element || !item) return;
    element.scrollTo({
      left:
        item.offsetLeft - (element.firstElementChild as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div
      className="feed-gallery"
      role="group"
      aria-label={`Foto dari ${post.name}`}
    >
      <div
        className="feed-gallery-track"
        ref={track}
        tabIndex={images.length > 1 ? 0 : undefined}
        aria-label={
          images.length > 1
            ? "Galeri foto, geser untuk melihat lainnya"
            : undefined
        }
        onScroll={(event) => {
          const element = event.currentTarget;
          const first = element.children[0] as HTMLElement;
          const next = element.children[1] as HTMLElement | undefined;
          const step = next
            ? next.offsetLeft - first.offsetLeft
            : first.offsetWidth;
          setActive(
            Math.min(images.length - 1, Math.round(element.scrollLeft / step)),
          );
        }}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          goTo(
            Math.max(
              0,
              Math.min(
                images.length - 1,
                active + (event.key === "ArrowRight" ? 1 : -1),
              ),
            ),
          );
        }}
      >
        {images.map((item, index) => (
          <figure className="feed-gallery-item" key={`${item.image}-${index}`}>
            <button
              type="button"
              className="feed-gallery-open"
              aria-label={`Pratinjau gambar ${index + 1} dari ${post.name}`}
              onClick={() => onPreview(index)}
            >
              <img
                src={item.image}
                alt={item.alt}
                loading={post.id === 1 && index === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
              {images.length > 1 && (
                <span className="feed-gallery-count">
                  {index + 1}/{images.length}
                </span>
              )}
            </button>
          </figure>
        ))}
      </div>
      {images.length > 1 && (
        <div className="feed-gallery-dots" aria-label="Pilih foto">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              aria-label={`Lihat foto ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => goTo(index)}
            >
              <span />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
