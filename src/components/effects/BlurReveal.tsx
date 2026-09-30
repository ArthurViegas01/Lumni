"use client";

/*
 * Adaptado de React Bits "BlurText" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Mudanças: LazyMotion (`m`), variants com stagger em vez de um IntersectionObserver
 * por instância, texto acessível num único rótulo, reduced motion, quebra de linha natural.
 */
import { useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { EASE, STAGGER } from "@/lib/motion";

const TAGS = { h2: m.h2, h3: m.h3, p: m.p } as const;

type BlurRevealProps = {
  text: string;
  as?: keyof typeof TAGS;
  className?: string;
  id?: string;
};

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER } },
};

const word: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
  shown: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.55, ease: EASE } },
};

const wordReduced: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.35 } },
};

/** Título que entra palavra por palavra, saindo do desfoque, quando rola para a tela. */
export function BlurReveal({ text, as = "h2", className, id }: BlurRevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  const words = text.split(" ");

  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={container}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden>
          <m.span className="inline-block" variants={reduce ? wordReduced : word}>
            {w}
          </m.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
