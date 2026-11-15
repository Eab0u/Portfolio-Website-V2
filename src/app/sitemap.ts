import type { MetadataRoute } from "next";

const SITE = "https://rahulmi.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/timeline", "/credits"].map((path) => ({ url: `${SITE}${path}` }));
}
