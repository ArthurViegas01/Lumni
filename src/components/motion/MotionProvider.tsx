"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * LazyMotion em modo estrito: todo componente animado usa `m.*` (de "motion/react-m")
 * e as features de animação chegam num chunk separado, depois do primeiro paint.
 * Usar `motion.*` dentro deste provider lança erro de propósito — é o que mantém o
 * JS inicial dentro do orçamento (PLANO_DE_IMPLEMENTACAO.md, 4.1).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
