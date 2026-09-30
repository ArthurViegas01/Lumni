import { describe, expect, it } from "vitest";
import {
  SERVICE_IDS,
  allRoutes,
  equivalentHref,
  href,
  internalPath,
  localesOf,
  matchPath,
  redirectRules,
  rewriteRules,
  routeExists,
  servicesIn,
} from "./routes";

describe("href", () => {
  it("gera URLs públicas traduzidas", () => {
    expect(href("pt", { name: "home" })).toBe("/pt");
    expect(href("en", { name: "services" })).toBe("/en/services");
    expect(href("pt", { name: "service", id: "ti-gerenciada" })).toBe("/pt/servicos/ti-gerenciada");
    expect(href("en", { name: "service", id: "ti-gerenciada" })).toBe("/en/services/managed-it");
    expect(href("en", { name: "team" })).toBe("/en/team");
    expect(href("pt", { name: "home" }, "faq")).toBe("/pt#faq");
  });

  it("recusa rota que não existe no idioma", () => {
    expect(routeExists("en", { name: "service", id: "presenca-digital" })).toBe(false);
    expect(() => href("en", { name: "service", id: "presenca-digital" })).toThrow();
  });
});

describe("disponibilidade", () => {
  it("presença digital só em português; as outras linhas nos dois idiomas", () => {
    expect(servicesIn("pt")).toEqual([...SERVICE_IDS]);
    expect(servicesIn("en")).not.toContain("presenca-digital");
    expect(localesOf({ name: "service", id: "automacao" })).toEqual(["pt", "en"]);
    expect(localesOf({ name: "service", id: "presenca-digital" })).toEqual(["pt"]);
  });

  it("URLs públicas são únicas", () => {
    const urls = allRoutes().map(({ locale, route }) => href(locale, route));
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("matchPath / equivalentHref", () => {
  it("ida e volta: toda URL pública e toda pasta interna são reconhecidas como a própria rota", () => {
    for (const { locale, route } of allRoutes()) {
      expect(matchPath(href(locale, route))).toEqual({ locale, route });
      expect(matchPath(internalPath(locale, route))).toEqual({ locale, route });
    }
  });

  it("nenhuma pasta interna coincide com a URL pública de outra rota", () => {
    const publicByUrl = new Map(allRoutes().map((e) => [href(e.locale, e.route), e]));
    for (const entry of allRoutes()) {
      const other = publicByUrl.get(internalPath(entry.locale, entry.route));
      if (other) expect(other).toEqual(entry);
    }
  });

  it("aceita barra final e rejeita o que não é rota", () => {
    expect(matchPath("/en/team/")?.route).toEqual({ name: "team" });
    expect(matchPath("/pt/services")).toBeNull();
    expect(matchPath("/en/servicos/presenca-digital")).toBeNull();
  });

  it("leva para a página equivalente no outro idioma", () => {
    expect(equivalentHref("/pt/servicos/ti-gerenciada", "en")).toBe("/en/services/managed-it");
    expect(equivalentHref("/en/team", "pt")).toBe("/pt/time");
  });

  it("dá o mesmo destino na pré-renderização (pathname interno) e no navegador (público)", () => {
    // Evita link errado no HTML estático e divergência de hidratação.
    expect(equivalentHref("/en/servicos/ti-gerenciada", "pt")).toBe("/pt/servicos/ti-gerenciada");
    expect(equivalentHref("/en/services/managed-it", "pt")).toBe("/pt/servicos/ti-gerenciada");
    expect(equivalentHref("/en/time", "pt")).toBe("/pt/time");
  });

  it("sem equivalente, cai no pai mais próximo", () => {
    expect(equivalentHref("/pt/servicos/presenca-digital", "en")).toBe("/en/services");
    expect(equivalentHref("/pt/qualquer-coisa", "en")).toBe("/en");
  });
});

describe("rewrites e redirects", () => {
  it("toda reescrita leva a URL pública para a pasta interna da mesma rota", () => {
    const rules = rewriteRules();
    expect(rules.length).toBeGreaterThan(0);
    for (const { locale, route } of allRoutes()) {
      const pub = href(locale, route);
      const internal = internalPath(locale, route);
      const rule = rules.find((r) => r.source === pub);
      if (pub === internal) expect(rule).toBeUndefined();
      else expect(rule?.destination).toBe(internal);
    }
  });

  it("redirects são o inverso das reescritas e nunca formam laço", () => {
    const sources = new Set(rewriteRules().map((r) => r.source));
    for (const rule of redirectRules()) {
      expect(rule.permanent).toBe(true);
      expect(sources.has(rule.destination)).toBe(true);
      expect(sources.has(rule.source)).toBe(false);
    }
  });

  it("português não precisa de reescrita (pastas já estão em português)", () => {
    expect(rewriteRules().every((r) => r.source.startsWith("/en"))).toBe(true);
  });
});
