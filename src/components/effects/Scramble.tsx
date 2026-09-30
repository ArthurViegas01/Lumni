"use client";

/*
 * Inspirado em React Bits "DecryptedText" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Reescrito enxuto: um único requestAnimationFrame durante a revelação, texto real
 * no HTML do servidor (SEO e sem JS), leitores de tela recebem só o texto final.
 * Use em texto monoespaçado: a largura não muda enquanto embaralha.
 */
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-";

type ScrambleProps = {
  text: string;
  className?: string;
  /** Milissegundos entre quadros de embaralhamento. */
  speed?: number;
};

export function Scramble({ text, className, speed = 40 }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let last = 0;
    let step = 0;

    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now;
        step += 1;
        const revealed = Math.floor(step / 2);
        setDisplay(
          Array.from(text, (ch, i) =>
            i < revealed || ch === " " ? ch : CHARSET[Math.floor(Math.random() * CHARSET.length)],
          ).join(""),
        );
        if (revealed >= text.length) return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden>
        {display}
      </span>
    </span>
  );
}
