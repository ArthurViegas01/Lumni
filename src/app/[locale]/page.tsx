import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroStory } from "@/components/sections/HeroStory";
import {
  ContactSection,
  FaqSection,
  ProcessSection,
  StackSection,
  SupplierSection,
} from "@/components/sections/HomeSections";
import { hasLocale, htmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { meta } = await getDictionary(locale);

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
        "x-default": "/pt",
      },
    },
    openGraph: { title: meta.title, description: meta.description, locale: htmlLang[locale] },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { story, sections } = await getDictionary(locale);

  return (
    <>
      <HeroStory story={story} />
      <SupplierSection data={sections.supplier} />
      <ProcessSection data={sections.process} />
      <StackSection data={sections.stack} />
      <FaqSection data={sections.faq} />
      <ContactSection data={sections.contact} />
    </>
  );
}
