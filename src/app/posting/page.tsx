import { PostingQuickLink } from "@/features/posting/posting-quick-link";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Buat postingan bisnis",
  "Bagikan kabar bisnis, foto, video, dan lowongan kerja melalui chatiers.",
  "/posting",
  true,
);
export default function Page() {
  return <PostingQuickLink />;
}
