import { BotaoAgendar } from "@/components/BotaoAgendar";
import { Foto } from "@/components/Foto";
import { VideoLoop } from "@/components/VideoLoop";
import type { NomeMidia } from "@/lib/midias.gen";

type Cuidado = {
  titulo: string;
  texto: string;
  midia: NomeMidia;
  alt: string;
  /** Obrigatória em antes e depois: finalidade educativa e aviso de variação (CFM). */
  legenda?: string;
  posicao?: string;
  /** Trecho mudo em loop no lugar da foto (a mídia já sai em 4:5 do pipeline). */
  video?: boolean;
};

const CUIDADOS: readonly Cuidado[] = [
  {
    titulo: "Harmonização facial",
    texto:
      "Toxina botulínica e preenchimentos, respeitando as proporções e a expressão do seu rosto.",
    midia: "cuidado-facial",
    alt: "Dra. Marina Corradi, de óculos e luvas, aplicando um injetável no queixo de uma paciente deitada",
    posicao: "35% 40%",
  },
  {
    titulo: "Glúteo Glow · GoldIncision",
    texto: "Protocolo para a celulite e o contorno dos glúteos, com técnica licenciada.",
    midia: "cuidado-goldincision",
    alt: "Glúteos de uma paciente antes, em cima, e depois do GoldIncision, embaixo, com a pele mais lisa",
    legenda: "Antes (em cima) e depois (embaixo). Resultados variam de pessoa para pessoa.",
  },
  {
    titulo: "Tricologia",
    texto:
      "Cuidado com a queda, o volume e a saúde dos fios, com tecnologia para o couro cabeludo.",
    midia: "cuidado-tricologia",
    alt: "Dra. Marina Corradi, de máscara e luvas, examinando o couro cabeludo de um paciente",
  },
  {
    titulo: "Laser Chrome",
    texto: "Para manchas e tom irregular da pele, inclusive nas mãos.",
    midia: "cuidado-laser",
    alt: "Aparelho de laser Chrome na sala de procedimentos da Corradi Derma",
    posicao: "50% 45%",
  },
  {
    titulo: "Aquapure",
    texto: "Protocolo facial com tecnologia, para a saúde e o viço da pele.",
    midia: "loop-aquapure",
    alt: "Profissional da clínica aplicando um aparelho de luz azul no rosto de um paciente deitado",
    video: true,
  },
];

/** Os outros tratamentos da clínica, citados sem tirar o foco do Volformer. */
export function OutrosCuidados() {
  return (
    <section id="outros-cuidados" className="bg-brand-bg-soft py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-16">
        <p className="rotulo text-brand-bronze">Além do Volformer</p>
        <h2 className="font-display mt-4 text-[2.4rem] font-medium leading-[1.04] text-brand-ink lg:text-[3.2rem]">
          Do rosto aos fios, <em className="italic text-brand-bronze">o mesmo cuidado</em>.
        </h2>
        <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-brand-muted">
          Na Corradi Derma, os outros tratamentos seguem o mesmo princípio:{" "}
          <strong className="font-semibold text-brand-ink">avaliação individual</strong> antes de
          qualquer indicação.
        </p>
        <p className="rotulo mt-8 text-brand-bronze lg:hidden" aria-hidden>
          Deslize para ver →
        </p>
      </div>

      <ul className="mt-5 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:mx-auto lg:mt-10 lg:grid lg:max-w-6xl lg:grid-cols-5 lg:overflow-visible lg:px-16 [&::-webkit-scrollbar]:hidden">
        {CUIDADOS.map((c) => (
          <li
            key={c.midia}
            className="w-[72vw] max-w-[290px] shrink-0 snap-start lg:w-auto lg:max-w-none"
          >
            <div className="overflow-hidden rounded-3xl border border-brand-gold/25 bg-brand-bg-elevated shadow-[var(--shadow-soft)]">
              {c.video ? (
                <VideoLoop
                  nome={c.midia}
                  rotulo={c.alt}
                  className="block aspect-[4/5] w-full object-cover"
                />
              ) : (
                <Foto
                  nome={c.midia}
                  alt={c.alt}
                  sizes="(min-width: 1024px) 220px, 72vw"
                  posicao={c.posicao}
                  className="aspect-[4/5] w-full object-cover"
                />
              )}
            </div>
            <p className="font-display mt-4 text-[1.4rem] font-medium leading-tight text-brand-ink">
              {c.titulo}
            </p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-brand-muted">{c.texto}</p>
            {c.legenda && (
              <p className="mt-2 text-[0.75rem] italic leading-snug text-brand-muted/90">
                {c.legenda}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-10 max-w-md px-6">
        <BotaoAgendar />
      </div>
    </section>
  );
}
