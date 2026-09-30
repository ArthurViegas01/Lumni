/**
 * Pôster estático do cubo em SVG isométrico, renderizado no servidor (zero JS).
 * É o primeiro paint do hero, o fallback sem WebGL e o fallback de reduced motion.
 *
 * Provisório: na fase 2 do plano vira um AVIF exportado da própria cena 3D,
 * para o crossfade pôster -> canvas não ter salto visual.
 */
const CELL = 40;
const COS30 = Math.cos(Math.PI / 6);
const A = { x: COS30 * CELL, y: CELL / 2 }; // eixo que desce para a direita
const B = { x: -COS30 * CELL, y: CELL / 2 }; // eixo que desce para a esquerda
const C = { x: 0, y: CELL }; // vertical

type Point = { x: number; y: number };
const add = (...ps: Point[]): Point => ps.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }));
const times = (p: Point, k: number): Point => ({ x: p.x * k, y: p.y * k });

/** Losango de uma célula, encolhido em volta do centro para desenhar a fresta entre peças. */
function cell(origin: Point, u: Point, v: Point, inset = 0.9): string {
  const corners = [origin, add(origin, u), add(origin, u, v), add(origin, v)];
  const center = add(origin, times(u, 0.5), times(v, 0.5));
  return corners
    .map((p) => add(center, times(add(p, times(center, -1)), inset)))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

const range = [0, 1, 2] as const;
const FACES = {
  top: range.flatMap((i) => range.map((j) => cell(add(times(A, i), times(B, j)), A, B))),
  left: range.flatMap((i) =>
    range.map((k) => cell(add(times(B, 3), times(A, i), times(C, k)), A, C)),
  ),
  right: range.flatMap((j) =>
    range.map((k) => cell(add(times(A, 3), times(B, j), times(C, k)), B, C)),
  ),
};

export function CubePoster() {
  return (
    <div className="absolute top-[26%] left-1/2 w-[58vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-[74%] md:w-[22vw]">
      <svg viewBox="-110 -6 220 252" className="h-auto w-full" role="presentation">
        <g stroke="#9aa7b4" strokeOpacity="0.35" strokeWidth="0.8">
          {FACES.top.map((points) => (
            <polygon key={`t${points}`} points={points} fill="#4a5664" />
          ))}
          {FACES.left.map((points) => (
            <polygon key={`l${points}`} points={points} fill="#343e4a" />
          ))}
          {FACES.right.map((points) => (
            <polygon key={`r${points}`} points={points} fill="#262f39" />
          ))}
        </g>
      </svg>
    </div>
  );
}
