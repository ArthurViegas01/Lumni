import localFont from "next/font/local";

/**
 * Fontes auto-hospedadas (woff2 variáveis, subset latin, licença SIL OFL 1.1 em ./fonts).
 * Origem: pacotes @fontsource-variable 5.3.0. Arquivos no repo em vez de next/font/google
 * para o build não depender de acesso ao Google (CI, redes corporativas) e o navegador
 * nunca falar com terceiros (LGPD).
 */
export const sans = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const mono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
  // Mono aparece só em rótulos pequenos, nunca acima da dobra como texto principal: sem preload.
  preload: false,
});

export const fontVariables = `${sans.variable} ${mono.variable}`;
