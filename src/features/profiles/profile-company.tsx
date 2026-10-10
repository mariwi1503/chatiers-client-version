"use client";
import { useRef, useState } from "react";
import {
  Building2,
  Sparkles,
  CalendarDays,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Play,
} from "lucide-react";
import { companyByHandle } from "@/data/products";
export function ProfileCompany({ handle }: { handle: string }) {
  const company = companyByHandle(handle);
  if (!company) {
    return (
      <div className="empty-state">
        <span className="activity-icon green">
          <Building2 size={18} />
        </span>
        <h2>Profil perusahaan belum tersedia</h2>
        <p>Informasi perusahaan untuk pengguna ini belum dipublikasikan.</p>
      </div>
    );
  }
  return (
    <section className="profile-company">
      <div className="company-card">
        <div className="company-header">
          <span className="company-logo">
            <Building2 size={26} />
          </span>
          <div className="company-title">
            <h2>{company.name}</h2>
            <small>{company.industry}</small>
          </div>
        </div>

        <p className="company-desc">{company.description}</p>

        <CompanyVideo handle={handle} />

        <div className="company-highlights">
          {company.highlights.map((h) => (
            <span key={h} className="company-chip">
              <Sparkles size={11} /> {h}
            </span>
          ))}
        </div>

        <div className="company-grid">
          <div className="company-field">
            <small>
              <Building2 size={11} /> Industri
            </small>
            <strong>{company.industry}</strong>
          </div>
          <div className="company-field">
            <small>
              <CalendarDays size={11} /> Berdiri
            </small>
            <strong>{company.founded}</strong>
          </div>
          <div className="company-field">
            <small>
              <Users size={11} /> Ukuran
            </small>
            <strong>{company.size}</strong>
          </div>
          <div className="company-field">
            <small>
              <MapPin size={11} /> Alamat
            </small>
            <strong>{company.address}</strong>
          </div>
          <div className="company-field">
            <small>
              <Phone size={11} /> Telepon
            </small>
            <strong>{company.phone}</strong>
          </div>
          <div className="company-field">
            <small>
              <Mail size={11} /> Email
            </small>
            <strong>{company.email}</strong>
          </div>
          <div className="company-field">
            <small>
              <Globe size={11} /> Situs
            </small>
            <strong>{company.website}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
function CompanyVideo({ handle }: { handle: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  return (
    <figure className="company-video">
      <div className="company-video-frame">
        <video
          ref={videoRef}
          aria-label="Video profil perusahaan"
          src="/media/demo-video.mp4"
          poster={companyPoster(handle)}
          preload="none"
          playsInline
          muted
          controls={started}
          onPlay={() => setStarted(true)}
          onError={() => setError("Video tidak dapat dimuat.")}
        />
        {!started && (
          <button
            type="button"
            className="company-video-play"
            aria-label="Putar video profil perusahaan"
            onClick={() => {
              videoRef.current
                ?.play()
                .then(() => setStarted(true))
                .catch(() =>
                  setError("Video belum dapat diputar. Silakan coba lagi."),
                );
            }}
          >
            <Play size={28} fill="currentColor" />
          </button>
        )}
      </div>
      <figcaption>Video profil perusahaan · cuplikan demo</figcaption>
      {error && <p role="status">{error}</p>}
    </figure>
  );
}
function companyPoster(handle: string): string {
  const posters: Record<string, string> = {
    sariwijaya: "/media/d8ccc01f-df77-4d2f-95ba-c6c50dadf501.webp",
    ardikurniawan: "/media/22ec0f28-a921-4c77-ae9f-300d50a78ac6.webp",
    dimassaputra: "/media/382431f1-9cb5-4f60-bada-863b498f1a11.webp",
    alyarahma: "/media/935b0883-6fb2-49d4-b53a-312c65a8ea30.webp",
    budisantoso: "/media/bdffccae-048c-44ea-a4a0-4ef0bfc802bf.webp",
    bimaaditya: "/media/bdffccae-048c-44ea-a4a0-4ef0bfc802bf.webp",
  };
  return posters[handle] || "/media/ccb359e5-00b3-4f1f-8a3c-55db3027ffb9.webp";
}
