import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { IconeWhatsApp } from "@/components/BotaoAgendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { CONSULTA_VALOR, DRA, GTM, INSTAGRAM, WEBHOOK_LEADS, whatsappLink } from "@/lib/marina";

const esquema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  fone: z
    .string()
    .trim()
    .min(1, "Informe o WhatsApp com DDD")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "WhatsApp inválido"),
  email: z.string().trim().email("E-mail inválido").max(255),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(100),
});

type Campos = z.infer<typeof esquema>;
type Etapa = "qualificar" | "formulario" | "recusou";

const VAZIO: Campos = { nome: "", fone: "", email: "", cidade: "" };
const etapaInicial = (): Etapa => (CONSULTA_VALOR ? "qualificar" : "formulario");

/**
 * Telefone no formato internacional (+5511915155011), como o GTM espera, ou
 * `null` quando os dígitos não fecham um número. Mesma regra das outras LPs da
 * Medlabs: o "55" digitado só sai quando sobra um número brasileiro completo,
 * para não cortar o DDD 55 (região de Santa Maria-RS).
 */
function telefoneCanonico(bruto: string, internacional: boolean, ddi: string): string | null {
  const digitos = bruto.replace(/\D/g, "");
  if (internacional) {
    const pais = ddi.replace(/\D/g, "");
    if (!/^[1-9]\d{0,2}$/.test(pais)) return null;
    const total = pais + digitos;
    return total.length >= 8 && total.length <= 15 ? `+${total}` : null;
  }
  if (digitos.length === 10 || digitos.length === 11) return `+55${digitos}`;
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) {
    return `+${digitos}`;
  }
  return null;
}

/** O mesmo telefone legível, para o webhook e a mensagem: "+55 (11) 91515-5011". */
function telefoneLegivel(canonico: string, internacional: boolean, ddi: string): string {
  if (internacional) {
    const pais = ddi.replace(/\D/g, "");
    return `+${pais} ${canonico.slice(1 + pais.length)}`;
  }
  const d = canonico.slice(3);
  const meio = d.length === 11 ? 7 : 6;
  return `+55 (${d.slice(0, 2)}) ${d.slice(2, meio)}-${d.slice(meio)}`;
}

/** Parâmetro da URL de entrada (UTM do anúncio, fbclid do Meta), ou "" sem ele. */
const parametro = (nome: string) => new URLSearchParams(window.location.search).get(nome) ?? "";

/** `crypto.randomUUID` só existe em HTTPS ou localhost; no teste pelo celular na rede local, não. */
const novoId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const CLASSE_CAMPO =
  "h-12 rounded-full border-brand-gold/40 bg-white/70 px-5 text-base text-brand-ink placeholder:text-brand-muted focus-visible:ring-brand-gold";

/**
 * O diálogo de agendamento. Todo botão "Agendar" dispara o evento
 * `open-lead-dialog` (ver `abrirAgendamento`). O contato vai para o webhook
 * (quando houver) e para o GTM, e a paciente segue para o WhatsApp da clínica
 * com a mensagem já escrita.
 *
 * Quem monta é o `AgendamentoSobDemanda`, no primeiro pedido de abertura: por
 * isso `abertoAoMontar`, já que esse primeiro evento chegou antes deste
 * componente existir.
 */
