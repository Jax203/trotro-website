import { test, expect, type Page } from "@playwright/test";

async function watchMotion(page: Page) {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    (window as any).motionCalls = [];
    Element.prototype.animate = function (frames, options) {
      (window as any).motionCalls.push({
        target: this.className,
        frames,
        options,
      });
      return original.call(this, frames, options);
    };
  });
}
async function calls(page: Page, target: string) {
  return page.evaluate(
    (target) =>
      (window as any).motionCalls.filter((call: any) => call.target === target),
    target,
  );
}
async function fillInquiry(page: Page) {
  await page.getByLabel("Your name").fill("Motion test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("Your question")
    .fill("Please explain school transportation options.");
  await page.getByRole("checkbox").check();
}

test("pointer journey transitions are short, directional and interruptible; keyboard is instant", async ({
  page,
}) => {
  await watchMotion(page);
  await page.goto("/");
  const pickup = page.getByRole("tab", { name: "2 At pickup" });
  await pickup.click();
  const movement = await calls(page, "journey-content");
  expect(movement).toHaveLength(1);
  expect(movement[0].options.duration).toBe(200);
  expect(movement[0].frames[0].transform).toContain("8px");
  await page.getByRole("button", { name: "Next school morning step" }).click();
  await page
    .getByRole("button", { name: "Previous school morning step" })
    .click();
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "aria-labelledby",
    "moment-tab-1",
  );
  await pickup.focus();
  const beforeKeyboard = (await calls(page, "journey-content")).length;
  await page.keyboard.press("End");
  expect((await calls(page, "journey-content")).length).toBe(beforeKeyboard);
  expect(
    await page
      .locator(".journey-panel")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(page.getByRole("tab", { name: "4 At school" })).toBeFocused();
});

test("menu reverses safely, removes closing links from focus and preserves mobile layout", async ({
  page,
}) => {
  await watchMotion(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".header-inner .header-cta")).toBeHidden();
  expect(
    await page.evaluate(
      () =>
        document.querySelector(".hero-visual")!.getBoundingClientRect()
          .bottom <=
        document.querySelector(".hero-copy")!.getBoundingClientRect().top,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator("#mobile-nav")).not.toHaveAttribute("inert");
  await page.getByRole("button", { name: "Close navigation" }).click();
  await expect(page.locator("#mobile-nav")).toHaveAttribute("inert", "");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  const events = await calls(page, "mobile-nav");
  expect(events.map((call: any) => call.options.duration)).toEqual([
    200, 120, 200,
  ]);
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect((await calls(page, "mobile-nav")).length).toBe(3);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
});

test("form review and edit transition without losing focus or entered details", async ({
  page,
}) => {
  await watchMotion(page);
  await page.goto("/contact?intent=general");
  await fillInquiry(page);
  await page.getByRole("button", { name: "Review my request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step, ready to send." }),
  ).toBeFocused();
  expect((await calls(page, "inquiry-review"))[0].options.duration).toBe(200);
  await page.getByRole("button", { name: "Edit my details" }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await expect(page.getByLabel("Your name")).toHaveValue("Motion test");
  const review = page.getByRole("button", { name: "Review my request" });
  await review.focus();
  await page.keyboard.press("Enter");
  expect((await calls(page, "inquiry-review")).length).toBe(1);
});

test("reduced motion bypasses all three transitions and responds to preference changes", async ({
  page,
}) => {
  await watchMotion(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Close navigation" }).click();
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await page.getByRole("tab", { name: "2 At pickup" }).click();
  expect(await calls(page, "journey-content")).toHaveLength(0);
  expect(await calls(page, "mobile-nav")).toHaveLength(0);
  await page.goto("/contact?intent=general");
  await fillInquiry(page);
  await page.getByRole("button", { name: "Review my request" }).click();
  expect(await calls(page, "inquiry-review")).toHaveLength(0);
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page.locator("#mobile-nav").evaluate((el) => el.getAnimations().length),
    )
    .toBe(0);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
});
