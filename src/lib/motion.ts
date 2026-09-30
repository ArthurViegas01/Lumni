/**
 * Constantes de movimento do site. Nenhuma duração ou easing solto em componente:
 * importe daqui. Regras em PLANO_DE_IMPLEMENTACAO.md, seção "Sistema de movimento".
 */
export const DUR = {
  micro: 0.12, // hover, press
  fast: 0.2, // fade de troca, tooltip
  base: 0.35, // reveal de elemento
  slow: 0.6, // entrada do hero
} as const;

/** Saída suave: rápido no início, assenta no fim. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Deslocamento máximo de entrada, em px. Mais que isso o texto "salta". */
export const REVEAL_OFFSET = 16;

/** Intervalo entre itens de um stagger. Máximo de 6 itens por grupo. */
export const STAGGER = 0.06;

/** Mola que suaviza o progresso de scroll do hero 3D. */
export const SCROLL_SPRING = { stiffness: 120, damping: 30, mass: 0.4 } as const;
