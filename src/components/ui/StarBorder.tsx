/*
 * Adaptado de React Bits "StarBorder" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Mudanças: CSS puro em globals.css (.star-border), sem JavaScript; cor do token
 * de destaque; parado com reduced motion. Server Component.
 */
import type { ReactNode } from "react";

/** Moldura com dois brilhos percorrendo a borda. Para destacar um único item por tela. */
export function StarBorder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`star-border ${className}`}>
      <span aria-hidden className="star" />
      <span aria-hidden className="star" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
