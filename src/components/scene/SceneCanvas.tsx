"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { type MotionValue, useMotionValueEvent } from "motion/react";
import { type RefObject, useEffect, useRef } from "react";
import { useTheme } from "@/components/interactive/theme-store";
import { SCENE_PALETTE } from "./color";
import { Cube } from "./Cube";
import type { CalloutElements, PointerState } from "./types";

type SceneCanvasProps = {
  progress: MotionValue<number>;
  idle: boolean;
  calloutsRef?: RefObject<CalloutElements>;
  /** Chamado depois do primeiro frame desenhado: é quando o pôster pode sair. */
  onReady: () => void;
};

/**
 * Canvas do hero. Importado só no cliente (ver StoryScene) e depois do primeiro paint,
 * então three.js nunca entra no JS inicial da página.
 */
export default function SceneCanvas({ progress, idle, calloutsRef, onReady }: SceneCanvasProps) {
  const pointerRef = useRef<PointerState>({ x: 0, y: 0 });
  const palette = SCENE_PALETTE[useTheme()];

  return (
    <Canvas
      frameloop="demand"
      // Sem tone mapping: o ACES padrão do R3F comprime o branco para cinza e o cubo
      // do modo invertido sairia cinza. Num site monocromático a cor tem de ser a do token.
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
    >
      <InvalidateOn value={progress} />
      {idle && <PointerTracker pointerRef={pointerRef} />}
      {/* Luz dura de cima e da direita, preenchimento fraco: faces bem separadas,
          como concreto ao sol. Monocromática (D26). */}
      <ambientLight intensity={palette.light.ambient} />
      <directionalLight position={[4, 6, 5]} intensity={palette.light.key} />
      <directionalLight position={[-5, -1, 2]} intensity={palette.light.fill} />
      <Cube
        progress={progress}
        idle={idle}
        pointerRef={pointerRef}
        calloutsRef={calloutsRef}
        palette={palette}
      />
    </Canvas>
  );
}

/** Com frameloop="demand", redesenha só quando o progresso de scroll muda. Parado, custo zero. */
function InvalidateOn({ value }: { value: MotionValue<number> }) {
  const invalidate = useThree((s) => s.invalidate);
  useMotionValueEvent(value, "change", () => invalidate());
  return null;
}

/**
 * Lê o ponteiro da janela inteira (o canvas fica atrás do texto e não recebe eventos).
 * Só com ponteiro fino: no toque não há inclinação.
 */
function PointerTracker({ pointerRef }: { pointerRef: RefObject<PointerState> }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerRef, invalidate]);

  return null;
}
