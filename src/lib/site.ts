/** Dados globais do site. Nome provisório: trocar aqui quando o naming for decidido. */
export const site = {
  name: "Lumni",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
