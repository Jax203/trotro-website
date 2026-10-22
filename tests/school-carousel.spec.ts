import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 1440]) {
  test(`school carousel loads and navigates at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const carousel = page.getByRole("region", { name: "Trusted by:" });
    await carousel.scrollIntoViewIfNeeded();
    await expect(carousel.getByRole("listitem")).toHaveCount(10);
    await expect(carousel.getByText("Preview placeholder")).toHaveCount(0);
    const images = carousel.locator("img");
    await expect(images).toHaveCount(9);
    await images.evaluateAll((items) =>
      items.forEach((image) => ((image as HTMLImageElement).loading = "eager")),
    );
    await expect
      .poll(() =>
        images.evaluateAll((items) =>
          items.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    const track = carousel.getByRole("list");
    const previous = carousel.getByRole("button", {
      name: "Previous school logos",
    });
    const next = carousel.getByRole("button", { name: "Next school logos" });
    await expect(previous).toBeDisabled();
    await next.click();
    await expect
      .poll(() => track.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0);
    await track.focus();
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBe(0);
    await track.evaluate((el) =>
      el.scrollTo({ left: el.scrollWidth, behavior: "instant" }),
    );
    await expect(next).toBeDisabled();
    await expect(previous).toBeEnabled();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const results = await new AxeBuilder({ page })
      .include(".school-carousel")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
