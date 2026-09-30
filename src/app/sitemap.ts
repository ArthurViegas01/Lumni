import type { MetadataRoute } from "next";
import { htmlLang, locales } from "@/i18n/config";
import { site } from "@/lib/site";

/** Uma entrada por página e idioma, com hreflang recíproco. Novas páginas entram em `paths`. */
const paths = [""] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `${site.url}/${l}${path}`])),
      },
    })),
  );
}
