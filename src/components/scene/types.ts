/** Ponteiro normalizado para a viewport: -1 (esquerda/topo) a 1 (direita/base). */
export type PointerState = { x: number; y: number };

/** Elementos DOM dos rótulos da etapa 3, preenchidos por callback ref no StoryScene. */
export type CalloutElements = {
  labels: (HTMLElement | null)[];
  lines: (SVGPolylineElement | null)[];
};
