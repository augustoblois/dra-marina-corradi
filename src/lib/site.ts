/**
 * Endereço oficial, regra de indexação e textos de busca, num lugar só.
 *
 * O <head>, o robots.txt, o sitemap.xml e o llms.txt leem daqui. Por isso a
 * lista de páginas existe uma vez: página nova entra em PAGINAS e aparece nos
 * três ao mesmo tempo (lista escrita à mão ao lado diverge na primeira página nova).
 *
 * Enquanto SITE_URL for null, o site é uma prévia e fica fora do Google:
 * noindex no <head>, robots.txt fechado, sitemap.xml e llms.txt em 404. Quando o
 * domínio estiver no ar, troque só a linha abaixo, sem barra no fim. Exemplo:
 *   export const SITE_URL: string | null = "https://www.dominio.com.br";
 */
export const SITE_URL: string | null = null;

export const INDEXAVEL = SITE_URL !== null;

/**
 * Título do resultado de busca: o que a pessoa digita vem primeiro (o
 * procedimento, a cidade, o que ele faz) e o nome da médica fecha.
 */
export const TITULO = "Volformer em Itu: efeito lifting sem cirurgia | Dra. Marina Corradi";

/** Até ~160 caracteres: o que a página tem, para quem e onde. */
export const DESCRICAO =
  "Ultrassom microfocado e radiofrequência na mesma sessão, para a flacidez do rosto, mandíbula e papada. Avaliação com a Dra. Marina Corradi, em Itu-SP.";

/** Título curto da prévia do link (WhatsApp, Instagram, Facebook). */
export const TITULO_PREVIA = "Protocolo Volformer em Itu | Dra. Marina Corradi";

/** Imagem da prévia do link. Gerada a partir de scripts/og.html. */
export const IMAGEM_PREVIA = {
  caminho: "/og-volformer.jpg",
  w: 1200,
  h: 630,
  alt: "Dra. Marina Corradi sorrindo, ao lado do texto Protocolo Volformer, efeito lifting sem cirurgia, Corradi Derma, Itu-SP",
} as const;

export const PAGINAS = [
  {
    caminho: "/",
    nome: "Protocolo Volformer em Itu",
    resumo:
      "o que é o Volformer, como as duas tecnologias atuam na pele, para quem é indicado, a médica, a clínica, a imprensa e as dúvidas frequentes, com o agendamento da avaliação pelo WhatsApp.",
  },
] as const;
