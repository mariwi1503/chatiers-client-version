export type PostKind = "update" | "partner" | "supplier" | "hiring";

export type SocialPost = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  color: string;
  time: string;
  location: string;
  company: string;
  role: string;
  text: string;
  tags: string;
  image: string;
  alt: string;
  video?: boolean;
  gallery?: { image: string; alt: string }[];
  likes: number;
  comments: number;
  replies: string[];
  kind?: PostKind;
  opportunityTitle?: string;
  opportunityDetail?: string;
};

export const initialPosts: SocialPost[] = [
  {
    id: 1,
    name: "Sari Wijaya",
    handle: "sariwijaya",
    initials: "SW",
    color: "peach",
    time: "25 menit lalu",
    location: "Bandung, Indonesia",
    company: "Wijaya Textile",
    role: "Pemilik Bisnis",
    text: "Meeting produktif dengan calon mitra distribusi. Kadang kolaborasi terbaik lahir dari obrolan santai secangkir kopi. Siapa yang sedang mencari mitra bisnis untuk ekspansi pasar?",
    tags: "#NetworkingBisnis #Kolaborasi",
    image: "/media/adb1de5e-246d-4810-becf-8253166a53f2.webp",
    alt: "Pertemuan bisnis di kedai kopi dengan tanaman tropis di Bandung",
    likes: 128,
    comments: 12,
    replies: [
      "Terima kasih sudah menyampaikan minatnya. Kita bisa jadwalkan call minggu depan untuk membahas peluang distribusinya.",
      "Untuk yang bertanya seputar wilayah coverage, saat ini kami melayani Jabodetabek dan Bandung.",
    ],
  },
  {
    id: 2,
    name: "Budi Santoso",
    handle: "budisantoso",
    initials: "BS",
    color: "green",
    time: "1 jam lalu",
    location: "Nusa Penida, Bali",
    company: "Nusantara Digital",
    role: "Founder Agency",
    text: "Retreat tim di Bali — menyusun strategi kuartal berikutnya dan memperluas jaringan klien. Tim kami membuka 3 posisi: UI Designer, Digital Marketer, dan Backend Developer. Bagi yang mencari peluang karier, silakan hubungi.",
    tags: "#LowonganKerja #Rekrutmen",
    image: "/media/12d5fd3c-2c91-4d29-b419-2fcb4b16777a.webp",
    alt: "Tim agency berkumpul menghadap tebing hijau dan laut biru di Nusa Penida, Bali",
    likes: 246,
    comments: 24,
    video: true,
    replies: [
      "Posisi UI Designer masih terbuka, silakan kirim portofolio ke email tim kami.",
      "Untuk Backend Developer, pengalaman minimal 2 tahun dengan Node.js atau Go.",
    ],
  },
  {
    id: 3,
    name: "Alya Rahma",
    handle: "alyarahma",
    initials: "AR",
    color: "peach",
    time: "3 jam lalu",
    location: "Surabaya, Indonesia",
    company: "Sumber Makmur",
    role: "Buyer & Sourcing",
    text: "Video cuplikan pabrik kain partner kami. Kualitas dan kapasitas produksi terjaga untuk kebutuhan grosir. Bagi buyer yang sedang mencari supplier tekstil, tonton dulu lalu hubungi kami.",
    tags: "#CariSupplier #ProdukBisnis",
    image: "/media/adb1de5e-246d-4810-becf-8253166a53f2.webp",
    alt: "Cuplikan video pabrik kain dengan rol kain berjajar di Surabaya",
    likes: 312,
    comments: 31,
    video: true,
    replies: [
      "Iya, kapasitas produksi kami mencapai 10.000 yard per bulan.",
      "Sample kain bisa kami kirimkan setelah konfirmasi kebutuhan buyer.",
    ],
  },
  {
    id: 4,
    name: "Bima Aditya",
    handle: "bimaaditya",
    initials: "BA",
    color: "green",
    time: "5 jam lalu",
    location: "Jakarta, Indonesia",
    company: "Nusantara Digital",
    role: "Founder Agency",
    text: "Pitch singkat layanan agency kami untuk brand yang ingin ekspansi digital. Tonton videonya, kalau cocok kita jadwalkan call.",
    tags: "#PitchBisnis #Agency",
    image: "/media/12d5fd3c-2c91-4d29-b419-2fcb4b16777a.webp",
    alt: "Video pitch bisnis agency dengan presentasi di Jakarta",
    likes: 198,
    comments: 17,
    video: true,
    replies: [
      "Bisa, kita atur jadwal call untuk preview layanan agency kami.",
      "Untuk paket branding lengkap, estimasi pengerjaan 4–6 minggu.",
    ],
  },
  {
    id: 5,
    name: "Ardi Kurniawan",
    handle: "ardikurniawan",
    initials: "AK",
    color: "yellow",
    time: "Baru saja",
    location: "Jakarta, Indonesia",
    company: "Kopi Nusantara",
    role: "Pemilik Bisnis",
    text: "Sedang mencari mitra untuk memperluas distribusi kopi lokal ke lebih banyak kota. Jika kamu punya pengalaman di bidang distribusi atau retail, yuk bertukar ide dan peluang kolaborasi.",
    tags: "#Kolaborasi #KopiLokal",
    image: "",
    alt: "",
    likes: 0,
    comments: 0,
    replies: [],
  },
  {
    id: 6,
    name: "Dimas Saputra",
    handle: "dimassaputra",
    initials: "DS",
    color: "purple",
    time: "4 jam lalu",
    location: "Batam, Indonesia",
    company: "Rasa Nusantara",
    role: "Pemilik Bisnis",
    text: "Membuka peluang kerja sama distribusi makanan khas Nusantara dari Batam ke berbagai kota. Bagi yang berminat menjadi distributor atau mitra logistik, mari berdiskusi lebih lanjut.",
    tags: "#PeluangBisnis #Distribusi",
    image: "",
    alt: "",
    likes: 87,
    comments: 8,
    replies: [
      "Distributor untuk wilayah Sumatra sudah kami pegang, tapi wilayah lain masih terbuka.",
      "Bisa kirimkan katalog produk dan estimasi harga grosirnya?",
    ],
  },
];
export const people = [
  {
    handle: "dimassaputra",
    name: "Dimas Saputra",
    detail: "Pemilik bisnis · Rasa Nusantara",
    reason: "Bergerak di makanan dan distribusi",
    initials: "DS",
    color: "purple",
  },
  {
    handle: "alyarahma",
    name: "Alya Rahma",
    detail: "Buyer & Sourcing · Sumber Makmur",
    reason: "Berpengalaman dalam pengadaan tekstil",
    initials: "AR",
    color: "peach",
  },
  {
    handle: "bimaaditya",
    name: "Bima Aditya",
    detail: "Founder Agency · Nusantara Digital",
    reason: "Menawarkan layanan pengembangan brand",
    initials: "BA",
    color: "green",
  },
];
export const topics = [
  { tag: "PeluangBisnis", count: "1,2 rb diskusi" },
  { tag: "LowonganKerja", count: "856 diskusi" },
  { tag: "CariSupplier", count: "642 diskusi" },
];
export type NewPost = {
  text: string;
  image?: string;
  alt?: string;
  tags?: string;
  video?: boolean;
  kind?: PostKind;
  opportunityTitle?: string;
  opportunityDetail?: string;
};

