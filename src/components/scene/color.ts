/** Mistura linear entre duas cores hex (#rrggbb), devolvendo `rgb(r g b)`. Puro e testável. */
export function mixHex(from: string, to: string, t: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const channel = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * k);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
}

function parseHex(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) throw new Error(`Cor inválida: ${hex}`);
  const n = Number.parseInt(match[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Paleta que a cena 3D usa. Espelha os tokens de globals.css. */
export const SCENE_COLORS = {
  darkBg: "#0b0f14",
  lightBg: "#ffffff",
  solid: "#4a5664",
  edgeOnDark: "#9aa7b4",
  edgeOnLight: "#0f1419",
  rimLight: "#5b9cff",
} as const;
