/**
 * Blocos reaproveitados por todas as páginas. Server Components; os efeitos vêm de effects/.
 * Antes de montar uma seção nova, veja se ela é composição destes blocos.
 */
import type { ReactNode } from "react";
import { BlurReveal } from "@/components/effects/BlurReveal";
import { GridBackdrop } from "@/components/effects/GridBackdrop";
import { Magnet } from "@/components/effects/Magnet";
import { ScrollLine } from "@/components/effects/ScrollLine";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { Container, Section } from "@/components/ui/Section";

/** Cabeçalho padrão de seção: rótulo decifrado + título que entra desfocando + apoio. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={`max-w-measure ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <Eyebrow text={eyebrow} scramble /> : null}
      <BlurReveal id={id} text={title} className="display-caps text-h2 text-ink" />
      {lead ? (
        <Reveal>
          <p className="mt-4 text-lg text-ink-quiet">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

/**
 * Topo escuro das páginas internas: rótulo, <h1> que entra por palavra, apoio e ações.
 * Ocupa ~70% da tela para a próxima seção aparecer e convidar à rolagem.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  back,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: ReactNode;
  /** Link de volta acima do rótulo (ex.: "Todas as frentes"). */
  back?: { label: string; href: string };
}) {
  return (
    <section className="tone-base relative overflow-hidden border-b border-border bg-bg pt-36 pb-20 md:min-h-[72svh] md:pt-44 md:pb-28">
      <GridBackdrop />
      <Container>
        {back ? (
          <a
            href={back.href}
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-ink-quiet uppercase hover:text-ink"
          >
            <span aria-hidden>←</span> {back.label}
          </a>
        ) : null}
        <Eyebrow text={eyebrow} scramble />
        <div className="max-w-4xl">
          <HeroTitle text={title} />
        </div>
        <p className="mt-6 max-w-measure text-lg text-ink-quiet">{lead}</p>
        {actions ? <div className="mt-10 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </section>
  );
}

/** Etapas numeradas com a linha que preenche no scroll. */
export function StepsList({
  steps,
}: {
  steps: readonly { name: string; duration: string; text: string }[];
}) {
  return (
    <ScrollLine>
      <ol className="flex flex-col gap-12">
        {steps.map((step, i) => (
          <li key={step.name} className="relative pl-10">
            <span
              aria-hidden
              className="absolute top-1.5 left-0 size-[15px] border border-accent bg-bg"
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
  );
}

/** Seção escura de etapas: título fixo à esquerda no desktop, etapas à direita. */
export function StepsSection({
  id,
  headingId,
  eyebrow,
  title,
  lead,
  steps,
}: {
  id?: string;
  headingId: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  steps: readonly { name: string; duration: string; text: string }[];
}) {
  return (
    <Section id={id} tone="invert" aria-labelledby={headingId}>
      <GridBackdrop />
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <SectionHeading id={headingId} eyebrow={eyebrow} title={title} lead={lead} />
        </div>
        <StepsList steps={steps} />
      </div>
    </Section>
  );
}

/** Perguntas com <details> nativo: acessível, sem JavaScript, altura animada em CSS. */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="border-t border-border">
      {items.map((item) => (
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
  );
}

/** Chamada final das páginas internas: leva para o contato da home até o formulário existir. */
export function CtaBand({
  title,
  lead,
  button,
  href,
}: {
  title: string;
  lead: string;
  button: string;
  href: string;
}) {
  return (
    <Section tone="invert" aria-labelledby="cta-titulo" className="text-center">
      <GridBackdrop />
      <SectionHeading id="cta-titulo" title={title} lead={lead} align="center" />
      <div className="mt-10 flex justify-center">
        <Magnet>
          <Button href={href}>{button}</Button>
        </Magnet>
      </div>
    </Section>
  );
}
