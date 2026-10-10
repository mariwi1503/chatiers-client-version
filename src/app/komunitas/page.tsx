import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Komunitas bisnis",
  "Temukan komunitas pemilik bisnis, supplier, dan profesional untuk berbagi ide dan peluang kolaborasi di chatiers.",
  "/komunitas",
  false,
);
export default function Page() {
  return <SocialApp key="komunitas" initialActive="Komunitas" />;
}
