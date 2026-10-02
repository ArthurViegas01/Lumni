import { Magnet } from "@/components/effects/Magnet";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { StarBorder } from "@/components/ui/StarBorder";
import type { ServiceContent } from "@/content/services";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href, type ServiceId } from "@/i18n/routes";
import { CtaBand, FaqList, PageHero, SectionHeading, StepsSection } from "./Blocks";

type ServiceSummary = { id: ServiceId; content: ServiceContent };

/** Cartão de uma linha de serviço, com link para a página dela. */
export function ServiceCard({
  locale,
  service,
  cta,
  featured = false,
}: {
  locale: Locale;
  service: ServiceSummary;
  cta: string;
  featured?: boolean;
}) {
  const card = (
    <SpotlightCard
      className={`group h-full ${featured ? "border-transparent bg-surface" : "border-border bg-surface/70"}`}
    >
      <a
        href={href(locale, { name: "service", id: service.id })}
        className="flex h-full flex-col p-5 focus-visible:outline-none"
      >
        <span className="font-medium text-ink">{service.content.name}</span>
        <span className="mt-1 text-sm text-ink-quiet">{service.content.pain}</span>
        <span className="mt-4 font-mono text-xs tracking-widest text-accent uppercase">
          {cta}{" "}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </a>
    </SpotlightCard>
  );
  return featured ? <StarBorder className="h-full">{card}</StarBorder> : card;
}

/** Página /servicos: as linhas disponíveis no idioma, a prioritária em destaque. */
export function ServicesHub({
  locale,
  services,
  page,
  cta,
}: {
  locale: Locale;
  services: ServiceSummary[];
  page: Dictionary["servicesPage"];
  cta: Dictionary["cta"];
}) {
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section aria-label={page.title}>
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <li key={service.id}>
              <Reveal index={i} className="h-full">
                <ServiceCard
                  locale={locale}
                  service={service}
                  cta={page.cardCta}
                  featured={i === 0}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand {...cta} href={href(locale, { name: "home" }, "contato")} />
    </>
  );
}

/**
 * Página de uma linha de serviço. Ordem do plano (Fase 5): dor -> inclusos ->
 * como funciona -> não incluso -> investimento -> FAQ -> outras frentes -> CTA.
 */
export function ServiceDetail({
  locale,
  service,
  others,
  labels,
  cta,
}: {
  locale: Locale;
  service: ServiceSummary;
  others: ServiceSummary[];
  labels: Dictionary["servicePage"];
  cta: Dictionary["cta"];
}) {
  const { content } = service;
  const contact = href(locale, { name: "home" }, "contato");

  return (
    <>
      <PageHero
        eyebrow={content.name}
        title={content.headline}
        lead={content.lead}
        back={{ label: labels.backToServices, href: href(locale, { name: "services" }) }}
        actions={
          <>
            <Magnet>
              <Button href={contact}>{labels.primary}</Button>
            </Magnet>
            <Button href="#como-funciona" variant="secondary">
              {labels.secondary}
            </Button>
          </>
        }
      />

      <Section aria-labelledby="incluso-titulo">
        <SectionHeading id="incluso-titulo" title={labels.included} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.included.map((item, i) => (
            <li key={item.title}>
              <Reveal index={i} className="h-full">
                <SpotlightCard className="h-full border-border bg-surface/70 p-5">
                  <h3 className="font-medium text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-quiet">{item.text}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <StepsSection
        id="como-funciona"
        headingId="etapas-titulo"
        title={labels.steps}
        steps={content.steps}
      />

      <Section surface aria-labelledby="escopo-titulo">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <SectionHeading id="escopo-titulo" title={labels.excluded} lead={labels.excludedLead} />
            <ul className="mt-8 flex flex-col gap-3">
              {content.excluded.map((item) => (
                <li key={item} className="flex gap-3 text-ink-quiet">
                  <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-ink-quiet" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-bg p-6 md:p-8">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">
              {labels.pricing}
            </p>
            <h3 className="display-caps mt-3 text-h2 text-ink">{content.pricing.title}</h3>
            <p className="mt-4 text-ink-quiet">{content.pricing.text}</p>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="faq-servico-titulo">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <SectionHeading id="faq-servico-titulo" title={labels.faq} />
          <FaqList items={content.faq} />
        </div>
      </Section>

      <Section surface aria-labelledby="outras-titulo">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="outras-titulo" title={labels.others} />
          <a
            href={href(locale, { name: "team" })}
            className="font-mono text-xs tracking-widest text-accent uppercase hover:underline"
          >
            {labels.teamLink} →
          </a>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {others.map((other) => (
            <li key={other.id}>
              <ServiceCard locale={locale} service={other} cta={labels.secondary} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand {...cta} href={contact} />
    </>
  );
}
