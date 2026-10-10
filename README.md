# chatiers

Migrasi proyek `../web` ke Next.js App Router, TypeScript, dan Tailwind CSS 3. Layout tiga kolom, navigasi mobile, warna, tipografi, logo, dan alur utama mengikuti proyek asli. Proyek ini berdiri sendiri: tidak membutuhkan PocketBase, kredensial, layanan AI, atau API backend.

## Menjalankan

Dari folder `apps`:

```bash
cd chatiers-next
npm install --workspaces=false
npm run dev
```

Buka http://localhost:3001. Port 3001 dipilih agar tidak bertabrakan dengan proyek `web` di port 3000. Gunakan Node.js 22 dan npm 10 atau versi yang kompatibel.

```bash
npm run lint
npm run typecheck
npm run build
npm run start
npm run test:e2e
```

Pengujian Playwright memakai Google Chrome yang terpasang (`channel: "chrome"`) dan otomatis menjalankan server jika belum tersedia. Konfigurasi dan skenario berada di `playwright.config.ts` dan folder `tests/`.

## Struktur dan cara menelusuri kode

```text
src/
  app/               Route App Router, layout, metadata, sitemap, robots, OG image
  features/
    feed/            Shell, filter feed, kartu postingan, rekomendasi koneksi
    explore/         Pemutar vertikal Jelajahi, kartu dan menu preferensi
    posting/         Pemilih tipe postingan dan formulir postingan
    comments/        Komentar, balasan, terjemahan demo, overlay komentar
    jobs/            Daftar, filter, formulir, dan interaksi lowongan
    profiles/        Profil pengguna, katalog produk, informasi/video perusahaan
    projects/        Galeri proyek serta filter foto/video
    announcements/   Chatboard, detail, CRUD, countdown
    search/          Pencarian dan riwayat
  components/        Navigasi, discovery, logo, lokasi, media, JSON-LD, pemberitahuan
  hooks/             Penyimpanan reaktif dan perilaku dialog
  data/              Seed postingan, pengguna, lowongan, produk, proyek, Chatboard
  lib/               SEO, navigasi, storage/validasi, font, profil, tanggal, demo translation
  styles/            CSS per kelompok fitur; index.ts menjaga urutan cascade asli
public/
  fonts/             Font asli yang dimuat dengan next/font/local
  media/             Gambar asli, versi WebP, dan video dummy lokal
```

Mulai dari `src/app/.../page.tsx`, ikuti komponen di `features`, lalu lihat seed di `data` dan key penyimpanan di pemanggilan `useLocalStorage`. Metadata dibangun melalui `lib/seo.ts`. Jangan mengubah urutan import CSS dalam `styles/index.ts` tanpa mengecek desktop dan mobile: beberapa aturan responsif proyek asli sengaja menimpa aturan sebelumnya.

## Route

| Route | Fungsi | Indeks pencarian |
| --- | --- | --- |
| `/` | Feed bisnis dan formulir melalui query `compose` | Ya |
| `/jelajahi` | Reels/video bisnis | Ya |
| `/lowongan` | Lowongan kerja | Ya |
| `/komunitas` | Pilihan dan keanggotaan komunitas lokal | Ya |
| `/profile/[handle]` | Profil, produk, perusahaan, informasi pengguna | Ya |
| `/profile/[handle]/projects` | Dokumentasi proyek | Ya |
| `/profile/[handle]/announcements` | Chatboard perusahaan | Ya |
| `/profile/[handle]/announcements/[id]` | Detail dan komentar Chatboard | Seed publik saja |
| `/search` | Pencarian pengguna, postingan, lowongan | Tidak |
| `/posting` | Pilihan cepat tipe postingan | Tidak |
| `/tersimpan`, `/notifikasi`, `/pesan` | Tampilan pribadi | Tidak |

