import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 1440]) {
  test(`hero plays automatically, can pause, and stays paused at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const video = page.locator(".hero-video");
    await video.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        video.evaluate(
          (el: HTMLVideoElement) => !el.paused && el.currentTime > 0,
        ),
      )
      .toBe(true);
    expect(
      await video.evaluate(
        (el: HTMLVideoElement) => el.muted && el.playsInline && el.loop,
      ),
    ).toBe(true);
    const pause = page.getByRole("button", { name: "Pause hero video" });
    await pause.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Play hero video" }),
    ).toBeFocused();
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(
      true,
    );
    await page.locator("footer").scrollIntoViewIfNeeded();
    await video.scrollIntoViewIfNeeded();
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(
      true,
    );
    await page.getByRole("button", { name: "Play hero video" }).click();
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.paused))
      .toBe(false);
    await expect(
      page.locator(".hero-caption, .hero-image-label, .film-button"),
    ).toHaveCount(0);
    await expect(page.locator(".hero-video-surface")).toHaveText("");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("reduced motion keeps the hero still until explicitly played", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const video = page.locator(".hero-video");
  await expect(
    page.getByRole("button", { name: "Play hero video" }),
  ).toBeVisible();
  expect(
    await video.evaluate(
      (el: HTMLVideoElement) => el.paused && el.currentTime === 0,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Play hero video" }).click();
  await expect
    .poll(() =>
      video.evaluate(
        (el: HTMLVideoElement) => !el.paused && el.currentTime > 0,
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Pause hero video" }).click();
  const results = await new AxeBuilder({ page })
    .include(".hero")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
