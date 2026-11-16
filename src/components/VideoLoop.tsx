import { useEffect, useRef } from "react";
import { MIDIAS, type NomeMidia } from "@/lib/midias.gen";

/** URL do pôster de um vídeo do pipeline, na maior largura gerada. */
function posterDe(nome: NomeMidia) {
  const larguras: readonly number[] = MIDIAS[nome].larguras;
  return `/media/${nome}-poster-${larguras[larguras.length - 1]}.webp`;
}

type Props = {
  nome: NomeMidia;
  /** Descrição do que acontece no trecho, para leitor de tela. */
  rotulo: string;
  className?: string;
};

/**
 * Trecho curto, mudo e em loop, no lugar de um GIF (o H.264 pesa uma fração
 * do GIF e não perde cor).
 *
 * O vídeo só começa a baixar quando chega perto da tela e pausa quando sai,
 * para não gastar dados nem bateria. Com "reduzir movimento" ligado no
 * aparelho, fica só o pôster (o primeiro quadro) e nada é baixado.
 *
 * O pôster também espera: no HTML do servidor, os pôsteres de todos os vídeos
 * baixavam junto com a abertura (uns 180 KB disputando banda com a foto dela).
 */
export function VideoLoop({ nome, rotulo, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const m = MIDIAS[nome];

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Num carrossel de deslizar, o cartão fora da tela na horizontal nunca
    // "chega perto" para o observador: vigia o carrossel inteiro, assim o
    // pôster já está pronto quando a paciente desliza.
    const alvoPoster = video.closest("ul, ol") ?? video;
    const perto = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        video.poster = posterDe(nome);
        perto.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    perto.observe(alvoPoster);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => perto.disconnect();
    }
    // O React não garante o atributo `muted` no HTML do servidor, e o navegador
    // só dá play automático em vídeo mudo: fixa aqui antes do primeiro play.
    video.muted = true;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          if (!video.getAttribute("src")) video.src = `/media/${nome}.mp4`;
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observador.observe(video);
    return () => {
      perto.disconnect();
      observador.disconnect();
    };
  }, [nome]);

  return (
    <video
      ref={ref}
      width={m.w}
      height={m.h}
      muted
      loop
      playsInline
      preload="none"
      aria-label={rotulo}
      className={className}
    />
  );
}
