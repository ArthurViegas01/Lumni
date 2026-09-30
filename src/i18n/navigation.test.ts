import { describe, expect, it } from "vitest";
import en from "./dictionaries/en.json";
import pt from "./dictionaries/pt.json";
import { resolveNavLinks } from "./navigation";

describe("resolveNavLinks", () => {
  it("resolve os links do dicionário para URLs traduzidas", () => {
    expect(resolveNavLinks("en", en.nav.links).map((l) => l.href)).toEqual([
      "/en/services",
      "/en#processo",
      "/en/team",
      "/en#faq",
    ]);
    expect(resolveNavLinks("pt", pt.nav.links).map((l) => l.href)).toEqual([
      "/pt/servicos",
      "/pt#processo",
      "/pt/time",
      "/pt#faq",
    ]);
  });

  it("falha alto com destino desconhecido", () => {
    expect(() => resolveNavLinks("pt", [{ label: "x", to: "blog" }])).toThrow();
  });
});
