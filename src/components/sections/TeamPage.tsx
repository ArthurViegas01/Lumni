import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { CtaBand, PageHero, SectionHeading, StepsSection } from "./Blocks";

/** Página /time: especialidades do time e forma de trabalho. Sem contagem de pessoas (D3). */
export function TeamPage({
  locale,
  page,
  process,
  cta,
}: {
  locale: Locale;
  page: Dictionary["teamPage"];
  process: Dictionary["sections"]["process"];
  cta: Dictionary["cta"];
}) {
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section aria-labelledby="especialidades-titulo">
        <SectionHeading id="especialidades-titulo" title={page.specialtiesTitle} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.specialties.map((item, i) => (
            <li key={item.name}>
              <Reveal index={i} className="h-full">
                <SpotlightCard className="h-full border-border bg-surface/70 p-5">
                  <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-medium text-ink">{item.name}</h3>
                  <p className="mt-2 text-sm text-ink-quiet">{item.text}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
      <StepsSection
        headingId="processo-time-titulo"
        eyebrow={process.eyebrow}
        title={process.title}
        lead={process.lead}
        steps={process.steps}
      />
      <CtaBand {...cta} href={href(locale, { name: "home" }, "contato")} />
    </>
  );
}
