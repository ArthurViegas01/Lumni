"use client";

import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { SCROLL_SPRING } from "@/lib/motion";
import { isFrozen, serverSnapshot, subscribeNever, supportsWebGL } from "./capabilities";
import { canonicalAnchors, measureAnchors, remapProgress } from "./progress";
import type { CalloutElements } from "./types";

// Chunk separado, só no cliente: three.js + R3F nunca entram no JS inicial.
// (Next 16: `ssr: false` só é permitido dentro de Client Component.)
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

type StorySceneProps = {
  /** As etapas de texto, renderizadas no servidor. Cada uma marcada com `data-stage`. */
  children: ReactNode;
  /** Imagem estática do cubo: primeiro paint, fallback sem WebGL e com reduced motion. */
  poster: ReactNode;
  label: string;
  /** Rótulos presos às peças na etapa 3 (desktop). Até 6. */
  callouts?: readonly string[];
};

/**
 * Região do hero: um palco sticky (fundo + pôster + canvas + rótulos) com as etapas
 * de texto rolando por cima. O scroll vira um único número de 0 a 1 que alimenta o
 * cubo e os rótulos — a mesma fonte, então nunca dessincronizam. O fundo é o papel
 * do site: fixo, e inverte junto com o modo.
 */
export function StoryScene({ children, poster, label, callouts = [] }: StorySceneProps) {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<CalloutElements>({ labels: [], lines: [] });
  const [canvasReady, setCanvasReady] = useState(false);
  const onReady = useCallback(() => setCanvasReady(true), []);

  const reduceMotion = useReducedMotion();
  const webgl = useSyncExternalStore(subscribeNever, supportsWebGL, serverSnapshot);
  const frozen = useSyncExternalStore(subscribeNever, isFrozen, serverSnapshot);
  const showCanvas = webgl && !reduceMotion;

  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const smoothed = useSpring(scrollYProgress, SCROLL_SPRING);
  const source = frozen ? scrollYProgress : smoothed;

  // Onde cada etapa realmente centraliza (etapas mais altas que a tela deslocam as seguintes).
  const anchors = useMotionValue<readonly number[]>(canonicalAnchors(4));
  const progress = useTransform(() => remapProgress(source.get(), anchors.get()));

  useEffect(() => {
    const region = root.current;
    const stages = content.current?.querySelectorAll<HTMLElement>("[data-stage]");
    if (!region || !stages?.length) return;

    const measure = () => {
      const centers = Array.from(stages, (el) => el.offsetTop + el.offsetHeight / 2);
      anchors.set(measureAnchors(centers, region.offsetHeight, window.innerHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(region);
    return () => observer.disconnect();
  }, [anchors]);

  return (
    <section ref={root} aria-label={label} className="tone-base relative">
      <div className="sticky top-0 h-svh overflow-hidden bg-bg" aria-hidden>
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            showCanvas && canvasReady ? "opacity-0" : "opacity-100"
          }`}
        >
          {poster}
        </div>
        {showCanvas && (
          <>
            <div className="absolute inset-0">
              <SceneCanvas
                progress={progress}
                idle={!frozen}
                calloutsRef={calloutsRef}
                onReady={onReady}
              />
            </div>
            {/* Rótulos da etapa 3: posicionados pelo Cube a cada frame, via refs. */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <svg className="absolute inset-0 size-full overflow-visible">
                {callouts.map((text, i) => (
                  <polyline
                    key={text}
                    ref={(el) => {
                      calloutsRef.current.lines[i] = el;
                    }}
                    fill="none"
                    className="stroke-ink"
                    strokeWidth={1}
                    style={{ opacity: 0 }}
                  />
                ))}
              </svg>
              {callouts.map((text, i) => (
                <span
                  key={text}
                  ref={(el) => {
                    calloutsRef.current.labels[i] = el;
                  }}
                  className="absolute top-0 left-0 border border-ink bg-bg px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-ink uppercase will-change-transform"
                  style={{ opacity: 0 }}
                >
                  {text}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Sobe o conteúdo por cima do palco sticky. */}
      <div ref={content} className="relative -mt-[100svh]">
        {children}
      </div>
    </section>
  );
}
