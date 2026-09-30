import AxeBuilder from "@axe-core/playwright";
import { PAGES, expect, test } from "./fixtures";
import { settle } from "./settle";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Bloqueia a CI em violações "serious"/"critical" (WCAG 2.2 A/AA). As menores
// entram no relatório do teste, sem travar o merge.
for (const path of PAGES) {
  test(`sem violações graves de acessibilidade em ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await settle(page);

    // As etapas da história ficam sobre um fundo animado pela rolagem (camada sticky
    // com cor ligada ao progresso). O axe não resolve essa pilha e mede contra branco;
    // o contraste delas é verificado com as cores reais no teste logo abaixo.
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .exclude("[data-stage]")
      .analyze();
    const stages = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include("[data-stage]")
      .disableRules(["color-contrast"])
      .analyze()
      .catch(() => null); // página sem história: nada a incluir

    const violations = [...results.violations, ...(stages?.violations ?? [])];
    await testInfo.attach("axe.json", {
      body: JSON.stringify(violations, null, 2),
      contentType: "application/json",
    });
    const blocking = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(" ")}`);
    expect(blocking).toEqual([]);
  });
}

test("história da home: texto de cada etapa contrasta com o fundo real do palco", async ({
  page,
}, testInfo) => {
  await page.goto("/pt");
  const count = await page.locator("[data-stage]").count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const report = await page.evaluate(async (index) => {
      const stage = document.querySelectorAll<HTMLElement>("[data-stage]")[index]!;
      stage.scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 500)); // progresso -> cor do fundo (rAF)

      // Normaliza qualquer formato de cor (rgb, oklab do Tailwind 4, color-mix...)
      // pintando num canvas 1x1 e lendo o pixel.
      const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      const parse = (c: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return { r: r!, g: g!, b: b!, a: a! / 255 };
      };
      const over = (top: ReturnType<typeof parse>, under: ReturnType<typeof parse>) => ({
        r: top.r * top.a + under.r * (1 - top.a),
        g: top.g * top.a + under.g * (1 - top.a),
        b: top.b * top.a + under.b * (1 - top.a),
        a: 1,
      });
      const lum = ({ r, g, b }: ReturnType<typeof parse>) => {
        const lin = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const ratio = (a: ReturnType<typeof parse>, b: ReturnType<typeof parse>) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (hi! + 0.05) / (lo! + 0.05);
      };

      const scene = document.querySelector<HTMLElement>("section > [aria-hidden].sticky")!;
      const sceneBg = parse(getComputedStyle(scene).backgroundColor);
      const panel = stage.querySelector<HTMLElement>(":scope > div > div")!;
      const bg = over(parse(getComputedStyle(panel).backgroundColor), sceneBg);

      return [...stage.querySelectorAll<HTMLElement>("h1, h2, h3, p")]
        .filter((el) => el.closest("[data-stage]") === stage && el.offsetParent !== null)
        .map((el) => {
          const style = getComputedStyle(el);
          const large =
            parseFloat(style.fontSize) >= 24 ||
            (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
          return {
            text: el.textContent!.slice(0, 40),
            ratio: Math.round(ratio(parse(style.color), bg) * 100) / 100,
            min: large ? 3 : 4.5,
          };
        });
    }, i);

    testInfo.annotations.push({ type: `etapa ${i + 1}`, description: JSON.stringify(report) });
    for (const item of report) {
      expect(item.ratio, `etapa ${i + 1}: "${item.text}"`).toBeGreaterThanOrEqual(item.min);
    }
  }
});
