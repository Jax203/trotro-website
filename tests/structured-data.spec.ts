import { test, expect } from "@playwright/test";
import {
  buildStructuredData,
  serializeStructuredData,
} from "../lib/structured-data";
import type { Graph } from "schema-dts";

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
const origin = "https://www.jointrotro.com";
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

for (const path of routes) {
  test(`JSON-LD on ${path} is in server HTML and matches visible content`, async ({
    page,
    request,
  }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const scripts = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    expect(scripts).toHaveLength(1);
    const data = JSON.parse(scripts[0][1]);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"]).toHaveLength(3);
    const nodes = data["@graph"];
    const ids = nodes.map((node: { "@id": string }) => node["@id"]);
    expect(new Set(ids).size).toBe(ids.length);
    const [organization, website, webPage] = nodes;
    expect(organization["@type"]).toBe("Organization");
    expect(organization).toEqual({
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "TroTro",
      url: origin,
      email: "trotrotransit@gmail.com",
    });
    expect(website["@type"]).toBe("WebSite");
    expect(webPage["@type"]).toBe(
      path === "/about"
        ? "AboutPage"
        : path === "/contact"
          ? "ContactPage"
          : "WebPage",
    );
    expect(webPage["@id"]).toBe(`${origin}${path}#webpage`);
    for (const node of nodes) {
      expect(new URL(node.url).origin).toBe(origin);
      for (const relation of ["publisher", "isPartOf", "about", "mainEntity"]) {
        if (node[relation]) expect(ids).toContain(node[relation]["@id"]);
      }
    }
    await page.goto(path);
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(1);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(webPage.url).toBe(canonical);
    expect(normalize(await page.locator("h1").innerText())).toBe(webPage.name);
    if (webPage.description)
      expect(normalize(await page.locator("main").innerText())).toContain(
        webPage.description,
      );
    await expect(
      page.locator('footer a[href="mailto:trotrotransit@gmail.com"]'),
    ).toBeVisible();
    // Do not turn starting prices, synthetic scenes or unsupported details into claims.
    expect(JSON.stringify(data)).not.toMatch(
      /"(?:offers|price|priceCurrency|aggregateRating|review|address|telephone|areaServed|openingHours|sameAs|founder|hasCredential|memberOf|award|image|logo|potentialAction|breadcrumb)"/,
    );
  });
}

test("contact intents share the canonical page identity and exclude submitted data", async ({
  request,
}) => {
  for (const query of [
    "?intent=school",
    "?intent=general",
    "?intent=parent&email=private%40example.com",
  ]) {
    const html = await (await request.get(`/contact${query}`)).text();
    const script = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )!;
    const data = JSON.parse(script[1]);
    expect(data).toEqual(buildStructuredData("/contact"));
    expect(script[1]).not.toContain("private@example.com");
    expect(script[1]).not.toContain("?intent");
  }
});

test("excluded pages emit no JSON-LD", async ({ request }) => {
  for (const path of ["/partner-preview", "/missing-schema-test-page"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(path === "/partner-preview" ? 200 : 404);
    expect(await response.text()).not.toContain('type="application/ld+json"');
  }
  expect(buildStructuredData("toString")).toBeNull();
  expect(buildStructuredData("/parents?intent=school")).toBeNull();
});

test("serialization cannot break out of the JSON-LD script", () => {
  const hostile = '</script><script>alert("unsafe")</script>';
  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [{ "@type": "WebPage", name: hostile }],
  };
  const serialized = serializeStructuredData(graph);
  expect(serialized).not.toContain("<");
  expect(JSON.parse(serialized)["@graph"][0].name).toBe(hostile);
});
