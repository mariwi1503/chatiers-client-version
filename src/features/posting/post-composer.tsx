"use client";
import { useState } from "react";
import { FileText, ImagePlus, Sparkles, X, ArrowUpRight } from "lucide-react";
import type { NewPost, PostKind } from "@/data/feed";
import { postKinds } from "@/data/opportunities";
import { useDialog } from "@/hooks/use-dialog";
type ComposeType = "text" | "media" | "custom";

const COMPOSE_TABS: {
  key: ComposeType;
  label: string;
  icon: typeof FileText;
}[] = [
  { key: "text", label: "Teks", icon: FileText },
  { key: "media", label: "Foto / Video", icon: ImagePlus },
  { key: "custom", label: "Custom", icon: Sparkles },
];

export function PostComposer({
  composeType,
  setComposeType,
  onPost,
  setComposerOpen,
  setNotice,
}: {
  composeType: ComposeType;
  setComposeType: (value: ComposeType) => void;
  onPost: (post: NewPost) => void;
  setComposerOpen: (open: boolean) => void;
  setNotice: (message: string) => void;
}) {
  useDialog(true, () => setComposerOpen(false));
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [kind, setKind] = useState<PostKind>("update");
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [opportunityDetail, setOpportunityDetail] = useState("");
  const composeTitle =
    composeType === "media"
      ? "Bagikan foto / video"
      : composeType === "custom"
        ? "Postingan custom"
        : "Bagikan postinganmu";
  const composeHint =
    composeType === "media"
      ? "Unggah cuplikan produk, kegiatan, atau video bisnis."
      : composeType === "custom"
        ? "Susun postingan bebas dengan topik dan tautan sendiri."
        : "Peluang bisnis, kebutuhan supplier, lowongan, atau kabar perusahaan.";
  const canPublish = () => {
    if (composeType === "media") return draft.trim() || imageUrl.trim();
    return draft.trim();
  };
  function resetComposer() {
    setDraft("");
    setTags("");
    setImageUrl("");
    setIsVideo(false);
    setLinkLabel("");
    setLinkUrl("");
  }
  function publish() {
    if (!canPublish()) return;
    const post: NewPost = { text: draft.trim(), kind };
    if (kind !== "update") {
      post.opportunityTitle = opportunityTitle.trim();
      post.opportunityDetail = opportunityDetail.trim();
    }
    if (composeType === "media") {
      post.image = imageUrl.trim();
      post.video = isVideo;
      post.alt = isVideo ? "Video bisnis" : "Foto bisnis";
    }
    if (tags.trim()) post.tags = tags.trim();
    if (composeType === "custom" && linkUrl.trim()) {
      const label = linkLabel.trim() ? `${linkLabel.trim()}: ` : "";
      post.text = `${draft.trim()}${draft.trim() ? " · " : ""}${label}${linkUrl.trim()}`;
    }
    onPost(post);
    resetComposer();
    setComposerOpen(false);
    setNotice("Postinganmu sudah dibagikan di browser ini.");
  }

  return (
    <div className="modal-backdrop" onClick={() => setComposerOpen(false)}>
      <section
        className="compose-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 id="compose-title">{composeTitle}</h2>
          <button aria-label="Tutup" onClick={() => setComposerOpen(false)}>
            <X />
          </button>
        </div>
        <div
          className="compose-tabs"
          role="tablist"
          aria-label="Jenis postingan"
        >
          {COMPOSE_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={composeType === t.key}
                className={composeType === t.key ? "active" : ""}
                onClick={() => setComposeType(t.key)}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
        <p>{composeHint}</p>
        <label className="compose-field">
          <span>Tujuan postingan</span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as PostKind)}
          >
            {postKinds.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {kind !== "update" && (
          <div className="compose-opportunity-fields">
            <label className="compose-field">
              <span>Kebutuhan utama (opsional)</span>
              <input
                value={opportunityTitle}
                onChange={(event) => setOpportunityTitle(event.target.value)}
                placeholder="cth. Mitra distribusi kopi di Bandung"
                maxLength={100}
              />
            </label>
            <label className="compose-field">
              <span>Detail singkat (opsional)</span>
              <input
                value={opportunityDetail}
                onChange={(event) => setOpportunityDetail(event.target.value)}
                placeholder="cth. Area Jawa Barat · Grosir dan retail"
                maxLength={140}
              />
            </label>
          </div>
        )}
        <textarea
          autoFocus
          maxLength={1000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Bagikan peluang, kebutuhan, atau kabar bisnis kamu…"
        />
        {composeType === "media" && (
          <div className="compose-field">
            <span>URL foto / video</span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Tempel tautan gambar atau video…"
            />
            <label className="compose-check">
              <input
                type="checkbox"
                checked={isVideo}
                onChange={(e) => setIsVideo(e.target.checked)}
              />{" "}
              Ini adalah video
            </label>
            {imageUrl.trim() && (
              <div className="compose-preview">
                {isVideo ? (
                  <video
                    src={imageUrl.trim()}
                    controls
                    preload="none"
                    aria-label="Pratinjau video"
                  />
                ) : (
                  <img src={imageUrl.trim()} alt="Pratinjau media" />
                )}
              </div>
            )}
          </div>
        )}
        {composeType === "custom" && (
          <div className="compose-link-row">
            <label className="compose-field">
              <span>Label tautan (opsional)</span>
              <input
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="cth. Daftar di sini"
                maxLength={60}
              />
            </label>
            <label className="compose-field">
              <span>Tautan (opsional)</span>
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://…"
                maxLength={200}
              />
            </label>
          </div>
        )}
        <label className="compose-field">
          <span>Topik / tag (opsional)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="cth. #LowonganKerja #NetworkingBisnis"
            maxLength={80}
          />
        </label>
        <small>{draft.length}/1.000 · Postingan disimpan di browser ini.</small>
        <button
          className="primary-button"
          disabled={!canPublish()}
          onClick={publish}
        >
          Bagikan postingan <ArrowUpRight size={18} />
        </button>
      </section>
    </div>
  );
}
