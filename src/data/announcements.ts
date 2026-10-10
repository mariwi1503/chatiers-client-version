import type { Announcement } from "@/lib/announcements";
import { users } from "@/data/feed";

/** Stable seed IDs are also used by server metadata and the sitemap. */
export const initialAnnouncements: Announcement[] = users.flatMap((user) => [
  {
    id: `${user.handle}-kemitraan`,
    handle: user.handle,
    title: "Peluang kemitraan baru",
    body: `${user.company} membuka kesempatan kolaborasi dan distribusi. Mari bertukar ide untuk mengembangkan bisnis bersama.`,
    color: "purple",
    icon: "handshake",
    eventDate: "",
    temporary: false,
    expiresAt: "",
  },
  {
    id: `${user.handle}-produk`,
    handle: user.handle,
    title: "Kabar produk dan layanan",
    body: `Kenali katalog dan layanan ${user.company} melalui profil perusahaan kami. Hubungi jaringan kami untuk informasi kemitraan.`,
    color: "yellow",
    icon: "megaphone",
    eventDate: "2026-10-15",
    temporary: false,
    expiresAt: "",
  },
]);
