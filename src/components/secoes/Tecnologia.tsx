import { Equal, Plus } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Foto } from "@/components/Foto";
import { VideoLoop } from "@/components/VideoLoop";
import type { NomeMidia } from "@/lib/midias.gen";

/** Azul da ponteira do Ultraformer, âmbar do aquecimento da radiofrequência. */
const AZUL = "oklch(0.74 0.13 235)";
const AMBAR = "oklch(0.82 0.12 75)";
const OURO = "oklch(0.87 0.075 85)";

type Aparelho = {
  video: NomeMidia;
  rotuloVideo: string;
  cor: string;
  tipo: string;
  nome: ReactNode;
  texto: string;
  detalhes: readonly string[];
};

const ULTRAFORMER: Aparelho = {
  video: "loop-tec-ultraformer",
  rotuloVideo: "Aparelho Ultraformer MPT com a tela acesa e as ponteiras de ultrassom",
  cor: AZUL,
  tipo: "Ultrassom microfocado",
  nome: "Ultraformer MPT",
  texto:
    "Concentra energia em pontos milimétricos abaixo da superfície, sem lesionar a pele por fora. No cartucho mais profundo, alcança o SMAS, a camada de sustentação do rosto.",
  detalhes: ["Lifting e contorno", "Até 4,5 mm"],
};

const VOLNEWMER: Aparelho = {
  video: "loop-tec-volnewmer",
  rotuloVideo: "Aparelho Volnewmer com as luzes azuis acesas",
  cor: AMBAR,
  tipo: "Radiofrequência monopolar",
  nome: "Volnewmer",
  texto:
    "Aquece a derme de forma uniforme enquanto resfria a superfície da pele, estimulando a produção de colágeno.",
  detalhes: ["Firmeza e textura", "6,78 MHz", "Resfriamento contínuo"],
};

const VOLFORMER: Aparelho = {
  video: "loop-tec-volformer",
  rotuloVideo:
    "O cartucho do Ultraformer MPT e a ponteira do Volnewmer, as duas peças do protocolo",
  cor: OURO,
  tipo: "Protocolo combinado",
  nome: <span className="text-gold-gradient">Volformer</span>,
  texto:
    "As duas tecnologias na mesma sessão, com pontos e profundidades planejados pela Dra. Marina para o seu rosto: o ultrassom trabalha a sustentação; a radiofrequência, a firmeza e a textura da pele.",
  detalhes: ["Mesma sessão", "Plano individual"],
};

/**
 * A tecnologia, em clima futurista (referência: os vídeos oficiais dos
 * aparelhos). A associação é uma conta: Ultraformer MPT + Volnewmer = Volformer.
 * Depois da conta vêm a pele em corte e a filmagem real na Corradi Derma,
 * para o futurista desembocar no que acontece de verdade na sala dela.
 */
