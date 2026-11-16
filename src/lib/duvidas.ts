/**
 * Dúvidas frequentes. O mesmo texto vira a seção da página, o FAQPage do JSON-LD
 * (SEO) e o llms.txt: a pergunta que o Google lê é a mesma que a paciente lê.
 *
 * Cada resposta abre com a frase curta em negrito (o "sim", o "não", o
 * "depende"), como nas LPs de referência, e segue na linguagem de quem
 * pergunta: "pontadinhas" no lugar de "desconforto", "a camada que segura o
 * rosto" no lugar do nome técnico sozinho.
 *
 * Regra do CFM (Res. 2.336/2023): nenhuma resposta promete resultado. O que
 * varia de pessoa para pessoa é dito como tal.
 */
export const DUVIDAS = [
  {
    pergunta: "O Volformer é a mesma coisa que o Ultraformer?",
    curta: "O Ultraformer é uma das partes.",
    resposta:
      "O Volformer junta duas tecnologias na mesma sessão: o Ultraformer MPT, um ultrassom que trabalha a sustentação do rosto, e o Volnewmer, uma radiofrequência que cuida da firmeza e da textura da pele.",
  },
  {
    pergunta: "Dói?",
    curta: "Dá para sentir, e a sessão é ajustada ao seu conforto.",
    resposta:
      "O mais comum é uma sensação de calor e umas pontadinhas rápidas durante a aplicação. A Dra. Marina regula a energia ao longo da sessão, de acordo com a sua sensibilidade.",
  },
  {
    pergunta: "Preciso me afastar da rotina?",
    curta: "Em geral, não.",
    resposta:
      "Sem corte e sem internação, a rotina costuma ser retomada no mesmo dia. A pele pode ficar um pouco avermelhada logo depois, e você sai do consultório com todas as orientações de cuidado.",
  },
  {
    pergunta: "Quando o resultado aparece?",
    curta: "Aos poucos, nos meses seguintes.",
    resposta:
      "O colágeno novo leva um tempo para se formar, então a melhora costuma ser gradual. Cada pele responde no seu ritmo, e os resultados variam de pessoa para pessoa.",
  },
  {
    pergunta: "Quantas sessões são necessárias?",
    curta: "Depende do seu rosto.",
    resposta:
      "O número de sessões leva em conta o grau de flacidez, as áreas tratadas e o que você deseja. Ele é definido na avaliação, junto com a Dra. Marina.",
  },
  {
    pergunta: "Serve para a flacidez depois de emagrecer?",
    curta: "Essa é uma das indicações.",
    resposta:
      "Quando o rosto perde volume, inclusive com as canetas emagrecedoras, a pele pode ficar mais solta. Na avaliação, a Dra. Marina vê se o Volformer é o melhor caminho para o seu caso, sozinho ou junto de outro tratamento.",
  },
  {
    pergunta: "Qualquer pessoa pode fazer?",
    curta: "Nem sempre.",
    resposta:
      "A indicação é individual, e há casos em que o procedimento não é recomendado, como na gestação ou para quem usa marca-passo. Por isso a avaliação médica vem antes de qualquer sessão.",
  },
  {
    pergunta: "Quanto custa o Volformer?",
    curta: "O valor sai na avaliação.",
    resposta:
      "Ele depende das áreas, das profundidades e do número de disparos que o seu rosto pede, e é definido depois que a Dra. Marina examina a sua pele.",
  },
  {
    pergunta: "Onde o Volformer é feito?",
    curta: "Em Itu, com a própria Dra. Marina.",
    resposta: "Na Corradi Derma Health Clinic, na Av. Barata Ribeiro, 2, Vila Prudente de Moraes.",
  },
] as const;

/** Resposta inteira, em texto corrido, para o JSON-LD e o llms.txt. */
export const respostaCompleta = (d: (typeof DUVIDAS)[number]) => `${d.curta} ${d.resposta}`;
