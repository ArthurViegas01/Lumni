import Link from "next/link";
import type { ReactNode } from "react";

const VARIANTS = {
  primary: "bg-accent text-accent-ink hover:opacity-90",
  secondary: "border border-border text-ink hover:border-ink-quiet",
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
  const classes = `inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap transition-[opacity,border-color,color] ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

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
