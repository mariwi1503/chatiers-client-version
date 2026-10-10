import Link from "next/link";
export default function NotFound() {
  return (
    <main className="announce-missing">
      <h1>Halaman tidak ditemukan</h1>
      <p>Halaman atau profil yang kamu cari tidak tersedia di chatiers.</p>
      <Link href="/" className="primary-button">
        Kembali ke Beranda
      </Link>
    </main>
  );
}
