import { MapPin, Navigation } from "lucide-react";
import { Foto } from "@/components/Foto";
import { VideoLoop } from "@/components/VideoLoop";
import { CLINICA, MAPS_URL, WAZE_URL } from "@/lib/marina";
import type { NomeMidia } from "@/lib/midias.gen";

type Parada = {
  titulo: string;
  texto: string;
  midia: NomeMidia;
  video?: boolean;
  alt: string;
};

/** O tour, na ordem em que a paciente anda pela clínica. */
const TOUR: readonly Parada[] = [
  {
    titulo: "A chegada",
    texto: "A fachada na Av. Barata Ribeiro, com o totem da clínica na entrada.",
    midia: "clinica-fachada",
    alt: "Fachada da Corradi Derma Health Clinic ao entardecer, com o totem de madeira da clínica",
  },
  {
    titulo: "A recepção",
    texto: "Painel de madeira com o nome da clínica em dourado e um banco para chegar com calma.",
    midia: "clinica-painel-ouro",
    alt: "Recepção com painel de ripas de madeira, o nome Corradi Derma em dourado e banco com almofadas",
  },
  {
    titulo: "O lounge",
    texto: "Sofá, luz quente e o selo da clínica iluminado na parede.",
    midia: "clinica-lounge",
    alt: "Lounge com sofá branco, mesa de madeira e o selo iluminado da Corradi Derma na parede",
  },
  {
    titulo: "Poltronas de massagem",
    texto: "Um momento de pausa antes ou depois do procedimento.",
    midia: "loop-poltrona",
    video: true,
    alt: "Paciente relaxando na poltrona de massagem com um capacete de luz na cabeça",
  },
  {
    titulo: "Café Health",
    texto: "Um cantinho para tomar um café enquanto espera.",
    midia: "clinica-cafe-health",
    alt: "Café Health com prateleiras de madeira iluminadas, luminária de palha e porta de madeira entalhada",
  },
  {
    titulo: "Tratamentos capilares",
    texto: "Tecnologia de luz para o couro cabeludo, com conforto.",
    midia: "loop-capacete",
    video: true,
    alt: "Capacete de luz sendo colocado na cabeça de uma paciente sentada na poltrona",
  },
  {
    titulo: "Salas de procedimento",
    texto: "Claras, amplas e preparadas para cada tecnologia.",
    midia: "clinica-sala",
    alt: "Sala de procedimentos com macas bege, bancada de madeira e janela ampla",
  },
  {
    titulo: "Os aparelhos",
    texto: "Os equipamentos do Volformer e de outros protocolos, lado a lado.",
    midia: "loop-maquinas",
    video: true,
    alt: "Aparelhos brancos de tecnologia estética lado a lado na sala de procedimentos",
  },
  {
    titulo: "Os detalhes",
    texto: "O selo da Corradi Derma recortado na janela, de frente para o pôr do sol.",
    midia: "clinica-janela",
    alt: "Janela redonda com o selo da Corradi Derma recortado em metal dourado e o céu do entardecer ao fundo",
  },
];

/**
 * Localização como imersão: primeiro a fachada à noite ocupando a tela, depois
 * um tour para deslizar com o dedo, ambiente por ambiente, e no fim o endereço
 * com os botões de rota. A ideia é a paciente chegar já conhecendo a clínica.
 */
export function CorradiDerma() {
  return (
    <section id="clinica" className="bg-brand-espresso text-brand-cream">
      <div className="relative h-[min(82svh,760px)] min-h-[520px] overflow-hidden">
        <Foto
          nome="clinica-noite"
          alt="Fachada da Corradi Derma Health Clinic à noite, com as luzes quentes acesas e o selo iluminado"
          sizes="100vw"
          posicao="50% 40%"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.2 0.018 50 / 0.35) 0%, transparent 25%, transparent 45%, oklch(0.2 0.018 50 / 0.8) 75%, var(--brand-espresso) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-10 lg:px-16">
          <p className="rotulo text-brand-gold">Localização</p>
          <h2 className="font-display mt-3 text-[2.6rem] font-medium leading-[1.02] lg:text-[3.8rem]">
            Entre na <em className="italic text-brand-gold-bright">Corradi Derma</em>.
          </h2>
          <p className="mt-4 flex items-start gap-2 text-[0.95rem] leading-snug text-brand-cream/85">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
            <span>
              {CLINICA.endereco}
              <br />
              {CLINICA.bairro} · {CLINICA.cidade}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-4 lg:px-16">
        <p className="max-w-xl text-[1rem] leading-relaxed text-brand-cream/75">
          Do café da recepção às poltronas de massagem, cada ambiente foi pensado para você{" "}
          <strong className="font-semibold text-brand-cream">
            chegar, desacelerar e ser cuidada
          </strong>
          . A tecnologia fica nas salas; o acolhimento, em todo lugar.
        </p>
        <p className="rotulo mt-8 text-brand-gold/90" aria-hidden>
          Deslize para conhecer →
        </p>
      </div>

      <ol
        className="mt-5 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto scroll-smooth px-6 pb-6 [scrollbar-width:none] lg:scroll-px-16 lg:px-16 [&::-webkit-scrollbar]:hidden"
        aria-label="Tour pelos ambientes da Corradi Derma"
      >
        {TOUR.map((parada, i) => (
          <li key={parada.midia} className="w-[78vw] max-w-[330px] shrink-0 snap-start">
            <div className="overflow-hidden rounded-3xl border border-brand-gold/20 bg-black">
              {parada.video ? (
                <VideoLoop
                  nome={parada.midia}
                  rotulo={parada.alt}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <Foto
                  nome={parada.midia}
                  alt={parada.alt}
                  sizes="(min-width: 640px) 330px, 78vw"
                  className="aspect-[3/4] w-full object-cover"
                />
              )}
            </div>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-[1.1rem] italic text-brand-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[1.45rem] font-medium leading-none">
                {parada.titulo}
              </span>
            </p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-brand-cream/70">
              {parada.texto}
            </p>
          </li>
        ))}
      </ol>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 lg:px-16 lg:pb-24">
        <div className="rounded-3xl border border-brand-gold/25 bg-white/[0.04] p-6 lg:flex lg:items-center lg:justify-between lg:p-8">
          <div>
            <p className="font-display text-[1.6rem] font-medium leading-tight">
              {CLINICA.nomeCompleto}
            </p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-brand-cream/75">
              {CLINICA.endereco} · {CLINICA.bairro}
              <br />
              {CLINICA.cidade}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cream px-5 py-3.5 text-[0.88rem] font-semibold text-brand-espresso transition hover:brightness-95"
            >
              <MapPin className="h-4 w-4" aria-hidden />
              Google Maps
            </a>
            <a
              href={WAZE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-cream/40 px-5 py-3.5 text-[0.88rem] font-semibold text-brand-cream transition hover:bg-white/5"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              Waze
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
