import { createFileRoute } from "@tanstack/react-router";
import { PAGINAS, SITE_URL } from "@/lib/site";

/**
 * sitemap.xml, gerado de PAGINAS (a mesma lista do llms.txt). Sem <lastmod>:
 * a data do build não é a data em que o conteúdo mudou, e data falsa é pior
 * que nenhuma. Na prévia (SITE_URL null) responde 404.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        if (!SITE_URL) return new Response("Not found\n", { status: 404 });
        const urls = PAGINAS.map((p) => `  <url><loc>${SITE_URL}${p.caminho}</loc></url>`);
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");
        return new Response(xml + "\n", {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
