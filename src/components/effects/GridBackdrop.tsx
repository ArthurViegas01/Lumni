"use client";

/*
 * Inspirado em React Bits "ShapeGrid" (reactbits.dev), MIT + Commons Clause,
 * © 2026 David Haz — ver THIRD_PARTY_NOTICES.md.
 * Reescrito sem canvas nem loop: a grade é CSS (.grid-backdrop em globals.css) e
 * o halo que acende as linhas segue o ponteiro por variável CSS. Parado, custo zero.
 */
import { useEffect, useRef } from "react";

/** Grade técnica de fundo. Coloque como primeiro filho de um elemento `relative`. */
export function GridBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || !window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      el.style.setProperty("--grid-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--grid-y", `${event.clientY - rect.top}px`);
      el.style.setProperty("--grid-o", "1");
    };
    const onLeave = () => el.style.setProperty("--grid-o", "0");

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`grid-backdrop pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