Quick links asli seperti `/?compose=text`, `/?compose=media`, `/?compose=custom`, dan `/?tab=lowongan&compose=job&type=Remote` tetap tersedia. Profil yang tidak dikenal dan route yang tidak tersedia mengembalikan 404.

## Data dan localStorage

Identitas demo tetap **Ardi Kurniawan**. Seed dirender di server agar konten publik tersedia sebelum JavaScript berjalan. Browser kemudian memulihkan perubahan lokal tanpa mismatch hydration.

Key memakai namespace **`chatiers:v1:`**:

- `posts`, `jobs`, `announcements`: data yang diterbitkan dan perubahan Chatboard.
- `post-likes`, `post-saved`, `post-comments`, `post-muted`: interaksi postingan yang dibagikan antara feed, reels, dan profil. `post-reposts` menyimpan tanda repost lokal yang sama antara feed dan profil; penghitung menunjukkan repost pada perangkat ini.
- `job-likes`, `job-saved`, `job-comments`: interaksi lowongan.
- `following`: follow pengguna yang konsisten antara rekomendasi dan profil.
- `announcement-reactions`, `announcement-comments`: interaksi Chatboard.
- `region`, `feed-mode`, `recent-searches`, `joined-communities`: preferensi dan aktivitas lokal.
- `explore-hidden`: video yang disembunyikan dari Jelajahi.
- `profile-details:[handle]`: bio, lokasi, dan situs bisnis dari editor profil sendiri.
- Key lama `profile-muted:[handle]` dan `profile-notifications:[handle]` tidak lagi digunakan oleh tampilan Profil.

`useLocalStorage` memakai `useSyncExternalStore`, event browser untuk sinkronisasi antar-tab, dan event lokal untuk sinkronisasi dalam tab yang sama. Data rusak ditolak melalui validasi. Jika storage penuh atau diblokir, interaksi tetap berjalan sementara di memori dan aplikasi menampilkan pemberitahuan.

## Home dan navigasi

Home dimulai dengan **Semua lokasi** (`Public` secara internal); pilihan lokasi yang sudah tersimpan tetap dihormati. Sumber feed **Semua / Mengikuti** tersimpan di `feed-mode`, sedangkan filter jenis peluang berlaku selama halaman dibuka. Filter sumber, lokasi, jenis, dan pencarian digabungkan. Setelah menerbitkan postingan, aplikasi membuka Beranda dan mengembalikan filter sumber/jenis ke semua agar postingan baru terlihat.

`features/feed/feed-controls.tsx` mengatur filter, `recommended-connections.tsx` dipakai bersama oleh kolom kanan dan feed mobile/tablet, serta `post-card.tsx` menampilkan postingan tanpa kartu tambahan Cari mitra, Lowongan, atau Cari supplier. Metadata peluang seed berada di `data/opportunities.ts`, terpisah dari seed storage agar postingan lama tidak hilang. Jenis peluang dan detail baru dari composer disimpan bersama postingan.

Feed memakai latar lavender, pembatas antarpostingan, composer berbentuk pill, label kategori, dan empat aksi: suka, komentar, repost lokal, serta simpan. Salin teks tersedia melalui menu titik tiga. `features/feed/feed-media-gallery.tsx` menyediakan foto persegi yang bisa digeser, tombol indikator, dan navigasi keyboard. `data/feed-presentation.ts` menyediakan galeri dummy Sari tanpa mengubah seed storage; postingan lain memakai foto sendiri atau field `gallery` opsional. Video tetap dapat diputar dengan kontrol suara. Tampilan feed diatur dalam `styles/feed-stream.css`.

Menekan foto membuka `features/feed/feed-media-preview.tsx` pada foto yang dipilih. Galeri preview mendukung swipe kiri/kanan, drag mouse, tombol panah, serta keyboard. Video membuka pemutar besar dengan kontrol browser dan status suara bersama feed. Preview dirender melalui portal, mengunci scroll halaman, mengelola fokus, dan dapat ditutup dengan tombol atau Escape; pemutar berhenti saat ditutup. Sumber video bersama berada di `lib/post-media.ts`, sedangkan CSS preview berada di `styles/feed-media-preview.css`.