export type ChatiersUser = {
  handle: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  company: string;
  location: string;
  detail?: string;
};

/** Daftar pengguna yang dikenal di jaringan chatiers. */
export const users: ChatiersUser[] = [
  {
    handle: "sariwijaya",
    name: "Sari Wijaya",
    initials: "SW",
    color: "peach",
    role: "Pemilik Bisnis",
    company: "Wijaya Textile",
    location: "Bandung, Indonesia",
  },
  {
    handle: "budisantoso",
    name: "Budi Santoso",
    initials: "BS",
    color: "green",
    role: "Founder Agency",
    company: "Nusantara Digital",
    location: "Nusa Penida, Bali",
  },
  {
    handle: "alyarahma",
    name: "Alya Rahma",
    initials: "AR",
    color: "peach",
    role: "Buyer & Sourcing",
    company: "Sumber Makmur",
    location: "Surabaya, Indonesia",
  },
  {
    handle: "bimaaditya",
    name: "Bima Aditya",
    initials: "BA",
    color: "green",
    role: "Founder Agency",
    company: "Nusantara Digital",
    location: "Jakarta, Indonesia",
  },
  {
    handle: "dimassaputra",
    name: "Dimas Saputra",
    initials: "DS",
    color: "purple",
    role: "Pemilik Bisnis",
    company: "Rasa Nusantara",
    location: "Batam, Indonesia",
    detail: "Pemilik bisnis F&B",
  },
  {
    handle: "ardikurniawan",
    name: "Ardi Kurniawan",
    initials: "AK",
    color: "yellow",
    role: "Pemilik Bisnis",
    company: "Kopi Nusantara",
    location: "Jakarta, Indonesia",
  },
];

export function findUser(handle: string): ChatiersUser | undefined {
  return users.find((u) => u.handle === handle);
}
