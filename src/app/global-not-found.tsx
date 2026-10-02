import type { Metadata } from "next";
import Link from "next/link";
import { themeInitScript } from "@/lib/theme";
import { fontVariables } from "./fonts";
import "./globals.css";

// 404 para URLs que não casam com rota nenhuma. O layout raiz vive em [locale],
// então este arquivo não passa por layout: importa CSS e fontes por conta própria.
export const metadata: Metadata = {
  title: "404 · Lumni",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-svh items-center justify-center bg-bg px-4 text-ink">
        <div className="text-center">
          <p className="font-mono text-sm text-ink-quiet">404</p>
          <h1 className="display-caps mt-2 text-h2">Página não encontrada · Page not found</h1>
          <Link
            href="/"
            className="mt-6 inline-block border border-ink px-4 py-2 font-medium hover:bg-ink hover:text-bg"
          >
            Voltar ao início · Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
