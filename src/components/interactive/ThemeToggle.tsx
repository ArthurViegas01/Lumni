"use client";

import { useEffect } from "react";
import { hasStoredTheme, setTheme, useTheme } from "./theme-store";

type ThemeToggleProps = {
  /** Rótulo quando o clique leva ao fundo preto, e quando leva ao fundo branco. */
  toDarkLabel: string;
  toLightLabel: string;
  className?: string;
};

/**
 * Botão da barra que inverte papel e carbono. A escolha fica salva; sem escolha,
 * o site segue o sistema — inclusive se o sistema trocar com a página aberta.
 */
export function ThemeToggle({ toDarkLabel, toLightLabel, className = "" }: ThemeToggleProps) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!hasStoredTheme()) {
        document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light");
      }
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === "dark" ? toDarkLabel : toLightLabel}
      title={next === "dark" ? toDarkLabel : toLightLabel}
      className={`flex size-10 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-bg ${className}`}
    >
      {/* Quadrado meio cheio: metade papel, metade carbono. Gira 180° no modo invertido. */}
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className={`size-4 transition-transform duration-300 ${theme === "dark" ? "rotate-180" : ""}`}
      >
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect x="1.5" y="1.5" width="6.5" height="13" fill="currentColor" />
      </svg>
    </button>
  );
}
