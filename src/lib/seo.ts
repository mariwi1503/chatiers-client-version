import type { Metadata } from "next";

export const SITE_NAME = "chatiers";
export const SITE_DESCRIPTION =
  "Terhubung dengan pemilik usaha, supplier, mitra bisnis, dan talenta. Bagikan peluang, jelajahi lowongan, dan kembangkan jaringan bisnis di chatiers.";
/** Set the public deployment origin; never infer canonical URLs from untrusted request headers. */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
).origin;
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: !noindex, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      url: path,
      type: "website",
      locale: "id_ID",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "chatiers — Ide bisnis. Koneksi nyata.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
