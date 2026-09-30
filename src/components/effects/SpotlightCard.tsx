"use client";

/*
 * Adaptado de React Bits "SpotlightCard" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Mudanças: posição da luz por variável CSS (o original fazia setState a cada
 * movimento do mouse), cor do token de destaque, estilo em globals.css (.spotlight-card).
 */
import type { PointerEvent, ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  /** Fundo e cor de borda vêm de quem usa (ex.: `bg-surface/70 border-border`). */
  className?: string;
};

function trackPointer(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <div
      onPointerMove={trackPointer}
      className={`spotlight-card relative overflow-hidden rounded-lg border ${className}`}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
}
