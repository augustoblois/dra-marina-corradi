import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt. Com o domínio definido: libera tudo, inclusive os robôs de busca
 * por IA, e aponta o sitemap. Na prévia (SITE_URL null): fecha o site inteiro.
 */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          SITE_URL
            ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
            : "User-agent: *\nDisallow: /\n",
          { headers: { "Content-Type": "text/plain; charset=utf-8" } },
        ),
    },
  },
});
