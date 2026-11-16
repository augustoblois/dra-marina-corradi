import { Losango } from "@/components/Losango";

const MOTIVOS = [
  <>
    <strong className="font-semibold text-brand-ink">Ultrassom microfocado</strong> na camada de
    sustentação do rosto (SMAS), a mesma trabalhada no lifting cirúrgico
  </>,
  <>
    <strong className="font-semibold text-brand-ink">Radiofrequência</strong> na derme, para
    estimular colágeno e a firmeza da pele
  </>,
  <>
    Sem cortes, sem internação e com{" "}
    <strong className="font-semibold text-brand-ink">retorno à rotina no mesmo dia</strong>
  </>,
];

/**
 * Credenciais do protocolo, logo depois da abertura (mesma posição e formato da
 * LP de referência): um título curto, três motivos e o botão que leva para a
 * explicação da tecnologia.
 */
export function PorQueVolformer() {
  return (
    <section className="bg-brand-bg-soft px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-[2rem] font-medium leading-[1.08] text-brand-ink lg:text-[2.75rem]">
          Firmeza que se constrói <em className="italic text-brand-bronze">por dentro</em> da pele.
        </h2>

        <div className="mt-10 rounded-2xl border border-brand-gold/20 bg-brand-bg-elevated p-6 text-left shadow-sm max-[359px]:p-5 lg:p-10">
          <ul className="space-y-5">
            {MOTIVOS.map((motivo, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-[0.2rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand-gold">
                  <span className="h-2 w-2 rounded-full bg-brand-gold" />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-brand-muted lg:text-base">
                  {motivo}
                </p>
              </li>
            ))}
          </ul>

          <a
            href="#tecnologia"
            className="mt-9 flex w-full items-center justify-center rounded-xl bg-gold-gradient px-5 py-4 text-[0.92rem] font-semibold text-brand-espresso shadow-[var(--shadow-gold)] transition hover:brightness-105 max-[359px]:px-3 max-[359px]:text-[0.86rem]"
          >
            Como funciona o Volformer?
          </a>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[0.8rem] text-brand-muted">
            <Losango />
            Indicação só depois da avaliação individual com a Dra.&nbsp;Marina
          </p>
        </div>
      </div>
    </section>
  );
}
