import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { hasLocale, htmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { fontVariables } from "../fonts";
import "../globals.css";

// Só os idiomas conhecidos existem: /xx cai no 404 global sem renderizar layout.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body>
        <MotionProvider>
          <SiteHeader locale={locale} nav={dict.nav} />
          <main id="conteudo">{children}</main>
          <SiteFooter locale={locale} footer={dict.footer} nav={dict.nav} />
        </MotionProvider>
      </body>
    </html>
  );
}
