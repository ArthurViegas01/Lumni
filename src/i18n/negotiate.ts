import { defaultLocale, hasLocale, type Locale } from "./config";

/**
 * Escolhe o idioma a partir do header Accept-Language.
 *
 * Implementação própria em vez de negotiator + intl-localematcher: com dois
 * idiomas, casar pelo prefixo da tag primária (pt-BR -> pt) resolve todos os
 * casos reais e evita duas dependências no caminho de toda requisição.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return {
        primary: tag.toLowerCase().split("-")[0] ?? "",
        q: Number.isFinite(q) ? q : 0,
        index,
      };
    })
    .filter((entry) => entry.primary && entry.q > 0)
    // q maior primeiro; empate mantém a ordem do header
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { primary } of ranked) {
    if (hasLocale(primary)) return primary;
  }
  return defaultLocale;
}
