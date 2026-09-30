/**
 * Detecção de capacidade no cliente, em formato compatível com useSyncExternalStore:
 * snapshot estável (boolean em cache) e valor de servidor fixo em false,
 * então o HTML do servidor sempre sai com o pôster e nunca há mismatch de hidratação.
 */
let webglCache: boolean | undefined;

export function supportsWebGL(): boolean {
  if (webglCache !== undefined) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** ?freeze=1 desliga mola e balanço ocioso: o render vira função só do scroll (testes visuais). */
export function isFrozen(): boolean {
  return new URLSearchParams(window.location.search).get("freeze") === "1";
}

export const serverSnapshot = () => false;
/** As capacidades não mudam durante a sessão; não há o que assinar. */
export const subscribeNever = () => () => {};
