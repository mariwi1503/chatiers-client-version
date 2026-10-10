import { test, expect } from "@playwright/test";
import { initialPosts } from "../src/data/feed";

test("image preview opens the selected photo, navigates both ways and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const post = page.locator("#post-1");
  await post.getByRole("button", { name: "Lihat foto 2" }).click();
  const opener = post.getByRole("button", {
    name: "Pratinjau gambar 2 dari Sari Wijaya",
  });
  await opener.click();
  const preview = page.getByRole("dialog", { name: "Pratinjau gambar" });
  const counter = preview.getByRole("status");
  await expect(counter).toHaveText("2 / 3");
  await expect(
    preview.locator('figure[aria-hidden="false"] img'),
  ).toHaveAttribute("src", /d8ccc01f/);
  await preview.getByRole("button", { name: "Gambar berikutnya" }).click();
  await expect(counter).toHaveText("3 / 3");
  await expect
    .poll(() =>
      preview
        .locator(".feed-media-preview-track")
        .evaluate((element) =>
          Math.abs(element.scrollLeft - element.clientWidth * 2),
        ),
    )
    .toBeLessThan(1);
  await expect(
    preview.getByRole("button", { name: "Gambar berikutnya" }),
  ).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(counter).toHaveText("2 / 3");
  await preview.getByRole("button", { name: "Gambar sebelumnya" }).click();
  await expect(counter).toHaveText("1 / 3");
  await expect(
    preview.getByRole("button", { name: "Gambar sebelumnya" }),
  ).toBeDisabled();
  await preview.getByRole("button", { name: "Gambar berikutnya" }).focus();
  await page.keyboard.press("Tab");
  await expect(
    preview.getByRole("button", { name: "Tutup pratinjau" }),
  ).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(preview).toHaveCount(0);
  await expect(opener).toBeFocused();

  // A photo with no gallery opens without navigation controls.
  await page.evaluate((posts) => {
    localStorage.setItem(
      "chatiers:v1:posts",
      JSON.stringify([
        {
          ...posts[5],
          id: 100,
          image: posts[0].image,
          alt: "Foto tunggal bisnis",
          gallery: undefined,
        },
      ]),
    );
  }, initialPosts);
  await page.reload();
  await page
    .getByRole("button", { name: "Pratinjau gambar 1 dari Dimas Saputra" })
    .click();
  await expect(preview.locator("img")).toHaveCount(1);
  await expect(
    preview.getByRole("button", { name: "Gambar berikutnya" }),
  ).toHaveCount(0);
  await preview.getByRole("button", { name: "Tutup pratinjau" }).click();
});

test("preview supports mouse dragging and mobile swipes in both directions", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator("#post-1")
    .getByRole("button", { name: "Pratinjau gambar 1 dari Sari Wijaya" })
    .click();
  const preview = page.getByRole("dialog", { name: "Pratinjau gambar" });
  const track = preview.locator(".feed-media-preview-track");
  let box = (await track.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.5, {
    steps: 12,
  });
  await page.mouse.up();
  await expect(preview.getByRole("status")).toHaveText("2 / 3");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(preview.getByRole("status")).toHaveText("2 / 3");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  box = (await track.boundingBox())!;
  async function swipe(from: number, to: number) {
    const y = box.y + box.height * 0.5;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width * from, y }],
    });
    for (let step = 1; step <= 8; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: box.x + box.width * (from + ((to - from) * step) / 8), y },
        ],
      });
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(0.85, 0.15);
  await expect(preview.getByRole("status")).toHaveText("3 / 3");
  await expect
    .poll(() =>
      track.evaluate((element) =>
        Math.abs(element.scrollLeft - element.clientWidth * 2),
      ),
    )
    .toBeLessThan(1);
  await swipe(0.15, 0.85);
  await expect(preview.getByRole("status")).toHaveText("2 / 3");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await expect
    .poll(() =>
      track.evaluate((element) =>
        Math.abs(element.scrollLeft - element.clientWidth),
      ),
    )
    .toBeLessThan(1);
  await page.screenshot({
    path: "docs/previews/feed-image-preview-mobile.png",
  });
  await preview.getByRole("button", { name: "Tutup pratinjau" }).click();
  await session.detach();
});

test("video preview plays with native controls, shares mute and stops when closed", async ({
  page,
}) => {
  await page.goto("/");
  const post = page.locator("#post-2");
  await post.locator("video").click({ position: { x: 10, y: 80 } });
  const preview = page.getByRole("dialog", { name: "Pratinjau video" });
  const video = preview.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await expect
    .poll(() =>
      video.evaluate(
        (element: HTMLVideoElement) =>
          !element.paused && element.currentTime > 0,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      post
        .locator("video")
        .evaluate((element: HTMLVideoElement) => element.paused),
    )
    .toBe(true);
  await video.evaluate((element: HTMLVideoElement) => {
    element.muted = false;
  });
  await expect(
    post.getByRole("button", { name: "Bisukan suara" }),
  ).toHaveAttribute("aria-pressed", "true");
  await preview.getByRole("button", { name: "Tutup pratinjau" }).focus();
  await page.keyboard.press("Tab");
  await expect(video).toBeFocused();
  const handle = await video.elementHandle();
  await preview.getByRole("button", { name: "Tutup pratinjau" }).click();
  await expect(preview).toHaveCount(0);
  expect(
    await handle!.evaluate((element: HTMLVideoElement) => element.paused),
  ).toBe(true);
  await post.getByRole("button", { name: "Pratinjau video" }).click();
  await expect(preview).toBeVisible();
  await page.keyboard.press("Escape");
  await page
    .locator(".navigation")
    .getByRole("link", { name: "Tersimpan", exact: true })
    .click();
});
