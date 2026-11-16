import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { MIDIAS, type NomeMidia } from "@/lib/midias.gen";

/**
 * Visor em tela cheia: tocar numa foto de antes e depois abre a foto grande,
 * com pinça para ampliar e deslize para trocar. Portado do visor do Special
 * Homes (components/visor.tsx), onde os defeitos abaixo foram medidos e
 * corrigidos.
 *
 * Ele é um diálogo modal de verdade: role="dialog", foco que entra ao abrir,
 * Tab preso dentro, Esc que fecha e foco que volta para a foto de origem.
 * O desenho fica em styles.css, nas classes .visor-*.
 *
 * Gestos (nenhum é do navegador: o palco usa touch-action none, senão a pinça
 * amplia a PÁGINA inteira por baixo do diálogo):
 *   roda do mouse      amplia e reduz, ancorada no ponteiro
 *   dois dedos         pinça, ancorada no meio dos dois
 *   um dedo ampliado   arrasta a imagem
 *   um dedo em repouso arrasto para o lado troca de imagem
 *   duplo clique       alterna entre repouso e meia ampliação
 *   setas / Esc        anterior e próxima / fecha
 *   toque no vazio     fecha
 */

export type ItemVisor = {
  nome: NomeMidia;
  alt: string;
  legenda: string;
};

type Props = {
  itens: readonly ItemVisor[];
  /** Índice aberto, ou null com o visor fechado. */
  indice: number | null;
  definirIndice: (i: number | null) => void;
  /** Botão que abriu o visor. Recebe o foco de volta ao fechar. */
  origemRef: RefObject<HTMLButtonElement | null>;
  /** Nome do conjunto, para o leitor de tela. */
  titulo: string;
  /** Linha fixa embaixo da legenda (o aviso educativo do antes e depois). */
  nota?: string;
};

const ZOOM_MAX = 4;
/** Arrasto horizontal, em px, que conta como trocar de imagem. */
const LIMIAR_SWIPE = 60;
/**
 * Fator exponencial por unidade de roda: o mouse entrega deltaY de 100 por
 * entalhe e o trackpad de 3 a 10. Multiplicando, os dois ampliam a mesma
 * distância, cada um no seu número de eventos.
 */
const PASSO_RODA = 0.0022;

/** Escala e deslocamento num estado só: o zoom ancorado calcula os dois na mesma conta. */
type Vista = { escala: number; x: number; y: number };
const REPOUSO: Vista = { escala: 1, x: 0, y: 0 };

