import { NextResponse, type NextRequest } from "next/server";
import { negotiateLocale } from "@/i18n/negotiate";

/**
 * Garante prefixo de idioma: "/" -> "/pt", "/servicos" -> "/pt/servicos".
 * Next 16: o antigo middleware agora se chama proxy e roda sempre em runtime nodejs.
 *
 * O matcher já exclui tudo que tem prefixo de idioma, então o proxy só roda para
 * URLs sem idioma — as páginas estáticas de /pt e /en não pagam o custo de invocá-lo.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // 307: a escolha depende do header do visitante, não é um redirect permanente.
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Exclui: prefixos de idioma, internos do Next, API, arquivos de metadados e
  // qualquer caminho com extensão. Precisa ser literal (análise estática do Next).
  matcher: [
    "/((?!pt(?:/|$)|en(?:/|$)|_next|api|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
