import type { Locale } from "./config";
import type ptDictionary from "./dictionaries/pt.json";

/** O português é a fonte da verdade: o inglês precisa ter exatamente a mesma forma. */
export type Dictionary = typeof ptDictionary;

// Importação dinâmica: cada página carrega só o idioma que renderiza, e tudo roda no servidor.
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
