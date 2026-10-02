import Link from "next/link";
import { LanguageLink } from "@/components/interactive/LanguageLink";
import { MobileMenu } from "@/components/interactive/MobileMenu";
import { ThemeToggle } from "@/components/interactive/ThemeToggle";
import { alternateLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { resolveNavLinks } from "@/i18n/navigation";
import { href } from "@/i18n/routes";
import { site } from "@/lib/site";

type SiteHeaderProps = { locale: Locale; nav: Dictionary["nav"] };

export function SiteHeader({ locale, nav }: SiteHeaderProps) {
  const links = resolveNavLinks(locale, nav.links);
  const cta = { label: nav.cta, href: href(locale, { name: "home" }, "contato") };
  const language = {
    target: alternateLocale(locale),
    label: nav.switchLanguage,
    ariaLabel: nav.switchLanguageLabel,
  };

  return (
    <header className="tone-base fixed inset-x-0 top-0 z-50 border-b border-border bg-bg">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:bg-ink focus:px-3 focus:py-2 focus:text-bg"
      >
        {nav.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-site items-center justify-between px-4 md:px-8">
        <Link
          href={href(locale, { name: "home" })}
          aria-label={nav.home}
          className="text-xl font-extrabold tracking-tighter text-ink uppercase"
        >
          {site.name}
        </Link>

        <nav aria-label={nav.label} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-quiet uppercase transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageLink
            target={language.target}
            label={language.label}
            ariaLabel={language.ariaLabel}
            className="hidden px-2 py-1 font-mono text-xs tracking-wide text-ink-quiet uppercase hover:text-ink md:inline-block"
          />
          <Link
            href={cta.href}
            className="hidden border border-ink bg-ink px-4 py-2 text-sm font-semibold text-bg uppercase transition-colors hover:bg-bg hover:text-ink sm:inline-block"
          >
            {cta.label}
          </Link>
          <ThemeToggle toDarkLabel={nav.themeToDark} toLightLabel={nav.themeToLight} />
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
