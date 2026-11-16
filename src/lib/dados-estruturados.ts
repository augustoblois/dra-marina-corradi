import { DUVIDAS, respostaCompleta } from "@/lib/duvidas";
import {
  CLINICA,
  DRA,
  INSTAGRAM,
  INSTAGRAM_CLINICA,
  MAPS_URL,
  WHATSAPP_NUMERO,
} from "@/lib/marina";
import { IMAGEM_PREVIA } from "@/lib/site";

/** "5511915155011" → "+55-11-91515-5011", o formato que o Google pede. */
const telefone = (n: string) => `+${n.slice(0, 2)}-${n.slice(2, 4)}-${n.slice(4, 9)}-${n.slice(9)}`;

/**
 * JSON-LD (dados estruturados): a mesma informação da página, num formato que
 * o Google e os assistentes de IA leem sem interpretar o layout.
 *
 * Regras, iguais às da página:
 * - só entra o que está visível na página;
 * - sem `medicalSpecialty`: anunciar especialidade exige RQE (CFM, Res. 2.336/2023);
 * - sem `priceRange` nem `offers`: a página não publica valores;
 * - toda propriedade foi conferida em schema.org/<Tipo>, com herança.
 */
export function dadosEstruturados(origem: string) {
  const url = `${origem}/`;
  const idClinica = `${url}#clinica`;
  const cidade = { "@type": "City", name: "Itu" } as const;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#site`,
        url,
        name: DRA.nome,
        inLanguage: "pt-BR",
        publisher: { "@id": idClinica },
      },
      {
        // MedicalClinic herda de LocalBusiness (endereço, telefone, mapa) e de Organization.
        "@type": "MedicalClinic",
        "@id": idClinica,
        name: CLINICA.nomeCompleto,
        alternateName: CLINICA.nome,
        url,
        image: `${origem}${IMAGEM_PREVIA.caminho}`,
        telephone: telefone(WHATSAPP_NUMERO),
        email: CLINICA.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${CLINICA.endereco} - ${CLINICA.bairro}`,
          addressLocality: "Itu",
          addressRegion: "SP",
          addressCountry: "BR",
        },
        hasMap: MAPS_URL,
        areaServed: cidade,
        sameAs: [INSTAGRAM_CLINICA.url],
      },
      {
        "@type": "Person",
        "@id": `${url}#dra-marina`,
        name: DRA.nomeCompleto,
        alternateName: DRA.nome,
        jobTitle: "Médica",
        identifier: { "@type": "PropertyValue", propertyID: "CRM-SP", value: "264323" },
        image: `${origem}/media/dra-vinho-1200.webp`,
        worksFor: { "@id": idClinica },
        sameAs: [INSTAGRAM.url],
      },
      {
        "@type": "Service",
        "@id": `${url}#volformer`,
        name: "Protocolo Volformer",
        serviceType: "Tratamento da flacidez facial sem cirurgia",
        description:
          "Ultraformer MPT (ultrassom microfocado) e Volnewmer (radiofrequência) na mesma sessão, para a flacidez do rosto, o contorno da mandíbula e a papada.",
        provider: { "@id": idClinica },
        areaServed: cidade,
        url,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#duvidas`,
        mainEntity: DUVIDAS.map((d) => ({
          "@type": "Question",
          name: d.pergunta,
          acceptedAnswer: { "@type": "Answer", text: respostaCompleta(d) },
        })),
      },
    ],
  };
}
