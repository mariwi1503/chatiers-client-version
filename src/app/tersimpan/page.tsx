import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Postingan tersimpan",
  "Lihat postingan bisnis yang Anda simpan di browser ini.",
  "/tersimpan",
  true,
);
export default function Page() {
  return <SocialApp key="tersimpan" initialActive="Tersimpan" />;
}
