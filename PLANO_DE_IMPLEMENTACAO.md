# Plano de implementação — site Lumni

> **Versão do plano:** 1.2 · **Atualizado em:** 30/09/2026 · **Versão do código:** 0.3.0
> **Onde estamos:** Fases 0 e 1 com código pronto; Fase 3 quase fechada (falta o Figma); home, hero, páginas de serviço, hub e time no ar; rotas traduzidas (parte da Fase 8) e E2E com Playwright entregues na v0.3.0. Detalhe por item na seção 5.
> **Próxima ação:** tornar o repositório privado (D20); validar a copy das páginas de serviço e decidir a faixa de preço (P10, P12, P13); medir o hero num Android intermediário (roteiro 4.2).

Este documento é a fonte da verdade técnica do site. Ele diz **o que** construir, **como**, **em que ordem** e **como saber que está pronto**. Decisões de negócio e posicionamento vivem no documento de planejamento; aqui ficam só as que afetam código.

Regra de manutenção: toda decisão nova entra na tabela da seção 1; toda entrega muda o status da fase na seção 5 e ganha uma entrada no `CHANGELOG.md`.

---

## Sumário

1. [Decisões registradas](#1-decisões-registradas)
2. [Escopo](#2-escopo)
3. [Arquitetura](#3-arquitetura)
4. [Qualidade: orçamento, testes, acessibilidade, CI](#4-qualidade)
5. [Roadmap por fase](#5-roadmap-por-fase)
6. [Cronograma e esforço](#6-cronograma-e-esforço)
7. [Riscos](#7-riscos)
8. [Pendências e perguntas abertas](#8-pendências-e-perguntas-abertas)
9. [Referências](#9-referências)

---

## 1. Decisões registradas

| #   | Decisão                 | Escolha                                                                                                                                  | Por quê                                                                                                                                                                                          | Data  |
| --- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| D1  | Nome                    | **Lumni como provisório**                                                                                                                | Foco no site; o naming volta depois. Trocar o nome é mexer em poucos arquivos (seção 3.12)                                                                                                       | 29/09 |
| D2  | Direção de arte         | **Híbrida:** base clara institucional + seções escuras técnicas                                                                          | Base clara passa solidez para quem compra contrato recorrente; seções escuras provam profundidade técnica. Tokens únicos, tema por seção                                                         | 30/09 |
| D3  | Tamanho do time na copy | **Não mencionar número de pessoas**                                                                                                      | Decisão de negócio. A prova vem das especialidades, não da contagem                                                                                                                              | 30/09 |
| D4  | Framework               | **Next.js 16 (App Router)**                                                                                                              | i18n com slugs traduzidos, SSG, ecossistema React do time, reuso de componentes em projetos de cliente                                                                                           | 26/09 |
| D5  | Hero                    | **Cubo 3D de 27 peças guiado por scroll**, inspirado na técnica do animejs.com                                                           | Peças separadas permitem abrir, explodir e remontar; a narrativa "especialidades viram um só contrato"                                                                                           | 29/09 |
| D6  | Render 3D               | **React Three Fiber + three.js, geometria gerada por código**                                                                            | Sem arquivo de modelo nem Draco: o animejs.com gasta ~800 KB só nisso. CSS 3D quebra com peças se cruzando no Safari                                                                             | 29/09 |
| D7  | Animação 3D             | **Motion fornece o progresso; função pura `cubeStateAt` calcula o estado; `useFrame` aplica**                                            | A integração oficial do Motion com R3F foi descontinuada. Função pura = scroll reversível e coreografia testável                                                                                 | 29/09 |
| D8  | Plano B de animação     | **GSAP**, só se a coreografia passar de ~8 parâmetros                                                                                    | Gratuito desde 2025, licença permite site de cliente. Duas libs desde o início = dois modelos mentais                                                                                            | 29/09 |
| D9  | Idiomas                 | **pt e en, prefixo obrigatório** (`/pt`, `/en`), negociação por `Accept-Language` no `proxy.ts`                                          | Prefixo só no inglês obriga reescrever o roteamento depois                                                                                                                                       | 26/09 |
| D10 | 404                     | **`global-not-found.tsx`** (experimental no Next 16)                                                                                     | O layout raiz vive em `[locale]`; é o caso exato para o qual o recurso existe                                                                                                                    | 30/09 |
| D11 | Fontes                  | **woff2 no repo via `next/font/local`**                                                                                                  | Build independente do Google (o sandbox de CI pode bloquear), zero requisição a terceiros (LGPD)                                                                                                 | 30/09 |
| D12 | Testes                  | **Vitest** (unidade) agora; **Playwright** (visual, e2e, a11y) na Fase 4                                                                 | Vitest 5 exige Node ≥ 22.12 — fixado em `.nvmrc` e `engines`                                                                                                                                     | 30/09 |
| D13 | Blog                    | **MDX no repositório** (`@next/mdx`), CMS só quando alguém sem git precisar publicar                                                     | Custo zero, versionado, quem escreve é técnico                                                                                                                                                   | 26/09 |
| D14 | Hospedagem              | **Vercel** para o site; domínio no registro.br; DNS no Cloudflare                                                                        | Preview por PR, sem servidor para manter                                                                                                                                                         | 26/09 |
| D15 | Analytics               | **Sem cookie de rastreio** (Plausible, Umami ou Vercel Analytics)                                                                        | Dispensa banner de cookies: melhor conversão e conformidade                                                                                                                                      | 26/09 |
| D16 | Componentes de efeito   | **React Bits como fonte primária**, só componentes que usam `motion` ou nenhuma lib; portados e endurecidos antes de entrar              | Estética de ponta sem dependência nova. O original faz `setState` a cada movimento de mouse e usa cores fixas; a versão portada usa variável CSS ou motion value, tokens, `m.*` e reduced motion | 30/09 |
| D17 | Motion+                 | **Não usar** (AnimateNumber, Ticker, ScrambleText etc. são pagos)                                                                        | Os equivalentes gratuitos do React Bits cobrem o que o site precisa. Reavaliar se alguém comprar a licença                                                                                       | 30/09 |
| D18 | anime.js                | **Não entra como dependência**; as técnicas do animejs.com (traço de SVG, rótulos de vista explodida, stagger, scroll) feitas com Motion | Seria o terceiro motor (Motion e R3F já existem) para efeitos que o Motion já faz                                                                                                                | 30/09 |
| D19 | Efeitos contínuos       | **Fora:** canvas em loop, cursor customizado, partículas, fundos WebGL extras                                                            | Custo constante de bateria e GPU e cara de template em site B2B. Fundo técnico em CSS (`GridBackdrop`), custo zero parado                                                                        | 30/09 |
| D20 | Licença do React Bits   | **Uso permitido no site; repo privado recomendado**                                                                                      | MIT + Commons Clause: pode usar como parte do site, não pode redistribuir os componentes em si. Registro em `THIRD_PARTY_NOTICES.md`                                                             | 30/09 |
| D21 | Orçamento de JS         | **Meta revista para ≤ 220 KB gzip** (antes 200)                                                                                          | Medido: o framework Next/React sozinho ocupa ~177 KB; 200 KB deixaria 23 KB para o site inteiro. A meta agora separa framework e código nosso                                                    | 30/09 |
| D22 | Motion e three          | **Manter `useFrame` + função pura**; não usar o `threeEffect` (`motion/three`) que o Motion 13 publicou                                  | O `threeEffect` escreve a cada frame no loop do Motion e brigaria com o `frameloop="demand"` do R3F, que é o que zera o custo parado                                                             | 30/09 |
| D23 | URLs traduzidas         | **`rewrites` + `redirects` no `next.config.ts`**, gerados de `i18n/routes.ts`; o `proxy.ts` só negocia o idioma                          | No Next 16 a ordem é redirects → proxy → rewrites `beforeFiles` → arquivos: a config resolve sem código em runtime, é testável como dado e o proxy fica trivial                                  | 30/09 |
| D24 | E2E                     | **Playwright contra `next start`**, desktop + mobile, `reducedMotion: "reduce"` por padrão; antecipado para a v0.3.0                     | Proxy, rewrites e redirects só se comportam como em produção no build; movimento reduzido deixa o teste determinístico (um spec cobre os dois modos)                                             | 30/09 |
| D25 | Ordem das fases         | **Registro de rotas e slugs em inglês (Fase 8) adiantados para a v0.3.0**                                                                | As páginas de serviço precisavam de links; escrever URLs à mão para migrar depois custaria mais                                                                                                  | 30/09 |

---

## 2. Escopo

### 2.1 Páginas da v1.0

| Rota pt                         | Rota en                   | Conteúdo                                          | Fase |
| ------------------------------- | ------------------------- | ------------------------------------------------- | ---- |
| `/pt`                           | `/en`                     | Home: hero 3D em 4 etapas + seções de prova + CTA | 1, 4 |
| `/pt/servicos`                  | `/en/services`            | Hub curto com as 4 linhas                         | 5    |
| `/pt/servicos/ti-gerenciada`    | `/en/services/managed-it` | Linha de serviço                                  | 5    |
| `/pt/servicos/automacao`        | `/en/services/automation` | Linha de serviço                                  | 5    |
| `/pt/servicos/squad`            | `/en/services/squad`      | Linha de serviço                                  | 5    |
| `/pt/servicos/presenca-digital` | —                         | Linha local, sem versão em inglês                 | 5    |
| `/pt/time`                      | `/en/team`                | Especialidades, forma de trabalho                 | 5    |
| `/pt/cases`                     | —                         | Cases (anonimizados até haver autorização)        | 5    |
| `/pt/blog`, `/pt/blog/[slug]`   | —                         | Artigos técnicos, só em português na v1           | 7    |
| `/pt/contato`                   | `/en/contact`             | Formulário qualificador                           | 6    |
| `/pt/privacidade`               | `/en/privacy`             | Política de privacidade (LGPD)                    | 6    |

T.I. gerenciada tem versão em inglês por ser o serviço prioritário, mas o CTA em inglês deixa claro que o atendimento presencial é local. Presença digital e cases ficam só em português na v1.

### 2.2 Fora do escopo da v1.0

Área de cliente, abertura de chamado, calculadora de economia, página de carreiras, CMS, blog em inglês. Todos listados em "Pós-lançamento" na seção 5.

---

## 3. Arquitetura

### 3.1 Stack e versões

Versões instaladas e verificadas em 30/09/2026 (build, lint, typecheck e testes limpos).

| Pacote                      | Versão        | Papel                                               |
| --------------------------- | ------------- | --------------------------------------------------- |
| next                        | 16.3.7        | Framework, App Router, Turbopack padrão             |
| react / react-dom           | 19.2.8        | —                                                   |
| typescript                  | 5.9           | `strict: true`                                      |
| tailwindcss                 | 4.3           | Estilo, tokens via `@theme`                         |
| motion                      | 13.4.6        | Animações de DOM e leitura do scroll                |
| three                       | 0.186.1       | Render 3D                                           |
| @react-three/fiber          | 9.8.1         | Ponte React ↔ three (a linha 9 pareia com React 19) |
| vitest                      | 5.0.2         | Testes de unidade                                   |
| eslint / eslint-config-next | 9.39 / 16.3.7 | Lint (flat config; `next lint` foi removido no 16)  |
| prettier + plugin tailwind  | 3.9 / 0.8     | Formatação e ordem de classes                       |

Node ≥ 22.12 (`.nvmrc` = 22). Sem `@react-three/drei` por enquanto: nada do que usamos precisa dele. Entra só se a Fase 4 usar `<Html>` ou helpers que custem menos que reimplementar.

**Mudanças do Next 16 que afetam este projeto** (fonte: guia de upgrade do 16 e docs em `node_modules/next/dist/docs/`):

- `middleware.ts` virou **`proxy.ts`**, função `proxy`, runtime sempre nodejs.
- `params` e `searchParams` são **sempre assíncronos**. Tipos globais `PageProps<'/rota'>` e `LayoutProps<'/rota'>` gerados por `next typegen` (por isso o `typecheck` roda `next typegen` antes do `tsc`).
- `next lint` não existe mais: `npm run lint` chama o ESLint direto. `next build` não roda lint.
- `next build` **não mostra mais** o tamanho de JS por rota. Medição com `npm run analyze` (`next experimental-analyze`) ou Lighthouse.
- `next/dynamic` com `ssr: false` só funciona dentro de Client Component.
- `revalidateTag` exige segundo argumento (perfil de `cacheLife`). Não usado ainda.

### 3.2 Estrutura de pastas

Estado atual (✅) e o que entra em cada fase (🔜 Fn).

```
.
├── AGENTS.md / CLAUDE.md          ✅ regras do projeto para pessoas e agentes
├── THIRD_PARTY_NOTICES.md         ✅ código de terceiros (React Bits) e licenças
├── CHANGELOG.md                   ✅ histórico por versão
├── PLANO_DE_IMPLEMENTACAO.md      ✅ este arquivo
├── .github/workflows/ci.yml       ✅ lint, typecheck, testes, formatação, build
├── content/                       🔜 F5/F7
│   ├── services/*.ts              🔜 F5 dados tipados das 4 linhas (pt + en no mesmo arquivo)
│   └── blog/*.mdx                 🔜 F7
├── scripts/
│   └── posters.mjs                🔜 F4 converte PNGs da cena em AVIF (sharp)
├── e2e/ + playwright.config.ts   ✅ Playwright: roteamento, SEO, navegação, a11y (axe), revelação
└── src/
    ├── proxy.ts                   ✅ negocia o idioma de URLs sem prefixo (slugs traduzidos: next.config, D23)
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx         ✅ html lang, fontes, header, footer, generateStaticParams
    │   │   ├── page.tsx           ✅ home
    │   │   ├── servicos/          ✅ page.tsx (hub) + [slug]/page.tsx
    │   │   ├── time/              ✅ (cases/ 🔜 F5)
    │   │   ├── contato/           🔜 F6 page.tsx + actions.ts (Server Action)
    │   │   ├── privacidade/       🔜 F6
    │   │   ├── blog/              🔜 F7
    │   │   ├── opengraph-image.tsx 🔜 F9
    │   │   └── dev/posters/       🔜 F4 rota só de desenvolvimento para exportar pôsteres
    │   ├── fonts/ + fonts.ts      ✅ woff2 + licenças OFL
    │   ├── globals.css            ✅ tokens
    │   ├── global-not-found.tsx   ✅
    │   └── robots.ts sitemap.ts icon.svg ✅
    ├── components/
    │   ├── layout/                ✅ SiteHeader, SiteFooter
    │   ├── motion/                ✅ MotionProvider (LazyMotion estrito), Reveal
    │   ├── effects/               ✅ BlurReveal, Scramble, SpotlightCard, Magnet, GridBackdrop, ScrollLine, SupplierDiagram (client)
    │   ├── interactive/           ✅ MobileMenu, LanguageLink (client)
    │   ├── scene/                 ✅ cubeState, progress, Cube, SceneCanvas, StoryScene, CubePoster, color, capabilities, types
    │   ├── sections/              ✅ HeroStory, HomeSections, Blocks, ServicePages, TeamPage
    │   └── ui/                    ✅ Button, Section/Container, Eyebrow, StarBorder, Ticker (server)
    ├── i18n/                      ✅ config, negotiate, dictionaries, routes (registro de URLs), navigation
    ├── lib/                       ✅ site, motion, seo; 🔜 F6 lead/
    └── content/services/*.ts      ✅ dados tipados das 4 linhas (pt + en no mesmo arquivo)
```

### 3.3 Renderização e fronteiras cliente/servidor

- **Tudo é Server Component por padrão.** Páginas, seções, header e footer renderizam no servidor e são pré-renderizadas estaticamente (`generateStaticParams` em `[locale]/layout.tsx`, `dynamicParams = false`).
- **`"use client"` só em quatro pastas:** `components/motion/`, `effects/`, `interactive/` e `scene/`. Uma seção que precisa de animação importa um componente de lá e continua sendo servidor. `ui/` é servidor.
- **O que dá para fazer em CSS fica em CSS:** entrada do `<h1>` (não espera hidratação, é o LCP), borda com brilho, faixa em loop, acordeão do FAQ (`<details>` + `::details-content`).
- **`LazyMotion` estrito:** as features de animação do Motion chegam num chunk à parte (~11 KB) depois do primeiro paint. `motion.*` lança erro; use `m.*` de `motion/react-m`.
- **three.js nunca entra no JS inicial.** `StoryScene` importa `SceneCanvas` com `next/dynamic({ ssr: false })`. O HTML do servidor sai com o pôster; o canvas monta depois e faz crossfade quando o primeiro frame está desenhado.
- **Detecção de capacidade sem mismatch de hidratação:** `useSyncExternalStore` com snapshot de servidor `false` (`capabilities.ts`). O servidor sempre renderiza o pôster; o cliente decide depois.

### 3.4 Internacionalização

**Como funciona hoje (✅):**

1. `proxy.ts` intercepta qualquer rota de página sem prefixo, escolhe o idioma por `Accept-Language` (`negotiate.ts`, casamento pela tag primária com peso `q`) e redireciona com **307** (a escolha depende do visitante; não é permanente).
2. `app/[locale]/layout.tsx` valida o idioma, define `<html lang="pt-BR|en">` e é o layout raiz.
3. Dicionários em `src/i18n/dictionaries/{pt,en}.json`. O tipo `Dictionary` é inferido do português; o teste `dictionaries.test.ts` falha se o inglês tiver chave ou tamanho de lista diferente, ou texto vazio.
4. Metadados: `canonical` por idioma, `alternates.languages` com `pt-BR`, `en` e `x-default` → `/pt`. O `sitemap.xml` repete o hreflang.

**Slugs traduzidos (✅ v0.3.0, adiantado da Fase 8 — D25):**

- `src/i18n/routes.ts` é o **registro de rotas**: segmentos por idioma, slugs por linha e em quais idiomas cada página existe. `href(locale, route, hash?)` gera **todo link interno** e lança erro no build se a página não existe no idioma.
- `next.config.ts` gera `rewrites.beforeFiles` (pública → pasta interna) e `redirects` 308 (interna → pública) a partir do registro (D23).
- `proxy.ts` só negocia o idioma de URLs sem prefixo (307).
- Troca de idioma: `LanguageLink` usa `equivalentHref(usePathname(), alvo)` — mesma página no outro idioma ou o pai mais próximo (serviço → hub → home). `matchPath` aceita forma pública e interna (na pré-renderização o `usePathname()` devolve a interna).
- `hreflang` e `sitemap.xml` só entre idiomas em que a página existe.

### 3.5 Hero 3D

#### Como funciona (✅ v0.1.0)

```
scroll da região (400svh)
   │  useScroll({ target, offset: ["start start", "end end"] })     ← Motion
   ▼
progresso 0..1 ──► useSpring(SCROLL_SPRING) ──► progresso suavizado
   │                                               │
   │                                               ├─► useTransform ──► cor de fundo do palco (DOM)
   │                                               │
   │                                               └─► useFrame ──► cubeStateAt(p) ──► 27 peças (three.js)
   ▼
?freeze=1 pula a mola e o balanço ocioso (render determinístico)
```

- **`cubeStateAt(p, out?)`** (`scene/cubeState.ts`) é **pura**: sem three, sem React. Oito parâmetros descrevem o cubo inteiro (`x`, `y`, `scale`, `rotX`, `rotY`, `gap`, `explode`, `edges`). Interpolação `smoothstep` entre keyframes, então cada etapa "assenta". Reaproveita o objeto de saída: zero alocação por frame.
- **Espalhamento das peças** sai de `spreadOf(state)` = `1 + gap + explode × 1.6`, aplicado à posição montada de cada peça. Nenhum keyframe por peça.
- **Sólido → planta técnica:** `solidOpacityOf(edges)` apaga o sólido na primeira metade da transição; as arestas escurecem e ficam opacas. `backgroundLightnessOf(edges)` clareia o fundo no miolo da transição. As duas curvas derivam do mesmo `edges`, então fundo e cubo **não conseguem** dessincronizar.
- **Render sob demanda:** `frameloop="demand"`. `InvalidateOn` pede um frame quando o progresso muda; o balanço ocioso do topo pede frames só enquanto seu peso é > 0. Página parada = GPU parada.
- **Recursos compartilhados:** 1 geometria arredondada + 1 de arestas para as 27 peças. Materiais declarados em JSX e atualizados por ref em `useFrame` (a regra `react-hooks/immutability` do React Compiler proíbe mutar valor retornado de hook — por isso não há `useMemo` de material).
- **Layout estreito (< 768px de canvas):** cubo centralizado, subido e em 60% da escala; o texto das etapas ganha painel com fundo translúcido.

#### Storyboard

A região tem 4 etapas de 100svh. Com o offset usado, o texto da etapa _i_ fica centralizado em `p = i/3`; cada estado é segurado em volta desse ponto para o texto ser lido com o cubo parado.

| Etapa              | Segura em `p` | Cubo                                                   | Texto    | Fundo  |
| ------------------ | ------------- | ------------------------------------------------------ | -------- | ------ |
| 1 · Hero           | 0.00–0.06     | Montado à direita, balanço ocioso                      | Esquerda | Escuro |
| 2 · Quatro frentes | 0.27–0.40     | À esquerda, maior, peças afastadas (grade 3×3 visível) | Direita  | Escuro |
| 3 · Especialidades | 0.60–0.73     | Explodido nas 27 peças, à direita, só arestas          | Esquerda | Claro  |
| 4 · CTA            | 0.94–1.00     | Remontado à direita, sólido, meia volta a mais         | Esquerda | Escuro |

#### Entregue na v0.2.0

- **Progresso a partir das posições reais das etapas** (`progress.ts`): mede onde cada etapa centraliza (`ResizeObserver`) e remapeia para os pontos canônicos. Etapa mais alta que a tela não desalinha mais o cubo do texto.
- **Rótulos de vista explodida na etapa 3** (técnica da seção "toolbox" do animejs.com): as 6 especialidades presas aos 6 cantos da silhueta do cubo, com linha até a peça. Projeção 3D → tela no `useFrame`, escrita direto no DOM por ref; o texto continua HTML. Perto da borda, o rótulo encosta em vez de cortar. Só no desktop; no mobile a lista aparece no texto.
- **Inclinação pelo ponteiro:** ±5°, amortecida, só com ponteiro fino e fora do `?freeze=1`. Pede frames só enquanto converge.
- **Título do hero entrando palavra por palavra em CSS**, rótulo decifrando (`Scramble`), cartões com luz no hover e borda com brilho na frente prioritária, CTA magnético.

#### O que falta para produção (Fase 4)

Pôsteres AVIF exportados da cena, curvas de transição (fundo cinza no meio do caminho), material toon vs standard, cores do cubo (P2), testes visuais no CI. Detalhe na seção 5.

### 3.6 Sistema de design

**Tokens semânticos** (`globals.css`). Os componentes só usam estes nomes; o tema da seção troca os valores.

| Token          | Claro (`:root`, `.theme-light`) | Escuro (`.theme-dark`) | Utilitário                 |
| -------------- | ------------------------------- | ---------------------- | -------------------------- |
| `--bg`         | #ffffff                         | #0b0f14                | `bg-bg`                    |
| `--surface`    | #f6f7f9                         | #131a22                | `bg-surface`               |
| `--border`     | #e3e7ec                         | #1f2a35                | `border-border`            |
| `--ink`        | #0f1419                         | #e6edf3                | `text-ink`                 |
| `--ink-quiet`  | #5a6672                         | #9aa7b4                | `text-ink-quiet`           |
| `--accent`     | #0f5c4a                         | #5b9cff                | `bg-accent`, `text-accent` |
| `--accent-ink` | #ffffff                         | #0b0f14                | `text-accent-ink`          |

**Contraste verificado (WCAG 2.2):** todos os pares de texto passam AA; a maioria passa AAA.

| Par                     | Claro  | Escuro |
| ----------------------- | ------ | ------ |
| ink sobre bg            | 18,5:1 | 16,3:1 |
| ink-quiet sobre bg      | 5,9:1  | 7,8:1  |
| ink-quiet sobre surface | 5,5:1  | 7,1:1  |
| accent sobre bg         | 7,9:1  | 7,0:1  |
| accent-ink sobre accent | 7,9:1  | 7,0:1  |

**Tipografia:** `font-display` (Source Serif 4) só em `text-hero` (clamp 2.5–4.25rem) e `text-h2` (clamp 1.75–2.5rem). Corpo em Inter 16px. `font-mono` (JetBrains Mono) em rótulos, eyebrows e números.

**Layout:** container `max-w-site` (1200px), texto `max-w-measure` (68ch), gutter `px-4` no mobile e `px-8` no desktop, espaço vertical entre seções de 128px no desktop e 80px no mobile, raios `rounded-sm` (6px) e `rounded-lg` (14px).

**Onde vai cada tema na home:** hero (etapas 1, 2 e 4) escuro; etapa 3 clara; "como trabalhamos" e prova técnica escuras; FAQ, contato e rodapé de conteúdo claros; footer escuro.

### 3.7 Sistema de movimento

- **Constantes únicas** em `lib/motion.ts`: `DUR.micro` 0.12s, `DUR.fast` 0.2s, `DUR.base` 0.35s, `DUR.slow` 0.6s; `EASE` = cubic-bezier(0.22, 1, 0.36, 1); `STAGGER` 60ms (máx. 6 itens); `REVEAL_OFFSET` 16px.
- **Regras:** só `opacity`, `transform` e `filter` animam; todo reveal com `once: true`; deslocamento de entrada ≤ 24px; nada acima da dobra depende de JS para aparecer (o `<h1>` do hero é HTML estático).
- **Reduced motion:** `Reveal` mantém o fade e remove o deslocamento; o hero não carrega o canvas e mostra o pôster.
- **Inventário por seção:**

| Seção                    | Animação                                                    | API                                           | Fase          |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------------- | ------------- |
| Hero (4 etapas)          | Cubo 3D + fundo guiado pelo scroll                          | `useScroll`, `useSpring`, `useTransform`, R3F | ✅ spike / F4 |
| Títulos de seção         | Entram palavra por palavra saindo do desfoque               | `BlurReveal` (React Bits BlurText)            | ✅            |
| Rótulos acima de títulos | Texto decifrando ao entrar na tela                          | `Scramble` (React Bits DecryptedText)         | ✅            |
| Cartões das frentes      | Luz que segue o ponteiro; borda com brilho na prioritária   | `SpotlightCard`, `StarBorder`                 | ✅            |
| CTAs principais          | Puxão magnético com mola                                    | `Magnet`                                      | ✅            |
| Três fornecedores vs um  | Traços de SVG que se desenham ao entrar                     | `SupplierDiagram` (`pathLength`)              | ✅            |
| Como trabalhamos         | Linha que se preenche com o scroll + grade técnica de fundo | `ScrollLine`, `GridBackdrop`                  | ✅            |
| Tecnologias              | Faixa em loop, pausa no hover                               | `Ticker` (CSS)                                | ✅            |
| FAQ                      | Altura animada nativa                                       | `<details>` + CSS                             | ✅            |
| Menu mobile              | Painel com stagger dos links                                | `AnimatePresence`                             | ✅            |
| Barra de progresso       | `scaleX` pelo scroll da página                              | `useScroll`                                   | F3            |
| Números                  | Contagem ao entrar em view, uma vez                         | `animate` + `useInView`                       | F5            |
| Troca de página          | Fade de 180ms (avaliar View Transitions do React 19.2)      | —                                             | F9            |

### 3.8 Modelo de conteúdo

**Linhas de serviço** (`content/services/<id>.ts`, Fase 5). Dados tipados em TypeScript — não JSON — para o compilador garantir que pt e en têm os mesmos campos.

```ts
export type ServiceLine = {
  id: "ti-gerenciada" | "automacao" | "squad" | "presenca-digital";
  slug: { pt: string; en?: string }; // sem `en` = página só em português
  order: number; // ordem de destaque na home
  content: Partial<
    Record<
      Locale,
      {
        title: string;
        pain: string; // dor em uma frase (cartão da home)
        included: string[]; // o que está incluso, itens concretos
        excluded: string[]; // o que NÃO está incluso
        steps: { name: string; duration: string }[];
        pricing: string; // faixa ou modelo de cobrança
        faq: { q: string; a: string }[];
        seo: { title: string; description: string };
      }
    >
  >;
};
```

Uma única página `servicos/[slug]/page.tsx` renderiza as quatro. Uma quinta linha = um arquivo novo.

**Artigos** (`content/blog/*.mdx`, Fase 7). Metadados exportados pelo próprio MDX (padrão do `@next/mdx`), validados por um tipo:

```ts
export const metadata = {
  title: "…", // ≤ 60 caracteres
  description: "…", // 150–160 caracteres
  publishedAt: "2026-11-03",
  updatedAt: "2026-11-03",
  author: "…", // pessoa real, com entrada em /time
  format: "caso", // caso | decisao | guia | bastidor
  relatedService: "automacao",
} satisfies ArticleMeta;
```

Todo artigo termina com um bloco que aponta para `relatedService`.

### 3.9 Captação de leads (Fase 6)

- **Formulário** com 6 campos: nome, e-mail, empresa, porte (1–10, 11–50, 51–200, 200+), linha de interesse (4 linhas + "não sei ainda"), descrição em até 300 caracteres. Sem telefone. WhatsApp como alternativa ao lado, não como campo.
- **Envio por Server Action** (`contato/actions.ts`) com `useActionState`: funciona sem JS (progressive enhancement), erros por campo vindos do servidor.
- **Validação com Zod no servidor** (o cliente só espelha para UX). Mensagens de erro nos dicionários.
- **Anti-spam em camadas:** honeypot → limite por IP (3/hora, com o IP guardado só como hash) → Cloudflare Turnstile invisível **apenas se** o spam passar das duas primeiras.
- **Destino:** e-mail formatado (Resend ou Brevo) + linha no Postgres (Neon ou Supabase, plano gratuito) com idioma, página de origem e linha de interesse. CRM só acima de ~15 leads/mês.
- **LGPD:** aviso em uma frase abaixo do botão com link para `/privacidade`; base legal declarada na política; retenção definida (proposta: 12 meses); encarregado com e-mail no rodapé; checkbox de marketing separado e desmarcado, só se houver uso para marketing. Revisar o texto com quem cuida do jurídico — este plano não substitui orientação legal.

### 3.10 SEO técnico (Fase 9)

- `<h1>` único por página, nunca dentro de componente que começa invisível.
- JSON-LD: `Organization` + `LocalBusiness` no layout, `Service` em cada linha, `Article` no blog, `BreadcrumbList` nas páginas internas (`lib/seo.ts`).
- `opengraph-image.tsx` por rota (no Next 16 recebe `params` como Promise).
- `sitemap.ts` gerado a partir do mapa de rotas e do conteúdo, com hreflang.
- Página de serviço com ≥ 600 palavras de conteúdo real.
- Google Business Profile e Search Console configurados no lançamento.

### 3.11 Analytics e privacidade

Analytics sem cookie (Plausible, Umami ou Vercel Analytics) + Vercel Speed Insights para Core Web Vitals reais. Quatro números revisados por mês: leads por linha, taxa de envio do formulário, páginas com tráfego de busca e termos, leads que viraram reunião.

### 3.12 Trocar o nome provisório

Quando o naming for decidido, os pontos de troca são:

- `src/lib/site.ts` (`site.name`) — usado no header, footer, título padrão.
- `src/i18n/dictionaries/{pt,en}.json` (`meta.title`, `nav.home`).
- `src/app/global-not-found.tsx` (título).
- `src/app/icon.svg`.
- `README.md`, `AGENTS.md`, este arquivo, `package.json` (`name`, `description`).

`git grep -n -i lumni` lista tudo o que sobrar.

---

## 4. Qualidade

### 4.1 Orçamento de desempenho

Medido na v0.1.0 com `gzip -9` sobre os arquivos do build (a Vercel serve Brotli, ~15% menor). Metas valem para a home em produção.

| Métrica                   | Meta                                   | v0.1.0                                                                 | Como medir                                  |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| JS inicial (antes do 3D)  | ≤ 220 KB gzip (D21)                    | v0.1.0: 224 · v0.2.0: 213 · **v0.3.0: 208 KB** (demais páginas 204) ✅ | scripts do HTML de `/pt`; `npm run analyze` |
| Chunk da cena 3D          | ≤ 250 KB gzip                          | **242 KB** ✅                                                          | idem                                        |
| Fontes                    | ≤ 150 KB, 2 com preload                | 139 KB, 2 com preload ✅                                               | `.next/static/media`                        |
| LCP (4G simulado, mobile) | ≤ 2,0 s                                | a medir                                                                | Lighthouse CI (F10)                         |
| CLS                       | ≤ 0,02                                 | a medir                                                                | Lighthouse CI                               |
| INP                       | ≤ 200 ms                               | a medir                                                                | Speed Insights                              |
| FPS do hero               | 60 desktop; ≥ 45 Android intermediário | a medir                                                                | roteiro 4.2                                 |
| GPU com página parada     | 0 frames                               | ✅ por construção (`frameloop="demand"`)                               | Performance panel                           |

**Composição do JS inicial (v0.2.0):** framework Next/React ~177 KB (fixo) + código do site ~36 KB, Motion incluído. Com o `LazyMotion`, a v0.2.0 ficou **11 KB menor que a v0.1.0 mesmo com 9 componentes de efeito novos**; as features de animação (~11 KB) chegam depois do primeiro paint. Regra: o código do site (tudo além do framework) não passa de 45 KB gzip.

### 4.2 Estratégia de testes

| Camada         | Ferramenta               | O que cobre                                                                                                                                           | Quando                                |
| -------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Unidade        | Vitest                   | Funções puras: `cubeStateAt` e curvas, `negotiateLocale`, paridade dos dicionários, `mixHex`; depois `href`/rotas, schema do lead, schema de artigo   | ✅ desde a v0.1.0; cresce a cada fase |
| Visual         | Playwright + `?freeze=1` | Screenshot da home em 7 pontos do scroll (0, 17, 33, 50, 67, 83, 100%), desktop 1440×900 e mobile 390×844; diff contra a base                         | F4                                    |
| E2E            | Playwright               | Idioma, 307/308/404, canonical/hreflang, troca de idioma, navegação, menu mobile, 404, revelações visíveis com e sem reduced motion; formulário na F6 | ✅ v0.3.0 (D24)                       |
| Acessibilidade | @axe-core/playwright     | Zero violação séria/crítica em 9 rotas; contraste das etapas do hero medido com a cor real do palco                                                   | ✅ v0.3.0, bloqueia a CI              |
| Desempenho     | Lighthouse CI            | Metas da tabela 4.1; falha o pipeline                                                                                                                 | F10                                   |

**Roteiro de medição do spike em aparelho real (critério de saída da Fase 1):**

1. `npm run build && npm start` na máquina; acessar pelo IP da rede local num Android intermediário (Chrome).
2. `chrome://inspect` no desktop → inspecionar o aparelho → Performance → gravar 10 s rolando a home do topo ao fim, duas vezes.
3. Registrar: FPS médio, pior frame (ms), e se houve frame acima de 50 ms. Repetir num notebook sem GPU dedicada.
4. Passou (≥ 45 fps no Android, sem frame > 50 ms recorrente)? Fase 1 fechada. Não passou? Primeira tentativa: `InstancedMesh` (54 → 2 draw calls) e `dpr` máximo 1.25. Segunda: plano B (sequência de imagens).
5. Anotar o resultado no `CHANGELOG.md`.

### 4.3 Acessibilidade

- Canvas e pôster `aria-hidden`: são decorativos; todo conteúdo está no DOM.
- Link "pular para o conteúdo" no header (✅).
- Foco visível com `--accent` (✅); nenhum `outline: none` sem substituto.
- `prefers-reduced-motion` respeitado no hero e nos reveals (✅).
- Contraste AA em todos os pares (✅, seção 3.6). Texto nunca sobre o cubo em movimento no desktop (layout em metades).
- Formulário: `label` visível por campo, erro associado por `aria-describedby`, foco no primeiro erro.

### 4.4 CI/CD e ambientes

- **CI** (`.github/workflows/ci.yml`, ✅): push para `main` e PR — `npm ci`, lint, typecheck, testes, formatação, build e E2E (Playwright + axe) contra o build. Node pela `.nvmrc`.
- **Vercel** (F10, pode ser antes): preview por PR, produção em `main`. Variável `NEXT_PUBLIC_SITE_URL` por ambiente.
- **Proteção de `main`:** merge só com CI verde e revisão.
- **Lighthouse CI e testes Playwright** entram no mesmo workflow quando existirem (F4/F10).

### 4.5 Convenções

- Commits em Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Uma branch por tarefa (`feat/hero-posters`), PR pequeno, descrição com o "porquê".
- **Definição de pronto:** `npm run check` e `npm run build` verdes, critério de aceite da tarefa cumprido, `CHANGELOG.md` atualizado em `[Não lançado]`.
- Versão menor sobe a cada entrega que muda o que o visitante vê (o `CHANGELOG.md` diz o que entrou em cada uma); a 1.0.0 é o lançamento.

---

## 5. Roadmap por fase

Legenda: ✅ feito · 🟡 em andamento · ⬜ não iniciado. Estimativas em horas de trabalho focado.

| Fase                                   | Versão        | Status | Esforço                         |
| -------------------------------------- | ------------- | ------ | ------------------------------- |
| 0 · Fundação                           | 0.1.0         | ✅     | 12 h                            |
| 1 · Spike do hero 3D                   | 0.1.0         | 🟡     | 16 h (10 feitas)                |
| 2 · Conteúdo e copy                    | —             | 🟡     | 30 h (copy provisória na 0.2.0) |
| 3 · Design system e componentes        | 0.2.0         | 🟡     | 45 h (~35 feitas)               |
| 4 · Hero 3D de produção                | 0.2.0 → 0.3.0 | 🟡     | 60 h (~20 feitas)               |
| 5 · Páginas de serviço, time e cases   | 0.2.0 → 0.4.0 | 🟡     | 45 h (~30 feitas)               |
| 6 · Contato, leads e LGPD              | 0.6.0         | ⬜     | 30 h                            |
| 7 · Blog                               | 0.7.0         | ⬜     | 20 h                            |
| 8 · Inglês completo e slugs traduzidos | 0.3.0 → 0.8.0 | 🟡     | 20 h (~10 feitas, D25)          |
| 9 · SEO técnico, OG e analytics        | 0.9.0         | ⬜     | 20 h                            |
| 10 · Endurecimento e lançamento        | 1.0.0         | ⬜     | 30 h                            |

---

### Fase 0 · Fundação ✅ (v0.1.0)

- [x] Next 16 + TS estrito + Tailwind 4 a partir do `create-next-app` oficial
- [x] Tokens da direção híbrida, temas por seção, escala tipográfica
- [x] Fontes auto-hospedadas com licença
- [x] i18n pt/en com `proxy.ts`, `[locale]`, dicionários tipados e testados
- [x] `global-not-found`, `robots`, `sitemap` com hreflang, ícone provisório
- [x] Vitest, ESLint, Prettier, CI, `AGENTS.md`, `README.md`, `CHANGELOG.md`

### Fase 1 · Spike do hero 3D 🟡

**Objetivo:** provar que o cubo por scroll roda bem em aparelho comum antes de investir no resto.

- [x] `cubeStateAt` puro com keyframes das 4 etapas + testes (continuidade, limites, keyframes exatos)
- [x] Cubo de 27 peças com geometria compartilhada; sólido ↔ arestas
- [x] `StoryScene` com palco sticky, canvas lazy, crossfade do pôster, fundo sincronizado
- [x] `frameloop="demand"`, balanço ocioso limitado, `?freeze=1`
- [x] Verificação visual em Chromium headless (desktop e mobile, 7 pontos do scroll)
- [ ] **Medição em Android intermediário e notebook sem GPU dedicada** (roteiro 4.2)
- [ ] Registrar resultado no `CHANGELOG.md` e fechar a fase (v0.1.1)

**Aceite:** ≥ 45 fps no Android, sem frame > 50 ms recorrente; chunk 3D ≤ 250 KB gzip (✅ 242 KB).
**Se reprovar:** `InstancedMesh` + `dpr` 1.25; se ainda reprovar, plano B (sequência de imagens pré-renderizada, D6).

### Fase 2 · Conteúdo e copy ⬜ (v0.2.0)

**Objetivo:** todo texto da v1 escrito antes de desenhar tela. Copy é o caminho crítico do projeto.

- [ ] H1 do hero: 3 versões testadas com 2 pessoas fora de tecnologia ("o que essa empresa faz?")
- [ ] Texto final das 4 etapas do hero (`story.*` nos dicionários) — sem número de pessoas (D3)
- [ ] Conteúdo das 4 linhas no formato do `ServiceLine` (3.8): dor, inclusos, **não inclusos**, etapas com prazo, faixa de preço, FAQ
- [ ] Página de time: especialidades, forma de trabalho, processo em 4 etapas com prazos
- [ ] FAQ da home: 6 objeções (preço, prazo, contrato, quem atende, se der errado, como sair)
- [ ] 3 melhores trabalhos já entregues, cada um com um número (vira seção de prova e primeiros cases)
- [ ] Versão em inglês das páginas do escopo en (adaptação, não tradução literal)
- [ ] Política de privacidade (rascunho para revisão jurídica)

**Aceite:** dicionários pt/en completos para home, passando no teste de paridade; conteúdo das linhas revisado por você.
**Responsável sugerido:** você (voz da empresa) + revisão de alguém do time.

### Fase 3 · Design system e componentes 🟡 (v0.2.0)

**Objetivo:** telas aprovadas e os componentes base que todas as páginas vão usar.

- [ ] Figma: home desktop e mobile, template de página de serviço, contato — sobre os tokens atuais
- [x] `components/ui/`: `Button` (primário, secundário, fantasma; `<a>` ou `next/link`), `Section` + `Container` (tema e espaçamento padrão), `Eyebrow`, `StarBorder`, `Ticker`
- [x] Efeitos do React Bits portados e endurecidos (D16): `BlurReveal`, `Scramble`, `SpotlightCard`, `Magnet`, `GridBackdrop`, `StarBorder`, `Ticker` — atribuição em `THIRD_PARTY_NOTICES.md`
- [x] `HeroStory` refeito com os componentes (sem classes de botão repetidas)
- [x] Header com navegação (âncoras da home até existirem as páginas) e **menu mobile acessível**: foco preso, `Esc` fecha, foco volta, rolagem travada. Em portal: o `backdrop-filter` do header prendia o painel `fixed`
- [ ] Footer completo: links, contato, encarregado LGPD, CNPJ
- [x] **Redução de JS inicial:** `MotionProvider` com `LazyMotion` estrito, features carregadas depois, `m.*` em tudo. 224 → 213 KB
- [ ] Barra de progresso de leitura
- [ ] `Heading` como componente (hoje `font-display text-h2 text-ink` se repete em vários lugares)

**Aceite:** telas aprovadas; nenhuma cor fora dos tokens (`git grep` por `#` e por paleta padrão do Tailwind em `src/components` só retorna a cena 3D e o pôster); JS inicial ≤ 220 KB gzip (✅ 213).
**Responsável sugerido:** designer (Figma) + dev (o que falta).

### Fase 4 · Hero 3D de produção 🟡 (v0.2.0 → v0.3.0)

**Objetivo:** o hero no nível visual do animejs.com, robusto no mobile e com fallback bonito.

- [ ] **Keyframes finais** a partir das telas da Fase 3; teste de continuidade ajustado
- [x] **Progresso a partir das posições reais das etapas:** função pura `remapProgress(p, anchors)` que mapeia as posições medidas no DOM (`offsetTop` de cada etapa, recalculadas em `ResizeObserver`) para os pontos canônicos 0, 1/3, 2/3, 1. Resolve o desalinhamento no mobile quando uma etapa passa de 100svh. Testada.
- [ ] **Curvas de transição:** reduzir o tempo em cinza médio (≈50% e ≈83%); avaliar holds mais longos
- [x] **Rótulos da etapa 3:** as especialidades do dicionário presas a 6 peças. Projeção manual (`Vector3.project(camera)`) aplicada por ref em elementos DOM absolutos — texto continua no DOM, legível e traduzível. Linhas finas do rótulo à peça, como a seção "toolbox" do animejs
- [x] **Inclinação pelo mouse:** ±5°, amortecida, só com `(pointer: fine)`, desligada com reduced motion
- [ ] **Pôsteres AVIF:** rota `app/[locale]/dev/posters` (retorna 404 em produção) renderiza a cena em 0, 1/3, 2/3 e 1 com `preserveDrawingBuffer`; `scripts/posters.mjs` converte para AVIF (sharp) em `public/scene/`. `CubePoster` passa a usar `next/image` com o AVIF da etapa 1; com reduced motion, troca de pôster por etapa com fade
- [ ] **Material:** avaliar `MeshToonMaterial` com rampa de 3 tons (o animejs usa toon) contra o `MeshStandardMaterial` atual; decidir pela leitura no fundo escuro
- [ ] **Cores do cubo:** decisão da pendência P2 (grafite + destaque ou cor por linha na etapa 2)
- [ ] **Layout mobile:** posição/escala finais; texto da etapa 2 compacto para caber em 100svh
- [ ] **Pausa fora da tela:** `IntersectionObserver` na região; fora dela, nenhum `invalidate`
- [ ] **Playwright visual:** 7 pontos × 2 viewports com `?freeze=1`, rodando no CI com SwiftShader
- [ ] Remover o aviso `THREE.Clock` se o R3F publicar correção (acompanhar)

**Aceite:** metas de FPS e LCP da seção 4.1 em aparelho real; pôster e cena idênticos na etapa 1 (sem salto no crossfade); screenshots aprovados como base.
**Responsável sugerido:** você (cena e coreografia).

### Fase 5 · Páginas de serviço, time e cases 🟡 (v0.2.0 → v0.4.0)

- [x] (v0.3.0) `src/content/services/*.ts` com o tipo `ServiceLine`; teste de que toda linha tem `pt` completo e, se tem `slug.en`, tem `en` completo
- [x] (v0.3.0) `servicos/page.tsx` (hub) e `servicos/[slug]/page.tsx` com `generateStaticParams` a partir dos dados
- [x] (v0.3.0, falta a "prova" — P8/P13) Estrutura da página de serviço: dor → inclusos → como funciona (etapas com prazo) → não incluso → investimento → prova → FAQ → CTA
- [x] (v0.3.0) Toda página de serviço linka `/time`; todo cartão da home linka sua linha
- [x] Seções da home abaixo do hero: "três fornecedores vs um" (diagrama que se desenha), como trabalhamos (linha que preenche no scroll), faixa de tecnologias, FAQ, chamada de contato
- [ ] Seção de números (só com números reais — P8) e de prova técnica/cases
- [x] (v0.3.0) `/time` · [ ] `/cases` (anonimizados até autorização)

**Aceite:** 4 páginas de serviço geradas estaticamente, ≥ 600 palavras cada; navegação interna completa; checagem de links quebrados no CI. _Hoje: ~400 palavras por página (P13); links verificados por E2E._

### Fase 6 · Contato, leads e LGPD ⬜ (v0.6.0)

- [ ] `contato/page.tsx` + `actions.ts` (Server Action, `useActionState`, funciona sem JS)
- [ ] `lib/lead/schema.ts` (Zod) compartilhado entre servidor e cliente; testes do schema
- [ ] Honeypot + limite por IP (hash) + registro no Postgres
- [ ] E-mail via Resend/Brevo; variáveis em `.env.example`
- [ ] `privacidade/page.tsx` com o texto revisado; aviso sob o botão
- [ ] Formulário também inline no fim da home
- [ ] E2E: envio feliz, erros de validação, honeypot bloqueia

**Aceite:** lead chega por e-mail e no banco em < 10 s; nenhum dado pessoal em log; página de privacidade publicada.

### Fase 7 · Blog ⬜ (v0.7.0)

- [ ] `@next/mdx` configurado; `content/blog/*.mdx` com `metadata` tipada (3.8)
- [ ] Listagem, página de artigo, bloco "serviço relacionado", tempo de leitura
- [ ] Estilo de prosa com os tokens (sem `@tailwindcss/typography` genérico sem customização)
- [ ] Dois artigos publicados no lançamento

### Fase 8 · Inglês completo e slugs traduzidos ⬜ (v0.8.0)

- [x] (v0.3.0) `i18n/routes.ts` com mapa de segmentos e `href()`; todo link do site migrado para `href()`
- [x] (v0.3.0) Rewrite `en → rota interna` e redirect 308 da forma não canônica no `proxy.ts`
- [x] (v0.3.0) Seletor de idioma leva para a página equivalente (não para a home) quando ela existe
- [x] (v0.3.0) Testes de ida e volta das rotas; hreflang só entre páginas equivalentes

### Fase 9 · SEO técnico, OG e analytics ⬜ (v0.9.0)

- [ ] `lib/seo.ts`: JSON-LD `Organization`, `LocalBusiness`, `Service`, `Article`, `BreadcrumbList`
- [ ] `opengraph-image.tsx` por rota com a marca
- [ ] Sitemap a partir das rotas e do conteúdo
- [ ] Analytics sem cookie + Speed Insights
- [ ] Transição de página (fade curto ou View Transitions)

### Fase 10 · Endurecimento e lançamento ⬜ (v1.0.0)

- [ ] Lighthouse CI com as metas da 4.1 falhando o pipeline
- [ ] axe sem violações sérias/críticas em todas as rotas
- [ ] Cabeçalhos de segurança: CSP, HSTS, `Referrer-Policy`, `Permissions-Policy` (em `next.config.ts` → `headers()`)
- [ ] Teste em Safari iOS, Chrome Android, Firefox, Edge
- [ ] Domínio definitivo, DNS, redirecionamentos, `NEXT_PUBLIC_SITE_URL` de produção
- [ ] Search Console, Google Business Profile, sitemap enviado
- [ ] Revisão final de copy nos dois idiomas

**Aceite de lançamento:** todas as metas da 4.1 verdes em produção, formulário testado ponta a ponta, política de privacidade publicada.

### Pós-lançamento (v1.1+)

Cases nomeados conforme autorização · página de carreiras · calculadora de economia de automação · blog em inglês · CMS (gatilho: alguém sem git precisa publicar) · área de cliente para chamados (transforma T.I. gerenciada em produto).

---

## 6. Cronograma e esforço

Total estimado da v1.0: **~330 horas**. Três trilhas em paralelo depois da Fase 2 reduzem o calendário:

| Semana | Trilha A — você                     | Trilha B — dev                   | Trilha C — design/conteúdo   |
| ------ | ----------------------------------- | -------------------------------- | ---------------------------- |
| 1      | F1 medição e fechamento             | —                                | F2 copy do hero e das linhas |
| 2–3    | F4 início (remap, curvas, pôsteres) | F3 componentes `ui/`, LazyMotion | F2 conteúdo + F3 Figma       |
| 4–5    | F4 rótulos, material, mobile        | F5 páginas de serviço            | F3 revisão de telas          |
| 6–7    | F4 testes visuais + F6 leads        | F5 time, cases, seções da home   | F2 inglês, privacidade       |
| 8      | F8 slugs traduzidos                 | F7 blog                          | Artigos 1 e 2                |
| 9      | F9 SEO e OG                         | F6 E2E                           | Revisão de copy              |
| 10–11  | F10 endurecimento                   | F10 testes cross-browser         | —                            |
| 12     | Lançamento                          |                                  |                              |

**Caminho que protege o prazo:** se a Fase 4 atrasar, publicar a v1.0 com o pôster estático no hero (a arquitetura já troca pôster por canvas sem mudar mais nada) e entregar o 3D vivo numa v1.1.

---

## 7. Riscos

| Risco                                     | Sinal                                              | Mitigação                                                                            |
| ----------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Copy trava o projeto                      | H1 ainda "em discussão" no fim da semana 1         | Escrever 3 versões ruins na primeira sessão e escolher uma                           |
| Hero consome o orçamento                  | Semana 5 ajustando curva e página de serviço vazia | Limite de 60 h na Fase 4; o que passar vai para v1.1                                 |
| Desempenho no Android                     | Spike abaixo de 45 fps                             | `InstancedMesh`, `dpr` 1.25; plano B da sequência de imagens                         |
| JS inicial acima da meta                  | `analyze` > 220 KB, ou código do site > 45 KB      | LazyMotion ✅; componente novo só com `motion` ou sem lib (D16); medir a cada versão |
| Licença do React Bits                     | Repo público com os componentes portados           | Repo privado (D20); `THIRD_PARTY_NOTICES.md` atualizado a cada componente            |
| Lockfile quebrado pelo Windows            | `npm ci` falha no CI com `@emnapi/*` ausente       | `npm install --package-lock-only` antes de commitar dependência nova (AGENTS.md)     |
| Presença digital atrai só orçamento baixo | Primeiros leads todos de site barato               | Faixa de preço publicada; linha por último na home                                   |
| API experimental (`globalNotFound`) muda  | Aviso no upgrade do Next                           | Fallback: `not-found.tsx` dentro de `[locale]` + redirect no `proxy`                 |
| Dependência do R3F com three novo         | Avisos de depreciação, quebra no upgrade           | Versões fixadas no lockfile; upgrade de three só junto com R3F                       |

---

## 8. Pendências e perguntas abertas

| #   | Pergunta                                                                                                   | Bloqueia    | Padrão se ninguém decidir             |
| --- | ---------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| P1  | No 2º quadro do rascunho, o cubo deve girar uma camada (movimento de cubo mágico) além de mostrar a grade? | Fase 4      | Só a grade, sem giro de camada        |
| P2  | Cor do cubo: grafite com o destaque da marca, ou uma cor por linha de serviço na etapa 2?                  | Fase 4      | Grafite + destaque                    |
| P3  | Etapa 4 (remontar no CTA) fica?                                                                            | Fase 4      | Fica                                  |
| P4  | Provedor de e-mail (Resend ou Brevo) e banco (Neon ou Supabase)                                            | Fase 6      | Resend + Neon                         |
| P5  | WhatsApp como canal alternativo de contato?                                                                | Fase 6      | Sim, link com mensagem pré-preenchida |
| P6  | Ticket mínimo aceito (filtra o formulário e a copy de preço)                                               | Fases 2 e 6 | — precisa de resposta                 |
| P7  | Nome definitivo e domínio                                                                                  | Fase 10     | Lançar como Lumni                     |
| P8  | Quais números reais a empresa pode publicar (anos somados, projetos entregues, SLA)?                       | Fase 5      | Sem seção de números                  |
| P9  | A faixa de tecnologias bate com o que o time realmente usa?                                                | Fase 2      | Lista provisória da v0.2.0            |
| P10 | Prazos do "como trabalhamos" e respostas do FAQ (contrato, SLA, saída) valem como estão?                   | Fase 2      | Texto provisório da v0.2.0            |
| P11 | E-mail ou WhatsApp de contato para a chamada final enquanto o formulário não existe?                       | Fase 6      | Sem botão na chamada final            |
| P12 | Publicar faixa de preço por frente ou só o modelo de cobrança?                                             | Fase 5      | Só o modelo de cobrança               |
| P13 | Inclusos, prazos, exclusões e FAQ de cada frente valem? Há casos reais para a "prova"?                     | Fase 5      | Texto provisório, sem prova           |

---

## 9. Referências

- Guia de upgrade do Next.js 16 — nextjs.org/docs/app/guides/upgrading/version-16
- Docs do Next empacotadas no projeto — `node_modules/next/dist/docs/` (internacionalização, proxy, fontes, `global-not-found`, bundling)
- React Three Fiber, instalação e pareamento de versões — github.com/pmndrs/react-three-fiber (docs/getting-started/installation.mdx)
- Motion para React Three Fiber (página descontinuada) — motion.dev/docs/react-three-fiber
- Motion, animações de scroll — motion.dev/docs/react-scroll-animations
- GSAP, preço e licença — gsap.com/pricing, gsap.com/standard-license
- animejs.com — inspecionado no navegador em 29/09/2026: canvas WebGL2 único, three.js r172, 22 modelos .glb com Draco, anime.js para o scroll
- WCAG 2.2, contraste mínimo (1.4.3)
