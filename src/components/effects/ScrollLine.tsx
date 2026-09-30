"use client";

import { useScroll } from "motion/react";
import * as m from "motion/react-m";
import { type ReactNode, useRef } from "react";

/**
 * Linha vertical que se preenche conforme o scroll passa pelo conteúdo.
 * Controlada pelo próprio scroll do visitante, então vale também com reduced motion.
 * Os marcadores das etapas ficam no conteúdo, alinhados em `left: 7px`.
 */
export function ScrollLine({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div aria-hidden className="absolute top-3 bottom-3 left-[7px] w-px bg-border" />
      <m.div
        aria-hidden
        className="absolute top-3 bottom-3 left-[7px] w-px origin-top bg-accent"
        style={{ scaleY: scrollYProgress }}
      />
      {children}
    </div>
  );
}