export function Agendamento({ abertoAoMontar = false }: { abertoAoMontar?: boolean }) {
  const [aberto, setAberto] = useState(abertoAoMontar);
  const [etapa, setEtapa] = useState<Etapa>(etapaInicial);
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [internacional, setInternacional] = useState(false);
  const [ddi, setDdi] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const abrir = () => {
      setEnviando(false);
      setEnviado(false);
      setAberto(true);
    };
    // Quem volta do WhatsApp pelo "voltar" do celular recebe a página guardada
    // na memória do navegador, com o diálogo parado em "Tudo certo!": libera o
    // formulário de novo (igual às outras LPs da Medlabs).
    const voltou = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setEnviando(false);
      setEnviado(false);
    };
    window.addEventListener("open-lead-dialog", abrir);
    window.addEventListener("pageshow", voltou);
    return () => {
      window.removeEventListener("open-lead-dialog", abrir);
      window.removeEventListener("pageshow", voltou);
    };
  }, []);

  const mudarAberto = (proximo: boolean) => {
    setAberto(proximo);
    if (!proximo) {
      setEnviando(false);
      setTimeout(() => {
        setEtapa(etapaInicial());
        setEnviado(false);
      }, 200);
    }
  };

  const campo = (nome: keyof Campos) => ({
    value: campos[nome],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setCampos({ ...campos, [nome]: e.target.value }),
  });

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando || enviado) return;

    const r = esquema.safeParse(campos);
    if (!r.success) {
      toast.error(r.error.issues[0]?.message ?? "Confira os campos");
      return;
    }
    const telefone = telefoneCanonico(r.data.fone, internacional, ddi);
    if (!telefone) {
      toast.error(internacional ? "Confira o DDI e o número" : "Confira o WhatsApp com DDD");
      return;
    }

    setEnviando(true);
    const { nome, email, cidade } = r.data;
    const legivel = telefoneLegivel(telefone, internacional, ddi);
    const eventId = novoId();

    // O mesmo evento das outras LPs, que o GTM da Medlabs escuta. O redirecionamento
    // espera o GTM confirmar (até 1,5 s); sem GTM na página, não há o que esperar.
    const gtm = new Promise<void>((resolve) => {
      let pronto = false;
      const fim = () => {
        if (pronto) return;
        pronto = true;
        window.clearTimeout(limite);
        resolve();
      };
      const limite = window.setTimeout(fim, GTM ? 1500 : 0);
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "lead_submit",
          event_id: eventId,
          lead: { name: nome, email, phone: telefone, city: cidade },
          page_location: window.location.href,
          page_referrer: document.referrer,
          eventCallback: fim,
          eventTimeout: 1500,
        });
      } catch {
        fim();
      }
    });

    // Webhook da Medlabs com a origem do anúncio (UTM e fbclid), como nas outras
    // LPs. `keepalive` deixa o envio terminar mesmo com a troca de página.
    if (WEBHOOK_LEADS) {
      fetch(WEBHOOK_LEADS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          name: nome,
          phone: legivel,
          email,
          city: cidade,
          page_location: window.location.href,
          page_referrer: document.referrer,
          submitted_at: new Date().toISOString(),
          fbclid: parametro("fbclid"),
          utm_source: parametro("utm_source"),
          utm_medium: parametro("utm_medium"),
          utm_campaign: parametro("utm_campaign"),
          utm_id: parametro("utm_id"),
          utm_term: parametro("utm_term"),
          utm_content: parametro("utm_content"),
        }),
        keepalive: true,
      }).catch(() => {});
    }

    await gtm;

    setEnviando(false);
    setEnviado(true);
    const mensagem = [
      `Olá! Vim do site da ${DRA.nome} e tenho interesse no protocolo Volformer. Gostaria de agendar minha avaliação.`,
      "",
      `Nome: ${nome}`,
      `Telefone: ${legivel}`,
      `E-mail: ${email}`,
      `Cidade: ${cidade}`,
    ].join("\n");
    setCampos(VAZIO);
    setInternacional(false);
    setDdi("");
    setTimeout(() => {
      window.location.href = whatsappLink(mensagem);
    }, 1200);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <Dialog open={aberto} onOpenChange={mudarAberto}>
        <DialogContent className="max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border-brand-gold/40 bg-brand-cream p-6 shadow-2xl sm:rounded-3xl sm:p-8">
          {etapa === "qualificar" && (
            <>
              <DialogHeader className="space-y-3 text-center sm:text-center">
                <DialogTitle className="font-display text-[1.35rem] font-semibold leading-snug text-brand-ink">
                  A consulta de avaliação com a {DRA.nome} tem investimento de {CONSULTA_VALOR}.
                </DialogTitle>
                <DialogDescription className="text-[0.92rem] text-brand-muted">
                  Deseja seguir com o agendamento?
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setEtapa("formulario")}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-green-gradient px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-[var(--shadow-green)] transition hover:brightness-110"
                >
                  Sim, quero agendar
                </button>
                <button
                  type="button"
                  onClick={() => setEtapa("recusou")}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-brand-gold/50 px-5 py-2.5 text-[0.9rem] font-medium text-brand-ink transition hover:bg-brand-gold/10"
                >
                  Agora não
                </button>
              </div>
            </>
          )}

          {etapa === "recusou" && (
            <>
              <DialogHeader className="text-center sm:text-center">
                <DialogTitle className="font-display text-[1.4rem] font-semibold text-brand-ink">
                  Obrigada pelo interesse.
                </DialogTitle>
                <DialogDescription className="text-[0.95rem] leading-relaxed text-brand-muted">
                  Quando for o momento, será um prazer receber você.
                </DialogDescription>
              </DialogHeader>
              <a
                href={INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-12 items-center justify-center rounded-full bg-gold-gradient px-8 text-[0.92rem] font-semibold text-brand-espresso shadow-[var(--shadow-gold)] transition hover:brightness-105"
              >
                Siga a @{INSTAGRAM.usuario}
              </a>
            </>
          )}

          {etapa === "formulario" && (
            <>
              <DialogHeader className="text-center sm:text-center">
                <DialogTitle className="font-display text-[1.6rem] font-semibold leading-tight text-brand-ink">
                  Agendar avaliação
                </DialogTitle>
                <DialogDescription className="text-[0.9rem] leading-relaxed text-brand-muted">
                  Preencha seus dados e continue a conversa com a clínica pelo WhatsApp.
                </DialogDescription>
              </DialogHeader>

              {enviado ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center" role="status">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                    <IconeWhatsApp className="h-7 w-7" />
                  </span>
                  <p className="text-[1.1rem] font-semibold text-brand-ink">Tudo certo!</p>
                  <p className="max-w-xs text-[0.9rem] text-brand-muted">
                    Abrindo o WhatsApp da clínica…
                  </p>
                </div>
              ) : (
                <form onSubmit={enviar} noValidate className="mt-2 flex flex-col gap-3">
                  <label htmlFor="ag-nome" className="sr-only">
                    Nome
                  </label>
                  <Input
                    id="ag-nome"
                    name="name"
                    type="text"
                    placeholder="Nome"
                    autoComplete="name"
                    maxLength={100}
                    required
                    className={CLASSE_CAMPO}
                    {...campo("nome")}
                  />

                  <div className={internacional ? "flex gap-2" : "contents"}>
                    {internacional && (
                      <>
                        <label htmlFor="ag-ddi" className="sr-only">
                          DDI do país
                        </label>
                        <Input
                          id="ag-ddi"
                          type="tel"
                          inputMode="numeric"
                          placeholder="DDI"
                          maxLength={5}
                          value={ddi}
                          onChange={(e) => setDdi(e.target.value.replace(/[^\d+]/g, ""))}
                          className={`${CLASSE_CAMPO} w-24 shrink-0`}
                        />
                      </>
                    )}
                    <label htmlFor="ag-fone" className="sr-only">
                      WhatsApp com DDD
                    </label>
                    <Input
                      id="ag-fone"
                      name="tel"
                      type="tel"
                      inputMode="tel"
                      placeholder={internacional ? "Número" : "WhatsApp com DDD"}
                      autoComplete="tel"
                      maxLength={20}
                      required
                      className={`${CLASSE_CAMPO} ${internacional ? "flex-1" : "w-full"}`}
                      {...campo("fone")}
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3">
                    <input
                      id="ag-internacional"
                      type="checkbox"
                      checked={internacional}
                      onChange={(e) => {
                        setInternacional(e.target.checked);
                        if (!e.target.checked) setDdi("");
                      }}
                      className="h-4 w-4 cursor-pointer accent-brand-bronze"
                    />
                    <label
                      htmlFor="ag-internacional"
                      className="cursor-pointer text-[0.82rem] text-brand-ink"
                    >
                      Telefone de fora do Brasil
                    </label>
                  </div>

                  <label htmlFor="ag-email" className="sr-only">
                    E-mail
                  </label>
                  <Input
                    id="ag-email"
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    autoComplete="email"
                    maxLength={255}
                    required
                    className={CLASSE_CAMPO}
                    {...campo("email")}
                  />

                  <label htmlFor="ag-cidade" className="sr-only">
                    Cidade
                  </label>
                  <Input
                    id="ag-cidade"
                    name="city"
                    type="text"
                    placeholder="Cidade"
                    autoComplete="address-level2"
                    maxLength={100}
                    required
                    className={CLASSE_CAMPO}
                    {...campo("cidade")}
                  />

                  <button
                    type="submit"
                    disabled={enviando}
                    className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-green-gradient px-8 text-[0.95rem] font-semibold text-white shadow-[var(--shadow-green)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Enviando…
                      </>
                    ) : (
                      <>
                        <IconeWhatsApp className="h-5 w-5" />
                        Continuar no WhatsApp
                      </>
                    )}
                  </button>
                  <p className="text-center text-[0.75rem] leading-snug text-brand-muted">
                    Seus dados são usados só para o contato da clínica.
                  </p>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
