import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/i18n/config";
import { negotiateLocale } from "@/i18n/negotiate";

/**
 * Garante prefixo de idioma em toda rota de página: "/" -> "/pt", "/servicos" -> "/pt/servicos".
 * Next 16: o antigo middleware agora se chama proxy e roda sempre em runtime nodejs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasPrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasPrefix) return;

  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // 307: a escolha depende do header do visitante, não é um redirect permanente.
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Ignora internos do Next, rotas de API, arquivos de metadados e qualquer arquivo com extensão.
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
