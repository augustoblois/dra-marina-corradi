import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/**
 * Origem de quem está servindo a página, para a og:image sair com URL absoluta
 * (o WhatsApp e o Facebook ignoram imagem de prévia com caminho relativo).
 * Assim a prévia funciona no domínio que o Rayan apontar, sem trocar código.
 */
export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  const req = getRequest();
  const url = new URL(req.url);
  // x-forwarded-host só é confiável atrás da reescrita de localhost do sandbox.
  const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
});
