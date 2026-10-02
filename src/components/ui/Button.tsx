import Link from "next/link";
import type { ReactNode } from "react";

const VARIANTS = {
  primary: "border border-ink bg-ink text-bg hover:bg-bg hover:text-ink",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink-quiet hover:text-ink",
} as const;

const SIZES = {
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
} as const;

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Botão do site. Sempre um link por enquanto: nenhuma ação do site é um <button>
 * fora de formulário (que entra na Fase 6). Âncoras (#) usam <a>; rotas usam next/link.
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold tracking-tight whitespace-nowrap uppercase transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
