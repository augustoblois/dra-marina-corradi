import { createFileRoute } from "@tanstack/react-router";
import { AgendamentoSobDemanda } from "@/components/AgendamentoSobDemanda";
import { Abertura } from "@/components/secoes/Abertura";
import { Chamada } from "@/components/secoes/Chamada";
import { CorradiDerma } from "@/components/secoes/CorradiDerma";
import { DraMarina } from "@/components/secoes/DraMarina";
import { Duvidas } from "@/components/secoes/Duvidas";
import { Investimento } from "@/components/secoes/Investimento";
import { NaImprensa } from "@/components/secoes/NaImprensa";
import { NoInstagram } from "@/components/secoes/NoInstagram";
import { OutrosCuidados } from "@/components/secoes/OutrosCuidados";
import { ParaVoce } from "@/components/secoes/ParaVoce";
import { PorQueVolformer } from "@/components/secoes/PorQueVolformer";
import { Resultados } from "@/components/secoes/Resultados";
import { Rodape } from "@/components/secoes/Rodape";
import { Tecnologia } from "@/components/secoes/Tecnologia";
import { dadosEstruturados } from "@/lib/dados-estruturados";
import { getRequestOrigin } from "@/lib/origin.functions";
import { DESCRICAO, IMAGEM_PREVIA, SITE_URL, TITULO, TITULO_PREVIA } from "@/lib/site";

export const Route = createFileRoute("/")({
  // Com o domínio definido, os endereços absolutos saem dele. Na prévia, saem de
  // quem está servindo a página, para a prévia do link já funcionar no WhatsApp.
  loader: async () => ({ origem: SITE_URL ?? (await getRequestOrigin()) }),
  head: ({ loaderData }) => {
    const origem = loaderData?.origem ?? "";
    return {
      meta: [
        { title: TITULO },
        { name: "description", content: DESCRICAO },
        { property: "og:type", content: "website" },
        { property: "og:title", content: TITULO_PREVIA },
        { property: "og:description", content: DESCRICAO },
        ...(SITE_URL ? [{ property: "og:url", content: `${SITE_URL}/` }] : []),
        { property: "og:image", content: `${origem}${IMAGEM_PREVIA.caminho}` },
        { property: "og:image:width", content: String(IMAGEM_PREVIA.w) },
        { property: "og:image:height", content: String(IMAGEM_PREVIA.h) },
        { property: "og:image:alt", content: IMAGEM_PREVIA.alt },
        { name: "twitter:card", content: "summary_large_image" },
        { "script:ld+json": dadosEstruturados(origem) },
      ],
      // Sem domínio, sem canonical: página noindex não aponta para outro endereço.
      links: SITE_URL ? [{ rel: "canonical", href: `${SITE_URL}/` }] : [],
    };
  },
  component: Inicio,
});

function Inicio() {
  return (
    <>
      <main>
        <Abertura />
        <PorQueVolformer />
        <Resultados />
        <ParaVoce />
        <Tecnologia />
        <Investimento />
        <DraMarina />
        <NaImprensa />
        <Chamada />
        <OutrosCuidados />
        <CorradiDerma />
        <NoInstagram />
        <Duvidas />
      </main>
      <Rodape />
      <AgendamentoSobDemanda />
    </>
  );
}
