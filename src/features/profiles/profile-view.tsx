"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Globe,
  MapPin,
  Pencil,
  UserPlus,
  UserCheck,
  X,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { findUser, initialPosts } from "@/data/feed";
import { companyByHandle } from "@/data/products";
import {
  profileBio,
  profileConnections,
  profileWebsite,
  VIEWER_HANDLE,
} from "@/lib/profiles";
import { AnnouncementBoard } from "@/features/announcements/announcement-board";
import { PostCard } from "@/features/feed/post-card";
import { PostCommentsOverlay } from "@/features/comments/post-comments-overlay";
import {
  buildSeed,
  toggleLikeById,
  addReplyById,
  countComments,
  VIEWER_IDENTITY,
  type Comment,
} from "@/features/comments/comment-thread";
import { ProfileProducts } from "./profile-products";
import { ProfileCompany } from "./profile-company";
import { ProfileAbout } from "./profile-about";
import { ProfileEditDialog } from "./profile-edit-dialog";
import { ProfileConnectionsDialog } from "./profile-connections-dialog";

const tabs = [
  { value: "postingan", label: "Postingan" },
  { value: "tentang", label: "Tentang" },
  { value: "perusahaan", label: "Perusahaan" },
  { value: "produk", label: "Produk" },
] as const;
type Tab = (typeof tabs)[number]["value"];

