"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";

import { PostComposer } from "@/features/posting/post-composer";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  Bookmark,
  Plus,
  Check,
  X,
  Search,
  ArrowUpRight,
} from "lucide-react";
import type { SocialPost, NewPost } from "@/data/feed";
import { PostCard } from "@/features/feed/post-card";
import { ExploreView } from "@/features/explore/explore-view";
import {
  buildSeed,
  toggleLikeById,
  addReplyById,
  countComments,
  VIEWER_IDENTITY,
  type Comment,
} from "@/features/comments/comment-thread";
import { JobListings } from "@/features/jobs/job-listings";
import { LocationSearch } from "@/components/location-search";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PostCommentsOverlay } from "@/features/comments/post-comments-overlay";
import { type JobVacancy } from "@/data/jobs";
import { getPostOpportunity } from "@/data/opportunities";
import {
  FeedControls,
  type FeedMode,
  type KindFilter,
} from "@/features/feed/feed-controls";
import { RecommendedConnections } from "@/features/feed/recommended-connections";

type ComposeType = "text" | "media" | "custom";

export function Feed({
  active,
  posts,
  onPost,
  jobs,
  onPostJob,
  composerOpen,
  setComposerOpen,
  composeType,
  setComposeType,
  jobAutoOpen,
  jobPresetType,
  query,
  region,
  setRegion,
  locations,
  onSearch,
}: {
  active: string;
  posts: SocialPost[];
  onPost: (post: NewPost) => void;
  jobs: JobVacancy[];
  onPostJob: (job: JobVacancy) => void;
  composerOpen: boolean;
  setComposerOpen: (v: boolean) => void;
  composeType: ComposeType;
  setComposeType: (v: ComposeType) => void;
  jobAutoOpen?: boolean;
  jobPresetType?: string;
  query: string;
  region: string;
  setRegion: (v: string) => void;
  locations: string[];
  onSearch: (q: string) => void;
}) {
  const [liked, setLiked] = useLocalStorage<number[]>("post-likes", []);
  const router = useRouter();
  const [saved, setSaved] = useLocalStorage<number[]>("post-saved", []);
  const [muted, setMuted] = useLocalStorage<Record<number, boolean>>(
    "post-muted",
    {},
  );
  const [commentPost, setCommentPost] = useState<number | null>(null);
  const [comments, setComments] = useLocalStorage<Record<number, Comment[]>>(
    "post-comments",
    {},
  );
  const [notice, setNotice] = useState("");
  const [feedMode, setFeedMode] = useLocalStorage<FeedMode>("feed-mode", "all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const visibleMode = isSmallScreen ? "all" : feedMode;
  const visibleKind = isSmallScreen ? "all" : kindFilter;
  const visibleRegion = isSmallScreen ? "Public" : region;
  const [following] = useLocalStorage<Record<string, boolean>>("following", {});
  const [communities, setCommunities] = useLocalStorage<string[]>(
    "joined-communities",
    [],
  );
  function addedCount(p: SocialPost) {
    return comments[p.id]
      ? Math.max(0, countComments(comments[p.id]) - (p.replies || []).length)
      : 0;
  }
  const videoPosts = posts.filter((p) => p.video);
  const showReels = active === "Jelajahi" && !query;
  const showJobs = active === "Lowongan";
  const showFeed =
    ["Beranda", "Tersimpan"].includes(active) ||
    (active === "Jelajahi" && !!query);
  const visible = posts.filter(
    (p) =>
      (active !== "Tersimpan" || saved.includes(p.id)) &&
      (!["Beranda", "Jelajahi"].includes(active) ||
        visibleMode !== "following" ||
        following[p.handle]) &&
      (visibleKind === "all" || getPostOpportunity(p).kind === visibleKind) &&
      (!query ||
        `${p.name} ${p.text} ${p.tags}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (visibleRegion === "Public" ||
        (p.location || "").split(",")[0].trim() === visibleRegion),
  );
  const toggle = (
    id: number,
    values: number[],
    setter: (v: number[]) => void,
  ) =>
    setter(
      values.includes(id) ? values.filter((n) => n !== id) : [...values, id],
    );
  const activePost =
    commentPost !== null
      ? posts.find((p) => p.id === commentPost) || null
      : null;
  return (
    <main className={`feed ${showFeed ? "stream-feed" : ""}`}>
      {active !== "Lowongan" && (
        <h1 className="sr-only">
          {active === "Beranda" ? "Jaringan bisnis chatiers" : active}
        </h1>
      )}
      {!showReels && (
        <header
          className={`feed-header ${active === "Beranda" ? "is-sticky" : ""}`}
        >
          <div className="feed-header-left">
            <BrandLogo compact className="feed-brand" />
          </div>
          <span className="home-page-title">
            {active === "Beranda" ? "Beranda" : active}
          </span>
          <div className="feed-header-right">
            <button
              type="button"
              className="header-icon-button"
              aria-label="Buka pencarian"
              onClick={() => router.push("/search")}
            >
              <Search size={19} />
            </button>
          </div>
          {active === "Lowongan" && (
            <LocationSearch
              locations={locations}
              value={region}
              onChange={setRegion}
            />
          )}
        </header>
      )}
      {showReels ? (
        <ExploreView
          posts={videoPosts}
          liked={liked}
          saved={saved}
          setLiked={setLiked}
          setSaved={setSaved}
          onNotice={setNotice}
        />
      ) : showJobs ? (
        <JobListings
          region={region}
          jobs={jobs}
          onPostJob={onPostJob}
          onNotice={setNotice}
          autoOpenForm={jobAutoOpen}
          presetType={jobPresetType}
        />
      ) : showFeed ? (
        <>
          <FeedControls
            mode={feedMode}
            onModeChange={setFeedMode}
            kind={kindFilter}
            onKindChange={setKindFilter}
            region={region}
            onRegionChange={setRegion}
            locations={locations}
            showFollowing={active !== "Tersimpan"}
          />
          {query && (
            <div className="feed-query">
              <span>
                Hasil untuk <strong>{query}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  onSearch("");
                  router.push("/");
                }}
              >
                Hapus pencarian <X size={16} />
              </button>
            </div>
          )}
          {active === "Beranda" && !query && (
            <button
              type="button"
              className="home-compose-prompt"
              onClick={() => {
                setComposeType("text");
                setComposerOpen(true);
              }}
            >
              <span className="avatar yellow">AK</span>
              <span>Apa ide bisnis atau produk baru anda?</span>
            </button>
          )}
          {visible.length === 0 && (
            <div className="empty-state">
              <Bookmark />
              <h2>Belum ada postingan di sini</h2>
              <p>
                {active === "Tersimpan"
                  ? "Simpan postingan dengan ikon penanda untuk membacanya kembali."
                  : isSmallScreen
                    ? query
                      ? "Belum ada postingan yang cocok dengan pencarianmu."
                      : "Kabar dan peluang bisnis akan muncul di sini."
                    : feedMode === "following" && active === "Beranda"
                      ? "Ikuti koneksi bisnis untuk melihat kabar mereka di sini. Periksa juga filter lokasi dan jenis peluang."
                      : "Belum ada hasil yang cocok. Coba perluas lokasi atau jenis peluang."}
              </p>
              {!isSmallScreen && (
                <div className="empty-feed-actions">
                  {region !== "Public" && (
                    <button
                      className="secondary-feed-button"
                      onClick={() => setRegion("Public")}
                    >
                      Lihat semua lokasi
                    </button>
                  )}
                  {kindFilter !== "all" && (
                    <button
                      className="secondary-feed-button"
                      onClick={() => setKindFilter("all")}
                    >
                      Lihat semua jenis
                    </button>
                  )}
                  {active === "Beranda" && feedMode === "following" && (
                    <button
                      className="secondary-feed-button"
                      onClick={() => setFeedMode("all")}
                    >
                      Jelajahi semua postingan
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {visible.map((post, index) => (
            <Fragment key={post.id}>
              <PostCard
                post={post}
                liked={liked.includes(post.id)}
                saved={saved.includes(post.id)}
                commentCount={post.comments + addedCount(post)}
                onLike={() => toggle(post.id, liked, setLiked)}
                onSave={() => toggle(post.id, saved, setSaved)}
                onComment={() => setCommentPost(post.id)}
                onNotice={setNotice}
                muted={muted[post.id] ?? true}
                onToggleMute={() =>
                  setMuted((previous) => ({
                    ...previous,
                    [post.id]: !(previous[post.id] ?? true),
                  }))
                }
              />
              {active === "Beranda" && !query && index === 1 && (
                <RecommendedConnections inline />
              )}
            </Fragment>
          ))}
          {active === "Beranda" && !query && visible.length < 2 && (
            <RecommendedConnections inline />
          )}
          {active === "Beranda" && (
            <Link href="/lowongan" className="feed-opportunities-link">
              Temukan peluang karier di Lowongan <ArrowUpRight size={18} />
            </Link>
          )}
        </>
      ) : (
        <section className="empty-state">
          {active === "Profil" ? (
            <>
              <span className="avatar yellow">AK</span>
              <h2>Ardi Kurniawan</h2>
              <p>
                @ardikurniawan · Pemilik Bisnis · Menghubungkan peluang dan
                mitra.
              </p>
              <button
                className="primary-button"
                onClick={() => setComposerOpen(true)}
              >
                Bagikan postingan pertama
              </button>
            </>
          ) : active === "Komunitas" ? (
            <>
              <h2>Temukan ruang bisnis yang cocok</h2>
              {["Komunitas UMKM", "Agency & Kreatif", "Buyer & Supplier"].map(
                (n) => (
                  <button
                    className="community-row"
                    key={n}
                    onClick={() => {
                      const joined = communities.includes(n);
                      setCommunities((previous) =>
                        joined
                          ? previous.filter((name) => name !== n)
                          : [...previous, n],
                      );
                      setNotice(
                        joined
                          ? `Kamu keluar dari ${n}.`
                          : `Kamu bergabung dengan ${n}.`,
                      );
                    }}
                    aria-pressed={communities.includes(n)}
                  >
                    {n}
                    {communities.includes(n) ? (
                      <Check size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </button>
                ),
              )}
            </>
          ) : active === "Lowongan" ? null : (
            <>
              <MessageCircle />
              <h2>
                {active === "Pesan"
                  ? "Belum ada percakapan"
                  : "Kamu sudah mengikuti kabar terbaru"}
              </h2>
              <p>
                {active === "Pesan"
                  ? "Percakapan bisnis baru akan muncul di sini."
                  : "Notifikasi baru akan muncul di ruang ini."}
              </p>
              <small>
                Ini adalah pratinjau antarmuka, bukan layanan pesan langsung.
              </small>
            </>
          )}
        </section>
      )}
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            aria-label="Tutup pemberitahuan"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {composerOpen && (
        <PostComposer
          composeType={composeType}
          setComposeType={setComposeType}
          onPost={(post) => {
            setFeedMode("all");
            setKindFilter("all");
            onPost(post);
          }}
          setComposerOpen={setComposerOpen}
          setNotice={setNotice}
        />
      )}
      {activePost && (
        <PostCommentsOverlay
          post={activePost}
          liked={liked.includes(activePost.id)}
          saved={saved.includes(activePost.id)}
          muted={muted[activePost.id] ?? true}
          comments={comments[activePost.id]}
          onToggleLike={() => toggle(activePost.id, liked, setLiked)}
          onToggleSave={() => toggle(activePost.id, saved, setSaved)}
          onToggleMute={() => {
            const next = {
              ...muted,
              [activePost.id]: !(muted[activePost.id] ?? true),
            };
            setMuted(next);
          }}
          onNotice={setNotice}
          onClose={() => setCommentPost(null)}
          onToggleCommentLike={(id) =>
            setComments((prev) => ({
              ...prev,
              [activePost.id]: toggleLikeById(
                prev[activePost.id] ||
                  buildSeed(activePost.replies, activePost),
                id,
              ),
            }))
          }
          onAddReply={(parentId, text) =>
            setComments((prev) => {
              const list =
                prev[activePost.id] ||
                buildSeed(activePost.replies, activePost);
              const reply: Comment = {
                id: `r-${crypto.randomUUID()}`,
                ...VIEWER_IDENTITY,
                text,
                side: "right",
                likes: 0,
                liked: false,
                replies: [],
              };
              return {
                ...prev,
                [activePost.id]: addReplyById(list, parentId, reply),
              };
            })
          }
          onAddComment={(text) =>
            setComments((prev) => {
              const list =
                prev[activePost.id] ||
                buildSeed(activePost.replies, activePost);
              const c: Comment = {
                id: `c-${crypto.randomUUID()}`,
                ...VIEWER_IDENTITY,
                text,
                side: "right",
                likes: 0,
                liked: false,
                replies: [],
              };
              return { ...prev, [activePost.id]: [...list, c] };
            })
          }
        />
      )}
    </main>
  );
}
