import type { SocialPost } from "@/data/feed";
import { getPostOpportunity } from "@/data/opportunities";

// Presentation enrichment also works with posts saved before the gallery update.
export function getPostGallery(post: SocialPost) {
  if (post.video) return [];
  if (post.gallery?.length) return post.gallery;
  if (!post.image) return [];
  const cover = { image: post.image, alt: post.alt };
  if (post.id === 1 && post.handle === "sariwijaya")
    return [
      cover,
      {
        image: "/media/d8ccc01f-df77-4d2f-95ba-c6c50dadf501.webp",
        alt: "Koleksi kain untuk calon mitra distribusi Wijaya Textile",
      },
      {
        image: "/media/077aa44e-f50f-4b37-ac44-a570b0c0fe0b.webp",
        alt: "Sampel linen dari koleksi Wijaya Textile",
      },
    ];
  return [cover];
}

export function getPostCategory(post: SocialPost) {
  const kind = getPostOpportunity(post).kind;
  const labels = {
    update: "Bisnis",
    partner: "Cari mitra",
    supplier: "Supplier",
    hiring: "Cari tim",
  };
  return { kind, label: labels[kind] };
}
