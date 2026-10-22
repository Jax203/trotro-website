import type { Graph, Organization, WebPage, WebSite } from "schema-dts";

// Public identity already shown in the site header/footer and verified in the
// existing-site audit. Do not infer an address, coverage area or legal name.
export const siteIdentity = {
  name: "TroTro",
  url: "https://www.jointrotro.com",
  email: "trotrotransit@gmail.com",
} as const;

type PageDescription = {
  type: "WebPage" | "AboutPage" | "ContactPage";
  name: string;
  description?: string;
};

// Exact existing headings and introductory copy. Rendered-page tests check
// these against the page itself so editorial changes cannot silently drift.
const pageDescriptions: Record<string, PageDescription> = {
  "/": {
    type: "WebPage",
    name: "A better ride to school. A calmer morning.",
    description:
      "From the people behind the wheel to the moment your child arrives, we bring care, coordination, and clarity to the school ride.",
  },
  "/parents": {
    type: "WebPage",
    name: "A school ride you can feel more connected to.",
    description:
      "Know the people behind the ride, understand the plan, and get the updates that matter. We help put the school journey in clearer view.",
  },
  "/schools": {
    type: "WebPage",
    name: "The right school should feel within reach.",
    description:
      "Transportation is part of how families experience your school. TroTro helps bring practical routes, responsible coordination and clearer communication into that journey.",
  },
  "/safety": {
    type: "WebPage",
    name: "Trust starts with knowing what’s behind the ride.",
    description:
      "Before a driver runs a TroTro route, required verification checkpoints are completed and recorded. That process supports a ride with clear responsibilities and a record of important moments.",
  },
  "/about": {
    type: "AboutPage",
    name: "It’s a school journey. And someone’s whole world.",
    description:
      "Behind every backpack is a family. Behind every route is a responsibility. TroTro brings those people and everyday moments together with more care, coordination and clarity.",
  },
  "/contact": {
    type: "ContactPage",
    name: "Let’s find your next step.",
    description:
      "Finding a ride for your child? Exploring options for your school? We’d love to hear a little about what you need.",
  },
  "/download": {
    type: "WebPage",
    name: "The school ride. A little closer.",
    description:
      "See who’s driving. Follow the active ride. Get an update at pickup and drop-off. The TroTro parent app keeps useful information within reach.",
  },
  "/privacy": { type: "WebPage", name: "Privacy Policy" },
  "/terms": { type: "WebPage", name: "Terms of Service" },
};

export function buildStructuredData(path: string): Graph | null {
  if (!Object.hasOwn(pageDescriptions, path)) return null;
  const content = pageDescriptions[path];
  // Only indexable, known public pages. No marketing entities on previews/404s.
  if (!content) return null;

  const organizationId = `${siteIdentity.url}/#organization`;
  const websiteId = `${siteIdentity.url}/#website`;
  const url = path === "/" ? siteIdentity.url : `${siteIdentity.url}${path}`;
  const organization: Organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: siteIdentity.name,
    url: siteIdentity.url,
    email: siteIdentity.email,
  };
  const website: WebSite = {
    "@type": "WebSite",
    "@id": websiteId,
    name: siteIdentity.name,
    url: siteIdentity.url,
    publisher: { "@id": organizationId },
    inLanguage: "en",
  };
  const page: WebPage = {
    "@type": content.type,
    "@id": `${siteIdentity.url}${path}#webpage`,
    url,
    name: content.name,
    ...(content.description ? { description: content.description } : {}),
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    publisher: { "@id": organizationId },
    inLanguage: "en",
    ...(path === "/" || path === "/about" || path === "/contact"
      ? { mainEntity: { "@id": organizationId } }
      : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, page],
  };
}

// Native script text needs escaping even when current values are static.
export function serializeStructuredData(data: Graph): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
