import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/parents",
  "/schools",
  "/safety",
  "/about",
  "/contact",
  "/download",
  "/privacy",
  "/terms",
];
for (const width of [390, 1440])
  for (const route of routes)
    test(`${route} works at ${width}px with accessible content`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow).toBe(false);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          help: v.help,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      expect(errors).toEqual([]);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://www.jointrotro.com${route === "/" ? "" : route}`,
      );
    });
test("journey supports keyboard navigation and keeps the selected content connected", async ({
  page,
}) => {
  await page.goto("/");
  const first = page.getByRole("tab", { name: "1 Before the ride" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "2 At pickup" })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("confirmed pickup");
  await page.keyboard.press("End");
  await expect(page.getByRole("tabpanel")).toContainText("The arrival");
  await page.getByRole("button", { name: "Next school morning step" }).click();
  await expect(first).toHaveAttribute("aria-selected", "true");
});
test("mobile navigation opens, escapes and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "For parents" })
    .click();
  await expect(page).toHaveURL(/\/parents$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});
test("parent inquiry requires consent, preserves edits and creates an unsent email draft", async ({
  page,
}) => {
  await page.goto("/contact");
  const outgoing: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST") outgoing.push(req.url());
  });
  await page.getByLabel("Your name").fill("Website test parent");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("School", { exact: true }).fill("Example school");
  await page.getByLabel("Neighborhood or service area").fill("Brooklyn");
  await page.getByRole("button", { name: "Review my request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step, ready to send." }),
  ).toHaveCount(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Review my request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step, ready to send." }),
  ).toBeFocused();
  const draft = page.getByRole("link", { name: "Open email draft" });
  const href = await draft.getAttribute("href");
  expect(href).toContain("mailto:trotrotransit@gmail.com");
  expect(decodeURIComponent(href!)).toContain("Neighborhood: Brooklyn");
  await expect(
    page.getByText("Your request has not been sent yet.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit my details" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("Website test parent");
  expect(outgoing).toEqual([]);
});
test("school pathway selects relevant form and supports real online handoff", async ({
  page,
}) => {
  await page.goto("/contact?intent=school");
  await expect(
    page.getByRole("button", { name: "For my school" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Your role")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Continue to TroTro’s online school form/ }),
  ).toHaveAttribute("href", "https://www.jointrotro.com/schools#request-demo");
  await page.getByRole("button", { name: "A question", exact: true }).click();
  await expect(page.getByLabel("Your question")).toBeVisible();
  await expect(page.getByLabel("Your role")).toHaveCount(0);
});
test("FAQ answers are available with keyboard", async ({ page }) => {
  await page.goto("/parents");
  const summary = page
    .locator("summary")
    .filter({ hasText: "How much does transportation cost?" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(summary.locator("..")).toContainText("$85 per week");
  await expect(summary.locator("..")).toHaveAttribute("open", "");
});
test("download stores are real and partner placeholders stay out of public discovery", async ({
  page,
  request,
}) => {
  await page.goto("/download");
  await expect(
    page.getByRole("link", { name: /Apple App Store/ }),
  ).toHaveAttribute(
    "href",
    "https://apps.apple.com/us/app/trotro-mobile/id6780704075",
  );
  await expect(page.getByRole("link", { name: /Google Play/ })).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=com.trotro.mobile",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("partner-preview");
  await page.goto("/partner-preview");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});
test("all local images load and the homepage has no broken internal destinations", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const paths = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(
        links.map(
          (link) =>
            (link as HTMLAnchorElement).getAttribute("href")!.split("#")[0],
        ),
      ),
    ]);
  for (const path of paths)
    expect((await request.get(path || "/")).status()).toBe(200);
  await page
    .locator("img")
    .evaluateAll((images) =>
      images.forEach((img) => ((img as HTMLImageElement).loading = "eager")),
    );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll(
          (images) =>
            images.filter(
              (i) =>
                !(i as HTMLImageElement).complete ||
                !(i as HTMLImageElement).naturalWidth,
            ).length,
        ),
    )
    .toBe(0);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
