"use client";

/*
 * Adaptado de React Bits "Magnet" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Mudanças: motion values com mola (o original fazia setState a cada movimento do
 * mouse), mede o invólucro parado (não o elemento deslocado), só com ponteiro fino
 * e sem reduced motion.
 */
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { type ReactNode, useEffect, useRef } from "react";

type MagnetProps = {
  children: ReactNode;
  /** Distância extra, em px, em volta do elemento onde o ímã já atua. */
  padding?: number;
  /** Quanto maior, mais fraco o puxão. */
  strength?: number;
  className?: string;
};

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

export function Magnet({ children, padding = 60, strength = 4, className = "" }: MagnetProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const el = anchor.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const near =
        Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding;
      x.set(near ? dx / strength : 0);
      y.set(near ? dy / strength : 0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, padding, strength, x, y]);

  return (
    <span ref={anchor} className={`inline-block ${className}`}>
      <m.span className="inline-block" style={{ x: springX, y: springY }}>
        {children}
      </m.span>
    </span>
  );
}
