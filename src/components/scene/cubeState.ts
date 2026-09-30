/**
 * Coreografia do cubo do hero.
 *
 * Módulo PURO: sem three.js, sem React, sem DOM. Recebe o progresso de scroll
 * (0 a 1) e devolve o estado do cubo. Isso torna o scroll reversível por
 * construção e a coreografia testável sem navegador (ver cubeState.test.ts).
 *
 * Storyboard (PLANO_DE_IMPLEMENTACAO.md, "Hero 3D"). A região do hero tem 4
 * etapas de 100svh; com offset ["start start", "end end"] o texto da etapa i
 * fica centralizado em progress = i / 3. Cada estado é segurado em volta desse
 * ponto, para o texto ser lido com o cubo parado:
 *   1. 0.00–0.06  montado, à direita                     -> hero (texto à esquerda)
 *   2. 0.27–0.40  atravessa para a esquerda, grade 3x3   -> quatro frentes (texto à direita)
 *   3. 0.60–0.73  explode nas 27 peças, vira traço fino  -> especialidades (texto à esquerda)
 *   4. 0.94–1.00  remonta à direita, sólido              -> CTA (texto à esquerda)
 */
export type CubeState = {
  /** Posição do grupo, em unidades de mundo. */
  x: number;
  y: number;
  scale: number;
  /** Rotação do grupo, em radianos. */
  rotX: number;
  rotY: number;
  /** Folga entre peças: 0.02 parece montado; ~0.14 revela a grade 3x3. */
  gap: number;
  /** 0 = montado, 1 = 27 peças totalmente separadas. */
  explode: number;
  /** 0 = sólido, 1 = só arestas (planta técnica, para o fundo claro). */
  edges: number;
};

export type Keyframe = readonly [at: number, state: CubeState];

const SOLID = { gap: 0.02, explode: 0, edges: 0 } as const;

// Escalas calibradas para a câmera de SceneCanvas (fov 35, z 9): meia-altura visível ~2.84.
const STAGE_1: CubeState = { x: 2.3, y: 0, scale: 0.62, rotX: 0.35, rotY: 0.6, ...SOLID };
const STAGE_2: CubeState = {
  x: -2.3,
  y: 0,
  scale: 0.72,
  rotX: 0.5,
  rotY: 1.6,
  gap: 0.14,
  explode: 0.1,
  edges: 0,
};
// Etapa 3 mais ao centro e menor: os rótulos das especialidades irradiam em volta das peças.
const STAGE_3: CubeState = {
  x: 1.45,
  y: -0.15,
  scale: 0.38,
  rotX: 0.6,
  rotY: 2.4,
  gap: 0.14,
  explode: 1,
  edges: 1,
};
const STAGE_4: CubeState = {
  x: 2.3,
  y: 0,
  scale: 0.62,
  rotX: 0.35,
  rotY: 0.6 + Math.PI,
  ...SOLID,
};

export const KEYFRAMES: readonly Keyframe[] = [
  [0.0, STAGE_1],
  [0.06, STAGE_1],
  [0.27, STAGE_2],
  [0.4, STAGE_2],
  [0.6, STAGE_3],
  [0.73, STAGE_3],
  [0.94, STAGE_4],
  [1.0, STAGE_4],
];

/** Fator de afastamento aplicado a `explode`: com 1, cada peça sai 1.6x da posição montada. */
export const EXPLODE_DISTANCE = 1.6;

const KEYS = Object.keys(KEYFRAMES[0]![1]) as (keyof CubeState)[];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** smoothstep: derivada zero nas pontas, então cada keyframe "assenta" em vez de passar reto. */
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Estado do cubo para um progresso de scroll.
 *
 * Escreve em `out` quando fornecido — o componente reaproveita o mesmo objeto
 * a cada frame e não gera lixo para o GC durante o scroll.
 */
export function cubeStateAt(progress: number, out: CubeState = { ...KEYFRAMES[0]![1] }): CubeState {
  const t = Number.isFinite(progress) ? clamp01(progress) : 0;
  const nextIndex = KEYFRAMES.findIndex(([at]) => at >= t);

  if (nextIndex <= 0)
    return Object.assign(out, KEYFRAMES[nextIndex === 0 ? 0 : KEYFRAMES.length - 1]![1]);

  const [a0, s0] = KEYFRAMES[nextIndex - 1]!;
  const [a1, s1] = KEYFRAMES[nextIndex]!;
  const k = smooth((t - a0) / (a1 - a0));
  for (const key of KEYS) out[key] = lerp(s0[key], s1[key], k);
  return out;
}

/** Multiplicador de afastamento de cada peça em relação à posição montada. */
export function spreadOf(state: Pick<CubeState, "gap" | "explode">): number {
  return 1 + state.gap + state.explode * EXPLODE_DISTANCE;
}

/**
 * Opacidade do sólido em função de `edges`: some na primeira metade da transição,
 * para não haver um trecho longo de peças semitransparentes sobrepostas.
 */
export function solidOpacityOf(edges: number): number {
  return 1 - smooth(clamp01(edges * 2));
}

/**
 * Quanto o fundo já clareou (0 escuro, 1 claro) em função de `edges`. A virada
 * acontece no miolo da transição, então o fundo passa pouco tempo em cinza médio.
 */
export function backgroundLightnessOf(edges: number): number {
  return smooth(clamp01((edges - 0.25) / 0.5));
}

/**
 * Visibilidade dos rótulos da etapa 3 (0 a 1): só aparecem com o cubo quase todo
 * explodido e já em traço, e somem antes de ele remontar.
 */
export function labelWeightOf(state: Pick<CubeState, "explode" | "edges">): number {
  return smooth(clamp01((state.explode - 0.6) / 0.4)) * state.edges;
}

/**
 * Peso da rotação ociosa do hero: 1 no topo da página, 0 a partir de 10% do scroll.
 * A rotação some suave em vez de parar de uma vez.
 */
export function idleWeightAt(progress: number): number {
  return 1 - smooth(clamp01(progress / 0.1));
}
