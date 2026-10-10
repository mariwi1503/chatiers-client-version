"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="announce-missing">
      <h1>Halaman belum bisa ditampilkan</h1>
      <p>Coba muat kembali halaman untuk melanjutkan.</p>
      <button className="primary-button" onClick={reset}>
        Coba lagi
      </button>
    </main>
  );
}
