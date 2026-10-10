import { test, expect, type Page } from "@playwright/test";
import { initialPosts } from "../src/data/feed";

async function showPublic(page: Page) {
  await page.getByRole("button", { name: "Cari lokasi", exact: true }).click();
  await page.getByRole("option", { name: "Semua lokasi", exact: true }).click();
}

test("public HTML contains content and SEO without JavaScript", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Dimas Saputra");
  expect(html).toContain('lang="id"');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('property="og:title"');
  expect(html).toContain('name="twitter:card"');
  expect(html).toContain("application/ld+json");
  const profile = await request.get("/profile/sariwijaya");
  expect(await profile.text()).toContain("ProfilePage");
  expect((await request.get("/profile/tidak-ada")).status()).toBe(404);
  expect((await request.get("/tidak-ada")).status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/profile/sariwijaya/projects");
  expect(sitemap).not.toContain("/tersimpan");
  expect(await (await request.get("/tersimpan")).text()).toContain("noindex");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  expect(
    (await request.get("/opengraph-image")).headers()["content-type"],
  ).toContain("image/png");
});

test("text posts survive reload, profile navigation and search", async ({
  page,
}) => {
  await page.goto("/?compose=text");
  const dialog = page.getByRole("dialog", { name: "Bagikan postinganmu" });
  await dialog
    .getByPlaceholder("Bagikan peluang, kebutuhan, atau kabar bisnis kamu…")
    .fill("Kolaborasi lokal untuk kopi uji persistensi");
  await dialog
    .getByRole("button", { name: "Bagikan postingan", exact: false })
    .click();
  await expect(page.locator("article.post").first()).toContainText(
    "kopi uji persistensi",
  );
  await page.reload();
  await page.keyboard.press("Escape");
  await expect(page.locator("article.post").first()).toContainText(
    "kopi uji persistensi",
  );
  await page.goto("/profile/ardikurniawan");
  await expect(page.locator(".profile-posts")).toContainText(
    "kopi uji persistensi",
  );
  await page.goto("/search");
  await page.locator(".search-page input").first().fill("uji persistensi");
  await expect(page.locator(".search-page")).toContainText(
    "Kolaborasi lokal untuk kopi uji persistensi",
  );
});

