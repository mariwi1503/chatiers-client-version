"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  ImagePlus,
  Briefcase,
  Laptop,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

type QuickOption = {
  key: string;
  title: string;
  desc: string;
  icon: typeof FileText;
  color: string;
  to: string;
};

const OPTIONS: QuickOption[] = [
  {
    key: "text",
    title: "Postingan Teks",
    desc: "Bagikan kabar, peluang, atau ide bisnis dalam bentuk teks sederhana.",
    icon: FileText,
    color: "yellow",
    to: "/?compose=text",
  },
  {
    key: "media",
    title: "Foto / Video",
    desc: "Unggah cuplikan produk, kegiatan, atau video bisnis untuk jaringanmu.",
    icon: ImagePlus,
    color: "peach",
    to: "/?compose=media",
  },
  {
    key: "lowongan",
    title: "Lowongan Kerja",
    desc: "Terbitkan lowongan dengan posisi, gaji, lokasi, dan email CV pelamar.",
    icon: Briefcase,
    color: "green",
    to: "/?tab=lowongan&compose=job",
  },
  {
    key: "wfh",
    title: "WFH",
    desc: "Lowongan kerja jarak jauh (remote) untuk talenta dari mana saja.",
    icon: Laptop,
    color: "purple",
    to: "/?tab=lowongan&compose=job&type=Remote",
  },
  {
    key: "custom",
    title: "Postingan Custom",
    desc: "Susun postingan bebas dengan topik dan tautan pilihanmu sendiri.",
    icon: Sparkles,
    color: "blue",
    to: "/?compose=custom",
  },
];

export function PostingQuickLink() {
  return (
    <main className="posting-page">
      <header className="posting-topbar">
        <Link href="/" className="posting-back" aria-label="Kembali ke Beranda">
          <ArrowLeft size={18} />
          <span>Beranda</span>
        </Link>
        <BrandLogo compact className="posting-brand" />
      </header>

      <section className="posting-hero">
        <span className="eyebrow">FITUR POSTING</span>
        <h1>Posting Quick Link</h1>
        <p>
          Pilih jenis postingan yang ingin kamu bagikan. Setiap pilihan membuka
          ruang pembuatan postingan yang sesuai di jaringan chatiers.
        </p>
      </section>

      <section className="posting-grid" aria-label="Pilihan jenis postingan">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <Link
              key={opt.key}
              href={opt.to}
              className={`posting-card posting-${opt.color}`}
            >
              <span className={`posting-card-icon ${opt.color}`}>
                <Icon size={24} />
              </span>
              <div className="posting-card-body">
                <strong>{opt.title}</strong>
                <p>{opt.desc}</p>
              </div>
              <span className="posting-card-arrow" aria-hidden="true">
                <ArrowUpRight size={20} />
              </span>
            </Link>
          );
        })}
      </section>

      <footer className="posting-footer">
        <Link href="/">Beranda</Link>
        <span>·</span>
        <span>© 2026 chatiers</span>
      </footer>
    </main>
  );
}
