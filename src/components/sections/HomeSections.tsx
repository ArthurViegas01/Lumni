import { GridBackdrop } from "@/components/effects/GridBackdrop";
import { SupplierDiagram } from "@/components/effects/SupplierDiagram";
import { Section } from "@/components/ui/Section";
import { Ticker } from "@/components/ui/Ticker";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { FaqList, SectionHeading, StepsSection } from "./Blocks";

type Sections = Dictionary["sections"];

/** O problema de coordenar três fornecedores contra um responsável só. */
export function SupplierSection({ data }: { data: Sections["supplier"] }) {
  const labels = {
    company: data.company,
    vendors: [data.vendors[0], data.vendors[1], data.vendors[2]] as const,
    hub: site.name,
    fronts: [data.fronts[0], data.fronts[1], data.fronts[2], data.fronts[3]] as const,
  };

  return (
    <Section theme="light" aria-labelledby="problema-titulo">
      <SectionHeading
        id="problema-titulo"
        eyebrow={data.eyebrow}
        title={data.title}
        lead={data.lead}
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {(["before", "after"] as const).map((variant) => (
          <figure
            key={variant}
            className={`rounded-lg border p-6 ${variant === "after" ? "border-accent/40 bg-surface" : "border-border"}`}
          >
            <p className="font-mono text-xs tracking-widest text-ink-quiet uppercase">
              {data[variant].title}
            </p>
            <div className="mx-auto mt-4 max-w-sm">
              <SupplierDiagram labels={labels} variant={variant} />
            </div>
            <figcaption className="mt-4 text-sm text-ink-quiet">{data[variant].caption}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/** As quatro etapas de trabalho, com a linha que se preenche no scroll. */
export function ProcessSection({ data }: { data: Sections["process"] }) {
  return (
    <StepsSection
      id="processo"
      headingId="processo-titulo"
      eyebrow={data.eyebrow}
      title={data.title}
      lead={data.lead}
      steps={data.steps}
    />
  );
}

/** Faixa de tecnologias em loop. */
export function StackSection({ data }: { data: Sections["stack"] }) {
  return (
    <section className="theme-dark border-y border-border bg-bg py-10" aria-label={data.title}>
      <div className="mx-auto mb-6 max-w-site px-4 md:px-8">
        <p className="font-mono text-xs tracking-widest text-ink-quiet uppercase">
          {data.eyebrow} · {data.title}
        </p>
      </div>
      <Ticker items={data.items} label={data.title} />
    </section>
  );
}

/** Perguntas frequentes da home. */
export function FaqSection({ data }: { data: Sections["faq"] }) {
  return (
    <Section id="faq" theme="light" surface aria-labelledby="faq-titulo">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <SectionHeading id="faq-titulo" eyebrow={data.eyebrow} title={data.title} />
        <FaqList items={data.items} />
      </div>
    </Section>
  );
}

/** Chamada final da home, alvo dos CTAs de todo o site. O formulário entra na Fase 6. */
export function ContactSection({ data }: { data: Sections["contact"] }) {
  return (
    <Section id="contato" theme="dark" aria-labelledby="contato-titulo" className="text-center">
      <GridBackdrop />
      <SectionHeading
        id="contato-titulo"
        eyebrow={data.eyebrow}
        title={data.title}
        lead={data.lead}
        align="center"
      />
    </Section>
  );
}