Layar sampai 600px memakai navbar bawah **Beranda, Jelajahi, Buat postingan, Notifikasi, Profil**, tanpa sidebar atau hamburger. Notifikasi tersedia di navbar bawah pada mobile dan sidebar pada desktop; profil melalui navbar bawah pada mobile dan bagian bawah sidebar pada desktop. Tombol Komunitas/Tersimpan serta filter sumber, lokasi, dan jenis peluang tidak ditampilkan pada layar sampai 600px; feed mobile menampilkan semua sumber, lokasi, dan jenis tanpa menghapus preferensi filter desktop. Pencarian dan daftar postingan tersimpan tetap berfungsi. Header tidak menampilkan avatar profil atau ikon notifikasi. Rekomendasi koneksi muncul di dalam feed ketika kolom kanan disembunyikan (sampai 960px). Waktu dan kota pada kartu postingan tampil tepat di samping nama, dengan tombol titik tiga di ujung kanan pada baris yang sama, misalnya `25m · Bandung` atau `1h · Nusa Penida`; postingan baru memakai label `baru`. Format diatur oleh `lib/post-metadata.ts` tanpa mengubah data tersimpan. Hashtag membuka pencarian feed; **Salin teks postingan** menyalin isi untuk dibagikan, bukan mengirim pesan.

Untuk mengembalikan dummy data, hapus hanya key dengan prefix `chatiers:v1:` melalui DevTools → Application → Local Storage. Data lokal berlaku untuk origin browser: `localhost` dan `127.0.0.1` mempunyai penyimpanan berbeda.

## Jelajahi

`features/explore/explore-view.tsx` menampilkan satu video vertikal dengan scroll-snap, aksi di sisi kanan, dan profil/deskripsi/hashtag di atas video bagian bawah. Header overlay berisi tombol Kembali ke Beranda dan judul Jelajahi. Sidebar tersedia di desktop; navbar bawah tetap terlihat di mobile. Halaman langsung membuka pemutar tanpa panel pencarian, filter, kartu konten, atau toolbar layar penuh. Preferensi lama `explore-source` dan `explore-topic` diabaikan agar tidak menyaring video secara tersembunyi.

`explore-header.tsx`, `explore-player.tsx`, `explore-video-card.tsx`, dan `explore-video-menu.tsx` memisahkan header, navigasi video, isi/aksi, dan opsi Tidak tertarik. `styles/explore.css` mengatur overlay dan tampilan responsif. Video tersembunyi tersimpan di localStorage; pemberitahuan setelah menyembunyikan menyediakan Urungkan, sementara menu atau tampilan kosong menyediakan cara memulihkan video.

Video aktif diputar otomatis dengan suara mati secara default. Jeda manual dihormati, video berhenti ketika tidak aktif, komentar dibuka, atau tab browser disembunyikan. Tombol panah desktop dan keyboard serta scroll/swipe mobile berpindah video. Video di luar layar dibuat `inert`; navigasi mengakomodasi reduced motion. Hashtag membuka pencarian Beranda, salin teks memakai clipboard, dan like/simpan/komentar/suara memakai key bersama Beranda dan Profil. Video seed memakai aset demo lokal.

`tests/explore.spec.ts` memeriksa navigasi/responsif, preferensi lama, sembunyikan/urungkan, autoplay/jeda, komentar lintas halaman, serta ketiadaan panggilan backend. Pratinjau berada di `docs/previews/explore-desktop.png` dan `explore-mobile.png`.

## Profil

Seluruh route `/profile/[handle]` memakai `app/profile/[handle]/layout.tsx` dan `features/profiles/profile-shell.tsx` untuk navigasi serta discovery yang sama dengan Home. Navbar bawah menggantikan sidebar pada layar sampai 600px. `styles/profile-refinements.css` menyesuaikan konten dengan lebar kolom melalui container queries.

