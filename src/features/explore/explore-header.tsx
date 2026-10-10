import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ExploreHeader() {
  return (
    <header className="explore-header">
      <Link
        href="/"
        className="explore-back"
        aria-label="Kembali ke Beranda"
        title="Kembali ke Beranda"
      >
        <ArrowLeft size={22} />
      </Link>
      <span>Jelajahi</span>
    </header>
  );
}
