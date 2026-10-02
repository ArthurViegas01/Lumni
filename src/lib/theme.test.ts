import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, resolveTheme, themeInitScript } from "./theme";

describe("resolveTheme", () => {
  it("escolha salva vence o sistema", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("sem escolha válida, segue o sistema", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("azul", true)).toBe("dark");
  });
});

/** Executa o script do <head> num ambiente falso e devolve o data-theme definido. */
function runScript(stored: string | null, systemDark: boolean, storageThrows = false) {
  const attrs: Record<string, string> = {};
  runInNewContext(themeInitScript, {
    localStorage: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("SecurityError");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    },
    window: { matchMedia: () => ({ matches: systemDark }) },
    document: { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } },
  });
  return attrs["data-theme"];
}

describe("themeInitScript", () => {
  it("aplica a mesma regra de resolveTheme em todas as combinações", () => {
    for (const stored of [null, "light", "dark", "lixo"]) {
      for (const systemDark of [true, false]) {
        expect(runScript(stored, systemDark), `${stored}/${systemDark}`).toBe(
          resolveTheme(stored, systemDark),
        );
      }
    }
  });

  it("localStorage indisponível não quebra: segue o sistema", () => {
    expect(runScript("dark", false, true)).toBe("light");
    expect(runScript(null, true, true)).toBe("dark");
  });
});
