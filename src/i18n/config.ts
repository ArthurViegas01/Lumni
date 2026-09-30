/**
 * Configuração de idiomas. Módulo puro: importado pelo proxy (runtime nodejs)
 * e pelo app. Não importe nada de React ou de "server-only" aqui.
 */
export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

/** Valor usado em <html lang> e em hreflang. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** O outro idioma disponível — o site tem exatamente dois. */
export function alternateLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}
