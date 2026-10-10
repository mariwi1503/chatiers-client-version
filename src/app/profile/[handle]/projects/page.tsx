import { notFound } from "next/navigation";
import { ProjectMoments } from "@/features/projects/project-moments";
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
    `Proyek ${user.name}`,
    `Lihat dokumentasi foto dan video proyek ${user.name} di ${user.company}. Kenali pengalaman dan hasil pekerjaan melalui jaringan bisnis chatiers.`,
    `/profile/${handle}/projects`,
  );
}
export default async function Page({ params }: Props) {
  const { handle } = await params;
  if (!findUser(handle)) notFound();
  return <ProjectMoments handle={handle} />;
}
