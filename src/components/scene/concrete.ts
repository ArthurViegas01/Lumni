import { CanvasTexture, NoColorSpace, SRGBColorSpace } from "three";
import { createRng } from "./twist";

/**
 * Face de módulo de fachada brutalista, desenhada em canvas no cliente (zero bytes de
 * imagem no bundle; ~10 ms na montagem). Duas texturas com o MESMO desenho:
 *
 * - `map` (albedo, cinza): concreto claro com granulação e manchas, caixilho recuado,
 *   sulco escuro em volta e a marca do tirante de fôrma no centro. Multiplica a cor
 *   do material (`palette.solid`): o mesmo desenho serve ao cubo preto e ao branco.
 * - `bump` (relevo): a luz da cena "afunda" o painel e o sulco de verdade.
 *
 * O desenho é simétrico por rotação de 90°, e a granulação é isotrópica: requisito dos
 * giros de camada (ver twist.ts), em que as peças voltam à origem depois de cada giro.
 */
const SIZE = 512;

/** Geometria da face, em fração do lado. */
const FACE = {
  /** Borda externa até o caixilho (a moldura do módulo). */
  frame: 0.15,
  /** Largura do sulco em volta do painel recuado. */
  groove: 0.018,
  /** Lado do tirante (marca quadrada) no centro. */
  tie: 0.07,
} as const;

type Tones = { base: number; panel: number; groove: number; tie: number; grain: number };

const ALBEDO: Tones = { base: 238, panel: 228, groove: 120, tie: 96, grain: 16 };
const RELIEF: Tones = { base: 210, panel: 150, groove: 40, tie: 20, grain: 10 };

function draw(tones: Tones, seed: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  const rand = createRng(seed);
  const gray = (v: number) => `rgb(${v} ${v} ${v})`;
  const px = (f: number) => Math.round(f * SIZE);

  ctx.fillStyle = gray(tones.base);
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Manchas largas e suaves: variação de cura do concreto.
  for (let i = 0; i < 28; i++) {
    const r = SIZE * (0.06 + rand() * 0.14);
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const tone = tones.base - tones.grain * (0.4 + rand() * 0.8);
    g.addColorStop(0, `rgb(${tone} ${tone} ${tone} / 0.35)`);
    g.addColorStop(1, `rgb(${tone} ${tone} ${tone} / 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Painel recuado e o sulco em volta.
  const a = px(FACE.frame);
  const b = SIZE - 2 * a;
  const gw = Math.max(2, px(FACE.groove));
  ctx.fillStyle = gray(tones.groove);
  ctx.fillRect(a - gw, a - gw, b + 2 * gw, b + 2 * gw);
  ctx.fillStyle = gray(tones.panel);
  ctx.fillRect(a, a, b, b);

  // Tirante de fôrma no centro.
  const t = px(FACE.tie);
  ctx.fillStyle = gray(tones.tie);
  ctx.fillRect((SIZE - t) / 2, (SIZE - t) / 2, t, t);

  // Granulação fina, pixel a pixel (isotrópica).
  const image = ctx.getImageData(0, 0, SIZE, SIZE);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (rand() - 0.5) * tones.grain;
    data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, data[i]! + n));
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

export type ConcreteTextures = { map: CanvasTexture; bump: CanvasTexture };

export function createConcreteTextures(): ConcreteTextures {
  const map = new CanvasTexture(draw(ALBEDO, 11));
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 4;
  const bump = new CanvasTexture(draw(RELIEF, 11));
  bump.colorSpace = NoColorSpace;
  return { map, bump };
}
