import { describe, expect, it } from "vitest";
import {
  TWIST,
  createRng,
  createTwistState,
  inLayer,
  nextMove,
  stepTwist,
  turnAngle,
  type Move,
} from "./twist";

const AXIS = [-1, 0, 1];
const HOME = AXIS.flatMap((x) => AXIS.flatMap((y) => AXIS.map((z) => ({ x, y, z }))));

describe("createRng", () => {
  it("é determinístico e fica em [0, 1)", () => {
    const a = createRng(7);
    const b = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("nextMove", () => {
  it("nunca repete o eixo do giro anterior", () => {
    const rand = createRng(1);
    let prev: Move | null = null;
    for (let i = 0; i < 500; i++) {
      const move = nextMove(prev, rand);
      if (prev) expect(move.axis).not.toBe(prev.axis);
      prev = move;
    }
  });

  it("usa todos os eixos, camadas e sentidos", () => {
    const rand = createRng(2);
    const seen = new Set<string>();
    let prev: Move | null = null;
    for (let i = 0; i < 500; i++) {
      prev = nextMove(prev, rand);
      seen.add(`${prev.axis}${prev.layer}${prev.dir}`);
    }
    expect(seen.size).toBe(3 * 3 * 2);
  });
});

describe("inLayer", () => {
  it("toda camada tem exatamente 9 peças", () => {
    for (const axis of [0, 1, 2] as const) {
      for (const layer of [-1, 0, 1] as const) {
        const move: Move = { axis, layer, dir: 1 };
        expect(HOME.filter((h) => inLayer(h, move))).toHaveLength(9);
      }
    }
  });
});

describe("turnAngle", () => {
  it("vai de 0 a 90° e para nas pontas", () => {
    expect(turnAngle(-1)).toBe(0);
    expect(turnAngle(0)).toBe(0);
    expect(turnAngle(TWIST.duration)).toBeCloseTo(Math.PI / 2);
    expect(turnAngle(TWIST.duration * 3)).toBeCloseTo(Math.PI / 2);
  });

  it("é monotônico e simétrico (acelera e freia igual)", () => {
    for (let t = 0; t < TWIST.duration; t += 0.01) {
      expect(turnAngle(t + 0.01)).toBeGreaterThanOrEqual(turnAngle(t));
    }
    expect(turnAngle(TWIST.duration / 2)).toBeCloseTo(Math.PI / 4);
  });
});

describe("stepTwist", () => {
  const run = (enabledUntil: number, end: number, dt = 1 / 60) => {
    const state = createTwistState(0);
    const rand = createRng(3);
    const angles: number[] = [];
    let turns = 0;
    for (let now = 0; now <= end; now += dt) {
      const hadMove = state.move;
      angles.push(stepTwist(state, now, now <= enabledUntil, rand));
      if (!hadMove && state.move) turns++;
    }
    return { state, angles, turns };
  };

  it("espera o atraso inicial antes do primeiro giro", () => {
    const state = createTwistState(0);
    stepTwist(state, TWIST.firstDelay - 0.01, true, createRng(1));
    expect(state.move).toBeNull();
    stepTwist(state, TWIST.firstDelay, true, createRng(1));
    expect(state.move).not.toBeNull();
  });

  it("no topo, gira continuamente com pausa entre giros", () => {
    const span = 10;
    const { turns } = run(Infinity, TWIST.firstDelay + span);
    const expected = span / (TWIST.duration + TWIST.pause);
    expect(turns).toBeGreaterThanOrEqual(Math.floor(expected) - 1);
    expect(turns).toBeLessThanOrEqual(Math.ceil(expected) + 1);
  });

  it("o ângulo nunca passa de 90° e termina exatamente em 0 (peças de volta à origem)", () => {
    const { angles } = run(Infinity, 8);
    for (const a of angles) expect(Math.abs(a)).toBeLessThanOrEqual(Math.PI / 2 + 1e-9);
    expect(angles).toContain(0);
  });

  it("ao rolar a página, termina o giro em andamento e não começa outro", () => {
    // Desliga no meio do primeiro giro.
    const off = TWIST.firstDelay + TWIST.duration / 2;
    const { state, angles, turns } = run(off, off + 5);
    expect(turns).toBe(1);
    expect(state.move).toBeNull();
    // O giro seguiu até o fim depois de desligar (ângulo continuou crescendo).
    const after = angles.slice(Math.ceil(off * 60), Math.ceil(off * 60) + 10).map(Math.abs);
    expect(Math.max(...after)).toBeGreaterThan(Math.PI / 4);
    expect(angles.at(-1)).toBe(0);
  });

  it("de volta ao topo, espera uma pausa antes de recomeçar", () => {
    const state = createTwistState(0);
    const rand = createRng(4);
    stepTwist(state, 5, false, rand);
    stepTwist(state, 5 + TWIST.pause / 2, true, rand);
    expect(state.move).toBeNull();
    stepTwist(state, 5 + TWIST.pause, true, rand);
    expect(state.move).not.toBeNull();
  });
});
