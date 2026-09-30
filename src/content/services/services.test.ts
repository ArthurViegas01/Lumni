import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { SERVICE_IDS, routeExists } from "@/i18n/routes";
import { ALL_LINES, getService, listServices } from "./index";

describe("conteúdo das linhas de serviço", () => {
  it("existe uma linha para cada id de rota, com ordens únicas", () => {
    expect(ALL_LINES.map((l) => l.id).sort()).toEqual([...SERVICE_IDS].sort());
    const orders = ALL_LINES.map((l) => l.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("conteúdo e rotas concordam sobre em quais idiomas cada linha existe", () => {
    for (const id of SERVICE_IDS) {
      for (const locale of locales) {
        expect(getService(id, locale) !== null).toBe(routeExists(locale, { name: "service", id }));
      }
    }
  });

  it("cada página tem o mínimo da estrutura: 3+ inclusos, 4 etapas, 1+ exclusão, 2+ perguntas", () => {
    for (const line of ALL_LINES) {
      for (const content of Object.values(line.content)) {
        expect(content.included.length).toBeGreaterThanOrEqual(3);
        expect(content.steps).toHaveLength(4);
        expect(content.excluded.length).toBeGreaterThanOrEqual(1);
        expect(content.faq.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("SEO dentro dos limites: título ≤ 80 e descrição entre 110 e 170 caracteres", () => {
    for (const line of ALL_LINES) {
      for (const { seo } of Object.values(line.content)) {
        expect(seo.title.length).toBeLessThanOrEqual(80);
        expect(seo.description.length).toBeGreaterThanOrEqual(110);
        expect(seo.description.length).toBeLessThanOrEqual(170);
      }
    }
  });

  it("listServices respeita a ordem de destaque e o idioma", () => {
    expect(listServices("pt").map((s) => s.id)).toEqual([
      "ti-gerenciada",
      "automacao",
      "squad",
      "presenca-digital",
    ]);
    expect(listServices("en").map((s) => s.id)).not.toContain("presenca-digital");
  });
});
