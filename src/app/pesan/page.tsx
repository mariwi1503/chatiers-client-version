import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Pesan",
  "Percakapan dengan koneksi bisnis Anda di chatiers.",
  "/pesan",
  true,
);
export default function Page() {
  return <SocialApp key="pesan" initialActive="Pesan" />;
}
