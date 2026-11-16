import { MIDIAS, type NomeMidia } from "@/lib/midias.gen";

type Props = {
  nome: NomeMidia;
  alt: string;
  /** Quanto da tela a imagem ocupa, para o navegador escolher a largura certa. */
  sizes: string;
  className?: string;
  /** Só a imagem do topo (LCP): carrega já, com prioridade alta. */
  prioridade?: boolean;
  /** `object-position` quando o recorte do CSS precisa mirar no rosto. */
  posicao?: string;
};

/**
 * Toda foto da página passa por aqui: AVIF com WebP de reserva, larguras do
 * pipeline (`scripts/midias.py`) e `width`/`height` reais, para o navegador
 * reservar o espaço antes de baixar e a página não pular (CLS zero).
 */
export function Foto({ nome, alt, sizes, className, prioridade, posicao }: Props) {
  const m = MIDIAS[nome];
  const larguras: readonly number[] = m.larguras;
  const srcset = (ext: string) =>
    larguras.map((l) => `/media/${nome}-${l}.${ext} ${l}w`).join(", ");
  const maior = larguras[larguras.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`/media/${nome}-${maior}.webp`}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={prioridade ? "eager" : "lazy"}
        fetchPriority={prioridade ? "high" : "auto"}
        decoding={prioridade ? "sync" : "async"}
        className={className}
        style={posicao ? { objectPosition: posicao } : undefined}
      />
    </picture>
  );
}
