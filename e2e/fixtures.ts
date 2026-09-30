import { test as base, expect } from "@playwright/test";

/** Páginas publicadas usadas em mais de um spec. */
export const PAGES = [
  "/pt",
  "/en",
  "/pt/servicos",
  "/en/services",
  "/pt/servicos/ti-gerenciada",
  "/en/services/managed-it",
  "/pt/servicos/presenca-digital",
  "/pt/time",
  "/en/team",
] as const;

/**
 * Falha o teste se a página registrar erro no console ou exceção não tratada.
 * Pega, entre outros, divergência de hidratação — o React a reporta como erro.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));
      await use(errors);
      expect(errors, "erros no console do navegador").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
