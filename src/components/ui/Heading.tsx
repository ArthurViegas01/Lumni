import type { ReactNode } from "react";

const SIZES = {
  hero: "display-caps text-hero text-ink",
  h2: "display-caps text-h2 text-ink",
  h3: "text-xl font-bold tracking-tight text-ink",
} as const;

type HeadingProps = {
  children: ReactNode;
  /** Nível semântico. Independente do tamanho visual. */
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  id?: string;
  className?: string;
};

/** Título estático. Para título que entra desfocando, use `BlurReveal`. */
export function Heading({
  children,
  as: Tag = "h2",
  size = "h2",
  id,
  className = "",
}: HeadingProps) {
  return (
    <Tag id={id} className={`${SIZES[size]} ${className}`}>
      {children}
    </Tag>
  );
}
