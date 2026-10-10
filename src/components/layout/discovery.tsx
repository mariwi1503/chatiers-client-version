"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { ArrowUpRight, Search } from "lucide-react";
import { initialPosts, topics } from "@/data/feed";
import { RecommendedConnections } from "@/features/feed/recommended-connections";
export function Discovery({
  onSearch,
  onTopic,
  searchOnSubmit = false,
}: {
  onSearch: (v: string) => void;
  onTopic: (v: string) => void;
  searchOnSubmit?: boolean;
}) {
  const [posts] = useLocalStorage("posts", initialPosts);
  return (
    <aside className="discovery">
      <form
        className="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(
            String(new FormData(event.currentTarget).get("query") || ""),
          );
        }}
      >
        <Search size={18} />
        <input
          aria-label="Cari di chatiers"
          name="query"
          placeholder="Cari mitra, lowongan, atau peluang bisnis"
          onChange={(e) => {
            if (!searchOnSubmit) onSearch(e.target.value);
          }}
        />
      </form>
      <RecommendedConnections />
      <section className="side-section">
        <div className="section-label">
          <h3>Jelajahi topik bisnis</h3>
        </div>
        {topics.map((t, i) => (
          <button className="topic" key={t.tag} onClick={() => onTopic(t.tag)}>
            <span className="topic-number">0{i + 1}</span>
            <span>
              <strong>#{t.tag}</strong>
              <small>
                {
                  posts.filter((post) =>
                    post.tags.toLowerCase().includes(t.tag.toLowerCase()),
                  ).length
                }{" "}
                postingan
              </small>
            </span>
            <ArrowUpRight size={17} />
          </button>
        ))}
      </section>
      <footer className="side-footer">
        <span>Tentang chatiers</span>
        <span>Privasi</span>
        <span>Panduan komunitas</span>
        <p>© 2026 chatiers. Dibuat untuk bisnis.</p>
        <p>Pratinjau UI · aktivitas berlaku di browser ini.</p>
      </footer>
    </aside>
  );
}
