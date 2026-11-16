import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import fonteTitulo from "@/assets/fonts/cormorant-garamond.woff2?url";
import fonteTituloItalico from "@/assets/fonts/cormorant-garamond-italico-500.woff2?url";
import { CLARITY_ID, GTM } from "@/lib/marina";
import { INDEXAVEL } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="rotulo text-brand-bronze">Página não encontrada</p>
        <h1 className="font-display mt-4 text-4xl text-brand-ink">Este endereço não existe.</h1>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-cream transition hover:opacity-90"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-brand-ink">A página não carregou.</h1>
        <p className="mt-3 text-sm text-brand-muted">Tente de novo em alguns segundos.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-cream transition hover:opacity-90"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-brand-sand px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-bg-soft"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#2a2019" },
      { name: "author", content: "Dra. Marina Corradi" },
      { property: "og:site_name", content: "Dra. Marina Corradi" },
      { property: "og:locale", content: "pt_BR" },
      // Prévia, sem domínio oficial: fora do Google (ver SITE_URL em lib/site.ts).
      ...(INDEXAVEL ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // As duas fontes do título da abertura saem junto com o CSS, para o h1 já
      // aparecer na serifa certa. A Montserrat (texto) fica sem pré-carga: a
      // banda vai para a foto da abertura, que é o maior elemento da tela.
      {
        rel: "preload",
        href: fonteTitulo,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: fonteTituloItalico,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      // O Google pede ícone em múltiplo de 48 px; o do iPhone é 180 px e sem transparência.
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Tag Manager, pelo carregador da Medlabs (ver `GTM` em lib/marina.ts) */}
        {GTM ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src=${JSON.stringify(`${GTM.script}?`)}+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM.parametro)});`,
            }}
          />
        ) : null}
        {/* End Google Tag Manager */}
        {CLARITY_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});`,
            }}
          />
        ) : null}
        <HeadContent />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {GTM ? (
          <noscript>
            <iframe
              src={`${new URL(GTM.script).origin}/ns.html?id=${GTM.id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {/* End Google Tag Manager (noscript) */}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
