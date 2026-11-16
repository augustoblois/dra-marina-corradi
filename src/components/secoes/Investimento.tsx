import { BadgeCheck, ScanFace } from "lucide-react";
import { BotaoAgendar } from "@/components/BotaoAgendar";
import { VideoLoop } from "@/components/VideoLoop";

/**
 * Valores (mesma posição da LP de referência). Sem número: o valor depende do
 * plano de cada rosto e só sai na avaliação. A seção responde a dúvida "quanto
 * custa" com o motivo, e já oferece o agendamento.
 */
export function Investimento() {
  return (
    <section id="investimento" className="bg-brand-cream">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1fr] lg:gap-16 lg:px-16 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-3 rounded-full border border-brand-gold/55 bg-brand-chip px-5 py-2 text-[0.68rem] font-semibold tracking-[0.26em] text-brand-chip-foreground">
            <BadgeCheck className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            VALORES DO PROTOCOLO
          </span>

          <h2 className="font-display mt-7 text-[2.5rem] font-medium leading-[1.02] text-brand-ink lg:text-[3.4rem]">
            Quanto custa
            <br />
            <em className="italic text-brand-bronze">o Volformer?</em>
          </h2>
          <span className="mt-5 block h-[2px] w-20 bg-gold-gradient" />

          <p className="mt-7 max-w-md text-[1rem] leading-relaxed text-brand-muted">
            Cada rosto pede <strong className="font-semibold text-brand-ink">um plano</strong>. O
            valor é definido{" "}
            <strong className="font-semibold text-brand-ink">na sua avaliação</strong> com a
            Dra.&nbsp;Marina.
          </p>

          <div className="mt-7 flex max-w-md items-center gap-4 rounded-2xl border border-brand-gold/25 bg-brand-bg-elevated px-5 py-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-bronze">
              <BadgeCheck className="h-6 w-6" strokeWidth={1.6} aria-hidden />
            </span>
            <p className="text-[0.95rem] font-semibold leading-snug text-brand-ink">
              A flacidez acontece em camadas. O tratamento também.
            </p>
          </div>

          <div className="mt-8 max-w-md">
            <BotaoAgendar />
            <p className="mt-3 text-balance text-center text-[0.8rem] text-brand-muted">
              Entre em contato e informe a data de sua preferência
            </p>
          </div>

          {/* Tom emocional sem promessa: "já tentou de tudo" ou "recuperar a autoestima"
              insinuam resultado, o que o CFM veda em publicidade médica. */}
          <p className="font-display mt-9 max-w-md text-[1.75rem] font-medium leading-[1.15] text-brand-ink">
            Para você que decidiu se cuidar.{" "}
            <em className="italic text-brand-bronze">Sem cirurgia e sem agulhas.</em>
          </p>
        </div>

        <figure className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-brand-gold/55 bg-brand-chip px-6 py-2.5">
            <ScanFace className="h-4 w-4 text-brand-chip-foreground" aria-hidden />
            <span className="text-[0.72rem] font-semibold tracking-[0.26em] text-brand-chip-foreground">
              AVALIAÇÃO COMPLETA
            </span>
          </span>
          <div className="mt-7 w-full max-w-[340px] overflow-hidden rounded-3xl border border-brand-gold/20 bg-black shadow-2xl">
            <VideoLoop
              nome="loop-analise"
              rotulo="Paciente posiciona o rosto no aparelho de análise digital da pele, e a imagem do rosto aparece na tela"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <figcaption className="mt-4 max-w-[340px] text-[0.85rem] leading-relaxed text-brand-muted">
            Na Corradi Derma, a avaliação conta com{" "}
            <strong className="font-semibold text-brand-ink">análise digital da pele</strong>, para
            o plano partir do que o seu rosto realmente precisa.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
