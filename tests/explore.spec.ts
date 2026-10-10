import { test, expect, type Page } from "@playwright/test";

const currentVideo = (page: Page) =>
  page.locator(".explore-video-page[aria-hidden='false']");

async function nextVideo(page: Page) {
  const next = page.getByRole("button", {
    name: "Reel berikutnya",
    exact: true,
  });
  if (await next.isVisible()) await next.click();
  else
    await page
      .locator(".explore-track")
      .evaluate((element) =>
        element.scrollBy({ top: element.clientHeight, behavior: "instant" }),
      );
}

test("explore keeps navigation accessible across screen sizes and empty states", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 600, 601, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/jelajahi");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Kembali ke Beranda" }),
    ).toBeVisible();
    await expect(page.locator(".explore-video-counter")).toHaveText(
      "Video 1 dari 3",
    );
    await nextVideo(page);
    await expect(page.locator(".explore-video-counter")).toHaveText(
      "Video 2 dari 3",
    );
    if (width <= 600) {
      await expect(page.locator(".navigation")).toBeHidden();
      await expect(page.locator(".mobile-bottom-nav")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
      await expect(
        page
          .locator(".mobile-bottom-nav")
          .getByRole("link", { name: "Beranda", exact: true }),
      ).toBeVisible();
    } else await expect(page.locator(".navigation")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const sizes = await currentVideo(page)
      .locator(".explore-video-actions button, .reel-sound-toggle")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }),
      );
    for (const size of sizes) {
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
  }
  await expect(
    page.locator(".explore-toolbar, .explore-topics, .explore-search"),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Kembali ke Beranda" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.evaluate(() => localStorage.setItem("chatiers:v1:posts", "[]"));
  await page.goto("/jelajahi");
  await expect(
    page.getByRole("heading", { name: "Belum ada video bisnis" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Kembali ke Beranda" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
});

test("explore hidden videos persist and obsolete filters never restrict the simple player", async ({
  page,
}) => {
  await page.goto("/jelajahi");
  await page.evaluate(() => {
    localStorage.setItem(
      "chatiers:v1:explore-source",
      JSON.stringify("following"),
    );
    localStorage.setItem(
      "chatiers:v1:explore-topic",
      JSON.stringify("supplier"),
    );
  });
  await page.reload();
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 1 dari 3",
  );
  await currentVideo(page).getByRole("button", { name: "Opsi video" }).click();
  await currentVideo(page)
    .getByRole("button", { name: "Tidak tertarik" })
    .click();
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 1 dari 2",
  );
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 1 dari 3",
  );
  await currentVideo(page).getByRole("button", { name: "Opsi video" }).click();
  await currentVideo(page)
    .getByRole("button", { name: "Tidak tertarik" })
    .click();
  await page.reload();
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 1 dari 2",
  );
  await currentVideo(page).getByRole("button", { name: "Opsi video" }).click();
  await currentVideo(page)
    .getByRole("button", { name: "Tampilkan video tersembunyi" })
    .click();
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 1 dari 3",
  );
  for (let i = 0; i < 3; i++) {
    await currentVideo(page)
      .getByRole("button", { name: "Opsi video" })
      .click();
    await currentVideo(page)
      .getByRole("button", { name: "Tidak tertarik" })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Semua video disembunyikan" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Kembali ke Beranda" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Tampilkan video yang disembunyikan" })
    .click();
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 1 dari 3",
  );
});

