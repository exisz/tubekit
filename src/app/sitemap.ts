import type { MetadataRoute } from "next";

// 🛑 REQUIRED for output: "export" — without this, build fails with:
//    Error: export const dynamic = "force-static"/export const revalidate
//    not configured on route "/sitemap.xml" with "output: export"
// nextjs-doctor catches this — do not remove unless switching to ISR/SSR.
export const dynamic = "force-static";
export const revalidate = false;

const BASE = "https://tubekit.starmap.quest";

const toolRoutes = [
  "youtube-thumbnail-downloader",
  "youtube-metadata-inspector",
  "youtube-embed-generator",
  "youtube-timestamp-link-generator",
  "youtube-tag-cleaner",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolRoutes.map((route) => ({
      url: `${BASE}/${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
