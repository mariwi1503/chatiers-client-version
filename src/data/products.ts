export type Product = {
  id: number;
  handle: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
};

export type CompanyInfo = {
  name: string;
  industry: string;
  founded: string;
  size: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  highlights: string[];
  verified: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    handle: "sariwijaya",
    name: "Kain Katun Premium",
    price: "Rp 45.000 / yard",
    category: "Tekstil",
    image: "/media/d8ccc01f-df77-4d2f-95ba-c6c50dadf501.webp",
    description:
      "Katun berkualitas tinggi dengan beragam warna, cocok untuk produksi pakaian seragam dan fashion.",
  },
  {
    id: 2,
    handle: "sariwijaya",
    name: "Kain Linen Earthy",
    price: "Rp 68.000 / yard",
    category: "Tekstil",
    image: "/media/077aa44e-f50f-4b37-ac44-a570b0c0fe0b.webp",
    description:
      "Linen natural dengan tone bumi, ideal untuk busana premium dan dekorasi interior.",
  },
  {
    id: 3,
    handle: "ardikurniawan",
    name: "Kopi Robusta Nusantara",
    price: "Rp 85.000 / 250g",
    category: "Kopi",
    image: "/media/22ec0f28-a921-4c77-ae9f-300d50a78ac6.webp",
    description:
      "Biji kopi robusta pilihan dari kebun lokal, disangrai medium dengan aroma khas nusantara.",
  },
  {
    id: 4,
    handle: "dimassaputra",
    name: "Snack Tradisional Nusantara",
    price: "Rp 25.000 / pack",
    category: "F&B",
    image: "/media/382431f1-9cb5-4f60-bada-863b498f1a11.webp",
    description:
      "Aneka camilan tradisional dengan resep otentik, tersedia untuk distribusi grosir dan retail.",
  },
  {
    id: 5,
    handle: "alyarahma",
    name: "Sample Kain Sourcing",
    price: "Rp 15.000 / set",
    category: "Sourcing",
    image: "/media/935b0883-6fb2-49d4-b53a-312c65a8ea30.webp",
    description:
      "Paket contoh kain beragam pola dan warna untuk kebutuhan evaluasi buyer sebelum pemesanan grosir.",
  },
  {
    id: 6,
    handle: "budisantoso",
    name: "Paket Branding Digital",
    price: "Mulai Rp 8.500.000",
    category: "Layanan",
    image: "/media/bdffccae-048c-44ea-a4a0-4ef0bfc802bf.webp",
    description:
      "Layanan branding lengkap: identitas visual, strategi digital, dan eksekusi kampanye untuk brand.",
  },
  {
    id: 7,
    handle: "bimaaditya",
    name: "Paket Ekspansi Digital",
    price: "Mulai Rp 12.000.000",
    category: "Layanan",
    image: "/media/bdffccae-048c-44ea-a4a0-4ef0bfc802bf.webp",
    description:
      "Strategi ekspansi digital end-to-end untuk brand yang ingin masuk pasar online baru.",
  },
];

export function productsByHandle(handle: string): Product[] {
  return products.filter((p) => p.handle === handle);
}