export function ProfileView({ handle }: { handle: string }) {
  const user = findUser(handle);
  const company = companyByHandle(handle);
  const [details, setDetails] = useLocalStorage(`profile-details:${handle}`, {
    bio: profileBio(handle),
    location: user?.location || "",
    website: company?.website || "",
  });
  const [allPosts] = useLocalStorage("posts", initialPosts);
  const [tab, setTab] = useState<Tab>("postingan");
  const [liked, setLiked] = useLocalStorage<number[]>("post-likes", []);
  const [saved, setSaved] = useLocalStorage<number[]>("post-saved", []);
  const [muted, setMuted] = useLocalStorage<Record<number, boolean>>(
    "post-muted",
    {},
  );
  const [comments, setComments] = useLocalStorage<Record<number, Comment[]>>(
    "post-comments",
    {},
  );
  const [followed, setFollowed] = useLocalStorage<Record<string, boolean>>(
    "following",
    {},
  );
  const [commentPost, setCommentPost] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(false);
  const [listOpen, setListOpen] = useState<"following" | "followers" | null>(
    null,
  );
  const connections = profileConnections(handle, followed);
  const ownProfile = handle === VIEWER_HANDLE;
  const website = profileWebsite(details.website);
  const posts = allPosts.filter((post) => post.handle === handle);
  const activePost = posts.find((post) => post.id === commentPost);
  function follow(account: string) {
    setFollowed((previous) => ({ ...previous, [account]: !previous[account] }));
  }
  function toggle(
    id: number,
    values: number[],
    setter: (values: number[]) => void,
  ) {
    setter(
      values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
    );
  }
  function newComment(text: string): Comment {
    return {
      id: crypto.randomUUID(),
      ...VIEWER_IDENTITY,
      text,
      side: "right",
      likes: 0,
      liked: false,
      replies: [],
      createdAt: new Date().toISOString(),
    };
  }
  async function copyProfile() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${handle}`,
      );
      setNotice("Tautan profil berhasil disalin.");
    } catch {
      setNotice("Tautan tidak dapat disalin di browser ini.");
    }
  }
  if (!user) return null;
  return (
    <main className="profile-page profile-overview">
      <div className="profile-page-bar">
        <Link href="/" aria-label="Kembali ke Beranda">
          <ArrowLeft size={20} />
        </Link>
        <span>Profil bisnis</span>
        <div className="profile-page-actions">
          <button
            type="button"
            aria-label="Salin tautan profil"
            title="Salin tautan profil"
            onClick={copyProfile}
          >
            <Copy size={19} />
          </button>
        </div>
      </div>
      <header className="profile-summary">
        <div className="profile-person">
          <span className={`avatar ${user.color} profile-person-avatar`}>
            {user.initials}
          </span>
          <div>
            <div className="profile-person-heading">
              <h1>{user.name}</h1>
              {ownProfile && (
                <button
                  type="button"
                  className="profile-edit-icon"
                  aria-label="Edit profil"
                  title="Edit profil"
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={19} />
                </button>
              )}
            </div>
            <p className="profile-person-handle">@{handle}</p>
            <p className="profile-person-role">
              {user.role} <span>di {user.company}</span>
            </p>
          </div>
        </div>
        <p className="profile-summary-bio">{details.bio}</p>
        <div className="profile-summary-meta">
          <span>
            <MapPin size={15} />
            {details.location}
          </span>
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer">
              <Globe size={15} />
              {details.website}
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
        {!ownProfile && (
          <div className="profile-summary-actions">
            <button
              type="button"
              className={`profile-action ${followed[handle] ? "" : "primary"}`}
              aria-pressed={!!followed[handle]}
              onClick={() => follow(handle)}
            >
              {followed[handle] ? (
                <UserCheck size={18} />
              ) : (
                <UserPlus size={18} />
              )}
              {followed[handle] ? "Mengikuti" : "Ikuti"}
            </button>
            <button
              type="button"
              className="profile-action"
              onClick={() => {
                setTab("tentang");
                document
                  .getElementById("profile-sections")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Kontak bisnis
              <ArrowUpRight size={17} />
            </button>
          </div>
        )}
        <div className="profile-metrics">
          <button
            type="button"
            onClick={() => setListOpen("following")}
            aria-label={`${connections.following.length} Mengikuti`}
          >
            <strong>{connections.following.length}</strong>
            <span>Mengikuti</span>
          </button>
          <button
            type="button"
            onClick={() => setListOpen("followers")}
            aria-label={`${connections.followers.length} Pengikut`}
          >
            <strong>{connections.followers.length}</strong>
            <span>Pengikut</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("postingan");
              document
                .getElementById("profile-sections")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-label={`${posts.length} Postingan`}
          >
            <strong>{posts.length}</strong>
            <span>Postingan</span>
          </button>
        </div>
      </header>
      <AnnouncementBoard handle={handle} variant="preview" />
      <nav
        id="profile-sections"
        className="profile-section-tabs"
        aria-label="Bagian profil"
      >
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            className={tab === item.value ? "active" : ""}
            aria-pressed={tab === item.value}
            aria-controls="profile-section-content"
            onClick={() => setTab(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div id="profile-section-content" className="profile-section-content">
        {tab === "postingan" && (
          <section
            className="profile-posts"
            aria-label={`Postingan ${user.name}`}
          >
            <div className="profile-section-heading">
              <h2>Aktivitas bisnis</h2>
              <span>{posts.length} postingan</span>
            </div>
            {posts.length === 0 && (
              <div className="empty-state">
                <h3>Belum ada postingan</h3>
                <p>Kabar dan peluang bisnis akan muncul di sini.</p>
              </div>
            )}
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                profile
                liked={liked.includes(post.id)}
                saved={saved.includes(post.id)}
                muted={muted[post.id] ?? true}
                onToggleMute={() =>
                  setMuted((previous) => ({
                    ...previous,
                    [post.id]: !(previous[post.id] ?? true),
                  }))
                }
                commentCount={
                  post.comments +
                  (comments[post.id]
                    ? Math.max(
                        0,
                        countComments(comments[post.id]) - post.replies.length,
                      )
                    : 0)
                }
                onLike={() => toggle(post.id, liked, setLiked)}
                onSave={() => toggle(post.id, saved, setSaved)}
                onComment={() => setCommentPost(post.id)}
                onNotice={setNotice}
              />
            ))}
          </section>
        )}
        {tab === "tentang" && <ProfileAbout user={user} details={details} />}
        {tab === "perusahaan" && <ProfileCompany handle={handle} />}
        {tab === "produk" && <ProfileProducts handle={handle} />}
      </div>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            aria-label="Tutup pemberitahuan"
            onClick={() => setNotice("")}
          >
            <X size={18} />
          </button>
        </div>
      )}
      {editing && (
        <ProfileEditDialog
          details={details}
          onClose={() => setEditing(false)}
          onSave={(value) => {
            setDetails(value);
            setEditing(false);
            setNotice("Profil berhasil diperbarui di browser ini.");
          }}
        />
      )}
      {listOpen && (
        <ProfileConnectionsDialog
          title={listOpen === "following" ? "Mengikuti" : "Pengikut"}
          accounts={connections[listOpen]}
          followed={followed}
          onToggle={follow}
          onClose={() => setListOpen(null)}
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
          onToggleMute={() =>
            setMuted((previous) => ({
              ...previous,
              [activePost.id]: !(previous[activePost.id] ?? true),
            }))
          }
          onNotice={setNotice}
          onClose={() => setCommentPost(null)}
          onToggleCommentLike={(id) =>
            setComments((previous) => ({
              ...previous,
              [activePost.id]: toggleLikeById(
                previous[activePost.id] ||
                  buildSeed(activePost.replies, activePost),
                id,
              ),
            }))
          }
          onAddReply={(parentId, text) =>
            setComments((previous) => ({
              ...previous,
              [activePost.id]: addReplyById(
                previous[activePost.id] ||
                  buildSeed(activePost.replies, activePost),
                parentId,
                newComment(text),
              ),
            }))
          }
          onAddComment={(text) =>
            setComments((previous) => ({
              ...previous,
              [activePost.id]: [
                ...(previous[activePost.id] ||
                  buildSeed(activePost.replies, activePost)),
                newComment(text),
              ],
            }))
          }
        />
      )}
    </main>
  );
}
