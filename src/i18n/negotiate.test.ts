import { describe, expect, it } from "vitest";
import { negotiateLocale } from "./negotiate";

describe("negotiateLocale", () => {
  it("usa o idioma padrão sem header", () => {
    expect(negotiateLocale(null)).toBe("pt");
    expect(negotiateLocale("")).toBe("pt");
  });

  it("casa pela tag primária", () => {
    expect(negotiateLocale("pt-BR,pt;q=0.9,en;q=0.8")).toBe("pt");
    expect(negotiateLocale("en-US,en;q=0.9")).toBe("en");
  });

  it("respeita o peso q, não só a ordem", () => {
    expect(negotiateLocale("pt;q=0.4,en-GB;q=0.8")).toBe("en");
  });

  it("pula idiomas não suportados", () => {
    expect(negotiateLocale("de-DE,fr;q=0.9,en;q=0.5")).toBe("en");
    expect(negotiateLocale("de-DE,fr;q=0.9")).toBe("pt");
  });

  it("ignora q=0 e valores malformados", () => {
    expect(negotiateLocale("en;q=0,pt;q=0.1")).toBe("pt");
    expect(negotiateLocale("en;q=abc")).toBe("pt");
  });
});
