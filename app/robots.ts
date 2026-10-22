import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/partner-preview" },
    sitemap: "https://www.jointrotro.com/sitemap.xml",
  };
}