test("explore autoplay pauses on navigation and comments stay in sync", async ({
  page,
}) => {
  await page.goto("/jelajahi");
  const firstVideo = page
    .locator(".explore-video-page")
    .first()
    .locator("video");
  await expect
    .poll(() =>
      firstVideo.evaluate(
        (video: HTMLVideoElement) => !video.paused && video.currentTime > 0,
      ),
    )
    .toBe(true);
  await currentVideo(page)
    .getByRole("button", { name: "Jeda video", exact: true })
    .click();
  await expect
    .poll(() => firstVideo.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true);
  await currentVideo(page)
    .getByRole("button", { name: "Putar video", exact: true })
    .click();
  await nextVideo(page);
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 2 dari 3",
  );
  await expect
    .poll(() => firstVideo.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true);
  await currentVideo(page)
    .getByRole("button", { name: "Bunyikan suara", exact: true })
    .click();
  await currentVideo(page)
    .getByRole("button", { name: "Buka komentar", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Komentar postingan" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Komentar", exact: true }),
  ).toContainText("31");
  const input = dialog.getByRole("textbox", {
    name: "Tulis komentar",
    exact: true,
  });
  await input.fill("Komentar Jelajahi yang tersimpan");
  await input.press("ArrowDown");
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 2 dari 3",
  );
  await dialog.getByRole("button", { name: "Kirim komentar" }).click();
  await expect(
    dialog.getByRole("button", { name: "Komentar", exact: true }),
  ).toContainText("32");
  await page.keyboard.press("Escape");
  await expect(
    currentVideo(page).getByRole("button", {
      name: "Buka komentar",
      exact: true,
    }),
  ).toContainText("32");
  await page.goto("/");
  const alyaPost = page
    .locator("article.post")
    .filter({ hasText: "Alya Rahma" });
  await expect(
    alyaPost.getByRole("button", { name: "Buka komentar", exact: true }),
  ).toContainText("32");
  await expect(
    alyaPost.getByRole("button", { name: "Bisukan suara", exact: true }),
  ).toBeVisible();
});

test("explore copying, saving and hashtags match the home feed", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/jelajahi");
  await currentVideo(page)
    .getByRole("button", { name: "Salin teks postingan" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Budi Santoso:",
  );
  await currentVideo(page)
    .getByRole("button", { name: "Simpan postingan" })
    .click();
  await currentVideo(page)
    .getByRole("button", { name: "Sukai postingan" })
    .click();
  await currentVideo(page)
    .getByRole("link", { name: "#LowonganKerja", exact: true })
    .click();
  await expect(page).toHaveURL(/q=%23LowonganKerja/);
  await expect(page.locator("article.post")).toHaveCount(1);
  await expect(
    page
      .locator("article.post")
      .getByRole("button", { name: "Sukai postingan" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/tersimpan");
  await expect(page.locator("article.post")).toContainText("Budi Santoso");
});

test("explore previews, short screens and reduced motion work without backend calls", async ({
  page,
}) => {
  const unexpected: string[] = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:3001") ||
      request.url().includes("/api/")
    )
      unexpected.push(request.url());
  });
  await page.goto("/jelajahi");
  await page.evaluate(() => document.fonts.ready);
  await currentVideo(page)
    .locator("video")
    .evaluate(
      (video: HTMLVideoElement) =>
        new Promise((resolve) =>
          video.requestVideoFrameCallback(() => resolve(null)),
        ),
    );
  await expect
    .poll(() =>
      currentVideo(page)
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime > 0.2),
    )
    .toBe(true);
  await page.screenshot({ path: "docs/previews/explore-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/jelajahi");
  await currentVideo(page)
    .locator("video")
    .evaluate(
      (video: HTMLVideoElement) =>
        new Promise((resolve) =>
          video.requestVideoFrameCallback(() => resolve(null)),
        ),
    );
  await expect
    .poll(() =>
      currentVideo(page)
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime > 0.2),
    )
    .toBe(true);
  await page.screenshot({ path: "docs/previews/explore-mobile.png" });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.reload();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".explore-player").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(".explore-video-counter")).toHaveText(
    "Video 2 dari 3",
  );
  await expect(
    page
      .locator(".mobile-bottom-nav")
      .getByRole("link", { name: "Beranda", exact: true }),
  ).toBeVisible();
  await nextVideo(page);
  await expect(
    page.locator("button[aria-label='Reel berikutnya']"),
  ).toBeDisabled();
  expect(unexpected).toEqual([]);
});
