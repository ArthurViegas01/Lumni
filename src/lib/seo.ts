import type { Metadata } from "next";
import { htmlLang, type Locale } from "@/i18n/config";
import { href, localesOf, type Route } from "@/i18n/routes";

/**
 * canonical + hreflang de uma rota. hreflang só lista idiomas em que a página
 * existe (apontar para página inexistente faz o Google ignorar o par inteiro);
 * x-default aponta para o português quando ele existe.
 */
export function alternatesFor(locale: Locale, route: Route): Metadata["alternates"] {
  const available = localesOf(route);
  const languages: Record<string, string> = Object.fromEntries(
    available.map((l) => [htmlLang[l], href(l, route)]),
  );
  if (available.includes("pt")) languages["x-default"] = href("pt", route);
  return { canonical: href(locale, route), languages };
}

/** Metadados padrão de uma página: título, descrição, canonical, hreflang e Open Graph. */
export function pageMetadata({
  locale,
  route,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale;
  route: Route;
  title: string;
  description: string;
  /** true na home: o título não recebe o sufixo " · Lumni". */
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, route),
    openGraph: { title, description, locale: htmlLang[locale], url: href(locale, route) },
  };
}
