/**
 * Giros de camada do cubo no topo da página (movimento de cubo mágico).
 *
 * Módulo PURO, como cubeState.ts: sem three.js, sem React. Decide QUAL camada gira,
 * QUANDO e em que ÂNGULO; o Cube só aplica.
 *
 * Por que não existe "estado embaralhado": as 27 peças são idênticas e simétricas
 * por rotação de 90° (mesmo desenho nas seis faces, granulação isotrópica). Um giro
 * completo deixa o cubo visualmente igual ao de antes, então ao terminar cada giro
 * as peças voltam às posições de origem. Isso mantém válidos, sem caso especial, a
 * explosão por scroll e os rótulos da etapa 3 (presos a peças por índice).
 */
export type Axis = 0 | 1 | 2;
export type Layer = -1 | 0 | 1;
export type Move = { axis: Axis; layer: Layer; dir: 1 | -1 };

export const TWIST = {
  /** Duração de um giro de 90°, em segundos. */
  duration: 0.6,
  /** Pausa entre giros. */
  pause: 0.45,
  /** Espera depois do carregamento: o canvas acabou de substituir o pôster. */
  firstDelay: 1.2,
} as const;

/** PRNG determinístico (mulberry32): a mesma semente dá a mesma sequência de giros. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(items: readonly T[], rand: () => number): T =>
  items[Math.min(items.length - 1, Math.floor(rand() * items.length))]!;

/**
 * Próximo giro. Nunca no mesmo eixo do anterior: dois giros seguidos no mesmo eixo
 * parecem um só movimento travado (ou desfazem o anterior), não um cubo sendo resolvido.
 */
export function nextMove(prev: Move | null, rand: () => number): Move {
  const axes = ([0, 1, 2] as const).filter((a) => a !== prev?.axis);
  return {
    axis: pick(axes, rand),
    layer: pick([-1, 0, 1] as const, rand),
    dir: rand() < 0.5 ? 1 : -1,
  };
}

/** A peça cuja posição de origem é `home` pertence à camada que gira? */
export function inLayer(home: { x: number; y: number; z: number }, move: Move): boolean {
  const coordinate = move.axis === 0 ? home.x : move.axis === 1 ? home.y : home.z;
  return Math.round(coordinate) === move.layer;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Ângulo (rad, sem sinal) de um giro após `elapsed` segundos: 0 → π/2 com aceleração e freio. */
export function turnAngle(elapsed: number, duration: number = TWIST.duration): number {
  const t = elapsed <= 0 ? 0 : elapsed >= duration ? 1 : elapsed / duration;
  return easeInOutCubic(t) * (Math.PI / 2);
}

export type TwistState = {
  /** Giro em andamento, ou null entre giros. */
  move: Move | null;
  startedAt: number;
  /** Quando o próximo giro pode começar. */
  nextAt: number;
  lastMove: Move | null;
};

export function createTwistState(now: number): TwistState {
  return { move: null, startedAt: 0, nextAt: now + TWIST.firstDelay, lastMove: null };
}

/**
 * Avança o cronograma até `now` (segundos) e devolve o ângulo com sinal do giro atual
 * (0 sem giro). MUTA `state` de propósito: roda a cada frame e não deve alocar.
 *
 * `enabled` falso (a pessoa rolou a página): o giro em andamento TERMINA — parar no
 * meio deixaria uma camada torta — e nenhum outro começa. Ao voltar ao topo, espera
 * uma pausa antes de recomeçar.
 */
export function stepTwist(
  state: TwistState,
  now: number,
  enabled: boolean,
  rand: () => number,
): number {
  if (state.move) {
    const elapsed = now - state.startedAt;
    if (elapsed < TWIST.duration) return turnAngle(elapsed) * state.move.dir;
    state.lastMove = state.move;
    state.move = null;
    state.nextAt = now + TWIST.pause;
    return 0;
  }
  if (!enabled) {
    state.nextAt = Math.max(state.nextAt, now + TWIST.pause);
    return 0;
  }
  if (now >= state.nextAt) {
    state.move = nextMove(state.lastMove, rand);
    state.startedAt = now;
  }
  return 0;
}
