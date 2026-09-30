import type { Locale } from "@/i18n/config";
import { type ServiceId, servicesIn } from "@/i18n/routes";
import { automacao } from "./automacao";
import { presencaDigital } from "./presenca-digital";
import { squad } from "./squad";
import { tiGerenciada } from "./ti-gerenciada";
import type { ServiceContent, ServiceLine } from "./types";

export type { ServiceContent, ServiceLine } from "./types";

const LINES: Record<ServiceId, ServiceLine> = {
  "ti-gerenciada": tiGerenciada,
  automacao,
  squad,
  "presenca-digital": presencaDigital,
};

/** Conteúdo de uma linha num idioma, ou null se ela não existe nesse idioma. */
export function getService(id: ServiceId, locale: Locale): ServiceContent | null {
  return LINES[id].content[locale] ?? null;
}

/** Linhas disponíveis num idioma, na ordem de destaque. */
export function listServices(locale: Locale): { id: ServiceId; content: ServiceContent }[] {
  return servicesIn(locale)
    .map((id) => ({ id, order: LINES[id].order, content: LINES[id].content[locale] }))
    .filter((s): s is typeof s & { content: ServiceContent } => s.content !== undefined)
    .sort((a, b) => a.order - b.order)
    .map(({ id, content }) => ({ id, content }));
}

/** Para testes: todas as linhas cruas. */
export const ALL_LINES: readonly ServiceLine[] = Object.values(LINES);
