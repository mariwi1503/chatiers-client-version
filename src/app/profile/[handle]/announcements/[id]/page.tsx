import { notFound } from "next/navigation";
import { findUser } from "@/data/feed";
import { initialAnnouncements } from "@/data/announcements";
import { AnnouncementPage } from "@/features/announcements/announcement-page";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ handle: string; id: string }> };
export function generateStaticParams() {
  return initialAnnouncements.map(({ handle, id }) => ({ handle, id }));
}
export async function generateMetadata({ params }: Props) {
  const { handle, id } = await params;
  if (!findUser(handle)) notFound();
  const item = initialAnnouncements.find(
    (item) => item.handle === handle && item.id === id,
  );
  return pageMetadata(
    item?.title || "Chatboard lokal",
    item?.body || "Pengumuman yang tersimpan di browser Anda.",
    `/profile/${handle}/announcements/${id}`,
    !item,
  );
}
export default async function Page({ params }: Props) {
  const { handle, id } = await params;
  if (!findUser(handle)) notFound();
  return <AnnouncementPage handle={handle} id={id} />;
}
