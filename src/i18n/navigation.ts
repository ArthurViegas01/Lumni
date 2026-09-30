import type { Locale } from "./config";
import { href, type Route } from "./routes";

/** Destinos que o dicionário pode citar em links de navegação. */
const NAV_TARGETS = {
  home: { name: "home" },
  services: { name: "services" },
  team: { name: "team" },
} as const satisfies Record<string, Route>;

type NavTarget = keyof typeof NAV_TARGETS;

function isNavTarget(value: string): value is NavTarget {
  return value in NAV_TARGETS;
}

/**
 * Converte os links do dicionário ({ label, to, hash? }) em URLs reais.
 * Um `to` desconhecido é erro de dicionário: falha no build, não em produção.
 */
export function resolveNavLinks(
  locale: Locale,
  links: readonly { label: string; to: string; hash?: string }[],
): { label: string; href: string }[] {
  return links.map(({ label, to, hash }) => {
    if (!isNavTarget(to)) throw new Error(`Destino de navegação desconhecido: "${to}"`);
    return { label, href: href(locale, NAV_TARGETS[to], hash) };
  });
}
