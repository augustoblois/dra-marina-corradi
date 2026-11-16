import { Instagram, Play } from "lucide-react";
import { Foto } from "@/components/Foto";
import { DRA, INSTAGRAM, INSTAGRAM_CLINICA } from "@/lib/marina";
import type { NomeMidia } from "@/lib/midias.gen";

const GRADIENTE_IG =
  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

type Post = { codigo: string; midia: NomeMidia; alt: string; video?: boolean };

/** Os 4 primeiros aparecem no celular; os 8, do tablet em diante. */
const POSTS: readonly Post[] = [
  {
    codigo: "DeovZGskfGM",
    midia: "ig-3",
    alt: "Retrato da Dra. Marina com a frase: a medicina faz parte de quem eu sou",
  },
  {
    codigo: "DaWMKwFlPb-",
    midia: "ig-4",
    alt: "Dra. Marina segurando o livro Dermatologia e Procedimentos Estéticos, do qual é autora de um capítulo",
  },
  {
    codigo: "DdFf_-jhlT0",
    midia: "ig-2",
    alt: "Vídeo: mulher de roupão branco mostra no celular uma foto do próprio rosto",
    video: true,
  },
  {
    codigo: "DaTgg_pD457",
    midia: "ig-5",
    alt: "Retrato da Dra. Marina com a frase: se cuidar por pressão ou se cuidar por escolha",
  },
  {
    codigo: "DaLyJSflKC-",
    midia: "ig-6",
    alt: "Dra. Marina de vestido vinho com a frase: o inverno começou, e esse pode ser o melhor momento para cuidar da pele",
  },
  {
    codigo: "DdE-iuLJ3Lr",
    midia: "ig-8",
    alt: "Vídeo gravado na Corradi Derma, com duas mulheres diante da janela com o selo da clínica",
    video: true,
  },
  {
    codigo: "DWSA0vxDy9U",
    midia: "ig-7",
    alt: "Post sobre a matéria do jornal O Globo com a Dra. Marina",
  },
  {
    codigo: "Deh2QqzDxsk",
    midia: "ig-1",
    alt: "Fotos de antes e depois de um tratamento facial, de frente e de perfil",
  },
];

export function NoInstagram() {
  return (
    <section id="instagram" className="bg-brand-cream">
      <div className="mx-auto max-w-[1100px] px-6 py-16 lg:px-16 lg:py-24">
        <div className="flex justify-center">
          <span
            className="inline-flex items-center gap-3 rounded-full px-5 py-2 text-[0.7rem] font-semibold tracking-[0.26em] text-white shadow-md"
            style={{ background: GRADIENTE_IG }}
          >
            <Instagram className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            INSTAGRAM
          </span>
        </div>

        <h2 className="font-display mt-6 text-center text-[2.3rem] font-medium leading-[1.06] text-brand-ink lg:text-[3rem]">
          Acompanhe a <em className="italic text-brand-bronze">Dra.&nbsp;Marina</em> no Instagram
        </h2>

        <a
          href={INSTAGRAM.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-9 flex max-w-[760px] items-center gap-4 rounded-2xl border border-brand-gold/25 bg-brand-bg-elevated px-4 py-4 shadow-md transition hover:-translate-y-0.5 hover:border-brand-gold/60 hover:shadow-[var(--shadow-gold)] sm:gap-6 sm:px-7 sm:py-5"
        >
          <span className="shrink-0 rounded-full p-[3px]" style={{ background: GRADIENTE_IG }}>
            <span className="block rounded-full bg-brand-bg-elevated p-[2px]">
              <Foto
                nome="ig-avatar"
                alt="Foto de perfil da Dra. Marina Corradi no Instagram"
                sizes="80px"
                className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
              />
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-display block truncate text-[1.25rem] font-semibold leading-tight text-brand-ink">
              @{INSTAGRAM.usuario}
            </span>
            <span className="mt-0.5 block text-[0.85rem] text-brand-muted">{DRA.nomeCompleto}</span>
            <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] text-brand-ink/80">
              <span>
                <strong className="font-semibold text-brand-ink">{INSTAGRAM.seguidores}</strong>{" "}
                seguidores
              </span>
              <span>
                <strong className="font-semibold text-brand-ink">{INSTAGRAM.publicacoes}</strong>{" "}
                publicações
              </span>
            </span>
          </span>
          <span
            className="hidden shrink-0 rounded-full px-5 py-2 text-xs font-semibold text-white shadow-md transition group-hover:brightness-110 md:inline-flex"
            style={{ background: GRADIENTE_IG }}
          >
            Seguir
          </span>
        </a>

        <ul className="mx-auto mt-6 grid max-w-[760px] grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {POSTS.map((post, i) => (
            <li key={post.codigo} className={i >= 4 ? "hidden md:block" : undefined}>
              <a
                href={`https://www.instagram.com/p/${post.codigo}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-xl border border-brand-gold/20 bg-brand-bg-elevated shadow-lg transition duration-300 hover:-translate-y-1 hover:border-brand-gold/60"
              >
                <Foto
                  nome={post.midia}
                  alt={post.alt}
                  sizes="(min-width: 768px) 190px, 46vw"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10"
                />
                {post.video && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white/80"
                    style={{ background: GRADIENTE_IG }}
                  >
                    <Play
                      className="h-3.5 w-3.5 translate-x-[1px] fill-white text-white"
                      strokeWidth={0}
                    />
                  </span>
                )}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2.5 text-white"
                >
                  <Instagram className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span className="truncate text-[0.68rem] font-semibold tracking-wide">
                    @{INSTAGRAM.usuario}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col items-center gap-4">
          <a
            href={INSTAGRAM.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[0.95rem] font-semibold text-white shadow-lg transition hover:brightness-110 max-[359px]:px-5 max-[359px]:text-[0.9rem]"
            style={{ background: GRADIENTE_IG }}
          >
            <Instagram className="h-5 w-5" strokeWidth={2} aria-hidden />
            Seguir @{INSTAGRAM.usuario}
          </a>
          <a
            href={INSTAGRAM_CLINICA.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.88rem] text-brand-muted underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-ink"
          >
            E a clínica: @{INSTAGRAM_CLINICA.usuario}
          </a>
        </div>
      </div>
    </section>
  );
}
