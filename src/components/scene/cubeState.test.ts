import { describe, expect, it } from "vitest";
import {
  type CubeState,
  KEYFRAMES,
  cubeStateAt,
  idleWeightAt,
  labelWeightOf,
  solidOpacityOf,
  spreadOf,
} from "./cubeState";

const first = KEYFRAMES[0]![1];
const last = KEYFRAMES[KEYFRAMES.length - 1]![1];
const keys = Object.keys(first) as (keyof CubeState)[];

describe("KEYFRAMES", () => {
  it("estão em ordem crescente e dentro de [0, 1]", () => {
    const ats = KEYFRAMES.map(([at]) => at);
    expect(ats).toEqual([...ats].sort((a, b) => a - b));
    expect(ats.every((at) => at >= 0 && at <= 1)).toBe(true);
    expect(new Set(ats).size).toBe(ats.length);
  });

  it("começam e terminam com o cubo montado e sólido", () => {
    for (const s of [first, last]) {
      expect(s.explode).toBe(0);
      expect(s.edges).toBe(0);
    }
  });
});

describe("cubeStateAt", () => {
  it("passa exatamente por cada keyframe", () => {
    for (const [at, state] of KEYFRAMES) {
      const s = cubeStateAt(at);
      for (const k of keys) expect(s[k]).toBeCloseTo(state[k], 10);
    }
  });

  it("prende valores fora de [0, 1] e trata NaN", () => {
    expect(cubeStateAt(-5)).toEqual(first);
    expect(cubeStateAt(5)).toEqual(last);
    expect(cubeStateAt(Number.NaN)).toEqual(first);
  });

  it("é contínuo: nenhum salto entre dois pontos próximos", () => {
    const step = 0.001;
    let maxJump = 0;
    for (let p = 0; p < 1; p += step) {
      const a = cubeStateAt(p);
      const b = cubeStateAt(p + step);
      for (const k of keys) maxJump = Math.max(maxJump, Math.abs(a[k] - b[k]));
    }
    // 0,1% de scroll nunca move nada mais que 0,05 unidade/radiano
    expect(maxJump).toBeLessThan(0.05);
  });

  it("é determinístico e reaproveita o objeto de saída", () => {
    const out = { ...first };
    const ret = cubeStateAt(0.45, out);
    expect(ret).toBe(out);
    expect(cubeStateAt(0.45)).toEqual(out);
  });

  it("explode e edges ficam sempre em [0, 1]", () => {
    for (let p = 0; p <= 1; p += 0.01) {
      const s = cubeStateAt(p);
      expect(s.explode).toBeGreaterThanOrEqual(0);
      expect(s.explode).toBeLessThanOrEqual(1);
      expect(s.edges).toBeGreaterThanOrEqual(0);
      expect(s.edges).toBeLessThanOrEqual(1);
    }
  });
});

describe("spreadOf", () => {
  it("cresce com gap e explode", () => {
    expect(spreadOf({ gap: 0, explode: 0 })).toBe(1);
    expect(spreadOf({ gap: 0.14, explode: 0 })).toBeGreaterThan(1);
    expect(spreadOf({ gap: 0.14, explode: 1 })).toBeGreaterThan(
      spreadOf({ gap: 0.14, explode: 0 }),
    );
  });
});

describe("idleWeightAt", () => {
  it("vai de 1 no topo a 0 depois de 10% do scroll", () => {
    expect(idleWeightAt(0)).toBe(1);
    expect(idleWeightAt(0.05)).toBeGreaterThan(0);
    expect(idleWeightAt(0.05)).toBeLessThan(1);
    expect(idleWeightAt(0.1)).toBe(0);
    expect(idleWeightAt(0.8)).toBe(0);
  });
});

describe("curvas derivadas de edges", () => {
  it("o sólido some na primeira metade da transição para traço", () => {
    expect(solidOpacityOf(0)).toBe(1);
    expect(solidOpacityOf(0.5)).toBe(0);
    expect(solidOpacityOf(1)).toBe(0);
  });

  it("são monotônicas", () => {
    for (let e = 0; e < 1; e += 0.01) {
      expect(solidOpacityOf(e + 0.01)).toBeLessThanOrEqual(solidOpacityOf(e));
    }
  });
});

describe("labelWeightOf", () => {
  it("rótulos só com o cubo explodido e em traço", () => {
    expect(labelWeightOf({ explode: 0, edges: 0 })).toBe(0);
    expect(labelWeightOf({ explode: 0.5, edges: 1 })).toBe(0);
    expect(labelWeightOf({ explode: 1, edges: 0 })).toBe(0);
    expect(labelWeightOf({ explode: 1, edges: 1 })).toBe(1);
  });

  it("é 1 no miolo da etapa 3 e 0 nas outras etapas", () => {
    expect(labelWeightOf(cubeStateAt(0.66))).toBe(1);
    for (const p of [0, 0.33, 1]) expect(labelWeightOf(cubeStateAt(p))).toBe(0);
  });
});
