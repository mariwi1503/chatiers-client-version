import { SocialApp } from "@/features/feed/social-app";
import { pageMetadata, SITE_DESCRIPTION } from "@/lib/seo";
export const metadata = pageMetadata(
  "Jaringan bisnis & peluang karier",
  SITE_DESCRIPTION,
  "/",
);
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
  return <SocialApp key={JSON.stringify(search)} search={search} />;
}
