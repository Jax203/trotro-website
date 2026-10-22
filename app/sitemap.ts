import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/parents",
    "/schools",
    "/safety",
    "/about",
    "/contact",
    "/download",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `https://www.jointrotro.com${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
