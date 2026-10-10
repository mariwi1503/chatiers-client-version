export type ProjectMoment = {
  id: number;
  handle: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
  date: string;
  location: string;
  video?: boolean;
  tags: string;
};

/** Momen foto & video pekerjaan proyek yang telah selesai, dikelompokkan per pengguna. */
export const projectMoments: ProjectMoment[] = [
  {
    id: 1,
    handle: "sariwijaya",
    title: "Pengiriman Grosir Seragam",
    caption:
      "Selesai memproduksi dan menyebar 5.000 yard kain katun untuk pesanan seragam korporasi.",
    image: "/media/d8ccc01f-df77-4d2f-95ba-c6c50dadf501.webp",
    alt: "Gulungan kain katun siap dikirim untuk pesanan seragam",
    date: "Sep 2026",
    location: "Bandung",
    tags: "#Produksi #Grosir",
  },
  {
    id: 2,
    handle: "sariwijaya",
    title: "Sample Linen Premium",
    caption: "Penyelesaian sampling linen earthy untuk klien interior butik.",
    image: "/media/077aa44e-f50f-4b37-ac44-a570b0c0fe0b.webp",
    alt: "Contoh kain linen premium dengan tone bumi",
    date: "Agu 2026",
    location: "Bandung",
    tags: "#Sampling #Interior",
  },
  {
    id: 3,
    handle: "sariwijaya",
    title: "Meeting Mitra Distribusi",
    caption: "Kesepakatan kemitraan distribusi baru untuk wilayah Jabodetabek.",
    image: "/media/adb1de5e-246d-4810-becf-8253166a53f2.webp",
    alt: "Pertemuan bisnis dengan mitra distribusi",
    date: "Agu 2026",
    location: "Bandung",
    video: true,
    tags: "#Kemitraan #Distribusi",
  },
  {
    id: 4,
    handle: "ardikurniawan",
    title: "Roasting Biji Robusta",
    caption:
      "Selesai menyangrai batch robusta nusantara untuk distribusi kafe mitra.",
    image: "/media/22ec0f28-a921-4c77-ae9f-300d50a78ac6.webp",
    alt: "Biji kopi robusta hasil sangrai medium",
    date: "Sep 2026",
    location: "Jakarta",
    tags: "#Roasting #KopiLokal",
  },
  {
    id: 5,
    handle: "ardikurniawan",
    title: "Peluncuran Outlet Baru",
    caption: "Peresmian titik distribusi kopi lokal di kawasan Kemang.",
    image: "/media/22ec0f28-a921-4c77-ae9f-300d50a78ac6.webp",
    alt: "Outlet distribusi kopi baru di Kemang",
    date: "Jul 2026",
    location: "Jakarta",
    video: true,
    tags: "#Ekspansi #Retail",
  },
  {
    id: 6,
    handle: "dimassaputra",
    title: "Produksi Camilan Tradisional",
    caption:
      "Batch produksi camilan tradisional untuk distribusi grosir antarpulau.",
    image: "/media/382431f1-9cb5-4f60-bada-863b498f1a11.webp",
    alt: "Aneka camilan tradisional hasil produksi",
    date: "Sep 2026",
    location: "Yogyakarta",
    tags: "#Produksi #Kuliner",
  },
  {
    id: 7,
    handle: "dimassaputra",
    title: "Distribusi ke Batam",
    caption: "Pengiriman pertama paket camilan ke mitra distributor Batam.",
    image: "/media/382431f1-9cb5-4f60-bada-863b498f1a11.webp",
    alt: "Paket camilan siap distribusi ke Batam",
    date: "Agu 2026",
    location: "Batam",
    video: true,
    tags: "#Distribusi #Logistik",
  },
  {
    id: 8,
    handle: "alyarahma",
    title: "Evaluasi Sample Kain",
    caption:
      "Penyelesaian paket sample kain untuk evaluasi buyer sebelum pesanan grosir.",
    image: "/media/935b0883-6fb2-49d4-b53a-312c65a8ea30.webp",
    alt: "Paket contoh kain beragam pola untuk buyer",
    date: "Sep 2026",
    location: "Surabaya",
    tags: "#Sourcing #QualityControl",
  },
  {
    id: 9,
    handle: "alyarahma",
    title: "Kunjungan Pabrik Mitra",
    caption: "Verifikasi kapasitas produksi pabrik kain partner di Surabaya.",
    image: "/media/935b0883-6fb2-49d4-b53a-312c65a8ea30.webp",
    alt: "Kunjungan pabrik kain partner",
    date: "Agu 2026",
    location: "Surabaya",
    video: true,
    tags: "#Supplier #SupplyChain",
  },
  {
    id: 10,
    handle: "budisantoso",
    title: "Kampanye Brand Klien",
    caption:
      "Penyelesaian eksekusi kampanye branding digital untuk klien fashion.",
    image: "/media/bdffccae-048c-44ea-a4a0-4ef0bfc802bf.webp",
    alt: "Hasil kampanye branding digital klien",
    date: "Sep 2026",
    location: "Jakarta",
    tags: "#Branding #Kampanye",
  },
  {
    id: 11,
    handle: "budisantoso",
    title: "Retreat Strategi Tim",
    caption:
      "Penyusunan strategi kuartal berikutnya bersama tim agency di Bali.",
    image: "/media/12d5fd3c-2c91-4d29-b419-2fcb4b16777a.webp",
    alt: "Tim agency berkumpul menyusun strategi di Bali",
    date: "Agu 2026",
    location: "Nusa Penida",
    video: true,
    tags: "#Strategi #Agency",
  },
  {
    id: 12,
    handle: "bimaaditya",
    title: "Peluncuran Ekspansi Digital",
    caption:
      "Go-live ekspansi digital end-to-end untuk brand baru masuk pasar online.",
    image: "/media/bdffccae-048c-44ea-a4a0-4ef0bfc802bf.webp",
    alt: "Peluncuran ekspansi digital brand",
    date: "Sep 2026",
    location: "Jakarta",
    tags: "#Ekspansi #Digital",
  },
  {
    id: 13,
    handle: "bimaaditya",
    title: "Pitch Layanan Agency",
    caption: "Penyampaian pitch layanan agency untuk klien ekspansi digital.",
    image: "/media/12d5fd3c-2c91-4d29-b419-2fcb4b16777a.webp",
    alt: "Sesi pitch layanan agency",
    date: "Agu 2026",
    location: "Jakarta",
    video: true,
    tags: "#Pitch #Agency",
  },
];

export function momentsByHandle(handle: string): ProjectMoment[] {
  return projectMoments.filter((m) => m.handle === handle);
}
