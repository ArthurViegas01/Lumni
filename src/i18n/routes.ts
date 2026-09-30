/**
 * Mapa de rotas por idioma. Fonte única de toda URL do site.
 *
 * As pastas em app/[locale] usam o nome em português (`servicos`, `time`). Em
 * inglês a URL pública é traduzida (`/en/services/managed-it`); o next.config
 * reescreve a URL pública para a pasta interna e redireciona (308) quem acessa a
 * forma interna, para não existir conteúdo duplicado.
 *
 * Nenhum link do site é escrito à mão: use `href()`.
 * Módulo puro e sem alias "@/": é importado também pelo next.config.ts.
 */
import { type Locale, locales } from "./config";

export const SERVICE_IDS = ["ti-gerenciada", "automacao", "squad", "presenca-digital"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

/** Slug público de cada linha por idioma. Sem entrada = a página não existe naquele idioma. */
const SERVICE_SLUGS: Record<ServiceId, Partial<Record<Locale, string>>> = {
  "ti-gerenciada": { pt: "ti-gerenciada", en: "managed-it" },
  automacao: { pt: "automacao", en: "automation" },
  squad: { pt: "squad", en: "squad" },
  // Serviço presencial e local: sem versão em inglês (plano, seção 2.1).
  "presenca-digital": { pt: "presenca-digital" },
};

/** Segmentos públicos por idioma. A chave é o nome da pasta em app/[locale]. */
const SEGMENTS = {
  servicos: { pt: "servicos", en: "services" },
  time: { pt: "time", en: "team" },
} as const satisfies Record<string, Record<Locale, string>>;

export type Route =
  { name: "home" } | { name: "services" } | { name: "service"; id: ServiceId } | { name: "team" };

/** A rota existe nesse idioma? */
export function routeExists(locale: Locale, route: Route): boolean {
  return route.name !== "service" || SERVICE_SLUGS[route.id][locale] !== undefined;
}

/** Idiomas em que a rota existe (para hreflang e sitemap). */
export function localesOf(route: Route): Locale[] {
  return locales.filter((locale) => routeExists(locale, route));
}

/** Serviços disponíveis num idioma, na ordem de SERVICE_IDS. */
export function servicesIn(locale: Locale): ServiceId[] {
  return SERVICE_IDS.filter((id) => SERVICE_SLUGS[id][locale] !== undefined);
}

/**
 * URL pública da rota. Lança erro se a rota não existe no idioma — chame
 * `routeExists` antes quando a disponibilidade variar (ex.: troca de idioma).
 */
export function href(locale: Locale, route: Route, hash?: string): string {
  const path = publicPath(locale, route);
  return hash ? `${path}#${hash}` : path;
}

function publicPath(locale: Locale, route: Route): string {
  switch (route.name) {
    case "home":
      return `/${locale}`;
    case "services":
      return `/${locale}/${SEGMENTS.servicos[locale]}`;
    case "team":
      return `/${locale}/${SEGMENTS.time[locale]}`;
    case "service": {
      const slug = SERVICE_SLUGS[route.id][locale];
      if (!slug) throw new Error(`Serviço "${route.id}" não existe em "${locale}"`);
      return `/${locale}/${SEGMENTS.servicos[locale]}/${slug}`;
    }
  }
}

/** Caminho interno (pastas do app/) que atende a rota. */
export function internalPath(locale: Locale, route: Route): string {
  switch (route.name) {
    case "home":
      return `/${locale}`;
    case "services":
      return `/${locale}/servicos`;
    case "team":
      return `/${locale}/time`;
    case "service":
      return `/${locale}/servicos/${route.id}`;
  }
}

/** Todas as rotas do site, em todos os idiomas em que existem. */
export function allRoutes(): { locale: Locale; route: Route }[] {
  const routes: Route[] = [
    { name: "home" },
    { name: "services" },
    ...SERVICE_IDS.map((id) => ({ name: "service" as const, id })),
    { name: "team" },
  ];
  return routes.flatMap((route) => localesOf(route).map((locale) => ({ locale, route })));
}

/**
 * Reconhece a rota a partir de um pathname, na forma pública OU interna.
 *
 * As duas formas aparecem na prática: no navegador `usePathname()` devolve a URL
 * pública (`/en/services/managed-it`), mas na pré-renderização estática ele devolve
 * a pasta interna (`/en/servicos/ti-gerenciada`), porque o rewrite não existe no
 * build. Aceitar só a pública gerava link de idioma errado no HTML e divergência
 * na hidratação. Não há ambiguidade: nenhuma forma interna coincide com uma
 * pública de outra rota (garantido em routes.test.ts).
 */
export function matchPath(pathname: string): { locale: Locale; route: Route } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const entry of allRoutes()) {
    if (
      publicPath(entry.locale, entry.route) === clean ||
      internalPath(entry.locale, entry.route) === clean
    ) {
      return entry;
    }
  }
  return null;
}

/**
 * Link para a mesma página no outro idioma. Se ela não existe lá, cai no pai
 * mais próximo que existe (serviço -> hub de serviços -> home).
 */
export function equivalentHref(pathname: string, target: Locale): string {
  const match = matchPath(pathname);
  if (!match) return href(target, { name: "home" });
  if (routeExists(target, match.route)) return href(target, match.route);
  return href(target, { name: match.route.name === "service" ? "services" : "home" });
}

/** Reescritas: URL pública -> pasta interna, só onde as duas diferem. */
export function rewriteRules(): { source: string; destination: string }[] {
  return allRoutes()
    .map(({ locale, route }) => ({
      source: publicPath(locale, route),
      destination: internalPath(locale, route),
    }))
    .filter((rule) => rule.source !== rule.destination);
}

/** Redirecionamentos 308: forma interna acessada direto -> URL pública canônica. */
export function redirectRules(): { source: string; destination: string; permanent: true }[] {
  return rewriteRules().map(({ source, destination }) => ({
    source: destination,
    destination: source,
    permanent: true,
  }));
}
