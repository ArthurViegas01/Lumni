"use client";

import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  type Group,
  type LineBasicMaterial,
  type MeshStandardMaterial,
  Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { SCENE_COLORS } from "./color";
import { cubeStateAt, idleWeightAt, labelWeightOf, solidOpacityOf, spreadOf } from "./cubeState";
import type { CalloutElements, PointerState } from "./types";

const AXIS = [-1, 0, 1] as const;
/** Posição montada de cada uma das 27 peças. Índice = (x+1)*9 + (y+1)*3 + (z+1). */
const HOME = AXIS.flatMap((x) => AXIS.flatMap((y) => AXIS.map((z) => new Vector3(x, y, z))));
const PIECE_SIZE = 0.96;
/** Abaixo desta largura (px do canvas) o cubo sobe e centraliza, acima do texto. */
const NARROW_BREAKPOINT = 768;
/** No mobile o cubo encolhe e sobe: o texto ocupa a metade de baixo. */
const NARROW_SCALE = 0.6;
const NARROW_LIFT = 1.5;

/** Inclinação máxima pelo ponteiro, em radianos (~5°). */
const TILT = 0.09;
/**
 * Peças que recebem rótulo na etapa 3: os 6 cantos que formam a silhueta hexagonal
 * do cubo na rotação da etapa 3. Os cantos 6 e 20 ficam de fora: projetam no centro.
 */
const CALLOUT_PIECES = [26, 8, 2, 0, 18, 24] as const;
/** Distância, em px, entre a peça e o início do rótulo. */
const CALLOUT_REACH = 56;

const EDGE_ON_DARK = new Color(SCENE_COLORS.edgeOnDark);
const EDGE_ON_LIGHT = new Color(SCENE_COLORS.edgeOnLight);
const scratch = new Vector3();
const center = new Vector3();

/** Some com os rótulos da etapa 3 (fora dela, ou no mobile). */
function hideCallouts(callouts: CalloutElements) {
  for (const el of callouts.labels) if (el) el.style.opacity = "0";
  for (const el of callouts.lines) if (el) el.style.opacity = "0";
}

