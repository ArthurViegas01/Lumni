/**
 * Modo de cor do site: "light" (papel branco, tinta preta) ou "dark" (invertido).
 * Módulo puro: usado pelo script do <head>, pelo botão de inverter e pelos testes.
 */
export type Theme = "light" | "dark";

/** Chave no localStorage. Só existe quando a pessoa escolheu pelo botão. */
export const THEME_STORAGE_KEY = "lumni-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** Escolha salva vence; sem escolha (ou valor corrompido), segue o sistema. */
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return systemPrefersDark ? "dark" : "light";
}

/**
 * Script síncrono do <head>: define `data-theme` antes do primeiro paint, para a
 * página nunca piscar no modo errado. É a mesma regra de `resolveTheme`, escrita
 * à mão em ES5 curto porque roda antes de qualquer bundle (o teste compara os dois).
 * localStorage pode lançar (modo privado, cookies bloqueados): cai no sistema.
 */
export const themeInitScript = `(function(){var s=null;try{s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")})()`;
