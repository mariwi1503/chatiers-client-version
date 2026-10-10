import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Jelajahi video & peluang bisnis",
  "Jelajahi cuplikan video bisnis, kegiatan perusahaan, produk, dan peluang kolaborasi dari jaringan pengusaha dan profesional di chatiers.",
  "/jelajahi",
  false,
);
export default function Page() {
  return <SocialApp key="jelajahi" initialActive="Jelajahi" />;
}
