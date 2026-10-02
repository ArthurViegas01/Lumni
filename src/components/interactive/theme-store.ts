"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * Fonte da verdade do modo no cliente: o atributo `data-theme` do <html>, definido
 * pelo script do <head> antes do paint. Quem precisa reagir (botão, cena 3D) assina
 * as mudanças do atributo — não há estado React duplicado para dessincronizar.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/** No servidor o modo é desconhecido: "light" é só o valor da hidratação. */
const getServerSnapshot = (): Theme => "light";

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Aplica e salva a escolha explícita da pessoa. Sem localStorage, vale só nesta visita. */
export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // modo privado / armazenamento bloqueado: a troca funciona, só não persiste
  }
}

/** Há escolha salva? Sem ela, o site acompanha o sistema ao vivo. */
export function hasStoredTheme(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
