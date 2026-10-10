import type { PostKind, SocialPost } from "@/data/feed";

export const postKinds: { value: PostKind; label: string }[] = [
  { value: "update", label: "Update bisnis" },
  { value: "partner", label: "Cari mitra" },
  { value: "supplier", label: "Cari supplier" },
  { value: "hiring", label: "Lowongan" },
];

// Keep enrichment separate from the storage seed so existing local posts remain valid.
const seedOpportunities: Record<
  number,
  {
    handle: string;
    kind: PostKind;
    title: string;
    detail: string;
  }
> = {
  1: {
    handle: "sariwijaya",
    kind: "partner",
    title: "Mitra distribusi untuk ekspansi pasar",
    detail: "Wijaya Textile · Bandung",
  },
  2: {
    handle: "budisantoso",
    kind: "hiring",
    title: "UI Designer, Digital Marketer & Backend Developer",
    detail: "Nusantara Digital · 3 posisi terbuka",
  },
  3: {
    handle: "alyarahma",
    kind: "supplier",
    title: "Supplier tekstil untuk kebutuhan grosir",
    detail: "Sumber Makmur · Surabaya",
  },
  5: {
    handle: "ardikurniawan",
    kind: "partner",
    title: "Mitra distribusi kopi lokal",
    detail: "Kopi Nusantara · Distribusi dan retail",
  },
  6: {
    handle: "dimassaputra",
    kind: "partner",
    title: "Distributor & mitra logistik makanan",
    detail: "Rasa Nusantara · Batam",
  },
};

export function getPostOpportunity(post: SocialPost) {
  const seed = seedOpportunities[post.id];
  const seeded =
    post.kind === undefined && seed?.handle === post.handle ? seed : undefined;
  return {
    kind: post.kind ?? seeded?.kind ?? "update",
    title: post.opportunityTitle || seeded?.title || "",
    detail: post.opportunityDetail || seeded?.detail || "",
  };
}
