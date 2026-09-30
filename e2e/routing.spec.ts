import { expect, test } from "@playwright/test";

// Nível HTTP: sem navegador, sem seguir redirects. Um projeto basta.
test.skip(({ isMobile }) => isMobile, "roteamento não depende do dispositivo");

async function statusOf(
  request: import("@playwright/test").APIRequestContext,
  path: string,
  headers: Record<string, string> = {},
) {
  const res = await request.get(path, { maxRedirects: 0, headers });
  return { status: res.status(), location: res.headers()["location"] ?? null };
}

const location = (path: string) => expect.stringMatching(new RegExp(`${path}$`));

test.describe("negociação de idioma (proxy)", () => {
  test("raiz vai para o idioma do navegador, com português como padrão", async ({ request }) => {
    expect(await statusOf(request, "/")).toEqual({ status: 307, location: location("/pt") });
    expect(await statusOf(request, "/", { "accept-language": "en-US,en;q=0.9" })).toEqual({
      status: 307,
      location: location("/en"),
    });
  });

  test("caminho sem idioma ganha o prefixo e preserva o resto", async ({ request }) => {
    expect(await statusOf(request, "/servicos")).toEqual({
      status: 307,
      location: location("/pt/servicos"),
    });
  });

  test("arquivos de metadados não passam pelo proxy", async ({ request }) => {
    for (const path of ["/robots.txt", "/sitemap.xml", "/icon.svg"]) {
      expect((await statusOf(request, path)).status, path).toBe(200);
    }
  });
});

test.describe("URLs traduzidas (rewrites + redirects)", () => {
  test("URLs públicas em inglês respondem 200", async ({ request }) => {
    for (const path of ["/en/services", "/en/services/managed-it", "/en/team"]) {
      expect((await statusOf(request, path)).status, path).toBe(200);
    }
  });

  test("a forma interna em português redireciona (308) para a pública em inglês", async ({
    request,
  }) => {
    expect(await statusOf(request, "/en/servicos/ti-gerenciada")).toEqual({
      status: 308,
      location: location("/en/services/managed-it"),
    });
    expect(await statusOf(request, "/en/time")).toEqual({
      status: 308,
      location: location("/en/team"),
    });
  });

  test("rota que não existe no idioma é 404, não redirect", async ({ request }) => {
    expect((await statusOf(request, "/en/services/presenca-digital")).status).toBe(404);
    expect((await statusOf(request, "/en/servicos/presenca-digital")).status).toBe(404);
    expect((await statusOf(request, "/pt/services")).status).toBe(404);
    expect((await statusOf(request, "/pt/servicos/managed-it")).status).toBe(404);
  });
});
