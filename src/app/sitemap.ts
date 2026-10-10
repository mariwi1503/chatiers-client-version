import type { MetadataRoute } from "next";
import { users } from "@/data/feed";
import { initialAnnouncements } from "@/data/announcements";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/jelajahi",
    "/lowongan",
    "/komunitas",
    ...users.flatMap(({ handle }) => [
      `/profile/${handle}`,
      `/profile/${handle}/projects`,
      `/profile/${handle}/announcements`,
    ]),
    ...initialAnnouncements.map(
      ({ handle, id }) => `/profile/${handle}/announcements/${id}`,
    ),
  ];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.startsWith("/profile/") ? 0.6 : 0.8,
  }));
}
