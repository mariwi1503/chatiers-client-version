"use client";
import { Package, ArrowUpRight, Tag, Copy, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/hooks/use-dialog";
import { ProfileDialogFrame } from "./profile-dialog-frame";
import { productsByHandle, type Product } from "@/data/products";
export function ProfileProducts({ handle }: { handle: string }) {
  const [notice, setNotice] = useState("");
  const items = productsByHandle(handle);
  const [selected, setSelected] = useState<Product | null>(null);
  useDialog(!!selected, () => setSelected(null));
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="activity-icon yellow">
          <Package size={18} />
        </span>
        <h2>Belum ada produk</h2>
        <p>Produk dari bisnis ini belum tersedia di katalog chatiers.</p>
      </div>
    );
  }
  return (
    <section className="profile-products">
      <div className="products-head">
        <h2>Katalog Produk</h2>
        <small>{items.length} produk</small>
      </div>
      <div className="products-grid">
        {items.map((p) => (
          <article className="product-card" key={p.id}>
            <div className="product-media">
              <img src={p.image} alt={p.name} loading="lazy" />
              <span className="product-category">
                <Tag size={10} /> {p.category}
              </span>
            </div>
            <div className="product-body">
              <strong>{p.name}</strong>
              <p>{p.description}</p>
              <div className="product-foot">
                <span className="product-price">{p.price}</span>
                <button
                  type="button"
                  aria-label={`Lihat detail ${p.name}`}
                  onClick={() => {
                    setNotice("");
                    setSelected(p);
                  }}
                >
                  Lihat <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <ProfileDialogFrame onClose={() => setSelected(null)}>
          <section
            className="profile-dialog product-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h2 id="product-detail-title">Detail produk</h2>
              <button
                type="button"
                aria-label="Tutup detail produk"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </header>
            <img src={selected.image} alt={selected.name} />
            <div className="product-detail-body">
              <span>{selected.category}</span>
              <h3>{selected.name}</h3>
              <strong>{selected.price}</strong>
              <p>{selected.description}</p>
              <button
                type="button"
                className="profile-action"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${selected.name} — ${selected.price}\n${selected.description}`,
                    );
                    setNotice("Informasi produk berhasil disalin.");
                  } catch {
                    setNotice(
                      "Informasi produk tidak dapat disalin di browser ini.",
                    );
                  }
                }}
              >
                <Copy size={17} />
                Salin informasi produk
              </button>
              {notice && (
                <p role="status" className="profile-local-note">
                  {notice}
                </p>
              )}
            </div>
          </section>
        </ProfileDialogFrame>
      )}
    </section>
  );
}
