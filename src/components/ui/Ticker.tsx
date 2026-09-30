/*
 * Inspirado em React Bits "LogoLoop" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Reescrito em CSS (.ticker em globals.css): sem JavaScript, pausa no hover e no
 * foco, parado e em grade com reduced motion. Server Component.
 */

type TickerProps = {
  items: readonly string[];
  label: string;
  /** Segundos para uma volta completa. */
  duration?: number;
};

export function Ticker({ items, label, duration = 45 }: TickerProps) {
  return (
    <div className="ticker relative overflow-hidden" role="region" aria-label={label}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div
        aria-hidden
        className="ticker-track flex w-max"
        style={{ ["--ticker-duration" as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) =>
          items.map((item) => (
            <span
              key={`${copy}-${item}`}
              className={[
                "flex items-center gap-8 pr-8 font-mono text-sm whitespace-nowrap text-ink-quiet md:text-base",
                // A segunda cópia só existe para o loop contínuo; some com reduced motion.
                copy === 1 ? "ticker-dup" : "",
              ].join(" ")}
            >
              {item}
              <span className="size-1 rounded-full bg-accent" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
