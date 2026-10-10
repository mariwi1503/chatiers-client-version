"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SocialPost } from "@/data/feed";
import { ExploreHeader } from "./explore-header";

export function ExplorePlayer({
  posts,
  paused,
  renderVideo,
}: {
  posts: SocialPost[];
  paused: boolean;
  renderVideo: (post: SocialPost, active: boolean) => ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const [index, setIndex] = useState(0);
  const go = useCallback(
    (next: number) => {
      const element = track.current;
      if (!element) return;
      const clamped = Math.max(0, Math.min(posts.length - 1, next));
      element.scrollTo({
        top: clamped * element.clientHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    },
    [posts.length],
  );
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollTo({
        top: currentIndex.current * element.clientHeight,
        behavior: "instant",
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="explore-player"
      tabIndex={0}
      aria-label="Pemutar video bisnis"
      onKeyDown={(event) => {
        if (
          paused ||
          (event.target as HTMLElement).closest(
            "input, textarea, select, [contenteditable='true']",
          )
        )
          return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          go(index + (event.key === "ArrowDown" ? 1 : -1));
        }
      }}
    >
      <ExploreHeader />
      <div
        className="explore-track"
        ref={track}
        onScroll={(event) => {
          const element = event.currentTarget;
          const next = Math.max(
            0,
            Math.min(
              posts.length - 1,
              Math.round(element.scrollTop / element.clientHeight),
            ),
          );
          currentIndex.current = next;
          setIndex(next);
        }}
      >
        {posts.map((post, position) => (
          <section
            key={post.id}
            className="explore-video-page"
            aria-label={`Video dari ${post.name}`}
            aria-hidden={position !== index}
            inert={position !== index}
          >
            {renderVideo(post, position === index && !paused)}
          </section>
        ))}
      </div>
      <span
        className="explore-video-counter sr-only"
        role="status"
        aria-live="polite"
      >
        Video {index + 1} dari {posts.length}
      </span>
      <div className="explore-player-navigation">
        <button
          type="button"
          aria-label="Reel sebelumnya"
          title="Video sebelumnya"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          <ChevronUp size={20} />
        </button>
        <button
          type="button"
          aria-label="Reel berikutnya"
          title="Video berikutnya"
          disabled={index === posts.length - 1}
          onClick={() => go(index + 1)}
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
}
