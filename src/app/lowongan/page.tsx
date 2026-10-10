import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Lowongan kerja & peluang remote",
  "Jelajahi lowongan penuh waktu, remote, paruh waktu, dan kontrak. Cari peluang karier berdasarkan lokasi dari jaringan bisnis chatiers.",
  "/lowongan",
  false,
);
export default function Page() {
  return <SocialApp key="lowongan" initialActive="Lowongan" />;
}
