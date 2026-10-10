"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Handshake,
  Lightbulb,
  Megaphone,
  Star,
  Users,
} from "lucide-react";
import {
  CommentThread,
  VIEWER_IDENTITY,
  addReplyById,
  toggleLikeById,
  type Comment,
} from "@/features/comments/comment-thread";
import { CountdownBadge } from "@/features/announcements/countdown-badge";
import { findUser } from "@/data/feed";
import {
  formatAnnouncementDate,
  type AnnouncementColor,
  type AnnouncementIcon,
} from "@/lib/announcements";

const ICONS: Record<AnnouncementIcon, typeof Megaphone> = {
  megaphone: Megaphone,
  handshake: Handshake,
  calendar: CalendarDays,
  users: Users,
  star: Star,
  bulb: Lightbulb,
};

type AnnouncementView = {
  id: string;
  title: string;
  body: string;
  color: AnnouncementColor;
  icon: AnnouncementIcon;
  eventDate: string;
  temporary: boolean;
  expiresAt: string;
};

export function AnnouncementDetail({
  announcement,
  handle,
}: {
  announcement: AnnouncementView;
  handle: string;
}) {
  const user = findUser(handle);
  const [allComments, setAllComments] = useLocalStorage<
    Record<string, Comment[]>
  >("announcement-comments", {});
  const comments = allComments[announcement.id] || [];
  const setComments = (action: (previous: Comment[]) => Comment[]) =>
    setAllComments((previous) => ({
      ...previous,
      [announcement.id]: action(previous[announcement.id] || []),
    }));
  const Icon = ICONS[announcement.icon];

  return (
    <main className="announce-detail">
      <header className="announce-detail-header">
        <Link
          href={`/profile/${handle}/announcements`}
          className="announce-detail-back"
          aria-label="Kembali ke daftar chatboard"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1>Komentar Chatboard</h1>
      </header>

      <div className="announce-detail-caption">
        <div className={`announce-detail-note note-${announcement.color}`}>
          <Icon size={22} strokeWidth={2.2} />
          <strong>{announcement.title}</strong>
          {announcement.body && <p>{announcement.body}</p>}
          <small>
            <CalendarDays size={11} />{" "}
            {announcement.eventDate
              ? formatAnnouncementDate(announcement.eventDate)
              : "Berlangsung"}
          </small>
        </div>
        {user && (
          <div className="announce-detail-author">
            <span className={`avatar ${user.color}`}>{user.initials}</span>
            <div>
              <strong>{user.name}</strong>
              <small>
                {user.role} di {user.company}
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="announce-detail-comments">
        <div className="announce-detail-comments-head">
          <span>Komentar ({comments.length})</span>
          {announcement.temporary && (
            <CountdownBadge expiresAt={announcement.expiresAt} />
          )}
        </div>
        <div className="comments">
          <CommentThread
            comments={comments}
            viewerName="Ardi"
            onToggleLike={(id) =>
              setComments((prev) => toggleLikeById(prev, id))
            }
            onAddReply={(parentId, text) =>
              setComments((prev) => {
                const reply: Comment = {
                  id: `r-${crypto.randomUUID()}`,
                  ...VIEWER_IDENTITY,
                  text,
                  side: "right",
                  likes: 0,
                  liked: false,
                  replies: [],
                };
                return addReplyById(prev, parentId, reply);
              })
            }
            onAddComment={(text) =>
              setComments((prev) => {
                const c: Comment = {
                  id: `c-${crypto.randomUUID()}`,
                  ...VIEWER_IDENTITY,
                  text,
                  side: "right",
                  likes: 0,
                  liked: false,
                  replies: [],
                };
                return [...prev, c];
              })
            }
          />
        </div>
      </div>
    </main>
  );
}
