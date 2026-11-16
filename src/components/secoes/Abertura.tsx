import { ArrowDown } from "lucide-react";
import { Foto } from "@/components/Foto";
import { Losango } from "@/components/Losango";
import { DRA, INSTAGRAM } from "@/lib/marina";

/**
 * O que a paciente precisa entender nos primeiros segundos, antes de rolar.
 * Quem passa o olho lê só os negritos: o quê, para quê e com quem.
 */
const forte = "font-semibold text-brand-cream lg:text-brand-ink";
const DESTAQUES = [
  <>
    <strong className={forte}>Ultrassom microfocado e radiofrequência</strong>, na mesma sessão
  </>,
  <>
    Para <strong className={forte}>flacidez do rosto, contorno da mandíbula e papada</strong>
  </>,
  <>
    Aplicado pela <strong className={forte}>própria Dra.&nbsp;Marina</strong>, na Corradi Derma, em
    Itu-SP
  </>,
];

/**
 * Abertura (hero). Mesma jornada da LP de referência: a foto da médica ocupa a
 * tela do celular, o título entra por cima do degradê e o único botão leva às
 * provas (resultados), não ao agendamento. Quem ainda não viu resultado não
 * agenda; quem viu, agenda nas seções seguintes.
 *
 * Um título só (h1) para celular e computador: no celular ele sobe para cima da
 * foto com margem negativa; no computador a foto vira a metade direita.
 */
export function Abertura() {
  return (
    <section className="relative overflow-hidden bg-brand-espresso lg:bg-brand-cream">
      <div className="relative h-[min(72svh,640px)] min-h-[480px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[58%]">
        <Foto
          nome="dra-hero"
          alt="Dra. Marina Corradi de blazer risca de giz, em retrato de estúdio"
          sizes="(min-width: 1024px) 58vw, 100vw"
          prioridade
          posicao="50% 12%"
          className="h-full w-full object-cover"
        />
        {/* Celular: escurece o pé da foto para o título em marfim passar no contraste. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.2 0.018 50 / 0.45) 0%, transparent 20%, transparent 38%, oklch(0.2 0.018 50 / 0.74) 60%, var(--brand-espresso) 96%)",
          }}
        />
        {/* Computador: a foto se dissolve no marfim do lado do texto. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, var(--brand-cream) 0%, oklch(0.975 0.008 78 / 0.55) 16%, transparent 38%)",
          }}
        />
        <p className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-brand-gold/60 bg-brand-espresso/45 px-4 py-1.5 backdrop-blur-md lg:hidden">
          <Losango />
          <span className="text-[0.62rem] font-semibold tracking-[0.32em] text-white">
            @{INSTAGRAM.usuario}
          </span>
          <Losango />
        </p>
      </div>

      <div className="relative z-10 mx-auto -mt-56 max-w-[1400px] px-6 pb-12 sm:px-10 lg:mt-0 lg:flex lg:min-h-[min(100svh,820px)] lg:items-center lg:px-16 lg:py-20">
        <div className="lg:max-w-[460px] xl:max-w-[540px]">
          {/* No celular, nome e CRM em duas linhas inteiras (sem o número órfão). */}
          <p className="rotulo leading-relaxed text-brand-gold lg:text-brand-bronze">
            <span className="block sm:inline">{DRA.nome}</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">{DRA.crm}</span>
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.1rem,9.6vw,2.6rem)] font-medium leading-[1.04] text-brand-cream lg:text-[3.25rem] lg:text-brand-ink xl:text-[3.75rem]">
            Protocolo Volformer:{" "}
            <em className="italic text-brand-gold-bright lg:text-brand-bronze">efeito lifting</em>{" "}
            sem cirurgia e sem agulhas.
          </h1>
          <div className="mt-5 h-px w-24 bg-gradient-to-r from-brand-gold via-brand-gold/40 to-transparent" />

          <ul className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md lg:border-brand-sand lg:bg-brand-bg-elevated/80 lg:px-5 lg:shadow-[var(--shadow-soft)]">
            {DESTAQUES.map((destaque, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[0.9rem] leading-snug text-brand-cream/80 lg:text-brand-muted"
              >
                <Losango className="mt-[0.45rem]" />
                <span>{destaque}</span>
              </li>
            ))}
          </ul>

          <a
            href="#resultados"
            className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gold-gradient px-6 py-4 text-[0.95rem] font-semibold text-brand-espresso shadow-[var(--shadow-gold)] transition hover:brightness-105 lg:inline-flex lg:w-auto lg:rounded-full lg:px-8"
          >
            Quero ver os resultados
            <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
