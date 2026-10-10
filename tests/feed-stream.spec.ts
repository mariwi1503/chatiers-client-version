import { test, expect } from "@playwright/test";

test("feed gallery supports dots, keyboard and horizontal swiping without page overflow", async ({
  page,
}) => {
  await page.goto("/");
  const post = page.locator("#post-1");
  await expect(post.locator(".feed-gallery-item")).toHaveCount(3);
  const track = post.locator(".feed-gallery-track");
  for (const width of [320, 390, 578, 601, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await post.getByRole("button", { name: "Lihat foto 3" }).click();
    await expect(
      post.getByRole("button", { name: "Lihat foto 3" }),
    ).toHaveAttribute("aria-pressed", "true");
    await track.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(
      post.getByRole("button", { name: "Lihat foto 2" }),
    ).toHaveAttribute("aria-pressed", "true");
    await track.evaluate((element) =>
      element.scrollTo({ left: 0, behavior: "instant" }),
    );
    await expect(
      post.getByRole("button", { name: "Lihat foto 1" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 578, height: 1230 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "docs/previews/feed-reference.png",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "docs/previews/feed-mobile.png",
  });
});

test("reposts persist across reload and profile, and can be undone", async ({
  page,
}) => {
  await page.goto("/");
  const repost = page
    .locator("#post-1")
    .getByRole("button", { name: "Repost postingan" });
  await repost.click();
  await expect(repost).toHaveAttribute("aria-pressed", "true");
  await expect(repost).toContainText("1");
  await page.reload();
  await expect(repost).toHaveAttribute("aria-pressed", "true");
  await page.goto("/profile/sariwijaya");
  await expect(repost).toHaveAttribute("aria-pressed", "true");
  await repost.click();
  await expect(repost).toHaveAttribute("aria-pressed", "false");
  await page.goto("/");
  await expect(repost).toHaveAttribute("aria-pressed", "false");
});
