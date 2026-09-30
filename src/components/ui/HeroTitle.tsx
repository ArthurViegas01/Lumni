/**
 * <h1> com entrada por palavra em CSS (.word-in em globals.css).
 * CSS e não Motion: o <h1> é o candidato a LCP e não pode esperar hidratação.
 * Server Component.
 */
export function HeroTitle({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 aria-label={text} className={`font-display text-hero text-ink ${className}`}>
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
