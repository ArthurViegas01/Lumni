import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra o build de produção (`next start`), que é o que vai ao ar: proxy,
 * rewrites e redirects só se comportam de verdade fora do `next dev`.
 * Pré-requisito: `npm run build`.
 *
 * PW_CHROMIUM_PATH permite usar um Chromium já instalado (sandbox, máquinas sem
 * `npx playwright install`); na CI o navegador vem do próprio Playwright.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    // A cena 3D e as entradas animadas são decoração: os testes validam conteúdo,
    // rotas e acessibilidade, então rodam com movimento reduzido (caminho determinístico).
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `${baseURL}/pt`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
