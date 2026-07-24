import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/about", priority: "0.7", changefreq: "monthly" as const },
  { path: "/contact", priority: "0.7", changefreq: "monthly" as const },
  { path: "/collections/engagement-rings", priority: "0.9", changefreq: "weekly" as const },
  { path: "/collections/earrings", priority: "0.9", changefreq: "weekly" as const },
  { path: "/collections/bracelets", priority: "0.9", changefreq: "weekly" as const },
  { path: "/collections/hip-hop-jewelry", priority: "0.9", changefreq: "weekly" as const },
  { path: "/collections/pendants", priority: "0.9", changefreq: "weekly" as const },
  { path: "/collections/bridal", priority: "0.9", changefreq: "weekly" as const },
  { path: "/collections/lab-grown", priority: "0.9", changefreq: "weekly" as const },
  { path: "/product/marquise-solitaire-ring", priority: "0.8", changefreq: "monthly" as const },
  { path: "/product/oval-hidden-halo-ring", priority: "0.8", changefreq: "monthly" as const },
  { path: "/product/emerald-cut-studs", priority: "0.8", changefreq: "monthly" as const },
  { path: "/product/tennis-bracelet", priority: "0.8", changefreq: "monthly" as const },
  { path: "/product/pear-diamond-ring", priority: "0.8", changefreq: "monthly" as const },
  { path: "/product/heart-drop-earrings", priority: "0.8", changefreq: "monthly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
