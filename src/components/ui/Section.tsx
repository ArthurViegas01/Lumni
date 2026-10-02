import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** `invert`: bloco de carbono com tinta de papel (inverte junto com o modo do site). */
  tone?: "base" | "invert";
  /** Fundo `surface` (concreto) em vez de `bg`, para alternar seções vizinhas do mesmo tom. */
  surface?: boolean;
  className?: string;
  "aria-labelledby"?: string;
};

/**
 * Seção de página: tom, espaçamento vertical padrão (80px mobile / 128px desktop)
 * e container. Todo bloco de página usa isto — não repita paddings à mão.
 */
export function Section({
  children,
  id,
  tone = "base",
  surface = false,
  className = "",
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={`tone-${tone} relative scroll-mt-16 overflow-hidden ${surface ? "bg-surface" : "bg-bg"} py-20 md:py-32 ${className}`}
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
