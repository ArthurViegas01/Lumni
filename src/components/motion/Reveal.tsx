"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { DUR, EASE, REVEAL_OFFSET, STAGGER } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Posição no grupo, para stagger. */
  index?: number;
  className?: string;
};

/**
 * Revela o conteúdo ao entrar na viewport, uma única vez.
 * Com prefers-reduced-motion mantém só o fade, sem deslocamento.
 */
export function Reveal({ children, index = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : REVEAL_OFFSET }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DUR.base, ease: EASE, delay: Math.min(index, 5) * STAGGER }}
    >
      {children}
    </m.div>
  );
}
