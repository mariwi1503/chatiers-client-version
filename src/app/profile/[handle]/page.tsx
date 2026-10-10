import { notFound } from "next/navigation";
import { ProfileView } from "@/features/profiles/profile-view";
import { findUser, users } from "@/data/feed";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, SITE_URL } from "@/lib/seo";
type Props = { params: Promise<{ handle: string }> };
export function generateStaticParams() {
  return users.map(({ handle }) => ({ handle }));
}
export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) notFound();
  return pageMetadata(
    `${user.name} (@${handle})`,
    `Profil ${user.name}, ${user.role} di ${user.company}, ${user.location}. Kenali produk, proyek, dan peluang kolaborasinya di chatiers.`,
    `/profile/${handle}`,
  );
}
export default async function Page({ params }: Props) {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE_URL}/profile/${handle}`,
          mainEntity: {
            "@type": "Person",
            name: user.name,
            identifier: handle,
            jobTitle: user.role,
            worksFor: { "@type": "Organization", name: user.company },
          },
        }}
      />
      <ProfileView key={handle} handle={handle} />
    </>
  );
}
