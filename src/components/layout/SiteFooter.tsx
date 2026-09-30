import Link from "next/link";
import { LanguageLink } from "@/components/interactive/LanguageLink";
import { listServices } from "@/content/services";
import { alternateLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { resolveNavLinks } from "@/i18n/navigation";
import { href } from "@/i18n/routes";
import { site } from "@/lib/site";

type SiteFooterProps = {
  locale: Locale;
  footer: Dictionary["footer"];
  nav: Dictionary["nav"];
};

const linkClass = "text-ink-quiet transition-colors hover:text-ink";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 font-mono text-xs tracking-wide text-ink-quiet uppercase">{title}</p>
      <ul className="flex flex-col gap-2 text-sm">{children}</ul>
    </div>
  );
}

export function SiteFooter({ locale, footer, nav }: SiteFooterProps) {
  // Só as frentes publicadas neste idioma: nunca linkar para uma página que não existe.
  const services = listServices(locale);
  const company = [
    ...resolveNavLinks(locale, nav.links),
    { label: nav.cta, href: href(locale, { name: "home" }, "contato") },
  ];

  return (
    <footer className="theme-dark border-t border-border/60 bg-bg">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-8">
        <div className="max-w-xs">
          <Link
            href={href(locale, { name: "home" })}
            aria-label={nav.home}
            className="font-display text-xl font-semibold tracking-tight text-ink"
          >
            {site.name}
          </Link>
          <p className="mt-3 text-sm text-ink-quiet">{footer.tagline}</p>
        </div>

        <nav aria-label={footer.servicesTitle}>
          <FooterColumn title={footer.servicesTitle}>
            {services.map(({ id, content }) => (
              <li key={id}>
                <Link href={href(locale, { name: "service", id })} className={linkClass}>
                  {content.name}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </nav>

        <nav aria-label={footer.companyTitle}>
          <FooterColumn title={footer.companyTitle}>
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </nav>

        <FooterColumn title={footer.languageTitle}>
          <li>
            <LanguageLink
              target={alternateLocale(locale)}
              label={nav.switchLanguage}
              ariaLabel={nav.switchLanguageLabel}
              className={linkClass}
            />
          </li>
        </FooterColumn>
      </div>
      <div className="mx-auto max-w-site border-t border-border/60 px-4 py-6 text-xs text-ink-quiet md:px-8">
        © {new Date().getFullYear()} {site.name}. {footer.rights}
      </div>
    </footer>
  );
}
