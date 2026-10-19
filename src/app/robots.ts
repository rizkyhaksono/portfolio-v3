import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        // Card crawlers honour robots.txt, so the OG images must stay fetchable.
        allow: ["/", "/api/og"],
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/profile/edit",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
