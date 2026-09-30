import { BlurReveal } from "@/components/effects/BlurReveal";
import { GridBackdrop } from "@/components/effects/GridBackdrop";
import { ScrollLine } from "@/components/effects/ScrollLine";
import { SupplierDiagram } from "@/components/effects/SupplierDiagram";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Ticker } from "@/components/ui/Ticker";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

type Sections = Dictionary["sections"];

/** Cabeçalho padrão de seção: rótulo decifrado + título que entra desfocando + apoio. */
function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="max-w-measure">
      <Eyebrow text={eyebrow} scramble />
      <BlurReveal id={id} text={title} className="font-display text-h2 text-ink" />
      {lead ? (
        <Reveal>
          <p className="mt-4 text-lg text-ink-quiet">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

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
    <Section id="processo" theme="dark" aria-labelledby="processo-titulo">
      <GridBackdrop />
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <SectionHeading
            id="processo-titulo"
            eyebrow={data.eyebrow}
            title={data.title}
            lead={data.lead}
          />
        </div>
        <ScrollLine>
          <ol className="flex flex-col gap-12">
            {data.steps.map((step, i) => (
              <li key={step.name} className="relative pl-10">
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 size-[15px] rounded-full border border-accent bg-bg"
                />
                <Reveal index={i}>
                  <p className="font-mono text-xs tracking-widest text-accent uppercase">
                    {String(i + 1).padStart(2, "0")} · {step.duration}
                  </p>
                  <h3 className="mt-2 text-xl font-medium text-ink">{step.name}</h3>
                  <p className="mt-2 text-ink-quiet">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </ScrollLine>
      </div>
    </Section>
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

/** Perguntas frequentes com <details> nativo: acessível e sem JavaScript. */
export function FaqSection({ data }: { data: Sections["faq"] }) {
  return (
    <Section id="faq" theme="light" surface aria-labelledby="faq-titulo">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <SectionHeading id="faq-titulo" eyebrow={data.eyebrow} title={data.title} />
        <div className="border-t border-border">
          {data.items.map((item) => (
            <details key={item.q} className="faq-item group border-b border-border">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-lg text-ink">
                {item.q}
                <span
                  aria-hidden
                  className="faq-icon relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-current"
                />
              </summary>
              <p className="max-w-measure pb-6 text-ink-quiet">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** Chamada final. O formulário qualificador entra na Fase 6. */
export function ContactSection({ data }: { data: Sections["contact"] }) {
  return (
    <Section id="contato" theme="dark" aria-labelledby="contato-titulo" className="text-center">
      <GridBackdrop />
      <div className="mx-auto flex max-w-measure flex-col items-center">
        <SectionHeading
          id="contato-titulo"
          eyebrow={data.eyebrow}
          title={data.title}
          lead={data.lead}
        />
      </div>
    </Section>
  );
}
