import type { Locale } from "@/i18n/config";
import type { ServiceId } from "@/i18n/routes";

/** Conteúdo de uma linha de serviço num idioma. Estrutura da página: plano, seção 5, Fase 5. */
export type ServiceContent = {
  /** Nome da linha (menu, cartões, rótulos). */
  name: string;
  /** Dor em uma frase, na voz do cliente (cartão da home e do hub). */
  pain: string;
  /** Título da página (h1). */
  headline: string;
  lead: string;
  /** O que está incluso, em itens concretos. */
  included: readonly { title: string; text: string }[];
  /** Como funciona, em etapas com prazo. */
  steps: readonly { name: string; duration: string; text: string }[];
  /** O que NÃO está incluso — diferencial de confiança, evita reunião perdida. */
  excluded: readonly string[];
  /** Modelo de cobrança ou faixa de investimento. */
  pricing: { title: string; text: string };
  faq: readonly { q: string; a: string }[];
  seo: { title: string; description: string };
};

/** Uma linha de serviço. Sem `en` = página só em português (espelha routes.ts). */
export type ServiceLine = {
  id: ServiceId;
  /** Ordem de destaque (1 = primeiro). */
  order: number;
  content: { pt: ServiceContent } & Partial<Record<Exclude<Locale, "pt">, ServiceContent>>;
};
