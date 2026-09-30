import { describe, expect, it } from "vitest";
import { mixHex } from "./color";

describe("mixHex", () => {
  it("devolve as pontas em 0 e 1", () => {
    expect(mixHex("#000000", "#ffffff", 0)).toBe("rgb(0 0 0)");
    expect(mixHex("#000000", "#ffffff", 1)).toBe("rgb(255 255 255)");
  });

  it("interpola e prende t fora de [0, 1]", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("rgb(128 128 128)");
    expect(mixHex("#0b0f14", "#ffffff", -1)).toBe("rgb(11 15 20)");
    expect(mixHex("#0b0f14", "#ffffff", 2)).toBe("rgb(255 255 255)");
  });

  it("rejeita cor inválida", () => {
    expect(() => mixHex("red", "#ffffff", 0)).toThrow();
  });
});
