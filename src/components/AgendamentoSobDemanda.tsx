import { lazy, Suspense, useEffect, useState } from "react";

const carregar = () => import("@/components/Agendamento");
const Agendamento = lazy(() => carregar().then((m) => ({ default: m.Agendamento })));

/**
 * O diálogo de agendamento sai do carregamento inicial: ele traz o validador
 * do formulário (zod), os avisos (sonner) e o diálogo do Radix, e nada disso
 * aparece antes de alguém tocar em "Agendar".
 *
 * O arquivo começa a baixar no primeiro sinal de uso (rolar, tocar ou teclar),
 * então quando a paciente chega num botão de agendar ele já está pronto. Se o
 * toque vier antes, o diálogo abre assim que o arquivo chega.
 */
export function AgendamentoSobDemanda() {
  const [montar, setMontar] = useState(false);

  useEffect(() => {
    const abrir = () => setMontar(true);
    const adiantar = () => void carregar();
    const umaVez = { once: true, passive: true } as const;
    window.addEventListener("open-lead-dialog", abrir);
    window.addEventListener("scroll", adiantar, umaVez);
    window.addEventListener("pointerdown", adiantar, umaVez);
    window.addEventListener("keydown", adiantar, umaVez);
    return () => {
      window.removeEventListener("open-lead-dialog", abrir);
      window.removeEventListener("scroll", adiantar);
      window.removeEventListener("pointerdown", adiantar);
      window.removeEventListener("keydown", adiantar);
    };
  }, []);

  if (!montar) return null;
  return (
    <Suspense fallback={null}>
      <Agendamento abertoAoMontar />
    </Suspense>
  );
}
