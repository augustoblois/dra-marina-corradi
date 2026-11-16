import { Check, ListChecks } from "lucide-react";
import { BotaoAgendar } from "@/components/BotaoAgendar";

/** O que a paciente percebe no espelho. Negrito é o sinal; o resto, o contexto. */
const SINAIS = [
  {
    sinal: "Contorno do rosto menos definido",
    contexto: ", com a linha da mandíbula perdendo a nitidez.",
  },
  { sinal: "Papada e pescoço mais soltos", contexto: ", que aparecem mais nas fotos de perfil." },
  { sinal: "Flacidez depois de emagrecer", contexto: ", inclusive com as canetas emagrecedoras." },
  { sinal: "Pele sem a firmeza de antes", contexto: ", deixando o rosto com aspecto cansado." },
] as const;

/**
 * Para quem é (o "Para você, que sofre com:" das LPs de referência). Vem depois
 * dos resultados: a paciente acabou de ver a diferença e confere se o caso dela
 * está aqui. Cada cartão abre com o sinal em negrito e segue em tom mais baixo,
 * para quem lê de passagem pegar só os negritos.
 *
 * CFM: a lista descreve indicações, sem prometer resultado, e o fecho manda para
 * a avaliação, que é onde a indicação se confirma.
 */
export function ParaVoce() {
  return (
    <section id="indicacoes" className="bg-brand-bg-soft px-6 py-16 lg:px-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-3 rounded-full border border-brand-gold/55 bg-brand-chip px-5 py-2 text-[0.68rem] font-semibold tracking-[0.26em] text-brand-chip-foreground">
            <ListChecks className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            PRINCIPAIS INDICAÇÕES
          </span>
          <h2 className="font-display mt-6 text-[2.5rem] font-medium leading-[1.02] text-brand-ink lg:text-[3.4rem]">
            Você se <em className="italic text-brand-bronze">reconhece</em> aqui?
          </h2>
          <span className="mt-5 block h-[2px] w-20 bg-gold-gradient" />
          <p className="mt-6 max-w-sm text-[1.1rem] leading-relaxed text-brand-muted lg:text-[1.2rem]">
            Os sinais que o Volformer trata, do jeito que eles aparecem no espelho.
          </p>
        </div>

        <div>
          <ul className="space-y-3">
            {SINAIS.map((s) => (
              <li
                key={s.sinal}
                className="flex items-start gap-4 rounded-2xl border border-brand-gold/25 bg-brand-bg-elevated px-5 py-4 shadow-sm"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-brand-espresso shadow-[var(--shadow-gold)]"
                >
                  <Check className="h-4 w-4" strokeWidth={2.6} />
                </span>
                <p className="text-[0.98rem] leading-relaxed text-brand-muted">
                  <strong className="font-semibold text-brand-ink">{s.sinal}</strong>
                  {s.contexto}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[1rem] leading-relaxed text-brand-muted">
            Se você se reconheceu em algum deles, o próximo passo é a avaliação: a Dra.&nbsp;Marina
            examina o seu rosto e confirma se o Volformer é{" "}
            <strong className="font-semibold text-brand-ink">indicado para você</strong>.
          </p>
          <div className="mt-6 max-w-md">
            <BotaoAgendar texto="Quero saber se é para mim" />
          </div>
        </div>
      </div>
    </section>
  );
}