`profile-view.tsx` mengatur bagian Postingan, Tentang, Perusahaan, dan Produk. Pratinjau Chatboards berada tepat di bawah kartu Profil, sebelum tab bagian profil, dan tetap tampil ketika tab berganti. Editor lokal, daftar koneksi, informasi bisnis, dan katalog berada dalam komponen terpisah di `features/profiles`. Dialog dirender melalui portal agar tidak terpotong oleh kolom. Ikon pensil di kanan kartu Profil, sejajar dengan nama pengguna, membuka editor untuk identitas demo Ardi. Tombol Buat postingan tidak ditampilkan dalam konten Profil; ringkasan koneksi dan postingan memakai angka serta label kecil dalam satu baris. Pengunjung profil lain dapat mengikuti, melihat kontak bisnis, dan menyalin tautan profil. Pengelolaan Chatboard juga hanya tampil pada profil sendiri.

Jumlah mengikuti, pengikut, dan postingan dihitung dari data yang ditampilkan. `lib/profiles.ts` menyediakan jaringan dummy yang konsisten; hubungan mengikuti milik Ardi memakai key bersama `following`. Statistik kunjungan serta indikator online/verifikasi yang tidak didukung data tidak ditampilkan. Detail produk dapat dibuka dan disalin; video perusahaan memakai kontrol browser dan video demo lokal. Like, simpan, dan komentar profil memakai key yang sama dengan Home.

Pratinjau Profil tersedia di `docs/previews/profile-*.png`. Pengujian mencakup editor dan validasi situs, persistensi profil, daftar koneksi unik, detail produk, komentar lintas halaman, serta semua bagian profil pada lebar 320–1440px.

## SEO

Sebelum deployment, buat `.env.local` berdasarkan `.env.example` dan tetapkan origin domain sebenarnya:

```dotenv
NEXT_PUBLIC_SITE_URL=https://domain-anda.example
```

Build ulang setelah mengubahnya. Nilai default adalah `http://localhost:3001`, untuk pengembangan lokal.

- Title dan description unik, canonical absolut, Open Graph, dan Twitter Card.
- OG image lokal di `/opengraph-image`, favicon, bahasa Indonesia, viewport, dan semantic heading.
- JSON-LD `WebSite` dan `ProfilePage` yang sesuai dengan konten profil.
- Sitemap mencakup route publik, seluruh profil, proyek, serta Chatboard seed.
- Halaman pribadi/pencarian memakai `noindex`; robots mengizinkan crawler membaca instruksi tersebut.
- Profil dan konten publik tersedia dalam HTML server. Gambar WebP dan font lokal mengurangi permintaan eksternal.

Perubahan yang hanya ada di localStorage tidak dapat dibaca server atau mesin pencari. Karena itu, metadata dan sitemap memakai seed publik; Chatboard baru di browser memakai `noindex`. Tidak ada schema lowongan yang mengklaim dummy data sebagai lowongan nyata.

## Batas demo yang dipertahankan

Pesan dan Notifikasi tetap berupa tampilan kosong sebagaimana proyek asli. Produk menampilkan katalog dummy. Terjemahan komentar memakai kamus lokal untuk contoh yang didukung; komentar bebas menampilkan keterangan jika terjemahan demo belum tersedia. Tidak ada login sungguhan, pengiriman CV, pengiriman pesan, atau layanan terjemahan backend.

Seluruh media seed tersedia lokal. URL foto/video yang Anda masukkan sendiri tetap dimuat dari URL tersebut. Video lokal adalah cuplikan dummy pengganti sumber lama yang mengembalikan 403.

## Preview

Hasil pengujian tampilan tersedia di `docs/previews/desktop.png` dan `docs/previews/mobile.png`. Preview memakai Semua lokasi untuk memperlihatkan seluruh contoh konten Home.
