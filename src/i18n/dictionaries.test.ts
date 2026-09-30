import { describe, expect, it } from "vitest";
import en from "./dictionaries/en.json";
import pt from "./dictionaries/pt.json";

/** Lista os caminhos de todas as folhas, com o tamanho dos arrays incluído na chave. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

describe("dicionários", () => {
  it("en tem exatamente as mesmas chaves e tamanhos de lista que pt", () => {
    expect(shape(en).sort()).toEqual(shape(pt).sort());
  });

  it("nenhum texto vazio", () => {
    const empty = (obj: unknown): boolean =>
      typeof obj === "string"
        ? obj.trim() === ""
        : Array.isArray(obj)
          ? obj.some(empty)
          : obj !== null && typeof obj === "object" && Object.values(obj).some(empty);
    expect(empty(pt)).toBe(false);
    expect(empty(en)).toBe(false);
  });
});
