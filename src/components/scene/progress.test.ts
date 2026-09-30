import { describe, expect, it } from "vitest";
import { canonicalAnchors, measureAnchors, remapProgress } from "./progress";

describe("canonicalAnchors", () => {
  it("distribui as etapas por igual entre 0 e 1", () => {
    expect(canonicalAnchors(4)).toEqual([0, 1 / 3, 2 / 3, 1]);
    expect(canonicalAnchors(1)).toEqual([0, 1]);
  });
});

describe("measureAnchors", () => {
  it("com etapas de 100vh, coincide com as âncoras canônicas", () => {
    const vh = 900;
    const centers = [450, 1350, 2250, 3150];
    const anchors = measureAnchors(centers, 4 * vh, vh);
    anchors.forEach((a, i) => expect(a).toBeCloseTo(canonicalAnchors(4)[i]!, 10));
  });

  it("com uma etapa mais alta, desloca as âncoras seguintes", () => {
    const vh = 800;
    // etapa 2 com 1400px em vez de 800
    const heights = [800, 1400, 800, 800];
    const tops = heights.map((_, i) => heights.slice(0, i).reduce((s, h) => s + h, 0));
    const centers = tops.map((t, i) => t + heights[i]! / 2);
    const total = heights.reduce((s, h) => s + h, 0);
    const anchors = measureAnchors(centers, total, vh);
    expect(anchors[0]).toBe(0);
    expect(anchors[3]).toBe(1);
    expect(anchors[1]!).toBeGreaterThan(1 / 3);
  });

  it("região sem scroll devolve as canônicas", () => {
    expect(measureAnchors([100, 200], 500, 900)).toEqual([0, 1]);
  });
});

describe("remapProgress", () => {
  const canonical = canonicalAnchors(4);

  it("é identidade com âncoras canônicas", () => {
    for (let p = 0; p <= 1; p += 0.05) expect(remapProgress(p, canonical)).toBeCloseTo(p, 10);
  });

  it("leva cada âncora medida ao ponto canônico da sua etapa", () => {
    const measured = [0, 0.45, 0.72, 1];
    measured.forEach((a, i) => expect(remapProgress(a, measured)).toBeCloseTo(canonical[i]!, 10));
  });

  it("é monotônica e presa em [0, 1]", () => {
    const measured = [0.05, 0.45, 0.72, 0.95];
    let prev = -1;
    for (let p = -0.2; p <= 1.2; p += 0.01) {
      const r = remapProgress(p, measured);
      expect(r).toBeGreaterThanOrEqual(prev);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
      prev = r;
    }
  });

  it("cai para identidade com âncoras inválidas e trata NaN", () => {
    expect(remapProgress(0.3, [0, 0.5, 0.5, 1])).toBe(0.3);
    expect(remapProgress(Number.NaN, canonical)).toBe(0);
  });
});
