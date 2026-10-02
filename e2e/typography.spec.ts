import { PAGES, expect, test } from "./fixtures";

/**
 * Títulos monumentais em caixa alta não podem estourar a coluna: a palavra mais
 * longa ("INFRAESTRUTURA,", "ESPECIALIDADES") tem de caber em toda largura testada.
 * Mede o título contra o próprio contêiner, e a página contra a janela.
 */
for (const path of PAGES) {
  test(`nenhum título estoura a coluna em ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("h1, h2, h3")]
        .filter((h) => h.offsetParent !== null)
        .filter((h) => h.scrollWidth > h.clientWidth + 1)
        .map((h) => `${h.tagName} "${h.textContent!.trim().slice(0, 40)}"`),
    );
    expect(overflowing).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      "rolagem horizontal na página",
    ).toBe(true);
  });
}
