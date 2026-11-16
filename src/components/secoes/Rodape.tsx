import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { IconeWhatsApp } from "@/components/BotaoAgendar";
import {
  abrirAgendamento,
  CLINICA,
  DRA,
  INSTAGRAM,
  INSTAGRAM_CLINICA,
  MAPS_URL,
  WHATSAPP_NUMERO,
} from "@/lib/marina";

export function Rodape() {
  return (
    <footer className="bg-brand-espresso px-6 pb-10 pt-14 text-brand-cream lg:px-16 lg:pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-[1.9rem] font-medium leading-none">{CLINICA.nome}</p>
          <p className="rotulo mt-2 text-brand-gold">Health Clinic</p>
          <p className="mt-5 text-[0.88rem] leading-relaxed text-brand-cream/75">
            {DRA.nomeCompleto}
            <br />
            {DRA.registro}
          </p>
          <button
            type="button"
            onClick={abrirAgendamento}
            className="mt-6 inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-green-gradient px-6 py-3 text-[0.88rem] font-semibold text-white shadow-[var(--shadow-green)] transition hover:brightness-110"
          >
            <IconeWhatsApp className="h-4 w-4" />
            Agendar avaliação
          </button>
        </div>

        <div>
          <p className="rotulo text-brand-gold">Endereço</p>
          <address className="mt-4 text-[0.92rem] not-italic leading-relaxed text-brand-cream/80">
            {CLINICA.endereco}
            <br />
            {CLINICA.bairro}
            <br />
            {CLINICA.cidade}
          </address>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-brand-gold-bright underline-offset-4 hover:underline"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            Como chegar
          </a>
        </div>

        <div>
          <p className="rotulo text-brand-gold">Contato</p>
          <ul className="mt-4 space-y-3 text-[0.92rem] text-brand-cream/80">
            <li>
              <a
                href={`tel:+${WHATSAPP_NUMERO}`}
                className="inline-flex items-center gap-2.5 hover:text-brand-cream"
              >
                <Phone className="h-4 w-4 text-brand-gold" aria-hidden />
                {CLINICA.telefoneExibicao}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CLINICA.email}`}
                className="inline-flex items-center gap-2.5 break-all hover:text-brand-cream"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                {CLINICA.email}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 hover:text-brand-cream"
              >
                <Instagram className="h-4 w-4 text-brand-gold" aria-hidden />@{INSTAGRAM.usuario}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_CLINICA.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 hover:text-brand-cream"
              >
                <Instagram className="h-4 w-4 text-brand-gold" aria-hidden />@
                {INSTAGRAM_CLINICA.usuario}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-[0.75rem] leading-relaxed text-brand-cream/60">
        <p>
          As informações deste site têm caráter educativo e não substituem a consulta médica. Os
          resultados variam de pessoa para pessoa, e a indicação de qualquer procedimento depende de
          avaliação individual.
        </p>
        <p className="mt-3">
          <span className="block sm:inline">© 2026 {CLINICA.nomeCompleto}</span>
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">
            {DRA.nome} · {DRA.crm}
          </span>
        </p>
      </div>
    </footer>
  );
}
