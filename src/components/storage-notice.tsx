"use client";
import { useEffect, useState } from "react";
export function StorageNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener("chatiers:storage-unavailable", show);
    return () =>
      window.removeEventListener("chatiers:storage-unavailable", show);
  }, []);
  return visible ? (
    <div role="status" className="storage-notice">
      Penyimpanan browser penuh atau tidak tersedia. Perubahan tersimpan
      sementara sampai halaman ditutup.
      <button
        onClick={() => setVisible(false)}
        aria-label="Tutup pemberitahuan"
      >
        ×
      </button>
    </div>
  ) : null;
}
