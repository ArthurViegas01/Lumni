import type { ReactNode } from "react";
import { Magnet } from "@/components/effects/Magnet";
import { CubePoster } from "@/components/scene/CubePoster";
import { StoryScene } from "@/components/scene/StoryScene";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { HeroTitle } from "@/components/ui/HeroTitle";
import type { ServiceContent } from "@/content/services";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ServiceId } from "@/i18n/routes";
import { ServiceCard } from "./ServicePages";

type Side = "left" | "right";

/** Uma etapa: 100svh (ou mais, se o texto pedir), texto numa metade, a outra livre para o cubo. */
function Stage({
  side,
  theme = "dark",
  narrow = false,
  children,
}: {
  side: Side;
  theme?: "dark" | "light";
  /** Coluna de texto mais estreita, para dar espaço ao cubo explodido e aos rótulos. */
  narrow?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      data-stage
      className={`${theme === "light" ? "theme-light" : "theme-dark"} flex min-h-svh items-end px-4 pt-24 pb-16 md:items-center md:px-8 md:py-24`}
    >
      <div
        className={`mx-auto flex w-full max-w-site ${side === "right" ? "md:justify-end" : "md:justify-start"}`}
      >
        {/* No mobile o cubo pode passar por trás do texto: um painel garante a leitura. */}
        <div
          className={`w-full rounded-lg bg-bg/85 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none ${narrow ? "md:w-[30%]" : "md:w-[44%]"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function HeroStory({
  locale,
  story,
  services,
}: {
  locale: Locale;
  story: Dictionary["story"];
  /** Linhas disponíveis no idioma: vêm do conteúdo, não do dicionário (fonte única). */
  services: { id: ServiceId; content: ServiceContent }[];
}) {
  const { hero, lines, team, close } = story;
  return (
    <StoryScene poster={<CubePoster />} label={hero.eyebrow} callouts={team.specialties}>
      <Stage side="left">
        <Eyebrow text={hero.eyebrow} scramble />
        <HeroTitle text={hero.title} />
        <p className="mt-6 max-w-measure text-lg text-ink-quiet">{hero.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnet>
            <Button href="#contato">{hero.primary}</Button>
          </Magnet>
          <Button href="#frentes" variant="secondary">
            {hero.secondary}
          </Button>
        </div>
      </Stage>

      <Stage side="right">
        <Heading id="frentes" className="scroll-mt-24">
          {lines.title}
        </Heading>
        <p className="mt-4 max-w-measure text-ink-quiet">{lines.lead}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {services.map((service, i) => (
            <li key={service.id}>
              {/* A primeira linha (T.I. gerenciada) é a prioritária: ganha a borda com brilho. */}
              <ServiceCard
                locale={locale}
                service={service}
                cta={lines.cardCta}
                featured={i === 0}
              />
            </li>
          ))}
        </ul>
      </Stage>

      <Stage side="left" theme="light" narrow>
        <Heading id="especialidades" className="scroll-mt-24">
          {team.title}
        </Heading>
        <p className="mt-4 max-w-measure text-ink-quiet">{team.lead}</p>
        {/* No desktop as especialidades aparecem como rótulos presos às peças do cubo;
            a lista continua no DOM para leitores de tela e para o mobile. */}
        <ul className="mt-8 grid gap-x-6 gap-y-3 font-mono text-sm text-ink sm:grid-cols-2 md:sr-only">
          {team.specialties.map((name) => (
            <li key={name} className="border-t border-border pt-3">
              {name}
            </li>
          ))}
        </ul>
      </Stage>

      <Stage side="left">
        <Heading>{close.title}</Heading>
        <p className="mt-4 max-w-measure text-lg text-ink-quiet">{close.lead}</p>
        <div className="mt-8">
          <Magnet>
            <Button href="#contato">{close.cta}</Button>
          </Magnet>
        </div>
      </Stage>
    </StoryScene>
  );
}
