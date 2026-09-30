"use client";

/**
 * "Três fornecedores" contra "um responsável", desenhado quando entra na tela.
 * Técnica do animejs.com (traços de SVG que se desenham) feita com Motion
 * (`pathLength`), para manter um único motor de animação (decisão D18).
 */
import { useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

type Labels = {
  company: string;
  vendors: readonly [string, string, string];
  hub: string;
  fronts: readonly [string, string, string, string];
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: 0.15 + i * 0.12, duration: 0.8 },
      opacity: { delay: 0.15 + i * 0.12, duration: 0.01 },
    },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0 },
  shown: (i: number) => ({ opacity: 1, transition: { delay: 0.2 + i * 0.12, duration: 0.3 } }),
};

// Mesmas propriedades de `draw`: o HTML do servidor sai com pathLength 0 (ele não
// conhece a preferência de movimento) e a variante estática precisa desfazer isso.
const still: Variants = {
  hidden: { pathLength: 1, opacity: 1 },
  shown: { pathLength: 1, opacity: 1 },
};
const stillMark: Variants = { hidden: { opacity: 1 }, shown: { opacity: 1 } };

const VENDOR_X = [56, 180, 304] as const;
const FRONT_X = [45, 135, 225, 315] as const;
const CX = 180;
const BOX_W = 96;

function Box({
  x,
  y,
  w,
  label,
  strong = false,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  strong?: boolean;
}) {
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 16}
        width={w}
        height={32}
        rx={6}
        className={strong ? "fill-accent/15 stroke-accent" : "fill-bg stroke-border"}
        strokeWidth={strong ? 1.5 : 1}
      />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-ink font-mono text-[11px]">
        {label}
      </text>
    </g>
  );
}

export function SupplierDiagram({
  labels,
  variant,
}: {
  labels: Labels;
  variant: "before" | "after";
}) {
  const reduce = useReducedMotion();
  const line = reduce ? still : draw;
  const mark = reduce ? stillMark : fade;

  return (
    <m.svg
      viewBox="0 0 360 240"
      className="h-auto w-full"
      role="img"
      aria-label={
        variant === "before"
          ? `${labels.company} → ${labels.vendors.join(", ")}`
          : `${labels.company} → ${labels.hub} → ${labels.fronts.join(", ")}`
      }
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
    >
      {variant === "before" ? (
        <>
          {/* Linhas que se cruzam: cada fornecedor puxa a empresa para um lado. */}
          {VENDOR_X.map((vx, i) => (
            <m.path
              key={vx}
              custom={i}
              variants={line}
              d={`M${CX} 189 C ${VENDOR_X[(i + 2) % 3]} 130, ${VENDOR_X[(i + 1) % 3]} 100, ${vx} 51`}
              fill="none"
              className="stroke-ink-quiet"
              strokeWidth={1.25}
            />
          ))}
          {/* Coordenação entre fornecedores: tracejada, e sempre com dúvida. */}
          {[0, 1].map((i) => (
            <m.path
              key={`c${i}`}
              custom={3 + i}
              variants={line}
              d={`M${VENDOR_X[i] + BOX_W / 2} 35 L${VENDOR_X[i + 1] - BOX_W / 2} 35`}
              fill="none"
              className="stroke-ink-quiet"
              strokeDasharray="3 3"
            />
          ))}
          {[0, 1].map((i) => (
            <m.text
              key={`q${i}`}
              custom={5 + i}
              variants={mark}
              x={(VENDOR_X[i] + VENDOR_X[i + 1]) / 2}
              y={24}
              textAnchor="middle"
              className="fill-accent font-mono text-[12px]"
            >
              ?
            </m.text>
          ))}
          {VENDOR_X.map((vx, i) => (
            <Box key={vx} x={vx} y={35} w={BOX_W} label={labels.vendors[i]} />
          ))}
        </>
      ) : (
        <>
          <m.path
            custom={0}
            variants={line}
            d={`M${CX} 189 L${CX} 136`}
            fill="none"
            className="stroke-accent"
            strokeWidth={1.75}
          />
          {FRONT_X.map((fx, i) => (
            <m.path
              key={fx}
              custom={1 + i}
              variants={line}
              d={`M${CX} 104 C ${CX} 80, ${fx} 80, ${fx} 52`}
              fill="none"
              className="stroke-accent"
              strokeWidth={1.25}
            />
          ))}
          {FRONT_X.map((fx, i) => (
            <m.g key={`f${fx}`} custom={2 + i} variants={mark}>
              <circle cx={fx} cy={46} r={5} className="fill-bg stroke-accent" strokeWidth={1.5} />
              <text x={fx} y={30} textAnchor="middle" className="fill-ink font-mono text-[10px]">
                {labels.fronts[i]}
              </text>
            </m.g>
          ))}
          <Box x={CX} y={120} w={120} label={labels.hub} strong />
        </>
      )}
      <Box x={CX} y={205} w={120} label={labels.company} />
    </m.svg>
  );
}
