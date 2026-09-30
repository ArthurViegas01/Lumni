import Link from "next/link";
import { MobileMenu } from "@/components/interactive/MobileMenu";
import { alternateLocale, htmlLang, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

type SiteHeaderProps = { locale: Locale; nav: Dictionary["nav"] };

export function SiteHeader({ locale, nav }: SiteHeaderProps) {
  const other = alternateLocale(locale);
  // Por enquanto a navegação aponta para seções da home; vira rotas na Fase 5.
  const links = nav.links.map((link) => ({ label: link.label, href: `/${locale}#${link.anchor}` }));
  const cta = { label: nav.cta, href: `/${locale}#contato` };
  const language = {
    label: nav.switchLanguage,
    href: `/${other}`,
    hrefLang: htmlLang[other],
    ariaLabel: nav.switchLanguageLabel,
  };

  return (
    <header className="theme-dark fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:rounded-sm focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink"
      >
        {nav.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-site items-center justify-between px-4 md:px-8">
        <Link
          href={`/${locale}`}
          aria-label={nav.home}
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          {site.name}
        </Link>

        <nav aria-label={nav.label} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-ink-quiet transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href={language.href}
            hrefLang={language.hrefLang}
            aria-label={language.ariaLabel}
            className="hidden rounded-sm px-2 py-1 font-mono text-xs tracking-wide text-ink-quiet uppercase hover:text-ink md:inline-block"
          >
            {language.label}
          </Link>
          <a
            href={cta.href}
            className="hidden rounded-sm bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 sm:inline-block"
          >
            {cta.label}
          </a>
          <MobileMenu
            links={links}
            cta={cta}
            language={language}
            openLabel={nav.openMenu}
            closeLabel={nav.closeMenu}
          />
        </div>
      </div>
    </header>
  );
}
