import { useId, useState } from "react";
import { HelpCircle, Minus, Plus } from "lucide-react";
import { BotaoAgendar } from "@/components/BotaoAgendar";
import { DUVIDAS } from "@/lib/duvidas";

/**
 * "Dra. Marina" sem quebra de linha no meio. Fica aqui, na hora de mostrar, e
 * não no texto: o mesmo texto vai para o JSON-LD e o llms.txt.
 */
const semPartir = (texto: string) => texto.replaceAll("Dra. Marina", "Dra. Marina");

export function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duvidas" className="bg-brand-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-brand-gold/60 px-5 py-2 text-[0.68rem] font-semibold tracking-[0.26em] text-brand-bronze">
            <HelpCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            ALGUMA DÚVIDA?
          </span>
        </div>
        <h2 className="font-display mt-6 text-center text-[2.3rem] font-medium leading-[1.06] text-brand-ink lg:text-[3rem]">
          Separamos as <em className="italic text-brand-bronze">perguntas mais comuns</em> para
          você.
        </h2>

        <ul className="mt-10 space-y-3">
          {DUVIDAS.map((d, i) => {
            const aberto = aberta === i;
            const idBotao = `${base}-pergunta-${i}`;
            const idPainel = `${base}-resposta-${i}`;
            return (
              <li
                key={d.pergunta}
                className="rounded-2xl border border-brand-gold/25 bg-brand-bg-elevated"
              >
                <h3>
                  <button
                    id={idBotao}
                    type="button"
                    aria-expanded={aberto}
                    aria-controls={idPainel}
                    onClick={() => setAberta(aberto ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left lg:px-7 lg:py-5"
                  >
                    <span className="text-[1rem] font-semibold leading-snug text-brand-ink lg:text-[1.08rem]">
                      {d.pergunta}
                    </span>
                    <span
                      aria-hidden
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        aberto
                          ? "bg-gold-gradient text-brand-espresso"
                          : "border border-brand-gold/50 text-brand-bronze"
                      }`}
                    >
                      {aberto ? (
                        <Minus className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                      )}
                    </span>
                  </button>
                </h3>
                <div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBotao}
                  hidden={!aberto}
                  className="px-5 pb-5 lg:px-7 lg:pb-6"
                >
                  <div className="mb-4 h-px bg-brand-gold/25" />
                  <p className="text-[0.95rem] leading-relaxed text-brand-muted">
                    <strong className="font-semibold text-brand-ink">{semPartir(d.curta)}</strong>{" "}
                    {semPartir(d.resposta)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="mb-4 text-[0.92rem] text-brand-muted">
            Não encontrou a sua pergunta? A equipe responde pelo WhatsApp.
          </p>
          <BotaoAgendar texto="Falar com a clínica" />
        </div>
      </div>
    </section>
  );
}
