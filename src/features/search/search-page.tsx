"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  TrendingUp,
  Hash,
  Briefcase,
  MapPin,
  Users as UsersIcon,
  Clock,
} from "lucide-react";
import {
  initialPosts,
  users,
  topics,
  type SocialPost,
  type ChatiersUser,
} from "@/data/feed";
import { jobVacancies, type JobVacancy } from "@/data/jobs";
import { ProfileLink } from "@/components/profile-link";

const SUGGESTED = [
  "PeluangBisnis",
  "LowonganKerja",
  "CariSupplier",
  "Distribusi",
  "KopiLokal",
  "Agency",
];
const MAX_RECENT = 8;

export function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useLocalStorage<string[]>("recent-searches", []);
  const inputRef = useRef<HTMLInputElement>(null);

  function commitSearch(term: string) {
    const value = term.trim();
    if (!value) return;
    setRecent((previous) =>
      [
        value,
        ...previous.filter(
          (item) => item.toLowerCase() !== value.toLowerCase(),
        ),
      ].slice(0, MAX_RECENT),
    );
  }
  function removeRecent(term: string, event: React.MouseEvent) {
    event.stopPropagation();
    setRecent((previous) => previous.filter((item) => item !== term));
  }
  function clearRecent() {
    setRecent([]);
  }

  function goHome() {
    router.push("/");
  }

  function pickSuggestion(tag: string) {
    setQuery(tag);
    commitSearch(tag);
    inputRef.current?.focus();
  }

  function pickRecent(term: string) {
    setQuery(term);
    commitSearch(term);
    inputRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) commitSearch(query);
  }

  const [posts] = useLocalStorage("posts", initialPosts);
  const [jobs] = useLocalStorage("jobs", jobVacancies);
  const q = query.trim().toLowerCase();

  const matchedPeople: ChatiersUser[] = q
    ? users.filter((u) =>
        `${u.name} ${u.handle} ${u.role} ${u.company} ${u.location}`
          .toLowerCase()
          .includes(q),
      )
    : [];
  const matchedPosts: SocialPost[] = q
    ? posts.filter((p) =>
        `${p.name} ${p.text} ${p.tags} ${p.company} ${p.role}`
          .toLowerCase()
          .includes(q),
      )
    : [];
  const matchedJobs: JobVacancy[] = q
    ? jobs.filter((j) =>
        `${j.position} ${j.company} ${j.location} ${j.caption} ${j.tags ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : [];
  const matchedTopics = q
    ? topics.filter((t) => t.tag.toLowerCase().includes(q))
    : [];

  const hasResults =
    q &&
    (matchedPeople.length ||
      matchedPosts.length ||
      matchedJobs.length ||
      matchedTopics.length);

  return (
    <main className="search-page">
      <h1 className="sr-only">Cari mitra, postingan, dan lowongan di chatiers</h1>
      <header className="search-header">
        <button
          type="button"
          className="search-back"
          aria-label="Kembali ke Beranda"
          onClick={goHome}
        >
          <ArrowLeft size={20} />
        </button>
        <form className="search-field" onSubmit={handleSubmit}>
          <Search size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Cari topik, mitra, lowongan…"
            aria-label="Cari topik, mitra, lowongan"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              aria-label="Hapus pencarian"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          )}
        </form>
        <button type="button" className="search-cancel" onClick={goHome}>
          Batal
        </button>
      </header>

      <div className="search-body">
        {!q && !isFocused && (
          <>
            <section className="search-section">
              <div className="search-section-head">
                <TrendingUp size={15} />
                <h3>Pencarian teratas</h3>
              </div>
              <div className="search-chips">
                {SUGGESTED.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="search-chip"
                    onClick={() => pickSuggestion(tag)}
                  >
                    <Hash size={12} />
                    {tag}
                  </button>
                ))}
              </div>
            </section>
            <section className="search-section">
              <div className="search-section-head">
                <Hash size={15} />
                <h3>Topik bisnis ramai</h3>
              </div>
              {topics.map((t, i) => (
                <button
                  key={t.tag}
                  type="button"
                  className="search-topic-row"
                  onClick={() => pickSuggestion(t.tag)}
                >
                  <span className="topic-number">0{i + 1}</span>
                  <span className="search-topic-text">
                    <strong>#{t.tag}</strong>
                    <small>{t.count}</small>
                  </span>
                </button>
              ))}
            </section>
            <section className="search-section">
              <div className="search-section-head">
                <UsersIcon size={15} />
                <h3>Mitra di jaringanmu</h3>
              </div>
              {users.slice(0, 4).map((u) => (
                <div className="search-person" key={u.handle}>
                  <ProfileLink
                    handle={u.handle}
                    className="profile-avatar-link"
                  >
                    <span className={`avatar ${u.color}`}>{u.initials}</span>
                  </ProfileLink>
                  <div className="search-person-meta">
                    <strong>
                      <ProfileLink handle={u.handle}>{u.name}</ProfileLink>
                    </strong>
                    <small>
                      {u.role} · {u.company}
                    </small>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {!q && isFocused && (
          <section className="search-section">
            <div className="search-section-head">
              <Clock size={15} />
              <h3>Pencarian terbaru</h3>
              {recent.length > 0 && (
                <button
                  type="button"
                  className="search-clear-all"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearRecent}
                >
                  Hapus semua
                </button>
              )}
            </div>
            {recent.length === 0 ? (
              <div className="search-recent-empty">
                Belum ada pencarian terbaru. Ketik sesuatu di kolom pencarian
                untuk mulai mencari.
              </div>
            ) : (
              <div className="search-recent-list">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="search-recent-row"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickRecent(term)}
                  >
                    <span className="search-recent-icon">
                      <Clock size={15} />
                    </span>
                    <span className="search-recent-text">{term}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="search-recent-remove"
                      aria-label={`Hapus ${term}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => removeRecent(term, e)}
                    >
                      <X size={14} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {q && !hasResults && (
          <div className="search-empty">
            <Search size={34} />
            <h2>Tidak ada hasil untuk “{query}”</h2>
            <p>
              Coba kata kunci lain, atau jelajahi topik dan mitra populer di
              bawah ini.
            </p>
            <div className="search-chips">
              {SUGGESTED.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="search-chip"
                  onClick={() => pickSuggestion(tag)}
                >
                  <Hash size={12} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {q && hasResults && (
          <>
            {matchedTopics.length > 0 && (
              <section className="search-section">
                <div className="search-section-head">
                  <Hash size={15} />
                  <h3>Topik</h3>
                </div>
                {matchedTopics.map((t) => (
                  <button
                    key={t.tag}
                    type="button"
                    className="search-topic-row"
                    onClick={() => pickSuggestion(t.tag)}
                  >
                    <span className="topic-number">#</span>
                    <span className="search-topic-text">
                      <strong>{t.tag}</strong>
                      <small>{t.count}</small>
                    </span>
                  </button>
                ))}
              </section>
            )}

            {matchedPeople.length > 0 && (
              <section className="search-section">
                <div className="search-section-head">
                  <UsersIcon size={15} />
                  <h3>Orang</h3>
                  <span className="search-count">{matchedPeople.length}</span>
                </div>
                {matchedPeople.map((u) => (
                  <div className="search-person" key={u.handle}>
                    <ProfileLink
                      handle={u.handle}
                      className="profile-avatar-link"
                    >
                      <span className={`avatar ${u.color}`}>{u.initials}</span>
                    </ProfileLink>
                    <div className="search-person-meta">
                      <strong>
                        <ProfileLink handle={u.handle}>{u.name}</ProfileLink>
                      </strong>
                      <small>
                        {u.role} · {u.company}
                      </small>
                      <span className="search-person-location">
                        <MapPin size={11} /> {u.location}
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {matchedJobs.length > 0 && (
              <section className="search-section">
                <div className="search-section-head">
                  <Briefcase size={15} />
                  <h3>Lowongan</h3>
                  <span className="search-count">{matchedJobs.length}</span>
                </div>
                {matchedJobs.map((j) => (
                  <div className="search-job" key={j.id}>
                    <span className="job-position-badge">{j.type}</span>
                    <strong>{j.position}</strong>
                    <small>
                      {j.company} · {j.location}
                    </small>
                  </div>
                ))}
              </section>
            )}

            {matchedPosts.length > 0 && (
              <section className="search-section">
                <div className="search-section-head">
                  <Search size={15} />
                  <h3>Postingan</h3>
                  <span className="search-count">{matchedPosts.length}</span>
                </div>
                {matchedPosts.map((p) => (
                  <article className="search-post" key={p.id}>
                    <ProfileLink
                      handle={p.handle}
                      className="profile-avatar-link"
                    >
                      <span className={`avatar ${p.color}`}>{p.initials}</span>
                    </ProfileLink>
                    <div className="search-post-meta">
                      <strong>
                        <ProfileLink handle={p.handle}>{p.name}</ProfileLink>
                      </strong>
                      <small>
                        @{p.handle} · {p.role} di {p.company}
                      </small>
                      <p>{p.text}</p>
                      {p.tags && (
                        <span className="search-post-tags">{p.tags}</span>
                      )}
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
