import { useRef, useState, type MouseEvent } from "react";
import { ZoomIn } from "lucide-react";
import { Foto } from "@/components/Foto";
import { Losango } from "@/components/Losango";
import { Visor, type ItemVisor } from "@/components/Visor";
import type { NomeMidia } from "@/lib/midias.gen";

type Caso = {
  antes: NomeMidia;
  depois: NomeMidia;
  /** Nome curto do caso, para a legenda do visor. */
  titulo: string;
  legenda: string;
  /** Descrição de cada foto para o leitor de tela (antes, depois). */
  alts: readonly [string, string];
  /** Rótulos das duas fotos; o padrão é ANTES / DEPOIS. */
  rotulos?: readonly [string, string];
};

const CASOS: readonly Caso[] = [
  {
    antes: "caso-34-antes",
    depois: "caso-34-depois",
    titulo: "Três quartos",
    legenda: "Três quartos · antes e depois do protocolo",
    alts: [
      "Rosto da paciente em três quartos, antes do protocolo Volformer",
      "Rosto da mesma paciente em três quartos, depois do protocolo Volformer",
    ],
  },
  {
    antes: "caso-lateral-antes",
    depois: "caso-lateral-depois",
    titulo: "Perfil",
    legenda: "Perfil · linha da mandíbula e pescoço",
    alts: [
      "Perfil da paciente, com a linha da mandíbula e o pescoço, antes do protocolo",
      "Perfil da mesma paciente, com a linha da mandíbula e o pescoço, depois do protocolo",
    ],
  },
  {
    antes: "caso-cadeira-antes",
    depois: "caso-cadeira-depois",
    titulo: "Mesma sessão",
    legenda: "Mesma sessão · lado sem tratamento e lado tratado",
    alts: [
      "Paciente na cadeira, lado do rosto ainda sem tratamento",
      "A mesma paciente na mesma sessão, lado do rosto já tratado",
    ],
    rotulos: ["SEM TRATAR", "TRATADO"],
  },
];

const COMPARATIVO = {
  nome: "comparativo-rosto",
  alt: "Rosto de uma paciente dividido ao meio: o lado esquerdo sem tratamento e o lado direito após o protocolo Volformer, com contorno mais definido.",
  legenda: "Lado esquerdo sem tratamento · lado direito após o Volformer",
} as const satisfies ItemVisor;

const fotosDoCaso = (caso: Caso) => {
  const [rotuloA, rotuloB] = caso.rotulos ?? ["ANTES", "DEPOIS"];
  return [
    { nome: caso.antes, rotulo: rotuloA, ouro: false, alt: caso.alts[0] },
    { nome: caso.depois, rotulo: rotuloB, ouro: true, alt: caso.alts[1] },
  ].map((f) => ({ ...f, legenda: `${caso.titulo} · ${f.rotulo.toLowerCase()}` }));
};

/** Ordem do visor: o comparativo, depois cada caso com antes e depois em sequência. */
const ITENS_VISOR: readonly ItemVisor[] = [COMPARATIVO, ...CASOS.flatMap(fotosDoCaso)];

const AVISO =
  "Resultados variam de pessoa para pessoa. Imagens publicadas com autorização das pacientes, com finalidade educativa.";

/**
 * Resultados: a prova vem antes da explicação, como na LP de referência.
 *
 * O destaque é o comparativo do destaque "Volformer" do Instagram dela: o mesmo
 * rosto, metade tratada e metade não, na mesma foto. É a comparação que não
 * depende de luz, ângulo ou dia diferentes. Depois, o carrossel de casos.
 * Toda foto abre no visor em tela cheia, e o aviso educativo vai junto.
 */