export function Visor({ itens, indice, definirIndice, origemRef, titulo, nota }: Props) {
  const dialogoRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const imagemRef = useRef<HTMLImageElement>(null);
  const aberto = indice !== null;

  // O gesto em andamento fica em refs: um setState por evento de ponteiro
  // renderizaria dezenas de vezes por segundo à toa.
  const [vista, setVista] = useState<Vista>(REPOUSO);
  const ponteiros = useRef(new Map<number, { x: number; y: number }>());
  const gesto = useRef({ distancia: 0, x: 0, y: 0, arrastou: false });

  const fechar = useCallback(() => definirIndice(null), [definirIndice]);

  const andar = useCallback(
    (passo: number) => {
      if (indice === null) return;
      // Circular: travar no fim, num diálogo sem rolagem, parece defeito.
      definirIndice((indice + passo + itens.length) % itens.length);
    },
    [indice, itens.length, definirIndice],
  );

  /**
   * O ponto escolhido pelo gesto fica parado e a imagem cresce em volta dele.
   * Com p medido do centro do palco, o ponto da imagem sob o cursor é
   * (p - d) / s; para continuar em p na escala s', o deslocamento vira
   * p - (p - d) * s'/s. O resultado é limitado à sobra real da imagem, senão
   * um gesto na borda joga a foto para fora da tela.
   */
  const aplicarZoom = useCallback((fator: number, ponto?: { x: number; y: number }) => {
    const palco = palcoRef.current;
    if (!palco) return;
    const caixa = palco.getBoundingClientRect();
    const px = ponto ? ponto.x - (caixa.left + caixa.width / 2) : 0;
    const py = ponto ? ponto.y - (caixa.top + caixa.height / 2) : 0;
    // offsetWidth é o tamanho SEM transform, o da imagem em repouso.
    const largura = imagemRef.current?.offsetWidth ?? 0;
    const altura = imagemRef.current?.offsetHeight ?? 0;

    setVista((v) => {
      const escala = Math.min(ZOOM_MAX, Math.max(1, v.escala * fator));
      if (escala === v.escala) return v;
      const x = px - ((px - v.x) * escala) / v.escala;
      const y = py - ((py - v.y) * escala) / v.escala;
      const sobraX = Math.max(0, (largura * escala - caixa.width) / 2);
      const sobraY = Math.max(0, (altura * escala - caixa.height) / 2);
      return {
        escala,
        x: Math.min(sobraX, Math.max(-sobraX, x)),
        y: Math.min(sobraY, Math.max(-sobraY, y)),
      };
    });
  }, []);

  const alternarZoom = (ponto?: { x: number; y: number }) =>
    vista.escala > 1 ? setVista(REPOUSO) : aplicarZoom(ZOOM_MAX / 2, ponto);

  // Trocar de imagem volta ao repouso. Ajuste durante a render (padrão do React
  // para estado que reage a outro estado): num efeito, a imagem nova chegava a
  // aparecer por um quadro com o zoom da anterior.
  const [indiceRenderizado, setIndiceRenderizado] = useState(indice);
  if (indice !== indiceRenderizado) {
    setIndiceRenderizado(indice);
    setVista(REPOUSO);
  }

  useEffect(() => {
    ponteiros.current.clear();
  }, [indice]);

  // Ciclo de vida do diálogo, só com `aberto` na dependência. Com `andar` aqui,
  // cada troca de imagem limpava o efeito, a limpeza devolvia o foco à origem
  // e o navegador rolava a página até ela, por baixo do visor.
  useEffect(() => {
    if (!aberto) return;
    const dialogo = dialogoRef.current;
    // Copiada na abertura: abrir outra foto reescreve o ref antes da limpeza.
    const origem = origemRef.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogo?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      document.body.style.overflow = overflowAnterior;
      origem?.focus({ preventScroll: true });
    };
  }, [aberto, origemRef]);

  // Teclado: remonta a cada troca de imagem, e isso é inofensivo.
  useEffect(() => {
    if (!aberto) return;
    const dialogo = dialogoRef.current;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") return fechar();
      if (e.key === "ArrowRight") return andar(1);
      if (e.key === "ArrowLeft") return andar(-1);
      if (e.key !== "Tab" || !dialogo) return;
      const lista = Array.from(dialogo.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (lista.length === 0) return;
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, fechar, andar]);

  // Roda do mouse com ouvinte nativo NÃO passivo: o onWheel do React é passivo
  // e não pode chamar preventDefault, e aí o Ctrl+roda ampliava a página inteira.
  useEffect(() => {
    const palco = palcoRef.current;
    if (!aberto || !palco) return;
    const aoRolar = (e: WheelEvent) => {
      e.preventDefault();
      aplicarZoom(Math.exp(-e.deltaY * PASSO_RODA), { x: e.clientX, y: e.clientY });
    };
    palco.addEventListener("wheel", aoRolar, { passive: false });
    return () => palco.removeEventListener("wheel", aoRolar);
  }, [aberto, aplicarZoom]);

  const doisPonteiros = () => Array.from(ponteiros.current.values());

  const aoDescer = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Gesto que começa num botão é do botão: com a captura abaixo, o clique da
    // seta era redirecionado ao palco e contava como "toque no vazio", fechando o visor.
    if (e.target instanceof Element && e.target.closest("button")) return;
    try {
      // Captura para não perder o movimento quando o dedo sai do palco.
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ponteiro já cancelado: segue sem captura */
    }
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesto.current.arrastou = false;
    gesto.current.x = e.clientX;
    gesto.current.y = e.clientY;
    if (ponteiros.current.size === 2) {
      const [a, b] = doisPonteiros();
      gesto.current.distancia = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const aoMover = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!ponteiros.current.has(e.pointerId)) return;
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (ponteiros.current.size === 2 && gesto.current.distancia > 0) {
      const [a, b] = doisPonteiros();
      const agora = Math.hypot(a.x - b.x, a.y - b.y);
      const razao = agora / gesto.current.distancia;
      gesto.current.distancia = agora;
      gesto.current.arrastou = true;
      aplicarZoom(razao, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      return;
    }
    if (ponteiros.current.size !== 1) return;

    const dx = e.clientX - gesto.current.x;
    const dy = e.clientY - gesto.current.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) gesto.current.arrastou = true;

    // Ampliada, um dedo arrasta a imagem (com o mesmo limite do zoom). Em
    // repouso o arrasto não move nada: vira troca de imagem ao soltar.
    if (vista.escala > 1) {
      gesto.current.x = e.clientX;
      gesto.current.y = e.clientY;
      const caixa = palcoRef.current?.getBoundingClientRect();
      const largura = imagemRef.current?.offsetWidth ?? 0;
      const altura = imagemRef.current?.offsetHeight ?? 0;
      setVista((v) => {
        const sobraX = caixa ? Math.max(0, (largura * v.escala - caixa.width) / 2) : 0;
        const sobraY = caixa ? Math.max(0, (altura * v.escala - caixa.height) / 2) : 0;
        return {
          escala: v.escala,
          x: Math.min(sobraX, Math.max(-sobraX, v.x + dx)),
          y: Math.min(sobraY, Math.max(-sobraY, v.y + dy)),
        };
      });
    }
  };

  const aoSubir = (e: ReactPointerEvent<HTMLDivElement>) => {
    const inicio = ponteiros.current.get(e.pointerId);
    const eraUnico = ponteiros.current.size === 1;
    const arrastou = gesto.current.arrastou;
    ponteiros.current.delete(e.pointerId);
    if (ponteiros.current.size < 2) gesto.current.distancia = 0;
    if (!inicio || !eraUnico) return;

    // Toque no vazio em volta da foto fecha, só em repouso e sem arrasto.
    if (!arrastou && vista.escala === 1 && e.target === e.currentTarget) {
      fechar();
      return;
    }
    if (vista.escala > 1) return;
    const dx = e.clientX - gesto.current.x;
    if (Math.abs(dx) >= LIMIAR_SWIPE) andar(dx < 0 ? 1 : -1);
  };

  const item = indice === null ? null : itens[indice];
  const posicao = indice === null ? 0 : indice + 1;
  const ampliado = vista.escala > 1;
  const midia = item ? MIDIAS[item.nome] : null;
  const larguras: readonly number[] = midia ? midia.larguras : [];
  const srcset = (ext: string) =>
    item ? larguras.map((l) => `/media/${item.nome}-${l}.${ext} ${l}w`).join(", ") : "";

  return (
    // `hidden` em vez de desmontar: com o nó no DOM, o ref já existe quando o
    // efeito de abertura roda e o foco consegue entrar.
    <div
      ref={dialogoRef}
      role="dialog"
      aria-modal="true"
      aria-label={item ? item.legenda : titulo}
      hidden={!aberto}
      className="visor"
    >
      {item && midia ? (
        <>
          <div className="visor-barra">
            <span className="visor-contagem">
              {posicao} de {itens.length}
            </span>
            <div className="visor-barra-acoes">
              <button
                type="button"
                className="visor-icone"
                onClick={() => alternarZoom()}
                aria-label={ampliado ? "Reduzir a imagem" : "Ampliar a imagem"}
              >
                {ampliado ? (
                  <Minus className="h-5 w-5" aria-hidden />
                ) : (
                  <Plus className="h-5 w-5" aria-hidden />
                )}
              </button>
              <button type="button" className="visor-icone" onClick={fechar} aria-label="Fechar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>

          <div
            ref={palcoRef}
            className="visor-palco"
            data-ampliado={ampliado || undefined}
            onPointerDown={aoDescer}
            onPointerMove={aoMover}
            onPointerUp={aoSubir}
            onPointerCancel={aoSubir}
            onDoubleClick={(e) => alternarZoom({ x: e.clientX, y: e.clientY })}
          >
            <button
              type="button"
              className="visor-seta visor-seta--antes"
              onClick={() => andar(-1)}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>

            <picture>
              <source type="image/avif" srcSet={srcset("avif")} sizes="100vw" />
              <source type="image/webp" srcSet={srcset("webp")} sizes="100vw" />
              <img
                ref={imagemRef}
                src={`/media/${item.nome}-${larguras[larguras.length - 1]}.webp`}
                alt={item.alt}
                width={midia.w}
                height={midia.h}
                className="visor-img"
                draggable={false}
                style={{
                  transform: `translate3d(${vista.x}px, ${vista.y}px, 0) scale(${vista.escala})`,
                }}
              />
            </picture>

            <button
              type="button"
              className="visor-seta visor-seta--depois"
              onClick={() => andar(1)}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <div className="visor-rodape">
            <p className="visor-legenda">{item.legenda}</p>
            {nota ? <p className="visor-nota">{nota}</p> : null}
            {/* Instrução escrita: o visor esconde a página, e quem nunca viu o
                padrão precisa ver a saída. Teclado no computador, gesto no celular. */}
            <p className="visor-ajuda visor-ajuda--ponteiro">
              Esc para fechar · setas do teclado para navegar · role para ampliar
            </p>
            <p className="visor-ajuda visor-ajuda--toque">
              Deslize para trocar · pinça para ampliar · × para fechar
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
