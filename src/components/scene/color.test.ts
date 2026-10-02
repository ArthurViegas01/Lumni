import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SCENE_PALETTE } from "./color";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

/** Valor de `--name` no primeiro bloco cujo seletor é exatamente `selector`. */
function tokenIn(selector: string, name: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1];
  const value = block && new RegExp(`--${name}:\\s*([^;]+);`).exec(block)?.[1];
  if (!value) throw new Error(`--${name} não encontrado em ${selector}`);
  return value.trim().toLowerCase();
}

describe("SCENE_PALETTE espelha os tokens de globals.css", () => {
  it("modo claro: tinta = carbono, fundo = papel", () => {
    expect(SCENE_PALETTE.light.ink).toBe(tokenIn(":root", "carbon"));
    expect(SCENE_PALETTE.light.bg).toBe(tokenIn(":root", "paper"));
  });

  it("modo invertido: papel e carbono trocados", () => {
    expect(SCENE_PALETTE.dark.ink).toBe(tokenIn(':root[data-theme="dark"]', "carbon"));
    expect(SCENE_PALETTE.dark.bg).toBe(tokenIn(':root[data-theme="dark"]', "paper"));
  });
});