export function Resultados() {
  const [aberta, setAberta] = useState<number | null>(null);
  const origem = useRef<HTMLButtonElement>(null);

  const abrir = (indice: number) => (e: MouseEvent<HTMLButtonElement>) => {
    origem.current = e.currentTarget;
    setAberta(indice);
  };

  return (
    <section id="resultados" className="overflow-hidden bg-brand-cream py-16 lg:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-3 rounded-full border border-brand-gold/55 bg-brand-chip px-5 py-2 text-[0.68rem] font-semibold tracking-[0.26em] text-brand-chip-foreground">
            <Losango />
            PROTOCOLO VOLFORMER
          </span>
          <h2 className="font-display mt-6 text-[2.5rem] font-medium leading-[1.02] text-brand-ink lg:text-[3.4rem]">
            O mesmo rosto.
            <br />
            <em className="italic text-brand-bronze">Mais definição.</em>
          </h2>
          <span className="mt-5 block h-[2px] w-20 bg-gold-gradient" />
          <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-brand-muted">
            A diferença <strong className="font-semibold text-brand-ink">com e sem</strong> o
            Volformer, lado a lado na mesma foto.
          </p>
        </div>

        <figure className="mx-auto w-full max-w-[420px]">
          <button
            type="button"
            onClick={abrir(0)}
            aria-label="Ampliar a comparação em tela cheia"
            className="group relative block w-full cursor-zoom-in rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
          >
            <span className="block overflow-hidden rounded-3xl border border-brand-gold/25 bg-brand-bg-elevated shadow-[var(--shadow-soft)]">
              <Foto
                nome={COMPARATIVO.nome}
                alt={COMPARATIVO.alt}
                sizes="(min-width: 1024px) 420px, calc(100vw - 48px)"
                className="h-auto w-full"
              />
            </span>
            {/* Metade para fora do cartão: os cantos da foto já têm os rótulos dela. */}
            <span
              aria-hidden
              className="absolute -bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-espresso text-brand-cream shadow-[var(--shadow-soft)] transition group-hover:scale-105"
            >
              <ZoomIn className="h-5 w-5" strokeWidth={1.8} />
            </span>
          </button>
          <figcaption className="mt-8 text-center text-[0.78rem] text-brand-muted">
            {COMPARATIVO.legenda}
          </figcaption>
        </figure>
      </div>

      {/* Carrossel: a trilha é duplicada para o loop não ter emenda; a cópia
          some para leitor de tela e teclado e, com movimento reduzido, vira
          rolagem à mão. Pausa sob o ponteiro e com o foco, para dar tempo de tocar. */}
      <div
        className="mt-14 overflow-hidden motion-reduce:overflow-x-auto"
        aria-label="Casos de antes e depois"
      >
        <ul className="flex w-max gap-5 px-6 animate-marquee-left motion-reduce:animate-none">
          {[...CASOS, ...CASOS].map((caso, i) => {
            const copia = i >= CASOS.length;
            const n = i % CASOS.length;
            return (
              <li
                key={i}
                aria-hidden={copia || undefined}
                className={`w-[300px] shrink-0 overflow-hidden rounded-2xl border border-brand-gold/20 bg-brand-bg-elevated shadow-[var(--shadow-soft)] sm:w-[360px] ${copia ? "motion-reduce:hidden" : ""}`}
              >
                <div className="grid grid-cols-2 gap-px bg-brand-sand">
                  {fotosDoCaso(caso).map((foto, lado) => (
                    <button
                      key={foto.nome}
                      type="button"
                      onClick={abrir(1 + n * 2 + lado)}
                      tabIndex={copia ? -1 : undefined}
                      aria-label={`Ampliar em tela cheia: ${foto.alt}`}
                      className="relative block cursor-zoom-in"
                    >
                      <Foto
                        nome={foto.nome}
                        alt={copia ? "" : foto.alt}
                        sizes="180px"
                        className="h-[300px] w-full object-cover object-top sm:h-[360px]"
                      />
                      <span
                        className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.16em] ${
                          foto.ouro
                            ? "bg-gold-gradient text-brand-espresso"
                            : "bg-brand-espresso/75 text-white"
                        }`}
                      >
                        {foto.rotulo}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="px-4 py-3 text-[0.8rem] font-medium text-brand-ink">{caso.legenda}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mx-auto mt-8 max-w-md px-6 text-center text-[0.75rem] leading-relaxed text-brand-muted">
        {AVISO}
      </p>

      <Visor
        itens={ITENS_VISOR}
        indice={aberta}
        definirIndice={setAberta}
        origemRef={origem}
        titulo="Resultados do protocolo Volformer"
        nota={AVISO}
      />
    </section>
  );
}
