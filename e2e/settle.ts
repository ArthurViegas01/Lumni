import type { Page } from "@playwright/test";

/**
 * Rola a página inteira para disparar todas as revelações "whileInView" e espera
 * as animações finitas terminarem. Sem isso o axe mede texto no meio do fade
 * (opacidade parcial) e acusa contraste falso, de forma intermitente.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity),
  );
  await page.waitForTimeout(400); // animações por rAF (Motion) não aparecem em getAnimations()
}
