import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.robots {
  const baseUrl = "https://afruzstore.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"], // Admin aur API routes ko google crawl nahi karega (Security!)
    },
    sitemap: `${baseUrl}/sitemap.sml`, // Sitemap link
  };
}
