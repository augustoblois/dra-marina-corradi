import { ArrowUpRight, Newspaper } from "lucide-react";
import { Foto } from "@/components/Foto";
import type { NomeMidia } from "@/lib/midias.gen";

const DESTAQUE = {
  veiculo: "O Globo",
  titulo: "A busca pela beleza real transforma o mercado de estética corporal no Brasil",
  resumo:
    "A Dra. Marina Corradi explica por que o tratamento de celulite e a harmonização corporal agora priorizam a naturalidade e a individualidade.",
  url: "https://oglobo.globo.com/patrocinado/pulse-brand/noticia/2026/03/23/a-busca-pela-beleza-real-transforma-o-mercado-de-estetica-corporal-no-brasil-1.ghtml",
} as const;

type Materia = {
  veiculo: string;
  titulo: string;
  midia: NomeMidia;
  alt: string;
  url: string;
};

/**
 * Sem o link da matéria original, o cartão abre o post em que a própria Dra.
 * publicou o recorte. Quando o Augusto conseguir o link da matéria, é trocar a
 * `url` aqui.
 */
const MATERIAS: readonly Materia[] = [
  {
    veiculo: "Valor Econômico",
    titulo:
      "Novo conceito em medicina estética chega ao Centro de Itu com investimento e proposta de naturalidade",
    midia: "imprensa-valor",
    alt: "Recorte da matéria do Valor Econômico com retrato da Dra. Marina Corradi",
    url: "https://www.instagram.com/p/DY2z4_Ckdce/",
  },
  {
    veiculo: "Jornal Agora Itu",
    titulo:
      "O inovador conceito de beleza internacional chega a Itu sob a liderança da Dra. Marina Corradi",
    midia: "imprensa-agora",
    alt: "Recorte da matéria do Jornal Agora Itu com retrato da Dra. Marina Corradi",
    url: "https://www.instagram.com/p/DdrZkp_EV8b/",
  },
  {
    veiculo: "Revista Singular",
    titulo: "Dra. Marina Corradi reúne convidados em encontro exclusivo",
    midia: "imprensa-singular",
    alt: "Recorte da Revista Singular com a Dra. Marina Corradi sentada na poltrona da clínica",
    url: "https://www.instagram.com/p/DfAbzpBmnFM/",
  },
];

/** Imprensa: O Globo em destaque, as demais em cartões compactos. */
export function NaImprensa() {
  return (
    <section id="imprensa" className="bg-brand-cream px-6 py-16 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-brand-gold/55 bg-brand-chip px-5 py-2 text-[0.68rem] font-semibold tracking-[0.26em] text-brand-chip-foreground">
            <Newspaper className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            NA MÍDIA
          </span>
          <h2 className="font-display mt-6 text-[2.4rem] font-medium leading-[1.04] text-brand-ink lg:text-[3.2rem]">
            A Dra.&nbsp;Marina <em className="italic text-brand-bronze">na imprensa</em>.
          </h2>
          <span className="mt-5 block h-[2px] w-20 bg-gold-gradient" />
        </div>

        <article className="mt-10 grid items-center gap-7 rounded-[2rem] border border-brand-gold/30 bg-brand-bg-elevated p-3 shadow-[var(--shadow-soft)] sm:p-5 lg:mt-14 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-14 lg:p-7">
          <a
            href={DESTAQUE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-[1.4rem]"
          >
            <Foto
              nome="imprensa-oglobo"
              alt="Recorte da matéria do jornal O Globo com retrato da Dra. Marina Corradi e o título da reportagem"
              sizes="(min-width: 1024px) 400px, calc(100vw - 72px)"
              className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-[1.02]"
            />
          </a>
          <div className="px-3 pb-4 sm:px-2 lg:px-0 lg:pb-0">
            <p className="rotulo text-brand-bronze">Em destaque · {DESTAQUE.veiculo}</p>
            <h3 className="font-display mt-3 text-[1.75rem] font-medium leading-[1.12] text-brand-ink lg:text-[2.5rem]">
              “{DESTAQUE.titulo}”
            </h3>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-brand-muted">
              {DESTAQUE.resumo}
            </p>
            <a
              href={DESTAQUE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 text-[0.92rem] font-semibold text-brand-espresso shadow-[var(--shadow-gold)] transition hover:brightness-105 max-[359px]:px-5 max-[359px]:text-[0.86rem]"
            >
              Ler matéria completa
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </article>

        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {MATERIAS.map((m) => (
            <li key={m.midia}>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full gap-4 rounded-2xl border border-brand-gold/25 bg-brand-bg-elevated p-3 transition hover:border-brand-gold/60 hover:shadow-[var(--shadow-gold)]"
              >
                {/* O <picture> é o item do flex: sem o invólucro fixo, a miniatura encolhe. */}
                <span className="block w-24 shrink-0 overflow-hidden rounded-xl">
                  <Foto
                    nome={m.midia}
                    alt={m.alt}
                    sizes="96px"
                    className="block aspect-[4/5] w-full object-cover"
                  />
                </span>
                <div className="flex min-w-0 flex-col py-1">
                  <p className="rotulo text-[0.6rem] text-brand-bronze">{m.veiculo}</p>
                  <p className="font-display mt-1.5 text-[1.1rem] font-medium leading-snug text-brand-ink">
                    {m.titulo}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[0.8rem] font-semibold text-brand-ink/80 group-hover:text-brand-ink">
                    Ver publicação
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
