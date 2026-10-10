"use client";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialAnnouncements } from "@/data/announcements";
import { AnnouncementDetail } from "@/features/announcements/announcement-detail";
export function AnnouncementPage({
  handle,
  id,
}: {
  handle: string;
  id: string;
}) {
  const [items] = useLocalStorage("announcements", initialAnnouncements);
  const item = items.find((item) => item.id === id && item.handle === handle);
  if (!item)
    return (
      <main className="announce-missing">
        <h1>Chatboard tidak ditemukan</h1>
        <p>Chatboard yang kamu cari tidak tersedia atau telah dihapus.</p>
        <Link
          href={`/profile/${handle}/announcements`}
          className="primary-button"
        >
          Kembali ke Chatboard
        </Link>
      </main>
    );
  return <AnnouncementDetail key={id} announcement={item} handle={handle} />;
}
