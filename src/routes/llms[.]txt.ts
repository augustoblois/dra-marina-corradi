import { createFileRoute } from "@tanstack/react-router";
import { DUVIDAS, respostaCompleta } from "@/lib/duvidas";
import { CLINICA, DRA, INSTAGRAM, INSTAGRAM_CLINICA, WHATSAPP_NUMERO } from "@/lib/marina";
import { PAGINAS, SITE_URL } from "@/lib/site";

/**
 * Resumo do site para assistentes de IA, no padrão llmstxt.org (v2). O Google
 * não usa este arquivo: quem lê é o agente que abre o site na hora de
 * responder. Sai da mesma lista do sitemap (PAGINAS) e segue as regras da
 * página: sem preço e sem especialidade (CFM). Na prévia responde 404.
 */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        if (!SITE_URL) return new Response("Not found\n", { status: 404 });
        const n = WHATSAPP_NUMERO;
        const linhas = [
          `# ${DRA.nome} · Protocolo Volformer em Itu`,
          "",
          `> Página do protocolo Volformer com a ${DRA.nome} (médica, ${DRA.crm}) na ${CLINICA.nomeCompleto}, em Itu-SP: Ultraformer MPT (ultrassom microfocado) e Volnewmer (radiofrequência) na mesma sessão, para a flacidez do rosto, o contorno da mandíbula e a papada.`,
          "",
          `- Atendimento: ${DRA.nome} (${DRA.nomeCompleto}), médica, ${DRA.crm}`,
          `- Clínica: ${CLINICA.nomeCompleto}, ${CLINICA.endereco}, ${CLINICA.bairro}, Itu-SP`,
          `- WhatsApp: +${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 9)}-${n.slice(9)} · E-mail: ${CLINICA.email}`,
          `- Instagram: @${INSTAGRAM.usuario} (Dra. Marina) e @${INSTAGRAM_CLINICA.usuario} (clínica)`,
          "- Como ler o site: o valor, o número de sessões e a indicação são definidos na avaliação médica, e o site não publica preços. Os resultados variam de pessoa para pessoa.",
          "",
          "Dúvidas frequentes, com as respostas da página:",
          "",
          ...DUVIDAS.map((d) => `- ${d.pergunta} ${respostaCompleta(d)}`),
          "",
          "## Páginas",
          "",
          ...PAGINAS.map((p) => `- [${p.nome}](${SITE_URL}${p.caminho}): ${p.resumo}`),
        ];
        return new Response(linhas.join("\n") + "\n", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
