# LP Dra. Marina Corradi · Protocolo Volformer

Landing page mobile-first da Dra. Marina Corradi (Corradi Derma, Itu-SP) para o
protocolo Volformer. O rastreio de leads segue a mesma estrutura das outras LPs da
Medlabs (GTM pelo carregador da Medlabs, evento `lead_submit`, webhook de leads e
WhatsApp).

Prévia para a cliente, sem rastreio e fora do Google:
https://dra-marina-corradi.vercel.app

## Stack

- TanStack Start (modelo do Lovable) com React 19, Vite 7 e Tailwind CSS v4
- Node 22 ou mais novo (testado com o 24)
- Uma rota só (`/`), renderizada no servidor

## Rodar local

```sh
npm ci
npm run dev      # http://localhost:8080
npm run lint
npm run build
```

## O que preencher antes de publicar

Todo dado de contato e de rastreio está em dois arquivos. Enquanto um valor está
`null`, a parte que depende dele fica desligada sem quebrar nada.

`src/lib/marina.ts`

| Constante         | O que é                                                                                                                      | Hoje                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `WHATSAPP_NUMERO` | WhatsApp de agendamento da clínica                                                                                           | `5511915155011` (confirmar) |
| `WEBHOOK_LEADS`   | Webhook de leads da Medlabs (`https://api.medlabs.ia.br/webhook/leads/<id>`)                                                 | `null`, envio pulado        |
| `GTM`             | `{ script, parametro, id }` tirados do snippet do carregador da Medlabs (o comentário no arquivo mostra de onde sai cada um) | `null`, sem GTM             |
| `CLARITY_ID`      | Microsoft Clarity, só se ele não vier pelo GTM                                                                               | `null`                      |
| `CONSULTA_VALOR`  | Valor da avaliação. Com valor, o agendamento abre pela etapa "a consulta tem investimento de R$ X"                           | `null`, etapa escondida     |

`src/lib/site.ts`

| Constante  | O que é                         | Efeito                                                                                                                                                              |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL` | Domínio final, sem barra no fim | Com `null`: `noindex`, robots.txt fechado, sitemap.xml e llms.txt em 404. Com o domínio: canonical, Open Graph absoluto, sitemap.xml, robots.txt e llms.txt ligados |

## Fluxo do lead

1. Todo botão de agendar dispara o evento `open-lead-dialog`; o diálogo
   (`src/components/Agendamento.tsx`) só é baixado no primeiro uso.
2. Formulário: nome, WhatsApp (com opção de DDI para fora do Brasil), e-mail e
   cidade. Telefone que não fecha um número válido é barrado com aviso.
3. Ao enviar, na ordem:
   - `dataLayer.push` com `event: "lead_submit"`, `event_id`,
     `lead: { name, email, phone, city }`, `page_location`, `page_referrer`,
     `eventCallback` e `eventTimeout: 1500`. Telefone em E.164 (`+5511915155011`).
   - POST no `WEBHOOK_LEADS` (`keepalive`) com `event_id`, `name`, `phone`,
     `email`, `city`, `page_location`, `page_referrer`, `submitted_at`, `fbclid`
     e os `utm_*` da URL de entrada. Telefone legível (`+55 (11) 91515-5011`).
   - Espera o GTM confirmar (até 1,5 s), mostra "Tudo certo!" e abre o WhatsApp da
     clínica 1,2 s depois, com a mensagem e os dados do lead.
4. O `event_id` é o mesmo no dataLayer e no webhook, para deduplicar.

Algumas LPs da Medlabs também gravam o lead numa planilha do Google por uma server
function. Esta não grava; se precisar, dá para portar a mesma função.

## Deploy

O build padrão gera um Worker da Cloudflare (`wrangler.jsonc`):

```sh
npm run build
npx wrangler deploy --config .output/server/wrangler.json
```

Na Vercel, a mesma base sai com a variável de ambiente `NITRO_PRESET=vercel`
(Settings > Environment Variables), Framework Preset "Other" e build `npm run build`.
O build gera `.vercel/output`, que a Vercel publica direto. Foi assim que a prévia
subiu.

## Depois que o domínio estiver no ar

1. `SITE_URL` em `src/lib/site.ts`, build e deploy.
2. Um lead de teste: conferir o `lead_submit` no modo Preview do GTM e a chegada
   no webhook.
3. Search Console e Bing Webmaster Tools: cadastrar o domínio e enviar
   `/sitemap.xml`.
4. Avisar o Bing pelo IndexNow (a chave já está em `public/`):
   `https://api.indexnow.org/indexnow?url=https://DOMINIO/&key=b4e2676870d0de8d3e689d4af4d662f8`

## Mídia

Fotos (AVIF e WebP em várias larguras) e vídeos curtos (H.264) ficam em
`public/media/`, com o índice em `src/lib/midias.gen.ts`, que o componente
`<Foto>` lê para montar o `srcset` e reservar a proporção. Os dois saem de
`scripts/midias.py`, a partir das fontes brutas (Instagram da médica e material da
clínica, com autorização), que ficam fora do repositório. Para publicar, nada disso
precisa rodar.

## Qualidade medida (16/11/2026, sem GTM)

- Lighthouse mobile: performance 90, acessibilidade 100, boas práticas 100, CLS 0
- Sem rolagem horizontal de 320 a 1440 px
- Movimento reduzido respeitado (`prefers-reduced-motion`)

Com GTM e Clarity a nota de performance cai, o mesmo custo das outras LPs.

## Pendências de conteúdo

- Confirmar o WhatsApp de agendamento e o valor da avaliação
- RQE da médica, horários e estacionamento da clínica
- Logo da clínica para o favicon (o atual é provisório)
- Links das matérias de imprensa (hoje os cartões levam aos posts do Instagram)
