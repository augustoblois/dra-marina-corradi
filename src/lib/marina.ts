/**
 * Dados da Dra. Marina e da Corradi Derma, num lugar só.
 *
 * Todo contato, link e registro da página sai daqui. Trocar o WhatsApp, ligar o
 * webhook de leads ou publicar o valor da consulta é mexer em UMA linha, sem
 * caçar o número seção por seção (foi assim que as LPs anteriores divergiram:
 * o rodapé com um telefone e o formulário com outro).
 */

export const DRA = {
  nome: "Dra. Marina Corradi",
  nomeCompleto: "Marina Corradi Scudeler",
  registro: "Médica · CRM-SP 264323",
  crm: "CRM-SP 264323",
} as const;

/** Endereço e contatos do cartão final do vídeo institucional da clínica (out/2026). */
export const CLINICA = {
  nome: "Corradi Derma",
  nomeCompleto: "Corradi Derma Health Clinic",
  endereco: "Av. Barata Ribeiro, 2",
  bairro: "Vila Prudente de Moraes",
  cidade: "Itu · SP",
  email: "corradisaude@gmail.com",
  telefoneExibicao: "(11) 9 1515-5011",
} as const;

const ENDERECO_BUSCA =
  "Corradi Derma Health Clinic, Av. Barata Ribeiro, 2 - Vila Prudente de Moraes, Itu - SP";
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO_BUSCA)}`;
export const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent("Av. Barata Ribeiro, 2, Itu - SP")}&navigate=yes`;

export const INSTAGRAM = {
  usuario: "dramarinacorradi",
  url: "https://www.instagram.com/dramarinacorradi/",
  seguidores: "12,9 mil",
  publicacoes: "1.604",
} as const;

export const INSTAGRAM_CLINICA = {
  usuario: "clinicacorradiderma",
  url: "https://www.instagram.com/clinicacorradiderma/",
} as const;

/**
 * Telefone do cartão de contato do vídeo institucional da clínica, o mesmo
 * publicado pelo Jornal Agora Itu. Falta só o Augusto confirmar que é o
 * WhatsApp de agendamento.
 */
export const WHATSAPP_NUMERO = "5511915155011";

/**
 * Webhook de leads da Medlabs, um por LP: "https://api.medlabs.ia.br/webhook/leads/<id>".
 * `null` enquanto o da Dra. Marina não chega: o envio é pulado.
 */
export const WEBHOOK_LEADS: string | null = null;

/**
 * Google Tag Manager pelo carregador da Medlabs, igual às outras LPs: o script
 * vem de um subdomínio da clínica (ex.: "https://r.dominio.com.br/abc123.js"),
 * não do googletagmanager.com. Os três valores saem do snippet que a Medlabs
 * gera para o contêiner:
 *
 *   j.src="https://r.dominio.com.br/abc123.js?"+i  →  script
 *   ...,'dataLayer','1i=AbCdEf...')                →  parametro
 *   ns.html?id=GTM-XXXXXXX                         →  id
 *
 * `null` = sem GTM na página.
 */
export const GTM: { script: string; parametro: string; id: string } | null = null;

/** Microsoft Clarity (ex.: "abcd1234ef"). `null` quando ele vem pelo GTM ou não é usado. */
export const CLARITY_ID: string | null = null;

/**
 * Valor da consulta de avaliação. Com valor, o agendamento abre pela etapa de
 * qualificação ("a consulta tem um investimento de R$ X, deseja prosseguir?"),
 * igual às LPs de referência. Com `null`, essa etapa não aparece.
 */
export const CONSULTA_VALOR: string | null = null;

export const MENSAGEM_WHATSAPP =
  "Olá! Vim do site da Dra. Marina Corradi e gostaria de agendar uma avaliação para o protocolo Volformer.";

export const whatsappLink = (mensagem: string = MENSAGEM_WHATSAPP) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(mensagem)}`;

/** Todo botão de agendamento da página abre o mesmo diálogo, em `Agendamento`. */
export const abrirAgendamento = () => window.dispatchEvent(new Event("open-lead-dialog"));
