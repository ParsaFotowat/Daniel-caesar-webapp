import { createFileRoute } from "@tanstack/react-router";
import { watches } from "@/lib/catalog";

const paths = ["/", "/watches", ...watches.map((w) => `/watches/${w.slug}`), "/brand", "/journal", "/retailers", "/contact", "/warranty"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${origin}${p}</loc><changefreq>${p.startsWith("/watches/") ? "monthly" : "weekly"}</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
