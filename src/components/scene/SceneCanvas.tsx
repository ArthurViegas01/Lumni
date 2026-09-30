"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { type MotionValue, useMotionValueEvent } from "motion/react";
import { type RefObject, useEffect, useRef } from "react";
import { SCENE_COLORS } from "./color";
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

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
    >
      <InvalidateOn value={progress} />
      {idle && <PointerTracker pointerRef={pointerRef} />}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <directionalLight position={[-5, -2, -4]} intensity={0.6} color={SCENE_COLORS.rimLight} />
      <Cube progress={progress} idle={idle} pointerRef={pointerRef} calloutsRef={calloutsRef} />
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
