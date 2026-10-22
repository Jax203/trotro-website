import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function checkState(page: import("@playwright/test").Page) {
  // Assess the readable resting state, not a partially transparent entrance frame.
  // In-flight motion, cancellation and reduced-motion behavior have separate tests.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => {})),
    ),
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    result.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map((n) => n.target),
    })),
  ).toEqual([]);
}

test("invalid inquiry has persistent linked errors and keyboard recovery", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Review my request" }).click();
  const summary = page
    .getByRole("alert")
    .filter({ hasText: "Please check your details." });
  await expect(summary).toBeFocused();
  await expect(page.getByLabel("Your name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await summary.getByRole("link", { name: /Your name:/ }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Accessibility test");
  await expect(page.getByLabel("Your name")).not.toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await checkState(page);
});

test("inquiry changes retain shared and pathway-specific details", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Accessibility test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Neighborhood or service area").fill("Brooklyn");
  await page.getByRole("button", { name: "For my school" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("Accessibility test");
  await expect(page.getByLabel("Work email")).toHaveValue("test@example.com");
  await page.getByLabel("Your role").fill("Coordinator");
  await page.getByRole("button", { name: "For my family" }).click();
  await expect(page.getByLabel("Neighborhood or service area")).toHaveValue(
    "Brooklyn",
  );
  await page.getByRole("button", { name: "For my school" }).click();
  await expect(page.getByLabel("Your role")).toHaveValue("Coordinator");
});

test("general inquiry validates message length and edit returns focus", async ({
  page,
}) => {
  await page.goto("/contact?intent=general");
  await page.getByLabel("Your name").fill("Accessibility test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Your question").fill("Hi");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Review my request" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Please check your details." }),
  ).toContainText("at least 10 characters");
  await page
    .getByLabel("Your question")
    .fill("Please explain the available routes.");
  await page.getByRole("button", { name: "Review my request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step, ready to send." }),
  ).toBeFocused();
  await checkState(page);
  await page.getByRole("button", { name: "Edit my details" }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await expect(page.getByLabel("Your question")).toHaveValue(
    "Please explain the available routes.",
  );
});

test("skip link, journey relationships, icon semantics and targets", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const tab of await page.getByRole("tab").all()) {
    const id = await tab.getAttribute("aria-controls");
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
  await expect(page.locator("svg:not([aria-hidden='true'])")).toHaveCount(0);
  for (const button of await page
    .locator(".journey-controls button, .school-carousel-controls button")
    .all()) {
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole("tab").last().click();
  await checkState(page);
});

test("small-screen menu and errors remain usable with text spacing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.addStyleTag({
    content:
      "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}",
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await checkState(page);
  await page.keyboard.press("Escape");
  await page.goto("/contact");
  await page.getByRole("button", { name: "Review my request" }).click();
  await checkState(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator(".form-errors").screenshot({
    path: "docs/accessibility/screenshots/after-form-errors-320.png",
  });
});

test("404 has a descriptive document title", async ({ page }) => {
  await page.goto("/audit-not-found");
  await expect(page).toHaveTitle(/Page not found.*TroTro/);
  await checkState(page);
});
