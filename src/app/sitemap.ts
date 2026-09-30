import type { MetadataRoute } from "next";
import { htmlLang } from "@/i18n/config";
import { allRoutes, href, localesOf } from "@/i18n/routes";
import { site } from "@/lib/site";

/**
 * Uma entrada por página publicada, com hreflang recíproco apenas entre os idiomas
 * em que ela existe. A fonte é o registro de rotas: página nova entra aqui sozinha.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().map(({ locale, route }) => ({
    url: `${site.url}${href(locale, route)}`,
    alternates: {
      languages: Object.fromEntries(
        localesOf(route).map((l) => [htmlLang[l], `${site.url}${href(l, route)}`]),
      ),
    },
  }));
}
