import { jakarta, barlow } from "@/lib/fonts";
import type { Metadata, Viewport } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { StorageNotice } from "@/components/storage-notice";
import "@/styles/index";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Jaringan bisnis & peluang karier`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "business",
  icons: { icon: "/brand-icon.svg", apple: "/apple-icon.png" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b1838",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${barlow.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Langsung ke konten
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "id-ID",
          }}
        />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <StorageNotice />
      </body>
    </html>
  );
}
