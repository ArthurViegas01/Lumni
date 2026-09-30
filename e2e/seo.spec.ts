import { expect, test } from "./fixtures";

test.skip(({ isMobile }) => isMobile, "metadados não dependem do dispositivo");

async function alternates(page: import("@playwright/test").Page) {
  return page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((links) =>
      Object.fromEntries(
        links.map((l) => [l.getAttribute("hreflang"), new URL(l.getAttribute("href")!).pathname]),
      ),
    );
}

test("serviço nos dois idiomas: canonical próprio e hreflang recíproco", async ({ page }) => {
  await page.goto("/en/services/managed-it");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).pathname).toBe("/en/services/managed-it");
  expect(await alternates(page)).toEqual({
    "pt-BR": "/pt/servicos/ti-gerenciada",
    en: "/en/services/managed-it",
    "x-default": "/pt/servicos/ti-gerenciada",
  });
});

test("página só em português não anuncia versão em inglês", async ({ page }) => {
  await page.goto("/pt/servicos/presenca-digital");
  expect(Object.keys(await alternates(page)).sort()).toEqual(["pt-BR", "x-default"]);
});

test("cada página tem exatamente um h1 e title próprio", async ({ page }) => {
  const titles = new Set<string>();
  for (const path of ["/pt", "/pt/servicos", "/pt/servicos/automacao", "/pt/time"]) {
    await page.goto(path);
    await expect(page.locator("h1"), path).toHaveCount(1);
    titles.add(await page.title());
  }
  expect(titles.size).toBe(4);
});
