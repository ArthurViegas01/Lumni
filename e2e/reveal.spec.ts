import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { settle } from "./settle";

/**
 * Regressão: o servidor não conhece prefers-reduced-motion e renderiza o estado
 * inicial das animações completas (blur, pathLength 0). Se a variante reduzida não
 * desfizer tudo isso, o conteúdo fica desfocado ou invisível para sempre — e o axe
 * não detecta (não mede blur). Aqui, depois de rolar a página inteira, todo texto
 * e todo traço de diagrama têm de estar nítidos e visíveis, com e sem movimento.
 */
async function hiddenContent(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = [];
    const main = document.querySelector("main")!;
    const opacityOf = (el: Element) => {
      let o = 1;
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
        o *= Number(getComputedStyle(n).opacity);
      }
      return o;
    };
    const blurred = (el: Element) => {
      for (let n: Element | null = el; n && n !== main; n = n.parentElement) {
        const f = getComputedStyle(n).filter;
        if (/blur\((?!0px)/.test(f)) return true;
      }
      return false;
    };

    // Tudo que pinta texto diretamente (inclui os <span> por palavra do BlurReveal,
    // onde fica o filtro) e todo traço de diagrama.
    const paintsText = (el: Element) =>
      [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim());
    const targets = [...main.querySelectorAll("*")].filter(
      (el) => paintsText(el) || el.matches("svg[role='img'] path"),
    );

    for (const el of targets) {
      if (el.closest(".sticky[aria-hidden='true']")) continue; // palco 3D: decoração
      if (el.closest("details:not([open])")) continue; // resposta de FAQ fechada
      const label = `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}"`;
      if (opacityOf(el) < 0.99) problems.push(`${label}: opacidade ${opacityOf(el).toFixed(2)}`);
      if (blurred(el)) problems.push(`${label}: desfocado`);
      if (el.tagName === "path" && getComputedStyle(el).strokeDasharray.startsWith("0")) {
        problems.push(`${label}: traço não desenhado`);
      }
    }
    return problems;
  });
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`movimento: ${reducedMotion}`, () => {
    test.use({ reducedMotion });
    test.skip(({ isMobile }) => isMobile, "o comportamento não depende do dispositivo");

    for (const path of ["/pt", "/en/services/managed-it", "/pt/time"]) {
      test(`nada fica desfocado ou invisível em ${path}`, async ({ page }) => {
        await page.goto(path);
        await settle(page);
        expect(await hiddenContent(page)).toEqual([]);
      });
    }
  });
}
