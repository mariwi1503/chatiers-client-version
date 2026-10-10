"use client";

import { useDialog } from "@/hooks/use-dialog";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { useState } from "react";
import {
  MapPin,
  Briefcase,
  Wallet,
  Users,
  Clock,
  ArrowUpRight,
  Bookmark,
  Building2,
  Heart,
  MessageCircle,
  Send,
  Mail,
  Copy,
  Plus,
  X,
} from "lucide-react";
import { type JobVacancy } from "@/data/jobs";
import { ProfileLink } from "@/components/profile-link";
import {
  CommentThread,
  buildSeed,
  toggleLikeById,
  addReplyById,
  countComments,
  VIEWER_IDENTITY,
  type Comment,
} from "@/features/comments/comment-thread";

const JOB_TYPES = ["Penuh Waktu", "Remote", "Paruh Waktu", "Kontrak"];

const EMPTY_FORM = {
  company: "",
  position: "",
  type: "Penuh Waktu",
  salary: "",
  location: "",
  email: "",
  caption: "",
  tags: "",
};

export function JobListings({
  region,
  jobs,
  onPostJob,
  onNotice,
  autoOpenForm,
  presetType,
}: {
  region: string;
  jobs: JobVacancy[];
  onPostJob: (job: JobVacancy) => void;
  onNotice: (msg: string) => void;
  autoOpenForm?: boolean;
  presetType?: string;
}) {
  const [saved, setSaved] = useLocalStorage<number[]>("job-saved", []);
  const [liked, setLiked] = useLocalStorage<number[]>("job-likes", []);
  const [commentJob, setCommentJob] = useState<number | null>(null);
  const [comments, setComments] = useLocalStorage<Record<number, Comment[]>>(
    "job-comments",
    {},
  );
  const [activeFilter, setActiveFilter] = useState<"public" | "latest">(
    "public",
  );
  const [formOpen, setFormOpen] = useState(!!autoOpenForm);
  useDialog(formOpen, () => setFormOpen(false));
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    type:
      presetType && JOB_TYPES.includes(presetType)
        ? presetType
        : EMPTY_FORM.type,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getJobAge = (time: string) => {
    const match = time.match(/(\d+)\s+(menit|jam|hari|minggu|bulan|tahun)/i);
    if (!match) return Number.MAX_SAFE_INTEGER;
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const minutesPerUnit: Record<string, number> = {
      menit: 1,
      jam: 60,
      hari: 1440,
      minggu: 10080,
      bulan: 43200,
      tahun: 525600,
    };
    return amount * minutesPerUnit[unit];
  };

  const toggle = (
    id: number,
    values: number[],
    setter: (v: number[]) => void,
  ) =>
    setter(
      values.includes(id) ? values.filter((n) => n !== id) : [...values, id],
    );

  const addedCount = (job: JobVacancy) =>
    comments[job.id]
      ? Math.max(
          0,
          countComments(comments[job.id]) - (job.replies || []).length,
        )
      : 0;

  const regionJobs =
    region === "Public"
      ? jobs
      : jobs.filter(
          (job) => (job.location || "").split(",")[0].trim() === region,
        );
  const visibleJobs =
    activeFilter === "latest"
      ? [...regionJobs].sort((a, b) => getJobAge(a.time) - getJobAge(b.time))
      : regionJobs;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.company.trim()) e.company = "Nama perusahaan wajib diisi.";
    if (!form.position.trim()) e.position = "Posisi wajib diisi.";
    if (!form.salary.trim()) e.salary = "Rentang gaji wajib diisi.";
    if (!form.location.trim()) e.location = "Lokasi wajib diisi.";
    if (!form.email.trim()) e.email = "Email tujuan CV wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Format email tidak valid.";
    if (!form.caption.trim()) e.caption = "Deskripsi lowongan wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    const id = jobs.length ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;
    const tags =
      form.tags.trim() ||
      `#LowonganKerja #${form.position.trim().replace(/\s+/g, "")}`;
    const job: JobVacancy = {
      id,
      email: form.email.trim(),
      company: form.company.trim(),
      posterName: "Ardi Kurniawan",
      handle: "ardikurniawan",
      initials: "AK",
      color: "yellow",
      role: "Pemilik Bisnis",
      position: form.position.trim(),
      salary: form.salary.trim(),
      location: form.location.trim(),
      type: form.type,
      caption: form.caption.trim(),
      tags,
      time: "Baru saja",
      applicants: 0,
      likes: 0,
      comments: 0,
      replies: [],
    };
    onPostJob(job);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormOpen(false);
    setActiveFilter("latest");
    onNotice(
      `Lowongan "${job.position}" di ${job.company} berhasil diterbitkan.`,
    );
  }

  return (
    <div className="jobs">
      <header className="jobs-header">
        <span className="eyebrow">RUANG KARIER</span>
        <h1>Lowongan terbaru</h1>
        <p>
          Peluang kerja dari jaringan bisnis chatiers — diperbarui setiap hari.
        </p>
      </header>
      <div className="jobs-tabs" role="group" aria-label="Filter lowongan">
        <button
          className={activeFilter === "public" ? "active" : ""}
          aria-pressed={activeFilter === "public"}
          onClick={() => setActiveFilter("public")}
        >
          Public
        </button>
        <button
          className={activeFilter === "latest" ? "active" : ""}
          aria-pressed={activeFilter === "latest"}
          onClick={() => setActiveFilter("latest")}
        >
          Terbaru
        </button>
        <button className="jobs-post-button" onClick={() => setFormOpen(true)}>
          <Plus size={16} /> Posting lowongan
        </button>
        <span className="jobs-count">{visibleJobs.length} lowongan</span>
      </div>
      {visibleJobs.length === 0 ? (
        <div className="empty-state">
          <MapPin />
          <h2>Tidak ada lowongan di lokasi ini</h2>
          <p>Coba pilih lokasi lain atau tampilkan semua lowongan.</p>
        </div>
      ) : (
        <div className="jobs-list">
          {visibleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={saved.includes(job.id)}
              liked={liked.includes(job.id)}
              commentOpen={commentJob === job.id}
              comments={comments[job.id]}
              onToggleSave={(id) => {
                toggle(id, saved, setSaved);
                onNotice(
                  saved.includes(id)
                    ? "Lowongan dihapus dari simpanan."
                    : "Lowongan disimpan untuk nanti.",
                );
              }}
              onToggleLike={(id) => toggle(id, liked, setLiked)}
              onToggleComments={(id) =>
                setCommentJob(commentJob === id ? null : id)
              }
              onShare={(job) => {
                if (navigator.clipboard)
                  navigator.clipboard
                    .writeText(
                      `${job.position} — ${job.company} (${job.location})\nKirim CV ke: ${job.email}`,
                    )
                    .then(() => onNotice("Detail lowongan berhasil disalin."))
                    .catch(() => onNotice("Tidak dapat menyalin. Coba lagi."));
                else onNotice("Penyalinan tidak tersedia di browser ini.");
              }}
              onApply={(job) =>
                onNotice(
                  `Lamaran untuk ${job.position} di ${job.company} dikirim. Kirim CV ke ${job.email}.`,
                )
              }
              onNotice={onNotice}
              setComments={setComments}
              addedCount={addedCount}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop" onClick={() => setFormOpen(false)}>
          <section
            className="compose-modal job-form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-form-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 id="job-form-title">Posting lowongan kerja</h2>
              <button aria-label="Tutup" onClick={() => setFormOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <p>
              Isi detail lowongan agar pelamar dapat mengirim CV ke email yang
              benar.
            </p>
            <div className="job-form">
              <label className="job-field">
                <span>
                  Nama perusahaan <i>*</i>
                </span>
                <input
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="cth. Kopi Nusantara"
                  maxLength={80}
                />
                {errors.company && (
                  <small className="job-error">{errors.company}</small>
                )}
              </label>
              <label className="job-field">
                <span>
                  Posisi yang dibutuhkan <i>*</i>
                </span>
                <input
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="cth. Head Barista"
                  maxLength={80}
                />
                {errors.position && (
                  <small className="job-error">{errors.position}</small>
                )}
              </label>
              <label className="job-field">
                <span>Tipe pekerjaan</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="job-field">
                <span>
                  Rentang gaji <i>*</i>
                </span>
                <input
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  placeholder="cth. Rp 5.000.000 – 7.000.000 /bulan"
                  maxLength={80}
                />
                {errors.salary && (
                  <small className="job-error">{errors.salary}</small>
                )}
              </label>
              <label className="job-field">
                <span>
                  Lokasi <i>*</i>
                </span>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="cth. Bandung, Indonesia"
                  maxLength={80}
                />
                {errors.location && (
                  <small className="job-error">{errors.location}</small>
                )}
              </label>
              <label className="job-field">
                <span>
                  Email tujuan CV <i>*</i>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="cth. hrd@perusahaan.co.id"
                  maxLength={120}
                />
                {errors.email && (
                  <small className="job-error">{errors.email}</small>
                )}
              </label>
              <label className="job-field">
                <span>
                  Deskripsi lowongan <i>*</i>
                </span>
                <textarea
                  value={form.caption}
                  onChange={(e) =>
                    setForm({ ...form, caption: e.target.value })
                  }
                  placeholder="Tulis tanggung jawab, kualifikasi, dan kebutuhan posisi…"
                  maxLength={600}
                />
                {errors.caption && (
                  <small className="job-error">{errors.caption}</small>
                )}
              </label>
              <label className="job-field">
                <span>Topik / tag (opsional)</span>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="cth. #LowonganKerja #Barista"
                  maxLength={80}
                />
              </label>
            </div>
            <small className="job-form-note">
              Lowongan akan ditampilkan sebagai postingan dari @ardikurniawan.
            </small>
            <button className="primary-button" onClick={submit}>
              Terbitkan lowongan <ArrowUpRight size={18} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function JobCard({
  job,
  saved,
  liked,
  commentOpen,
  comments,
  onToggleSave,
  onToggleLike,
  onToggleComments,
  onShare,
  onApply,
  onNotice,
  setComments,
  addedCount,
}: {
  job: JobVacancy;
  saved: boolean;
  liked: boolean;
  commentOpen: boolean;
  comments: Comment[] | undefined;
  onToggleSave: (id: number) => void;
  onToggleLike: (id: number) => void;
  onToggleComments: (id: number) => void;
  onShare: (job: JobVacancy) => void;
  onApply: (job: JobVacancy) => void;
  onNotice: (msg: string) => void;
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>;
  addedCount: (job: JobVacancy) => number;
}) {
  const creator = {
    name: job.posterName,
    handle: job.handle,
    initials: job.initials,
    color: job.color,
    role: job.role,
    company: job.company,
  };

  return (
    <article className="job-card">
      <div className="job-card-top">
        <ProfileLink handle={job.handle} className="profile-avatar-link">
          <span className={`avatar ${job.color}`}>{job.initials}</span>
        </ProfileLink>
        <div className="job-card-author">
          <strong>
            <ProfileLink handle={job.handle}>{job.posterName}</ProfileLink>
          </strong>
          <small>
            @{job.handle} · {job.role} di {job.company}
          </small>
          <small className="job-time">
            <Clock size={11} /> {job.time}
          </small>
        </div>
        <button
          className={`job-save ${saved ? "is-saved" : ""}`}
          aria-label="Simpan lowongan"
          aria-pressed={saved}
          onClick={() => onToggleSave(job.id)}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="job-position">
        <span className="job-position-badge">
          <Briefcase size={13} /> {job.type}
        </span>
        <h2>{job.position}</h2>
        <div className="job-company">
          <Building2 size={13} /> {job.company}
        </div>
      </div>

      <div className="job-meta">
        <div className="job-meta-item">
          <Wallet size={14} />
          <div>
            <small>Gaji</small>
            <strong>{job.salary}</strong>
          </div>
        </div>
        <div className="job-meta-item">
          <MapPin size={14} />
          <div>
            <small>Lokasi</small>
            <strong>{job.location}</strong>
          </div>
        </div>
        <div className="job-meta-item">
          <Users size={14} />
          <div>
            <small>Pelamar</small>
            <strong>{job.applicants} orang</strong>
          </div>
        </div>
      </div>

      <p className="job-caption">{job.caption}</p>

      <div className="job-email">
        <Mail size={14} />
        <div>
          <small>Kirim CV ke email</small>
          <strong>{job.email}</strong>
        </div>
        <button
          className="job-email-copy"
          aria-label="Salin alamat email"
          onClick={() => {
            if (navigator.clipboard)
              navigator.clipboard
                .writeText(job.email)
                .then(() =>
                  onNotice(`Email ${job.email} disalin ke papan klip.`),
                )
                .catch(() => onNotice("Tidak dapat menyalin. Coba lagi."));
            else onNotice("Penyalinan tidak tersedia di browser ini.");
          }}
        >
          <Copy size={13} /> Salin
        </button>
      </div>
      <button
        className="tags"
        onClick={() => onNotice(`Topik lowongan: ${job.tags}`)}
      >
        {job.tags}
      </button>

      <div className="job-actions">
        <button
          className={liked ? "is-liked" : ""}
          onClick={() => onToggleLike(job.id)}
          aria-label={liked ? "Batal suka" : "Sukai lowongan"}
          aria-pressed={liked}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {job.likes + (liked ? 1 : 0)}
        </button>
        <button
          className={commentOpen ? "is-active" : ""}
          onClick={() => onToggleComments(job.id)}
          aria-label={commentOpen ? "Tutup komentar" : "Buka komentar"}
          aria-pressed={commentOpen}
        >
          <MessageCircle size={18} />
          {job.comments + addedCount(job)}
        </button>
        <button aria-label="Bagikan lowongan" onClick={() => onShare(job)}>
          <Send size={17} />
        </button>
        <button className="primary-button" onClick={() => onApply(job)}>
          Lamar sekarang <ArrowUpRight size={16} />
        </button>
      </div>

      {commentOpen && (
        <div className="comments">
          <CommentThread
            comments={comments || buildSeed(job.replies, creator)}
            viewerName="Ardi"
            onToggleLike={(id) =>
              setComments((prev) => ({
                ...prev,
                [job.id]: toggleLikeById(
                  prev[job.id] || buildSeed(job.replies, creator),
                  id,
                ),
              }))
            }
            onAddReply={(parentId, text) =>
              setComments((prev) => {
                const list = prev[job.id] || buildSeed(job.replies, creator);
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
                  [job.id]: addReplyById(list, parentId, reply),
                };
              })
            }
            onAddComment={(text) =>
              setComments((prev) => {
                const list = prev[job.id] || buildSeed(job.replies, creator);
                const c: Comment = {
                  id: `c-${crypto.randomUUID()}`,
                  ...VIEWER_IDENTITY,
                  text,
                  side: "right",
                  likes: 0,
                  liked: false,
                  replies: [],
                };
                return { ...prev, [job.id]: [...list, c] };
              })
            }
          />
        </div>
      )}
    </article>
  );
}
