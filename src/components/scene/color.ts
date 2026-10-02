import type { Theme } from "@/lib/theme";

/**
 * Paleta da cena 3D por modo. O WebGL não lê variável CSS, então os valores espelham
 * `--paper`/`--carbon` de globals.css — e `color.test.ts` falha se divergirem.
 *
 * - `ink`: cor das arestas na planta técnica (etapa 3) — a tinta do site.
 * - `bg`: cor das frestas entre peças com o cubo sólido — o papel.
 * - `solid`: albedo das peças. Não é a tinta pura: preto absoluto não recebe luz e o
 *   cubo viraria uma silhueta chapada; um carvão (ou um branco puro com luz contida) deixa as faces lerem.
 */
export const SCENE_PALETTE = {
  light: {
    ink: "#0a0a0a",
    bg: "#ffffff",
    solid: "#3a3a3a",
    light: { ambient: 0.45, key: 1.6, fill: 0.35 },
  },
  dark: {
    ink: "#f2f2f0",
    bg: "#0a0a0a",
    solid: "#ffffff",
    light: { ambient: 0.9, key: 2.7, fill: 0.6 },
  },
} as const satisfies Record<Theme, ScenePaletteShape>;

/**
 * Intensidade das luzes por modo. O Lambert do three divide por π: com a luz do modo
 * claro, um cubo branco sairia cinza médio (~#c4c4c4). O modo invertido precisa de
 * mais luz para a face de cima chegar perto do branco sem estourar as laterais.
 */
type ScenePaletteShape = {
  ink: string;
  bg: string;
  solid: string;
  light: { ambient: number; key: number; fill: number };
};

export type ScenePalette = (typeof SCENE_PALETTE)[Theme];
