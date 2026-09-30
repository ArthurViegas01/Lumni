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
import { listServices } from "@/content/services";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { meta } = await getDictionary(locale);
  return pageMetadata({
    locale,
    route: { name: "home" },
    title: meta.title,
    description: meta.description,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { story, sections } = await getDictionary(locale);

  return (
    <>
      <HeroStory locale={locale} story={story} services={listServices(locale)} />
      <SupplierSection data={sections.supplier} />
      <ProcessSection data={sections.process} />
      <StackSection data={sections.stack} />
      <FaqSection data={sections.faq} />
      <ContactSection data={sections.contact} />
    </>
  );
}
