import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Notifikasi",
  "Kabar terbaru dari jaringan bisnis Anda di chatiers.",
  "/notifikasi",
  true,
);
export default function Page() {
  return <SocialApp key="notifikasi" initialActive="Notifikasi" />;
}
