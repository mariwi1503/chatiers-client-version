import { ImageResponse } from "next/og";
export const alt = "chatiers — Ide bisnis. Koneksi nyata.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f5f6fb",
        padding: "80px",
        color: "#1b1838",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: "-4px",
        }}
      >
        chatiers<span style={{ color: "#8b5cf6" }}>•</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 65,
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <span>Ide bisnis.</span>
        <span>Koneksi nyata.</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 26,
          color: "#6a6f8a",
        }}
      >
        Mitra, supplier, lowongan, dan peluang kolaborasi.
      </div>
    </div>,
    size,
  );
}