export function Tecnologia() {
  return (
    <section
      id="tecnologia"
      className="relative overflow-hidden bg-[oklch(0.14_0.022_255)] px-6 py-20 text-white lg:px-16 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 35% at 12% 6%, oklch(0.55 0.16 248 / 0.38), transparent 70%), radial-gradient(55% 30% at 92% 52%, oklch(0.72 0.12 75 / 0.16), transparent 70%), radial-gradient(50% 30% at 20% 96%, oklch(0.55 0.16 248 / 0.22), transparent 70%)",
        }}
      />
      <div aria-hidden className="tec-grade pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl">
        <p className="rotulo" style={{ color: AZUL }}>
          A tecnologia
        </p>
        <h2 className="font-display mt-4 text-[2.5rem] font-medium leading-[1.02] lg:text-[3.6rem]">
          Duas tecnologias.
          <br />
          <em className="text-gold-gradient italic">Uma sessão.</em>
        </h2>
        <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-white/70">
          O Volformer une{" "}
          <strong className="font-semibold text-white">dois aparelhos da CLASSYS</strong>,
          fabricante sul-coreana distribuída no Brasil pela MedSystems. Cada um trabalha{" "}
          <strong className="font-semibold text-white">uma camada diferente</strong> da pele.
        </p>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1.12fr] lg:items-stretch lg:gap-4">
          <CartaoAparelho {...ULTRAFORMER} />
          <Operador simbolo="+" leitura="mais" />
          <CartaoAparelho {...VOLNEWMER} />
          <Operador simbolo="=" leitura="igual a" />
          <CartaoAparelho {...VOLFORMER} destaque />
        </div>

        <NaPele />

        <div className="mt-16">
          <p className="rotulo" style={{ color: OURO }}>
            Na Corradi Derma
          </p>
          <h3 className="font-display mt-3 text-[1.9rem] font-medium leading-tight lg:text-[2.4rem]">
            Do aparelho para a sala da Dra.&nbsp;Marina.
          </h3>
          <div className="mt-7 grid grid-cols-2 gap-3 lg:max-w-2xl lg:gap-5">
            {[
              {
                nome: "loop-ultrassom" as const,
                rotulo: "Ponteira azul do Ultraformer MPT aplicada na lateral do rosto da paciente",
                legenda: "Ultraformer MPT",
                cor: AZUL,
              },
              {
                nome: "loop-radiofrequencia" as const,
                rotulo:
                  "Ponteira do Volnewmer, com o anel de luz aceso, deslizando na bochecha da paciente",
                legenda: "Volnewmer",
                cor: AMBAR,
              },
            ].map((trecho) => (
              <figure key={trecho.nome}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <VideoLoop
                    nome={trecho.nome}
                    rotulo={trecho.rotulo}
                    className="aspect-[9/14] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2.5 flex items-center gap-2 text-[0.78rem] font-medium text-white/75">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: trecho.cor }} />
                  {trecho.legenda}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <a
          href="#investimento"
          className="mt-14 flex w-full items-center justify-center rounded-xl bg-green-gradient px-6 py-4 text-[0.95rem] font-semibold text-white shadow-[var(--shadow-green)] transition hover:brightness-110 lg:inline-flex lg:w-auto lg:px-10"
        >
          Qual o valor do tratamento?
        </a>
      </div>
    </section>
  );
}

