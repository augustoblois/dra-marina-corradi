import { BotaoAgendar } from "@/components/BotaoAgendar";
import { Foto } from "@/components/Foto";
import { Losango } from "@/components/Losango";
import { DRA } from "@/lib/marina";

/**
 * Formação e licenças, do jeito que ela mesma publica (posts de competências).
 * O título de cada uma vai em negrito, para a lista ser lida de passagem.
 */
const FORMACAO = [
  {
    titulo: "Pós-graduação em Injetáveis",
    resto: " com Dr. Matheus Arantes (Beleza Funcional)",
  },
  { titulo: "Fellow 2025", resto: " na Faculdade Boggio" },
  { titulo: "Autora de capítulo", resto: " do livro “Dermatologia e Procedimentos Estéticos”" },
  {
    titulo: "Licenciada GoldIncision",
    resto: " e curso de Harmonização Glútea com Dr. Roberto Chacur, em Lisboa",
  },
  { titulo: "Licenciada APTOS", resto: " para fios Excellence e Light Lift" },
  { titulo: "Embaixadora XERF", resto: " e parceira MedSystems" },
  { titulo: "Congressos internacionais", resto: " de atualização, como IMCAS e AMWC" },
] as const;

/**
 * Quem é a médica. O título é o lema que fecha os posts dela ("beleza com
 * verdade e saúde"): a seção apresenta a pessoa pelas palavras dela.
 */
export function DraMarina() {
  return (
    <section id="dra-marina" className="bg-brand-bg-soft px-6 py-16 lg:px-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="overflow-hidden rounded-[2rem] border border-brand-gold/25 shadow-[var(--shadow-soft)]">
            <Foto
              nome="dra-vinho"
              alt="Dra. Marina Corradi sorrindo, de vestido vinho, em retrato de estúdio"
              sizes="(min-width: 1024px) 460px, calc(100vw - 48px)"
              posicao="50% 15%"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-brand-gold/30 bg-brand-bg-elevated/95 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur sm:right-auto">
            <p className="font-display text-[1.45rem] font-semibold leading-none text-brand-ink">
              {DRA.nome}
            </p>
            <p className="rotulo mt-2 text-brand-bronze">{DRA.registro}</p>
          </div>
        </div>

        <div className="pt-4 lg:pt-0">
          <p className="rotulo text-brand-bronze">Quem vai cuidar de você</p>
          <h2 className="font-display mt-4 text-[2.5rem] font-medium leading-[1.02] text-brand-ink lg:text-[3.3rem]">
            Beleza com <em className="italic text-brand-bronze">verdade</em> e saúde.
          </h2>
          <span className="mt-5 block h-[2px] w-20 bg-gold-gradient" />
          <p className="mt-6 text-[1rem] leading-relaxed text-brand-muted">
            Antes da medicina, a Dra.&nbsp;Marina veio da arquitetura. Daí o olhar para{" "}
            <strong className="font-semibold text-brand-ink">proporção e estrutura</strong> que ela
            leva para cada rosto. Hoje está à frente da{" "}
            <strong className="font-semibold text-brand-ink">Corradi Derma Health Clinic</strong>,
            em Itu, onde{" "}
            <strong className="font-semibold text-brand-ink">
              avalia, planeja e aplica pessoalmente
            </strong>{" "}
            o protocolo Volformer.
          </p>

          <ul className="mt-7 space-y-3">
            {FORMACAO.map((item) => (
              <li
                key={item.titulo}
                className="flex items-start gap-3 text-[0.92rem] leading-snug text-brand-muted"
              >
                <Losango className="mt-[0.4rem]" />
                <span>
                  <strong className="font-semibold text-brand-ink">{item.titulo}</strong>
                  {item.resto}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 max-w-md">
            <BotaoAgendar texto="Agendar com a Dra. Marina" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 lg:mt-20 lg:gap-5">
        <div className="overflow-hidden rounded-2xl border border-brand-gold/20 shadow-xl">
          <Foto
            nome="dra-sentada"
            alt="Dra. Marina Corradi sentada, de blusa preta, em retrato de estúdio"
            sizes="(min-width: 1152px) 560px, 50vw"
            posicao="50% 20%"
            className="aspect-[3/4] h-full w-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border border-brand-gold/20 shadow-xl">
          <Foto
            nome="clinica-poltrona"
            alt="Dra. Marina Corradi de vestido branco, sentada na poltrona de couro caramelo da Corradi Derma, ao lado da porta de madeira"
            sizes="(min-width: 1152px) 560px, 50vw"
            posicao="50% 30%"
            className="aspect-[3/4] h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