test("likes, saved posts, comments and replies persist across pages", async ({
  page,
}) => {
  await page.goto("/");
  const post = page.locator("article.post").first();
  await post.getByRole("button", { name: "Sukai postingan" }).click();
  await post.getByRole("button", { name: "Simpan postingan" }).click();
  await post.getByRole("button", { name: "Buka komentar" }).click();
  const overlay = page.getByRole("dialog", { name: "Komentar postingan" });
  await overlay
    .locator("form input")
    .fill("Komentar lokal yang tetap tersimpan");
  await overlay.locator("form button[type=submit]").click();
  await expect(overlay).toContainText("Komentar lokal yang tetap tersimpan");
  await overlay
    .getByRole("button", { name: "Balas komentar", exact: true })
    .first()
    .click();
  await overlay.locator("form input").fill("Balasan lokal untuk mitra");
  await overlay.locator("form button[type=submit]").click();
  await expect(overlay).toContainText("Balasan lokal untuk mitra");
  await page.goto("/tersimpan");
  await expect(page.locator("article.post")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Sukai postingan" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await page.getByRole("button", { name: "Buka komentar" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Balasan lokal untuk mitra",
  );
  await page.goto("/profile/sariwijaya");
  await expect(
    page.getByRole("button", { name: "Simpan postingan" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("following stays in sync between discovery and profile", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ikuti Dimas Saputra", exact: true })
    .click();
  const other = await context.newPage();
  await other.goto("/profile/dimassaputra");
  await expect(
    other.getByRole("button", { name: "Mengikuti", exact: true }),
  ).toBeVisible();
  await other.getByRole("button", { name: "Mengikuti", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ikuti Dimas Saputra", exact: true }),
  ).toBeVisible();
});

test("job publishing validates fields and persists a vacancy", async ({
  page,
}) => {
  await page.goto("/?tab=lowongan&compose=job&type=Remote");
  const dialog = page.getByRole("dialog", { name: "Posting lowongan kerja" });
  await dialog
    .getByRole("button", { name: /Terbitkan|Bagikan|Posting lowongan/ })
    .last()
    .click();
  await expect(dialog).toContainText("wajib");
  await dialog.getByPlaceholder("cth. Kopi Nusantara").fill("Kopi Uji Lokal");
  await dialog
    .getByPlaceholder("cth. Head Barista")
    .fill("Barista Uji Persistensi");
  await dialog
    .getByPlaceholder("cth. Rp 5.000.000 – 7.000.000 /bulan")
    .fill("Rp 5.000.000 /bulan");
  await dialog
    .getByPlaceholder("cth. Bandung, Indonesia")
    .fill("Batam, Indonesia");
  await dialog
    .getByPlaceholder("cth. hrd@perusahaan.co.id")
    .fill("hrd@example.com");
  await dialog
    .getByPlaceholder(
      "Tulis tanggung jawab, kualifikasi, dan kebutuhan posisi…",
    )
    .fill("Menyajikan kopi untuk mitra dan pelanggan.");
  await dialog
    .getByRole("button", { name: /Terbitkan|Bagikan|Posting lowongan/ })
    .last()
    .click();
  await page.goto("/lowongan");
  await expect(page.locator(".jobs")).toContainText("Barista Uji Persistensi");
  await page.reload();
  await expect(page.locator(".jobs")).toContainText("Barista Uji Persistensi");
});

test("chatboard supports create, edit, temporary duration, comments and delete", async ({
  page,
}) => {
  const url = "/profile/ardikurniawan/announcements";
  await page.goto(url);
  await page
    .getByRole("button", { name: /Buat Chatboard|Tambah Chatboard/i })
    .first()
    .click();
  let dialog = page.getByRole("dialog");
  await dialog
    .getByPlaceholder("Judul chatboard")
    .fill("Peluang kolaborasi uji lokal");
  await dialog
    .getByPlaceholder("Tulis chatboard…")
    .fill("Detail pengumuman lokal.");
  await dialog.getByRole("button", { name: /Temporary Post/ }).click();
  await dialog.locator(".announce-publish").click();
  await expect(page.locator(".note-grid")).toContainText(
    "Peluang kolaborasi uji lokal",
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Edit Peluang kolaborasi uji lokal" })
    .click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByPlaceholder("Judul chatboard")
    .fill("Pengumuman uji selesai edit");
  await dialog.locator(".announce-publish").click();
  await page
    .getByRole("link", { name: "Buka komentar Pengumuman uji selesai edit" })
    .click();
  await expect(page.locator(".comment-countdown")).toBeVisible();
  await page
    .locator(".comment-thread form input")
    .fill("Komentar chatboard lokal");
  await page.locator(".comment-thread form button[type=submit]").click();
  await page.reload();
  await expect(page.locator(".comment-thread")).toContainText(
    "Komentar chatboard lokal",
  );
  await page.goto(url);
  await page
    .getByRole("button", { name: "Hapus Pengumuman uji selesai edit" })
    .click();
  await page.getByRole("dialog").getByRole("button", { name: /Hapus/ }).click();
  await page.reload();
  await expect(page.locator(".note-grid")).not.toContainText(
    "Pengumuman uji selesai edit",
  );
});

test("search history and invalid storage are handled locally", async ({
  page,
}) => {
  await page.goto("/search");
  const input = page.locator(".search-page input").first();
  await input.fill("KopiLokal");
  await input.press("Enter");
  await page.reload();
  await expect(page.locator(".search-page")).toContainText("KopiLokal");
  await page.evaluate(() => {
    localStorage.setItem("chatiers:v1:posts", "invalid-json");
    localStorage.setItem("chatiers:v1:following", "[]");
    localStorage.setItem("chatiers:v1:post-comments", '{"6":false}');
  });
  await page.goto("/");
  await expect(page.locator("article.post")).toHaveCount(6);
  await expect(
    page.locator("article.post").filter({ hasText: "Dimas Saputra" }),
  ).toHaveCount(1);
});

test("local media plays and navigation renders on mobile without overflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".feed-header a[href='/profile/ardikurniawan']"),
  ).toHaveCount(0);
  await expect(page.locator(".feed-header a[href='/notifikasi']")).toHaveCount(
    0,
  );
  await expect(page.locator(".navigation .profile-button")).toBeVisible();
  await showPublic(page);
  const videoPost = page
    .locator("article.post")
    .filter({ has: page.locator("video") })
    .first();
  await videoPost.getByRole("button", { name: "Putar video" }).click();
  const preview = page.getByRole("dialog", { name: "Pratinjau video" });
  await expect
    .poll(() =>
      preview
        .locator("video")
        .evaluate(
          (video: HTMLVideoElement) => !video.paused && video.currentTime > 0,
        ),
    )
    .toBe(true);
  await preview.getByRole("button", { name: "Tutup pratinjau" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".mobile-bottom-nav")).toBeVisible();
  await expect(page.locator(".navigation")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Buka menu navigasi" }),
  ).toHaveCount(0);
  await expect(
    page
      .locator(".mobile-bottom-nav")
      .getByRole("link", { name: "Pesan", exact: true }),
  ).toHaveCount(0);
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Profil", exact: true })
    .click();
  await expect(page).toHaveURL(/\/profile\/ardikurniawan$/);
  await expect(page.locator("h1")).toContainText("Ardi Kurniawan");
  await page.goto("/");
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await page.setViewportSize({ width: 600, height: 844 });
  await expect(page.locator(".mobile-bottom-nav")).toBeVisible();
  await expect(page.locator(".navigation")).toBeHidden();
  await page.setViewportSize({ width: 601, height: 844 });
  await expect(page.locator(".mobile-bottom-nav")).toBeHidden();
  await expect(page.locator(".navigation")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Notifikasi" })
    .click();
  await expect(page).toHaveURL(/\/notifikasi$/);
  await expect(
    page
      .locator(".mobile-bottom-nav")
      .getByRole("link", { name: "Notifikasi" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".navigation")).toBeHidden();
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("button", { name: "Buat postingan" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("dummy interactions never call backend endpoints or external assets", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await showPublic(page);
  await page
    .locator("article.post")
    .first()
    .getByRole("button", { name: "Buka komentar" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Terjemah|Translate/i })
    .first()
    .click();
  await expect(page.locator(".comment-translation")).toBeVisible();
  expect(
    requests.filter(
      (url) =>
        url.includes("/api/") || !url.startsWith("http://127.0.0.1:3001"),
    ),
  ).toEqual([]);
  expect(errors).toEqual([]);
});

test("composer reopens and media and custom quick links persist posts", async ({
  page,
}) => {
  await page.goto("/");
  for (const text of [
    "Postingan pertama berulang",
    "Postingan kedua berulang",
  ]) {
    await page.locator(".compose-button").click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByPlaceholder("Bagikan peluang, kebutuhan, atau kabar bisnis kamu…")
      .fill(text);
    await dialog
      .getByRole("button", { name: "Bagikan postingan", exact: false })
      .click();
    await expect(page.locator("article.post").first()).toContainText(text);
  }
  await page.goto("/?compose=media");
  let dialog = page.getByRole("dialog");
  await dialog
    .getByPlaceholder("Bagikan peluang, kebutuhan, atau kabar bisnis kamu…")
    .fill("Video mitra lokal");
  await dialog
    .getByPlaceholder("Tempel tautan gambar atau video…")
    .fill("/media/demo-video.mp4");
  await dialog.getByRole("checkbox", { name: "Ini adalah video" }).check();
  await dialog
    .getByRole("button", { name: "Bagikan postingan", exact: false })
    .click();
  await expect(
    page.locator("article.post").first().locator("video"),
  ).toHaveAttribute("src", "/media/demo-video.mp4");
  await page.goto("/?compose=custom");
  dialog = page.getByRole("dialog");
  await dialog
    .getByPlaceholder("Bagikan peluang, kebutuhan, atau kabar bisnis kamu…")
    .fill("Daftar kegiatan bisnis");
  await dialog.getByPlaceholder("cth. Daftar di sini").fill("Daftar");
  await dialog.getByPlaceholder("https://…").fill("https://example.com/daftar");
  await dialog
    .getByRole("button", { name: "Bagikan postingan", exact: false })
    .click();
  await expect(page.locator("article.post").first()).toContainText(
    "Daftar: https://example.com/daftar",
  );
});

test("community membership and browser quota fallback work locally", async ({
  page,
}) => {
  await page.goto("/komunitas");
  const community = page.getByRole("button", {
    name: "Komunitas UMKM",
    exact: true,
  });
  await community.click();
  await page.reload();
  await expect(community).toHaveAttribute("aria-pressed", "true");
  await page.goto("/");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    };
  });
  await page
    .locator("article.post")
    .first()
    .getByRole("button", { name: "Sukai postingan" })
    .click();
  await expect(page.locator(".storage-notice")).toContainText(
    "tersimpan sementara",
  );
  await expect(
    page.getByRole("button", { name: "Sukai postingan" }).first(),
  ).toHaveAttribute("aria-pressed", "true");
});

test("profile catalog, company video and project filters remain functional", async ({
  page,
}) => {
  await page.goto("/profile/sariwijaya");
  await page.getByRole("button", { name: "Produk", exact: true }).click();
  await expect(page.locator(".profile-products")).toContainText(
    "Kain Katun Premium",
  );
  await page.getByRole("button", { name: "Perusahaan", exact: true }).click();
  await expect(page.locator(".profile-company")).toContainText(
    "Wijaya Textile",
  );
  await page
    .getByRole("button", { name: "Putar video profil perusahaan" })
    .click();
  await expect
    .poll(() =>
      page
        .locator(".company-video video")
        .evaluate((video: HTMLVideoElement) => !video.paused),
    )
    .toBe(true);
  await page.goto("/profile/sariwijaya/projects");
  await page.getByRole("button", { name: "Foto", exact: true }).click();
  await expect(page.locator(".project-moment-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Video", exact: true }).click();
  await expect(page.locator(".project-moment-card")).toHaveCount(1);
  await expect(page.locator(".project-moment-card video")).toHaveCount(1);
});

test("primary pages render on narrow screens without hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await showPublic(page);
  await page.screenshot({ path: "docs/previews/desktop.png", fullPage: true });
  await page.screenshot({ path: "docs/previews/desktop-viewport.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/",
    "/jelajahi",
    "/lowongan",
    "/search",
    "/posting",
    "/profile/sariwijaya",
    "/profile/sariwijaya/projects",
    "/profile/sariwijaya/announcements",
    "/profile/sariwijaya/announcements/sariwijaya-kemitraan",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const width = await page.evaluate(() => ({
      actual: document.documentElement.scrollWidth,
      expected: window.innerWidth,
    }));
    expect(width.actual, path).toBeLessThanOrEqual(width.expected);
    if (path === "/") {
      await page.screenshot({
        path: "docs/previews/mobile.png",
        fullPage: true,
      });
      await page.screenshot({ path: "docs/previews/mobile-viewport.png" });
    }
  }
  expect(errors).toEqual([]);
});

test("home filters combine following, opportunity type and location without losing preferences", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.locator("article.post")).toHaveCount(6);
  await expect(
    page.getByRole("button", { name: "Cari lokasi", exact: true }),
  ).toContainText("Semua lokasi");
  await page
    .getByRole("group", { name: "Sumber feed" })
    .getByRole("button", { name: "Mengikuti", exact: true })
    .click();
  await expect(page.locator("article.post")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Ikuti Dimas Saputra", exact: true })
    .click();
  await expect(page.locator("article.post")).toHaveCount(1);
  await expect(page.locator("article.post")).toContainText("Dimas Saputra");
  await page.reload();
  await expect(
    page
      .getByRole("group", { name: "Sumber feed" })
      .getByRole("button", { name: "Mengikuti", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("article.post")).toHaveCount(1);
  await page.getByRole("button", { name: "Cari lokasi", exact: true }).click();
  await page.getByRole("option", { name: "Bandung", exact: true }).click();
  await expect(page.locator("article.post")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Lihat semua lokasi", exact: true })
    .click();
  await expect(page.locator("article.post")).toHaveCount(1);
  const other = await context.newPage();
  await other.goto("/profile/dimassaputra");
  await other.getByRole("button", { name: "Mengikuti", exact: true }).click();
  await expect(page.locator("article.post")).toHaveCount(0);
  await page.getByRole("button", { name: "Jelajahi semua postingan" }).click();
  await page
    .getByRole("group", { name: "Jenis peluang" })
    .getByRole("button", { name: "Lowongan", exact: true })
    .click();
  await expect(page.locator("article.post")).toHaveCount(1);
  await expect(page.locator("article.post")).toContainText("Budi Santoso");
  await page
    .locator("article.post")
    .getByRole("button", { name: "Buka komentar", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Komentar postingan" }),
  ).toBeVisible();
});

test("typed opportunities persist alongside posts stored before the home update", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(
    (posts) => localStorage.setItem("chatiers:v1:posts", JSON.stringify(posts)),
    [
      ...initialPosts,
      {
        ...initialPosts[4],
        id: 99,
        text: "Postingan lama yang harus tetap ada",
      },
    ],
  );
  await page.reload();
  await expect(page.locator("article.post")).toHaveCount(7);
  await page
    .getByRole("button", {
      name: "Apa kebutuhan bisnismu hari ini?",
      exact: false,
    })
    .click();
  const dialog = page.getByRole("dialog", { name: "Bagikan postinganmu" });
  await dialog.getByLabel("Tujuan postingan").selectOption("partner");
  await dialog
    .getByLabel("Kebutuhan utama (opsional)")
    .fill("Mitra kopi untuk Jawa Barat");
  await dialog
    .getByLabel("Detail singkat (opsional)")
    .fill("Bandung · Distribusi grosir");
  await dialog
    .getByPlaceholder("Bagikan peluang, kebutuhan, atau kabar bisnis kamu…")
    .fill("Mencari mitra untuk perluasan distribusi kopi.");
  await dialog
    .getByRole("button", { name: "Bagikan postingan", exact: false })
    .click();
  await expect(page.locator("article.post").first()).toContainText(
    "Mencari mitra untuk perluasan distribusi kopi.",
  );
  await page.reload();
  await expect(page.locator("article.post")).toHaveCount(8);
  await expect(
    page
      .locator("article.post")
      .filter({ hasText: "Postingan lama yang harus tetap ada" }),
  ).toHaveCount(1);
  await page
    .getByRole("group", { name: "Jenis peluang" })
    .getByRole("button", { name: "Cari mitra", exact: true })
    .click();
  await expect(page.locator("article.post")).toHaveCount(4);
  await expect(page.locator("article.post").first()).toContainText(
    "Mencari mitra untuk perluasan distribusi kopi.",
  );
  const storedPosts = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("chatiers:v1:posts") || "[]"),
  );
  expect(storedPosts[0]).toMatchObject({
    kind: "partner",
    opportunityTitle: "Mitra kopi untuk Jawa Barat",
    opportunityDetail: "Bandung · Distribusi grosir",
  });
});

test("mobile discovery, simplified navigation, hashtag search and copying text work", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.locator(".recommended-connections.is-inline"),
  ).toBeVisible();
  await expect(page.locator(".discovery")).toBeHidden();
  await expect(page.locator(".navigation")).toBeHidden();
  await expect(
    page
      .locator(".mobile-bottom-nav")
      .getByRole("link", { name: "Notifikasi", exact: true }),
  ).toContainText("Notifikasi");
  await expect(
    page
      .locator(".mobile-bottom-nav")
      .getByRole("link", { name: "Lowongan", exact: true }),
  ).toHaveCount(0);
  await page
    .locator("article.post")
    .first()
    .getByRole("button", { name: "Opsi postingan" })
    .click();
  await page
    .locator("article.post")
    .first()
    .getByRole("button", { name: "Salin teks postingan" })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("Sari Wijaya:");
  await page
    .locator("article.post")
    .first()
    .getByRole("link", { name: "#Kolaborasi", exact: true })
    .click();
  await expect(page).toHaveURL(/q=/);
  await expect(page.locator("article.post")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Hapus pencarian", exact: false })
    .click();
  await expect(page.locator("article.post")).toHaveCount(6);
  await expect(
    page.getByRole("navigation", { name: "Akses ruang bisnis" }),
  ).toHaveCount(0);
  await expect(page.locator(".home-feed-controls")).toBeHidden();
  await page.goto("/tersimpan");
  await expect(page).toHaveURL(/\/tersimpan$/);
  await page.goto("/komunitas");
  await expect(page).toHaveURL(/\/komunitas$/);
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Notifikasi", exact: true })
    .click();
  await expect(page).toHaveURL(/\/notifikasi$/);
  await expect(page.locator(".navigation")).toBeHidden();
  await page.goto("/");
  for (const width of [320, 360, 390, 600, 601, 768, 960, 961, 1280, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    if (width <= 600)
      await expect(page.locator(".home-feed-controls")).toBeHidden();
    else await expect(page.locator(".home-feed-controls")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth), {
        message: `Overflow at ${width}px`,
      })
      .toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await expect(page.locator("article.post .post-text").first()).toHaveCSS(
    "font-size",
    "15px",
  );
  await expect(
    page.locator("article.post .post-actions button").first(),
  ).toHaveCSS("min-height", "44px");
});

test("publishing from a filtered feed returns to a visible home post", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("group", { name: "Sumber feed" })
    .getByRole("button", { name: "Mengikuti", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Jenis peluang" })
    .getByRole("button", { name: "Cari supplier", exact: true })
    .click();
  await expect(page.locator("article.post")).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Apa kebutuhan bisnismu hari ini?",
      exact: false,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByPlaceholder("Bagikan peluang, kebutuhan, atau kabar bisnis kamu…")
    .fill("Kabar terbaru dari bisnis saya");
  await dialog
    .getByRole("button", { name: "Bagikan postingan", exact: false })
    .click();
  await expect(page.locator("article.post").first()).toContainText(
    "Kabar terbaru dari bisnis saya",
  );
  await expect(
    page
      .getByRole("group", { name: "Sumber feed" })
      .getByRole("button", { name: "Semua", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page
      .getByRole("group", { name: "Jenis peluang" })
      .getByRole("button", { name: "Semua jenis", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("own profile editing validates links and persists local business details", async ({
  page,
}) => {
  await page.goto("/profile/ardikurniawan");
  await expect(
    page.getByRole("button", { name: "Ikuti", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.locator(".profile-overview a[href='/?compose=text']"),
  ).toHaveCount(0);
  await expect(
    page
      .locator(".profile-summary .profile-person-heading")
      .getByRole("button", { name: "Edit profil", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit profil", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Edit profil", exact: true });
  await dialog
    .getByLabel("Bio", { exact: true })
    .fill("Kopi lokal untuk mitra bisnis uji profil.");
  await dialog.getByLabel("Lokasi", { exact: true }).fill("Bandung, Indonesia");
  await dialog.getByLabel(/Situs bisnis/).fill("javascript:alert(1)");
  await dialog.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(dialog.getByRole("alert")).toContainText("http atau https");
  await dialog.getByLabel(/Situs bisnis/).fill("kopi-uji.example");
  await dialog.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".profile-summary")).toContainText(
    "Kopi lokal untuk mitra bisnis uji profil.",
  );
  await expect(page.locator(".profile-summary")).toContainText(
    "Bandung, Indonesia",
  );
  await expect(page.locator(".profile-summary-meta a")).toHaveAttribute(
    "href",
    "https://kopi-uji.example/",
  );
  await page.getByRole("button", { name: "Tentang", exact: true }).click();
  await expect(page.locator(".profile-about-panel")).toContainText(
    "Kopi lokal untuk mitra bisnis uji profil.",
  );
  await expect(page.locator(".profile-about-panel")).toContainText(
    "halo@kopinusantara.id",
  );
  await expect(page.locator(".profile-about-panel")).not.toContainText(
    "Terverifikasi",
  );
  await page.getByRole("button", { name: "Edit profil", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Edit profil", exact: true }),
  ).toBeFocused();
});

test("profile connection counts match unique accounts and shared follows", async ({
  page,
}) => {
  await page.goto("/profile/sariwijaya");
  const followers = page.locator(".profile-metrics button").nth(1);
  const before = Number(await followers.locator("strong").textContent());
  await page.getByRole("button", { name: "Ikuti", exact: true }).click();
  await expect(followers.locator("strong")).toHaveText(String(before + 1));
  await followers.click();
  const dialog = page.getByRole("dialog", { name: /Pengikut/ });
  await expect(dialog.locator(".profile-connection")).toHaveCount(before + 1);
  await expect(dialog).toContainText("Ardi Kurniawan");
  const links = await dialog
    .locator(".profile-connection > a")
    .evaluateAll((items) => items.map((item) => item.getAttribute("href")));
  expect(new Set(links).size).toBe(links.length);
  await page.keyboard.press("Escape");
  await page.goto("/profile/ardikurniawan");
  await expect(
    page.locator(".profile-metrics button").first().locator("strong"),
  ).toHaveText("1");
  await page.locator(".profile-metrics button").first().click();
  const following = page.getByRole("dialog", { name: /Mengikuti/ });
  await expect(following.locator(".profile-connection")).toHaveCount(1);
  await following
    .getByRole("button", { name: "Batal mengikuti Sari Wijaya" })
    .click();
  await expect(following).toContainText("Belum ada koneksi");
  await page.keyboard.press("Escape");
  await page.goto("/profile/sariwijaya");
  await expect(
    page.getByRole("button", { name: "Ikuti", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".profile-metrics button").nth(1).locator("strong"),
  ).toHaveText(String(before));
});

test("profile product details, contacts and comments are functional", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/profile/sariwijaya");
  await expect(
    page.getByRole("button", { name: /Edit .*Kemitraan|Tambah chatboard/i }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Produk", exact: true }).click();
  const trigger = page.getByRole("button", {
    name: "Lihat detail Kain Katun Premium",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Detail produk" });
  await expect(dialog).toContainText("Rp 45.000 / yard");
  await dialog.getByRole("button", { name: "Salin informasi produk" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("Kain Katun Premium");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Kontak bisnis" }).click();
  await expect(page.locator(".profile-about-panel a").first()).toHaveAttribute(
    "href",
    "mailto:halo@wijayatextile.id",
  );
  await page.getByRole("button", { name: "Postingan", exact: true }).click();
  await page.getByRole("button", { name: "Buka komentar" }).click();
  const comments = page.getByRole("dialog", { name: "Komentar postingan" });
  await comments.locator("form input").fill("Diskusi produk dari profil");
  await comments.locator("form button[type=submit]").click();
  await expect(comments).toContainText("Diskusi produk dari profil");
  await page.keyboard.press("Escape");
  await page.goto("/");
  await page
    .locator("article.post")
    .first()
    .getByRole("button", { name: "Buka komentar" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Komentar postingan" }),
  ).toContainText("Diskusi produk dari profil");
});

test("profile sections fit mobile and sidebar column widths", async ({
  page,
}) => {
  await page.goto("/profile/ardikurniawan");
  for (const width of [320, 390, 601, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const section of ["Postingan", "Tentang", "Perusahaan", "Produk"]) {
      await page.getByRole("button", { name: section, exact: true }).click();
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    if (width <= 600) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator(".navigation")).toBeHidden();
      await expect(
        page.getByRole("link", { name: "Profil", exact: true }),
      ).toHaveAttribute("aria-current", "page");
    } else {
      await expect(page.locator(".navigation")).toBeVisible();
      await expect(page.locator(".mobile-bottom-nav")).toBeHidden();
    }
  }
});

test("profile preview captures overview and business sections", async ({
  page,
}) => {
  await page.goto("/profile/sariwijaya");
  await page.screenshot({
    path: "docs/previews/profile-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".profile-person h1")).toHaveCSS(
    "font-size",
    "21px",
  );
  await page.screenshot({ path: "docs/previews/profile-mobile.png" });
  await page.locator(".profile-feed-card").scrollIntoViewIfNeeded();
  await expect(page.locator(".profile-feed-card .post-text")).toBeInViewport();
  await page.screenshot({ path: "docs/previews/profile-feed-mobile.png" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(".profile-page-bar")).toBeInViewport();
  await page.screenshot({
    path: "docs/previews/profile-mobile-full.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Perusahaan", exact: true }).click();
  await page.screenshot({
    path: "docs/previews/profile-company-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Produk", exact: true }).click();
  await page.screenshot({
    path: "docs/previews/profile-products-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Lihat detail Kain Katun Premium" })
    .click();
  const dialog = page.getByRole("dialog", { name: "Detail produk" });
  const box = await dialog.boundingBox();
  expect(box && box.x >= 0 && box.x + box.width <= 390).toBeTruthy();
  await page.screenshot({
    path: "docs/previews/profile-product-detail-mobile.png",
  });
  await page.keyboard.press("Escape");
  await page.goto("/profile/ardikurniawan");
  await page.screenshot({
    path: "docs/previews/profile-own-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Edit profil", exact: true }).click();
  const editBox = await page
    .getByRole("dialog", { name: "Edit profil", exact: true })
    .boundingBox();
  expect(
    editBox && editBox.x >= 0 && editBox.x + editBox.width <= 390,
  ).toBeTruthy();
  await page.screenshot({ path: "docs/previews/profile-edit-mobile.png" });
});

test("mobile feed ignores hidden desktop filters and restores preferences on wider screens", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("group", { name: "Sumber feed" })
    .getByRole("button", { name: "Mengikuti", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Jenis peluang" })
    .getByRole("button", { name: "Cari supplier", exact: true })
    .click();
  await page.getByRole("button", { name: "Cari lokasi", exact: true }).click();
  await page.getByRole("option", { name: "Bandung", exact: true }).click();
  await expect(page.locator("article.post")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".home-feed-controls")).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Akses ruang bisnis" }),
  ).toHaveCount(0);
  await expect(page.locator("article.post")).toHaveCount(initialPosts.length);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("chatiers:v1:feed-mode") || "null"),
    ),
  ).toBe("following");
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("chatiers:v1:region") || "null"),
    ),
  ).toBe("Bandung");
  await page
    .locator("article.post")
    .first()
    .getByRole("button", { name: "Simpan postingan" })
    .click();
  await page.setViewportSize({ width: 601, height: 844 });
  await expect(page.locator(".home-feed-controls")).toBeVisible();
  await expect(
    page
      .getByRole("group", { name: "Sumber feed" })
      .getByRole("button", { name: "Mengikuti", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page
      .getByRole("group", { name: "Jenis peluang" })
      .getByRole("button", { name: "Cari supplier", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("article.post")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tersimpan");
  await expect(page.locator("article.post")).toHaveCount(1);
  await page.goto("/");
  await expect(page.locator("article.post")).toHaveCount(initialPosts.length);
  await page.reload();
  await expect(page.locator("article.post")).toHaveCount(initialPosts.length);
  await page.screenshot({ path: "docs/previews/mobile-viewport.png" });
});
