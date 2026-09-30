import type { ReactNode } from "react";
import { Magnet } from "@/components/effects/Magnet";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { CubePoster } from "@/components/scene/CubePoster";
import { StoryScene } from "@/components/scene/StoryScene";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StarBorder } from "@/components/ui/StarBorder";
import type { Dictionary } from "@/i18n/dictionaries";

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

/** Título do hero com entrada por palavra em CSS (não espera hidratação: é o LCP). */
function HeroTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 aria-label={text} className="font-display text-hero text-ink">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden>
          <span className="word-in" style={{ ["--i" as string]: i }}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}

export function HeroStory({ story }: { story: Dictionary["story"] }) {
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
        <h2 id="frentes" className="scroll-mt-24 font-display text-h2 text-ink">
          {lines.title}
        </h2>
        <p className="mt-4 max-w-measure text-ink-quiet">{lines.lead}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {lines.items.map((item, i) => {
            const featured = i === 0;
            const card = (
              <SpotlightCard
                className={`h-full p-4 ${featured ? "border-transparent bg-surface" : "border-border bg-surface/70"}`}
              >
                <p className="font-medium text-ink">{item.name}</p>
                <p className="mt-1 text-sm text-ink-quiet">{item.pain}</p>
              </SpotlightCard>
            );
            // A primeira frente (T.I. gerenciada) é a prioritária: ganha a borda com brilho.
            return (
              <li key={item.name}>
                {featured ? <StarBorder className="h-full">{card}</StarBorder> : card}
              </li>
            );
          })}
        </ul>
      </Stage>

      <Stage side="left" theme="light" narrow>
        <h2 id="especialidades" className="scroll-mt-24 font-display text-h2 text-ink">
          {team.title}
        </h2>
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
        <h2 className="font-display text-h2 text-ink">{close.title}</h2>
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
