"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Play,
  Volume2,
  VolumeX,
  FolderKanban,
  ImageIcon,
  Video,
} from "lucide-react";
import { findUser } from "@/data/feed";
import { momentsByHandle, type ProjectMoment } from "@/data/projects";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ProfileLink } from "@/components/profile-link";

export function ProjectMoments({ handle }: { handle: string }) {
  const user = findUser(handle);
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");

  if (!user) {
    return (
      <main className="profile-page">
        <BrandLogo className="profile-brand" />
        <Link href="/" className="profile-back">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
        <div className="empty-state">
          <h2>Pengguna tidak ditemukan</h2>
          <p>Profil yang kamu cari tidak tersedia di jaringan chatiers.</p>
        </div>
      </main>
    );
  }

  const all = momentsByHandle(handle);
  const moments = all.filter((m) =>
    filter === "all" ? true : filter === "video" ? m.video : !m.video,
  );

  return (
    <main className="profile-page projects-page">
      <div className="profile-page-bar">
        <Link href={`/profile/${handle}`} aria-label="Kembali ke profil">
          <ArrowLeft size={20} />
        </Link>
        <span>Proyek bisnis</span>
      </div>
      <header className="profile-summary projects-summary">
        <div className="profile-person">
          <span className={`avatar ${user.color} profile-person-avatar`}>
            {user.initials}
          </span>
          <div>
            <h1>Proyek {user.name}</h1>
            <p className="profile-person-role">{user.company}</p>
          </div>
        </div>
        <p className="profile-summary-bio">
          Foto dan video pekerjaan yang dibagikan oleh {user.name}.
        </p>
      </header>

      <div className="projects-toolbar">
        <div className="projects-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Semua
          </button>
          <button
            className={filter === "photo" ? "active" : ""}
            aria-pressed={filter === "photo"}
            onClick={() => setFilter("photo")}
          >
            <ImageIcon size={13} /> Foto
          </button>
          <button
            className={filter === "video" ? "active" : ""}
            aria-pressed={filter === "video"}
            onClick={() => setFilter("video")}
          >
            <Video size={13} /> Video
          </button>
        </div>
        <small className="projects-count">{moments.length} momen</small>
      </div>

      {moments.length === 0 ? (
        <div className="empty-state">
          <span className="activity-icon yellow">
            <FolderKanban size={18} />
          </span>
          <h2>Belum ada momen proyek</h2>
          <p>
            {user.name} belum membagikan momen pekerjaan proyek yang selesai.
          </p>
        </div>
      ) : (
        <div className="projects-masonry">
          {moments.map((m) => (
            <ProjectCard key={m.id} moment={m} handle={handle} />
          ))}
        </div>
      )}

      <footer className="profile-footer">
        <Link href={`/profile/${handle}`}>Profil</Link>
        <span>·</span>
        <Link href="/">Beranda</Link>
        <span>·</span>
        <span>© 2026 chatiers</span>
      </footer>
    </main>
  );
}

function ProjectCard({
  moment,
  handle,
}: {
  moment: ProjectMoment;
  handle: string;
}) {
  const user = findUser(handle);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const src = "/media/demo-video.mp4";

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }
  function onTime() {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    const v = videoRef.current;
    if (!v) return;
    setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
  }
  function onMeta() {
    const v = videoRef.current;
    if (v) setDuration(v.duration || 0);
  }
  function fmt(s: number) {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <article className="project-moment-card">
      <div className="project-moment-media">
        {moment.video ? (
          <>
            <video
              ref={videoRef}
              src={src}
              poster={moment.image}
              preload="metadata"
              playsInline
              muted={muted}
              onClick={togglePlay}
              onTimeUpdate={onTime}
              onLoadedMetadata={onMeta}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
            {!playing && (
              <button
                type="button"
                className="project-moment-play"
                aria-label="Putar video proyek"
                onClick={togglePlay}
              >
                <Play size={26} fill="currentColor" />
              </button>
            )}
            <button
              type="button"
              className="project-moment-mute"
              aria-label={muted ? "Bunyikan video" : "Bisukan video"}
              aria-pressed={muted}
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <span className="project-moment-duration">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
            <div className="project-moment-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <img src={moment.image} alt={moment.alt} loading="lazy" />
        )}
        <span className="project-moment-date">
          <CalendarDays size={10} /> {moment.date}
        </span>
        {moment.video && (
          <span className="project-moment-badge">
            <Video size={10} /> Video
          </span>
        )}
      </div>

      <div className="project-moment-body">
        <div className="project-moment-head">
          <strong>{moment.title}</strong>
          <span className="project-moment-loc">
            <MapPin size={11} /> {moment.location}
          </span>
        </div>
        <p className={expanded ? "is-expanded" : ""}>{moment.caption}</p>
        {moment.caption.length > 90 && (
          <button
            className="project-moment-toggle"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Sembunyikan" : "Selengkapnya"}
          </button>
        )}
        <button className="project-moment-tags">{moment.tags}</button>
        {user && (
          <div className="project-moment-author">
            <ProfileLink handle={user.handle}>
              <span className={`avatar ${user.color}`}>{user.initials}</span>
            </ProfileLink>
            <div>
              <strong>{user.name}</strong>
              <small>
                {user.role} di {user.company}
              </small>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
