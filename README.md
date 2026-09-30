# Lumni — site institucional

Site da Lumni (nome provisório): infraestrutura, software e automação para empresas.
Next.js 16 (App Router), React 19, Tailwind 4, Motion e React Three Fiber, com um hero 3D guiado por scroll.

- **Plano completo:** [PLANO_DE_IMPLEMENTACAO.md](./PLANO_DE_IMPLEMENTACAO.md) — arquitetura, decisões, fases e critérios de aceite.
- **Histórico por versão:** [CHANGELOG.md](./CHANGELOG.md).
- **Regras para quem contribui (pessoas e agentes):** [AGENTS.md](./AGENTS.md).

## Requisitos

- Node.js **22.12 ou superior** (ver `.nvmrc`). Vitest 5 e Vite 8 exigem essa versão.
- npm 10+.

## Começando

```bash
npm ci                       # instala exatamente o lockfile (prefira a `npm install`, ver abaixo)
cp .env.example .env.local   # ajuste NEXT_PUBLIC_SITE_URL se precisar
npm run dev                  # http://localhost:3000 -> redireciona para /pt ou /en
```

## Scripts

| Comando                           | O que faz                                                          |
| --------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                     | Servidor de desenvolvimento (Turbopack)                            |
| `npm run build` / `npm start`     | Build de produção e servidor                                       |
| `npm run lint`                    | ESLint (config do Next, flat config)                               |
| `npm run typecheck`               | Gera os tipos de rota (`next typegen`) e roda `tsc`                |
| `npm test` / `npm run test:watch` | Testes unitários (Vitest)                                          |
| `npm run format` / `format:check` | Prettier com ordenação de classes Tailwind                         |
| `npm run check`                   | lint + typecheck + testes + formatação — rode antes de todo commit |
| `npm run analyze`                 | Analisador de bundle do Next (`next experimental-analyze`)         |

## Estrutura

```
src/
  app/
    [locale]/            layout raiz (html lang, fontes, header/footer) e páginas por idioma
    fonts/               woff2 auto-hospedados + licenças OFL
    fonts.ts             declaração das fontes (next/font/local)
    globals.css          tokens da direção de arte híbrida (Tailwind 4 @theme)
    global-not-found.tsx 404 de URLs sem rota
    robots.ts sitemap.ts icon.svg
  proxy.ts               redireciona "/" para /pt ou /en pelo Accept-Language
  components/
    layout/              header e footer
    motion/              MotionProvider (LazyMotion estrito) e Reveal (client)
    effects/             efeitos visuais, vários portados do React Bits (client)
    interactive/         menu mobile (client)
    scene/               hero 3D: cubeState e progress (puros), Cube, SceneCanvas, StoryScene, pôster
    sections/            seções das páginas (Server Components)
    ui/                  Button, Section, Eyebrow, StarBorder, Ticker (Server Components)
  i18n/                  idiomas, negociação, dicionários pt/en
  lib/                   constantes compartilhadas (site, motion)
```

## Dicas de desenvolvimento

- **`/pt?freeze=1`** desliga a mola do scroll e o balanço ocioso do cubo: o render vira função só da posição de scroll. Use para comparar screenshots.
- **Reduced motion:** com `prefers-reduced-motion` ativo no sistema, o canvas não carrega e fica o pôster estático. Teste pelo DevTools → Rendering → _Emulate CSS prefers-reduced-motion_.
- **Fontes** ficam no repositório: o build não precisa de acesso ao Google Fonts.
- **Windows e o lockfile:** `npm install` no Windows pode tirar do `package-lock.json` pacotes opcionais de outras plataformas (`@emnapi/*`), e o `npm ci` do CI (Linux) falha. Para instalar, use `npm ci`. Ao adicionar uma dependência, rode `npm install --package-lock-only` em seguida e confira no `git diff` que nenhum `@emnapi` sumiu.
- **Componentes de terceiros:** efeitos portados do React Bits estão listados em `THIRD_PARTY_NOTICES.md`, com a licença. Mantenha o repositório privado.
