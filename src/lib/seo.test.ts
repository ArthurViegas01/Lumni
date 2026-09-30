import { describe, expect, it } from "vitest";
import { alternatesFor } from "./seo";

describe("alternatesFor", () => {
  it("página nos dois idiomas: hreflang recíproco + x-default em português", () => {
    const alt = alternatesFor("en", { name: "service", id: "ti-gerenciada" });
    expect(alt?.canonical).toBe("/en/services/managed-it");
    expect(alt?.languages).toEqual({
      "pt-BR": "/pt/servicos/ti-gerenciada",
      en: "/en/services/managed-it",
      "x-default": "/pt/servicos/ti-gerenciada",
    });
  });

  it("página só em português não declara alternate em inglês", () => {
    const alt = alternatesFor("pt", { name: "service", id: "presenca-digital" });
    expect(alt?.languages).toEqual({
      "pt-BR": "/pt/servicos/presenca-digital",
      "x-default": "/pt/servicos/presenca-digital",
    });
  });
});
