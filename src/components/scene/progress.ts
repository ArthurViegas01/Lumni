/**
 * Mapeamento do scroll real para o progresso canônico da coreografia.
 *
 * A coreografia (cubeState.ts) assume que o texto da etapa i fica centralizado
 * em p = i / (n - 1). Isso só é verdade quando toda etapa tem exatamente 100svh.
 * No mobile uma etapa com mais texto fica mais alta e o cubo desalinharia do texto.
 * Aqui medimos onde cada etapa realmente centraliza e remapeamos linearmente.
 * Módulo puro: sem DOM, testado em progress.test.ts.
 */

/** Pontos canônicos das n etapas: 0, 1/(n-1), …, 1. */
export function canonicalAnchors(stages: number): number[] {
  if (stages < 2) return [0, 1];
  return Array.from({ length: stages }, (_, i) => i / (stages - 1));
}

/**
 * Progresso (0..1) em que o centro de cada etapa coincide com o centro da viewport.
 *
 * @param stageCenters centro de cada etapa, em px, relativo ao topo da região
 * @param regionHeight altura total da região, em px
 * @param viewportHeight altura da viewport, em px
 */
export function measureAnchors(
  stageCenters: readonly number[],
  regionHeight: number,
  viewportHeight: number,
): number[] {
  const scrollable = regionHeight - viewportHeight;
  if (scrollable <= 0) return canonicalAnchors(stageCenters.length);
  return stageCenters.map((center) => clamp01((center - viewportHeight / 2) / scrollable));
}

/**
 * Converte o progresso medido `p` no progresso canônico, interpolando linearmente
 * entre âncoras. Âncoras inválidas (não crescentes) caem para identidade.
 */
export function remapProgress(p: number, anchors: readonly number[]): number {
  const t = Number.isFinite(p) ? clamp01(p) : 0;
  const n = anchors.length;
  if (n < 2 || !isStrictlyIncreasing(anchors)) return t;

  const first = anchors[0]!;
  const last = anchors[n - 1]!;
  if (t <= first) return 0;
  if (t >= last) return 1;

  for (let i = 0; i < n - 1; i++) {
    const a = anchors[i]!;
    const b = anchors[i + 1]!;
    if (t <= b) return (i + (t - a) / (b - a)) / (n - 1);
  }
  return 1;
}

function isStrictlyIncreasing(values: readonly number[]): boolean {
  for (let i = 1; i < values.length; i++) if (!(values[i]! > values[i - 1]!)) return false;
  return true;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
