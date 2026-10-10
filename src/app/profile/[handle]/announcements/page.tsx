import { notFound } from "next/navigation";
import { AnnouncementBoard } from "@/features/announcements/announcement-board";
import { findUser, users } from "@/data/feed";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ handle: string }> };
export function generateStaticParams() {
  return users.map(({ handle }) => ({ handle }));
}
export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) notFound();
  return pageMetadata(
    `Chatboard ${user.company}`,
    `Kabar produk, kemitraan, dan acara dari ${user.company}. Jelajahi pengumuman serta kesempatan berkolaborasi di jaringan bisnis chatiers.`,
    `/profile/${handle}/announcements`,
  );
}
export default async function Page({ params }: Props) {
  const { handle } = await params;
  if (!findUser(handle)) notFound();
  return (
    <main className="announce-shell">
      <AnnouncementBoard handle={handle} variant="page" />
    </main>
  );
}
