import { SearchPage } from "@/features/search/search-page";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Cari mitra, lowongan & peluang",
  "Cari pengguna, postingan, dan lowongan dari jaringan bisnis chatiers.",
  "/search",
  true,
);
export default function Page() {
  return <SearchPage />;
}
