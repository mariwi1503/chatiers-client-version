/** Local demo only: supported seed phrases never call a translation service. */
const translations: Record<string, string> = {
  "Terima kasih sudah menyampaikan minatnya. Kita bisa jadwalkan call minggu depan untuk membahas peluang distribusinya.":
    "Thank you for expressing your interest. We can schedule a call next week to discuss distribution opportunities.",
  "Untuk yang bertanya seputar wilayah coverage, saat ini kami melayani Jabodetabek dan Bandung.":
    "For those asking about coverage, we currently serve Greater Jakarta and Bandung.",
  "Posisi UI Designer masih terbuka, silakan kirim portofolio ke email tim kami.":
    "The UI Designer position is still open. Please send your portfolio to our team email.",
  "Untuk Backend Developer, pengalaman minimal 2 tahun dengan Node.js atau Go.":
    "For the Backend Developer position, at least two years of experience with Node.js or Go is required.",
  "Iya, kapasitas produksi kami mencapai 10.000 yard per bulan.":
    "Yes, our production capacity reaches 10,000 yards per month.",
  "Sample kain bisa kami kirimkan setelah konfirmasi kebutuhan buyer.":
    "We can send fabric samples after confirming the buyer's requirements.",
  "Bisa, kita atur jadwal call untuk preview layanan agency kami.":
    "Sure, let's schedule a call to preview our agency services.",
  "Untuk paket branding lengkap, estimasi pengerjaan 4–6 minggu.":
    "For a complete branding package, the estimated turnaround is four to six weeks.",
  "Distributor untuk wilayah Sumatra sudah kami pegang, tapi wilayah lain masih terbuka.":
    "We already have a distributor for Sumatra, but other regions remain open.",
  "Bisa kirimkan katalog produk dan estimasi harga grosirnya?":
    "Could you send the product catalog and estimated wholesale prices?",
  Halo: "Hello",
  "Terima kasih": "Thank you",
  hello: "Halo",
  "thank you": "Terima kasih",
};
export function translateDemo(text: string): string | undefined {
  return translations[text.trim()] ?? translations[text.trim().toLowerCase()];
}
