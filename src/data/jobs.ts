export type JobVacancy = {
  id: number;
  email: string;
  company: string;
  posterName: string;
  handle: string;
  initials: string;
  color: string;
  role: string;
  position: string;
  salary: string;
  location: string;
  type: string;
  caption: string;
  tags: string;
  time: string;
  applicants: number;
  likes: number;
  comments: number;
  replies: string[];
};

export const jobVacancies: JobVacancy[] = [
  {
    id: 1,
    email: "karir@nusantaradigital.id",
    company: "Nusantara Digital",
    posterName: "Budi Santoso",
    handle: "budisantoso",
    initials: "BS",
    color: "green",
    role: "Founder Agency",
    position: "Backend Developer",
    salary: "Rp 8.000.000 – 12.000.000 /bulan",
    location: "Jakarta, Indonesia",
    type: "Penuh Waktu",
    caption:
      "Tim kami sedang berkembang dan membuka posisi Backend Developer. Pengalaman minimal 2 tahun dengan Node.js atau Go. Kamu akan membangun layanan yang melayani ribuan pengguna bisnis setiap harinya.",
    tags: "#LowonganKerja #BackendDeveloper",
    time: "1 jam lalu",
    applicants: 48,
    likes: 86,
    comments: 14,
    replies: [
      "Terima kasih minatnya. Silakan kirim CV ke email tim rekrutmen kami.",
      "Untuk fresh graduate, saat ini kami butuh pengalaman minimal 2 tahun.",
    ],
  },
  {
    id: 2,
    email: "hrd@wijayatextile.co.id",
    company: "Wijaya Textile",
    posterName: "Sari Wijaya",
    handle: "sariwijaya",
    initials: "SW",
    color: "peach",
    role: "Pemilik Bisnis",
    position: "UI Designer",
    salary: "Rp 6.500.000 – 9.000.000 /bulan",
    location: "Bandung, Indonesia",
    type: "Penuh Waktu",
    caption:
      "Kami mencari UI Designer kreatif untuk merancang pengalaman visual produk tekstil kami. Kuasai Figma dan punya perhatian terhadap detail. Portofolio wajib dilampirkan saat melamar.",
    tags: "#LowonganKerja #UIDesigner",
    time: "3 jam lalu",
    applicants: 32,
    likes: 64,
    comments: 9,
    replies: [
      "Portofolio wajib dilampirkan ya, bisa kirim via link Behance atau Dribbble.",
    ],
  },
  {
    id: 3,
    email: "karir@nusantaradigital.id",
    company: "Nusantara Digital",
    posterName: "Budi Santoso",
    handle: "budisantoso",
    initials: "BS",
    color: "green",
    role: "Founder Agency",
    position: "Digital Marketer",
    salary: "Rp 5.500.000 – 8.000.000 /bulan",
    location: "Nusa Penida, Bali",
    type: "Remote",
    caption:
      "Bergabunglah sebagai Digital Marketer untuk mengelola kampanye klien lintas industri. Pengalaman dengan iklan berbayar dan analitik diperlukan. Posisi remote dengan kunjungan tim berkala ke Bali.",
    tags: "#LowonganKerja #DigitalMarketing",
    time: "5 jam lalu",
    applicants: 27,
    likes: 53,
    comments: 7,
    replies: [
      "Posisi remote penuh, kunjungan tim ke Bali diatur sebulan sekali.",
    ],
  },
  {
    id: 4,
    email: "rekrutmen@sumbermakmur.co.id",
    company: "Sumber Makmur",
    posterName: "Alya Rahma",
    handle: "alyarahma",
    initials: "AR",
    color: "peach",
    role: "Buyer & Sourcing",
    position: "Supply Chain Analyst",
    salary: "Rp 7.000.000 – 10.000.000 /bulan",
    location: "Surabaya, Indonesia",
    type: "Penuh Waktu",
    caption:
      "Cari analis rantai pasok untuk mengoptimalkan alur distribusi kain dari pabrik ke buyer. Latar belakang logistik atau manajemen operasional diutamakan. Hubungi kami untuk detail lebih lanjut.",
    tags: "#LowonganKerja #SupplyChain",
    time: "8 jam lalu",
    applicants: 19,
    likes: 41,
    comments: 5,
    replies: [
      "Latar belakang logistik atau manajemen operasional sangat diutamakan.",
    ],
  },
  {
    id: 5,
    email: "lowongan@rasanusantara.id",
    company: "Rasa Nusantara",
    posterName: "Dimas Saputra",
    handle: "dimassaputra",
    initials: "DS",
    color: "purple",
    role: "Pemilik Bisnis",
    position: "Head Barista",
    salary: "Rp 4.500.000 – 6.500.000 /bulan",
    location: "Batam, Indonesia",
    type: "Penuh Waktu",
    caption:
      "Kami membuka lowongan Head Barista untuk cabang baru di Batam. Wajib pengalaman minimal 3 tahun di industri kopi spesialti. Kemampuan melatih tim dan mengelola operasional harian menjadi nilai tambah.",
    tags: "#LowonganKerja #Barista",
    time: "1 hari lalu",
    applicants: 41,
    likes: 72,
    comments: 11,
    replies: [
      "Pengalaman 3 tahun di kopi spesialti wajib, kemampuan melatih tim jadi nilai tambah.",
    ],
  },
];