const companies: Record<string, CompanyInfo> = {
  sariwijaya: {
    name: "Wijaya Textile",
    industry: "Tekstil & Grosir",
    founded: "2018",
    size: "51–200 karyawan",
    address: "Jl. Industri Tekstil No. 12, Bandung, Jawa Barat",
    phone: "+62 22 8765 4321",
    email: "halo@wijayatextile.id",
    website: "wijayatextile.id",
    description:
      "Wijaya Textile adalah distributor dan produsen kain grosir yang melayani kebutuhan produksi fashion, seragam, dan interior di seluruh Indonesia. Berkomitmen pada kualitas bahan dan keandalan distribusi.",
    highlights: [
      "Grosir & Produksi",
      "Kapasitas 10.000 yard/bulan",
      "Coverage Jabodetabek & Bandung",
      "Kemitraan Produksi",
    ],
    verified: true,
  },
  budisantoso: {
    name: "Nusantara Digital",
    industry: "Agency Digital",
    founded: "2020",
    size: "11–50 karyawan",
    address: "Jl. Sudirman Kav. 21, Jakarta Selatan, DKI Jakarta",
    phone: "+62 21 5550 1234",
    email: "hello@nusantaradigital.id",
    website: "nusantaradigital.id",
    description:
      "Nusantara Digital adalah agency yang membantu brand berekspansi secara online melalui strategi digital, branding, dan eksekusi kampanye yang terukur.",
    highlights: [
      "Branding & Identitas Visual",
      "Digital Marketing",
      "Web & Aplikasi",
      "Strategi Ekspansi",
    ],
    verified: true,
  },
  alyarahma: {
    name: "Sumber Makmur",
    industry: "Sourcing & Supply Chain",
    founded: "2016",
    size: "51–200 karyawan",
    address: "Jl. Raya Gresik No. 88, Surabaya, Jawa Timur",
    phone: "+62 31 9988 7766",
    email: "sourcing@sumbermakmur.id",
    website: "sumbermakmur.id",
    description:
      "Sumber Makmur menghubungkan buyer dengan supplier tekstil tepercaya, menjamin kualitas dan kapasitas produksi untuk kebutuhan grosir skala besar.",
    highlights: [
      "Sourcing & Buyer",
      "Quality Control",
      "Negosiasi Harga",
      "Supply Chain Terpadu",
    ],
    verified: true,
  },
  bimaaditya: {
    name: "Nusantara Digital",
    industry: "Agency Digital",
    founded: "2020",
    size: "11–50 karyawan",
    address: "Jl. Sudirman Kav. 21, Jakarta Selatan, DKI Jakarta",
    phone: "+62 21 5550 1234",
    email: "hello@nusantaradigital.id",
    website: "nusantaradigital.id",
    description:
      "Nusantara Digital adalah agency yang membantu brand berekspansi secara online melalui strategi digital, branding, dan eksekusi kampanye yang terukur.",
    highlights: [
      "Branding & Identitas Visual",
      "Digital Marketing",
      "Web & Aplikasi",
      "Strategi Ekspansi",
    ],
    verified: true,
  },
  dimassaputra: {
    name: "Rasa Nusantara",
    industry: "F&B & Distribusi Kuliner",
    founded: "2019",
    size: "11–50 karyawan",
    address: "Jl. Malioboro No. 45, Yogyakarta, DI Yogyakarta",
    phone: "+62 274 1234 567",
    email: "halo@rasanusantara.id",
    website: "rasanusantara.id",
    description:
      "Rasa Nusantara memproduksi dan mendistribusikan camilan tradisional dengan resep otentik, melayani kebutuhan retail dan grosir kuliner di berbagai kota.",
    highlights: [
      "Produksi Kuliner",
      "Distribusi Grosir",
      "Resep Otentik",
      "Retail & Waralaba",
    ],
    verified: true,
  },
  ardikurniawan: {
    name: "Kopi Nusantara",
    industry: "Kopi & Distribusi",
    founded: "2021",
    size: "11–50 karyawan",
    address: "Jl. Kemang Raya No. 9, Jakarta Selatan, DKI Jakarta",
    phone: "+62 21 7654 3210",
    email: "halo@kopinusantara.id",
    website: "kopinusantara.id",
    description:
      "Kopi Nusantara menyediakan biji kopi lokal berkualitas dari kebun mitra, dengan layanan distribusi ke kafe, retail, dan reseller di banyak kota.",
    highlights: [
      "Kopi Lokal Pilihan",
      "Distribusi Multi-Kota",
      "Kemitraan Kebun",
      "Retail & Reseller",
    ],
    verified: true,
  },
};

export function companyByHandle(handle: string): CompanyInfo | undefined {
  return companies[handle];
}
