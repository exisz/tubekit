import type { MetadataRoute } from "next";

// 🛑 REQUIRED for output: "export" — without this, build fails with:
//    Error: export const dynamic = "force-static"/export const revalidate
//    not configured on route "/sitemap.xml" with "output: export"
// nextjs-doctor catches this — do not remove unless switching to ISR/SSR.
export const dynamic = "force-static";
export const revalidate = false;

const BASE = "https://tubekit.starmap.quest";

// ⚠️ Replace with real routes once Pod builds out the site.
// Add dynamic routes (e.g. /[slug]) by importing your data and mapping over it.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
