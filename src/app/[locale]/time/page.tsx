import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamPage } from "@/components/sections/TeamPage";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

// URL pública em inglês: /en/team (reescrita em next.config.ts).

export async function generateMetadata({ params }: PageProps<"/[locale]/time">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { teamPage } = await getDictionary(locale);
  return pageMetadata({
    locale,
    route: { name: "team" },
    title: teamPage.meta.title,
    description: teamPage.meta.description,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/time">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <TeamPage locale={locale} page={dict.teamPage} process={dict.sections.process} cta={dict.cta} />
  );
}
