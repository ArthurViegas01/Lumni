import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/sections/ServicePages";
import { getService, listServices } from "@/content/services";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SERVICE_IDS, type ServiceId, servicesIn } from "@/i18n/routes";
import { pageMetadata } from "@/lib/seo";

// O segmento [slug] recebe o id interno (ti-gerenciada). A URL pública em inglês
// (/en/services/managed-it) é reescrita para cá pelo next.config.ts.

/** Só os serviços que existem no idioma: /en/servicos/presenca-digital vira 404. */
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!hasLocale(params.locale)) return [];
  return servicesIn(params.locale).map((slug) => ({ slug }));
}

function resolve(locale: string, slug: string): { locale: Locale; id: ServiceId } {
  if (!hasLocale(locale) || !(SERVICE_IDS as readonly string[]).includes(slug)) notFound();
  return { locale, id: slug as ServiceId };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/servicos/[slug]">): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const { locale, id } = resolve(rawLocale, slug);
  const content = getService(id, locale);
  if (!content) notFound();
  return pageMetadata({
    locale,
    route: { name: "service", id },
    title: content.seo.title,
    description: content.seo.description,
  });
}

export default async function ServicePage({ params }: PageProps<"/[locale]/servicos/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const { locale, id } = resolve(rawLocale, slug);
  const content = getService(id, locale);
  if (!content) notFound();
  const dict = await getDictionary(locale);

  return (
    <ServiceDetail
      locale={locale}
      service={{ id, content }}
      others={listServices(locale).filter((s) => s.id !== id)}
      labels={dict.servicePage}
      cta={dict.cta}
    />
  );
}
