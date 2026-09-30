import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  theme?: "light" | "dark";
  /** Fundo `surface` em vez de `bg`, para alternar seções vizinhas do mesmo tema. */
  surface?: boolean;
  className?: string;
  "aria-labelledby"?: string;
};

/**
 * Seção de página: tema, espaçamento vertical padrão (80px mobile / 128px desktop)
 * e container. Todo bloco de página usa isto — não repita paddings à mão.
 */
export function Section({
  children,
  id,
  theme = "light",
  surface = false,
  className = "",
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={`theme-${theme} relative scroll-mt-16 overflow-hidden ${surface ? "bg-surface" : "bg-bg"} py-20 md:py-32 ${className}`}
      {...aria}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-full max-w-site px-4 md:px-8 ${className}`}>{children}</div>
  );
}