/** Geometrias compartilhadas pelas 27 peças. Nunca são mutadas depois de criadas. */
function createGeometries() {
  const box = new BoxGeometry(PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
  const geometries = {
    solid: new RoundedBoxGeometry(PIECE_SIZE, PIECE_SIZE, PIECE_SIZE, 3, 0.08),
    // Arestas de uma caixa reta: as da caixa arredondada viriam cheias de facetas.
    edges: new EdgesGeometry(box),
  };
  box.dispose();
  return geometries;
}

type CubeProps = {
  progress: MotionValue<number>;
  /** Balanço ocioso no topo da página. Desligado em ?freeze=1 para testes visuais. */
  idle: boolean;
  /** Ponteiro normalizado (-1..1), escrito pelo PointerTracker. */
  pointerRef: RefObject<PointerState>;
  /** Rótulos e linhas da etapa 3, no DOM, posicionados aqui a cada frame. */
  calloutsRef?: RefObject<CalloutElements>;
};

export function Cube({ progress, idle, pointerRef, calloutsRef }: CubeProps) {
  const [geometry] = useState(createGeometries);
  const group = useRef<Group>(null);
  const pieces = useRef<(Group | null)[]>([]);
  const solids = useRef<(MeshStandardMaterial | null)[]>([]);
  const edges = useRef<(LineBasicMaterial | null)[]>([]);
  const state = useRef(cubeStateAt(0));
  const tilt = useRef<PointerState>({ x: 0, y: 0 });

  useEffect(
    () => () => {
      geometry.solid.dispose();
      geometry.edges.dispose();
    },
    [geometry],
  );

  useFrame((frame, delta) => {
    const root = group.current;
    if (!root) return;

    const p = progress.get();
    const s = cubeStateAt(p, state.current);
    const narrow = frame.size.width < NARROW_BREAKPOINT;

    // Balanço ocioso: limitado e determinístico, some suave com o scroll.
    const idleWeight = idle ? idleWeightAt(p) : 0;
    const sway = idleWeight * Math.sin(frame.clock.elapsedTime * 0.5) * 0.35;

    // Inclinação pelo ponteiro, amortecida. O alvo vem de fora (0 sem ponteiro fino).
    const target = pointerRef.current;
    const t = tilt.current;
    const k = Math.min(1, delta * 6);
    t.x += (target.x - t.x) * k;
    t.y += (target.y - t.y) * k;
    const tilting = Math.abs(target.x - t.x) + Math.abs(target.y - t.y) > 0.001;

    root.position.set(narrow ? 0 : s.x, narrow ? s.y + NARROW_LIFT : s.y, 0);
    root.scale.setScalar(s.scale * (narrow ? NARROW_SCALE : 1));
    root.rotation.set(s.rotX + t.y * TILT, s.rotY + sway + t.x * TILT, 0);

    // Sólido -> planta técnica: o sólido some e as arestas escurecem para o fundo claro.
    const spread = spreadOf(s);
    const solidOpacity = solidOpacityOf(s.edges);
    const edgeOpacity = 0.3 + 0.7 * s.edges;
    for (let i = 0; i < HOME.length; i++) {
      pieces.current[i]?.position.copy(HOME[i]!).multiplyScalar(spread);

      const solid = solids.current[i];
      if (solid) {
        solid.opacity = solidOpacity;
        solid.visible = solidOpacity > 0.01;
        solid.depthWrite = solidOpacity > 0.99;
      }
      const edge = edges.current[i];
      if (edge) {
        edge.color.lerpColors(EDGE_ON_DARK, EDGE_ON_LIGHT, s.edges);
        edge.opacity = edgeOpacity;
      }
    }

    const callouts = calloutsRef?.current;
    if (callouts) {
      const weight = narrow ? 0 : labelWeightOf(s);
      if (weight > 0.001) {
        root.updateMatrixWorld();
        const { width, height } = frame.size;
        root.getWorldPosition(center).project(frame.camera);
        const cx = ((center.x + 1) / 2) * width;
        const cy = ((1 - center.y) / 2) * height;

        CALLOUT_PIECES.forEach((pieceIndex, k) => {
          const piece = pieces.current[pieceIndex];
          const label = callouts.labels[k];
          const line = callouts.lines[k];
          if (!piece || !label || !line) return;

          piece.getWorldPosition(scratch).project(frame.camera);
          const sx = ((scratch.x + 1) / 2) * width;
          const sy = ((1 - scratch.y) / 2) * height;
          const len = Math.hypot(sx - cx, sy - cy) || 1;
          const ux = (sx - cx) / len;
          const uy = (sy - cy) / len;
          const ax = sx + ux * CALLOUT_REACH;
          const ay = sy + uy * CALLOUT_REACH;
          const right = ux >= 0;

          // Mantém o rótulo dentro da tela: perto da borda, ele encosta em vez de cortar.
          const labelWidth = label.offsetWidth;
          const edge = 16;
          const lx = right
            ? Math.min(ax + 12, width - edge - labelWidth)
            : Math.max(ax - 12, edge + labelWidth);

          label.style.transform = `translate3d(${lx}px, ${ay}px, 0) translate(${right ? "0" : "-100%"}, -50%)`;
          label.style.opacity = String(weight);
          line.setAttribute("points", `${sx},${sy} ${ax},${ay} ${lx + (right ? -4 : 4)},${ay}`);
          line.style.opacity = String(weight);
        });
      } else {
        hideCallouts(callouts);
      }
    }

    // frameloop="demand": só pede o próximo frame enquanto algo se move sozinho.
    if (idleWeight > 0.001 || tilting) frame.invalidate();
  });

  return (
    <group ref={group}>
      {HOME.map((_, i) => (
        <group
          key={i}
          ref={(node) => {
            pieces.current[i] = node;
          }}
        >
          <mesh geometry={geometry.solid}>
            <meshStandardMaterial
              ref={(material) => {
                solids.current[i] = material;
              }}
              color={SCENE_COLORS.solid}
              metalness={0.15}
              roughness={0.55}
              transparent
            />
          </mesh>
          <lineSegments geometry={geometry.edges}>
            <lineBasicMaterial
              ref={(material) => {
                edges.current[i] = material;
              }}
              color={SCENE_COLORS.edgeOnDark}
              transparent
              opacity={0.3}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
