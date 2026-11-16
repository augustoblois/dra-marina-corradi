import { CalendarDays, ChevronsDown } from "lucide-react";
import { Foto } from "@/components/Foto";
import { abrirAgendamento } from "@/lib/marina";

/**
 * O cartão escuro de chamada (mesmo papel do da LP de referência): um respiro
 * no meio da página que leva de volta ao agendamento.
 */
export function Chamada() {
  return (
    <section id="avaliacao" className="bg-brand-cream px-4 pb-16 sm:px-6 lg:px-16 lg:pb-24">
      <div className="relative mx-auto max-w-6xl">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-10 flex h-11 w-[88px] -translate-x-1/2 items-end justify-center rounded-b-[2rem] bg-brand-cream pb-1.5"
        >
          <ChevronsDown className="h-5 w-5 text-brand-bronze" strokeWidth={2.5} />
        </div>

        <div
          className="relative overflow-hidden rounded-[2.5rem] border border-brand-gold/40 bg-brand-espresso px-6 pb-12 pt-16 text-center sm:px-10 lg:px-16 lg:pb-16 lg:pt-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top, oklch(0.78 0.12 75 / 0.26), transparent 60%), radial-gradient(ellipse at bottom right, oklch(0.78 0.12 75 / 0.16), transparent 60%)",
          }}
        >
          <h2 className="font-display mx-auto max-w-3xl text-[2rem] font-medium leading-[1.08] text-brand-cream sm:text-[2.2rem] lg:text-[3rem]">
            Seu Volformer começa
            <br />
            <em className="text-gold-gradient italic">pela avaliação.</em>
          </h2>

          <div className="mx-auto mt-8 w-full max-w-[300px] overflow-hidden rounded-3xl border border-brand-gold/30 shadow-2xl">
            <Foto
              nome="sessao-vetores"
              alt="Rosto de uma paciente com setas desenhadas na pele, indicando a direção de sustentação planejada para cada área"
              sizes="300px"
              posicao="50% 35%"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-[0.98rem] leading-relaxed text-brand-cream/85">
            Na consulta, a Dra.&nbsp;Marina examina a sua pele,{" "}
            <strong className="font-semibold text-brand-cream">ouve o que incomoda você</strong> e
            desenha no seu rosto a direção de sustentação de cada área. É esse mapa que{" "}
            <strong className="font-semibold text-brand-cream">
              guia o Volformer, ponto a ponto
            </strong>
            .
          </p>

          <button
            type="button"
            onClick={abrirAgendamento}
            className="mt-9 inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-green-gradient py-2 pl-2 pr-7 text-[1rem] font-semibold text-white shadow-[var(--shadow-green)] transition hover:scale-[1.02] max-[359px]:pr-6 min-[360px]:min-w-[262px]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-espresso text-brand-gold-bright">
              <CalendarDays className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            </span>
            Agendar avaliação
          </button>
        </div>
      </div>
    </section>
  );
}
