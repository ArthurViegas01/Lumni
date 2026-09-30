import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicesHub } from "@/components/sections/ServicePages";
import { listServices } from "@/content/services";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

// URL pública em inglês: /en/services (reescrita em next.config.ts, mapa em i18n/routes.ts).

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/servicos">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { servicesPage } = await getDictionary(locale);
  return pageMetadata({
    locale,
    route: { name: "services" },
    title: servicesPage.meta.title,
    description: servicesPage.meta.description,
  });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/servicos">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <ServicesHub
      locale={locale}
      services={listServices(locale)}
      page={dict.servicesPage}
      cta={dict.cta}
    />
  );
}