function CartaoAparelho({
  video,
  rotuloVideo,
  cor,
  tipo,
  nome,
  texto,
  detalhes,
  destaque,
}: Aparelho & { destaque?: boolean }) {
  const tom = { "--cor": cor } as CSSProperties;
  return (
    <article
      style={tom}
      className={`relative flex flex-col rounded-3xl border bg-white/[0.04] p-4 backdrop-blur-sm lg:p-5 ${
        destaque ? "border-[color-mix(in_oklch,var(--cor)_45%,transparent)]" : "border-white/10"
      } shadow-[0_30px_60px_-34px_color-mix(in_oklch,var(--cor)_70%,transparent)]`}
    >
      <div className="overflow-hidden rounded-2xl bg-black">
        <VideoLoop
          nome={video}
          rotulo={rotuloVideo}
          className="aspect-square w-full object-cover"
        />
      </div>
      <p className="rotulo mt-5 text-[var(--cor)]">{tipo}</p>
      <h3 className="font-display mt-2 text-[2rem] font-medium leading-none">{nome}</h3>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-white/70">{texto}</p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
        {detalhes.map((detalhe) => (
          <li
            key={detalhe}
            className="rounded-full border border-[color-mix(in_oklch,var(--cor)_45%,transparent)] px-3 py-1 text-[0.7rem] font-semibold tracking-wide text-[var(--cor)]"
          >
            {detalhe}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Operador({ simbolo, leitura }: { simbolo: "+" | "="; leitura: string }) {
  const Icone = simbolo === "+" ? Plus : Equal;
  return (
    <div className="flex items-center justify-center py-1 lg:py-0">
      <span
        aria-hidden
        className="tec-operador flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-brand-gold-bright"
      >
        <Icone className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="sr-only">{leitura}</span>
    </div>
  );
}

/**
 * A pele em corte, em imagens reais dos fabricantes (no lugar do desenho das
 * camadas). Cada painel leva a cor do seu aparelho, como os cartões da conta.
 */
function NaPele() {
  return (
    <figure className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 lg:p-10">
      <div className="px-1 lg:px-0">
        <p className="rotulo text-white/60">Na pele</p>
        <p className="font-display mt-3 text-[1.7rem] font-medium leading-tight lg:text-[2.2rem]">
          Cada aparelho na sua <em className="italic text-brand-gold-bright">profundidade</em>.
        </p>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <PainelPele
          cor={AZUL}
          midia="pele-ultraformer"
          alt="Ilustração da pele em corte com o cartucho Ultraformer MPT de 4,5 mm apoiado na superfície: epiderme, derme, gordura, SMAS e músculo"
          sizes="(min-width: 1024px) 460px, calc(100vw - 82px)"
          sobreposicao={<PontosNoSmas />}
        >
          <strong className="font-semibold text-white">Ultraformer MPT:</strong> pontos de energia a
          1,5, 3,0 e 4,5 mm. Com o cartucho de 4,5 mm, chega ao SMAS, a camada que sustenta o rosto.
        </PainelPele>
        <PainelPele
          cor={AMBAR}
          midia="pele-volnewmer"
          alt="Ilustração em 3D da pele em corte com a ponteira do Volnewmer: brilho vermelho de calor na derme e luz azul de resfriamento na superfície"
          sizes="(min-width: 1024px) 510px, calc(100vw - 82px)"
          fundo="radial-gradient(70% 60% at 45% 60%, oklch(0.32 0.07 250 / 0.9), oklch(0.16 0.03 255) 78%)"
        >
          <strong className="font-semibold text-white">Volnewmer:</strong> aquece a derme, onde fica
          o colágeno (o brilho vermelho), e resfria a superfície da pele ao mesmo tempo (o azul).
        </PainelPele>
      </div>

      <p className="mt-6 px-1 text-[0.7rem] text-white/40 lg:px-0">
        Imagens ilustrativas: CLASSYS / MedSystems.
      </p>
    </figure>
  );
}

function PainelPele({
  cor,
  midia,
  alt,
  sizes,
  fundo,
  sobreposicao,
  children,
}: {
  cor: string;
  midia: NomeMidia;
  alt: string;
  sizes: string;
  fundo?: string;
  sobreposicao?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ "--cor": cor } as CSSProperties}>
      <div
        className="relative overflow-hidden rounded-2xl border border-[color-mix(in_oklch,var(--cor)_40%,transparent)] shadow-[0_30px_60px_-34px_color-mix(in_oklch,var(--cor)_75%,transparent)]"
        style={fundo ? { background: fundo } : undefined}
      >
        <Foto nome={midia} alt={alt} sizes={sizes} className="block h-auto w-full" />
        {sobreposicao}
      </div>
      <p className="mt-4 flex gap-3 text-[0.92rem] leading-relaxed text-white/75">
        <span
          aria-hidden
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: cor, boxShadow: `0 0 12px ${cor}` }}
        />
        <span>{children}</span>
      </p>
    </div>
  );
}

/**
 * Pontos focais do ultrassom pulsando sobre a faixa do SMAS da imagem. A faixa
 * foi medida no próprio arquivo: centro a 84% da altura do recorte.
 */
function PontosNoSmas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[84%]">
      {[8, 20, 32, 44, 56].map((x, i) => (
        <span
          key={x}
          className="tec-pulso absolute h-2 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            left: `${x}%`,
            animationDelay: `${i * 0.18}s`,
            boxShadow: `0 0 10px 4px ${AZUL}`,
          }}
        />
      ))}
      <span
        className="absolute right-2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[0.62rem] font-bold tracking-wider backdrop-blur-sm"
        style={{ color: AZUL, borderColor: AZUL, background: "oklch(0.14 0.022 255 / 0.78)" }}
      >
        SMAS · 4,5 mm
      </span>
    </div>
  );
}
