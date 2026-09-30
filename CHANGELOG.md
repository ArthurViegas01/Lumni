# Changelog

Todas as mudanças relevantes do site, por versão. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
O mapa de versões até o lançamento (0.1 → 1.0) está em `PLANO_DE_IMPLEMENTACAO.md`, seção 5.

## [Não lançado]

_Nada ainda._

## [0.3.0] - 2026-09-30

Páginas de serviço, hub e time; URLs traduzidas em inglês; testes E2E com Playwright. Adianta a parte de rotas da Fase 8 (necessária para linkar as páginas novas) e cobre boa parte da Fase 5. **A copy das páginas novas é provisória** (Fase 2; pendências P10, P12 e P13).

### Adicionado

- **Registro de rotas** (`src/i18n/routes.ts`, testado): fonte única das URLs públicas por idioma. `href(locale, route, hash?)` gera todo link interno e falha no build se a página não existir no idioma; `equivalentHref` leva para a mesma página no outro idioma (ou para o pai mais próximo que exista lá).
- **URLs em inglês de verdade:** `/en/services/managed-it`, `/en/services/automation`, `/en/services/squad`, `/en/team`. As pastas continuam em português; `next.config.ts` gera `rewrites` (pública → interna) e redirects **308** (interna → pública) a partir do registro, sem conteúdo duplicado (decisão D23).
- **Páginas de serviço** (`/pt/servicos/[slug]`): dor → inclusos → como funciona (etapas com prazo) → o que não está incluso → investimento → FAQ → outras frentes → chamada. Geradas estaticamente a partir de `src/content/services/*.ts` (tipado; teste garante `pt` completo e `en` só onde a rota existe). Presença digital só em português.
- **Hub de serviços** (`/pt/servicos`, `/en/services`) e **página do time** (`/pt/time`, `/en/team`) com as especialidades e a forma de trabalho.
- **Metadados por página** (`src/lib/seo.ts`): `canonical` próprio e `hreflang` apenas entre idiomas em que a página existe (página só em pt não anuncia `en`); `sitemap.xml` gerado do registro de rotas.
- **Troca de idioma para a página equivalente** no header, no menu mobile e no rodapé (antes levava sempre à home).
- **Rodapé completo:** frentes publicadas no idioma, links da empresa, idioma.
- Blocos de página reutilizáveis (`sections/Blocks.tsx`: `PageHero`, `SectionHeading`, `StepsSection`, `FaqList`, `CtaBand`), `ui/Heading` e `ui/HeroTitle`.
- **Testes E2E com Playwright** (`e2e/`, `npm run e2e`) contra o build de produção, em desktop e mobile (decisão D24):
  - roteamento: negociação de idioma, 307/308/404 esperados, arquivos de metadados fora do proxy;
  - SEO: canonical, hreflang recíproco, um `h1` e um `title` por página;
  - navegação: troca de idioma equivalente, hub → serviço, rodapé sem link quebrado, menu mobile por teclado, 404;
  - acessibilidade: axe (WCAG 2.2 A/AA) sem violação séria ou crítica em 9 rotas; contraste das etapas do hero medido com as cores reais do palco animado;
  - regressão de revelação: nenhum texto desfocado ou invisível e nenhum traço de diagrama sem desenhar, com e sem reduced motion;
  - qualquer erro no console (inclusive divergência de hidratação) falha o teste.
- CI roda o E2E depois do build e anexa o relatório quando falha.
- 22 testes de unidade novos (53 no total) e 23 E2E (46 execuções entre desktop e mobile).

### Alterado

- Links do dicionário descrevem o destino (`{ to: "services" }`, `{ to: "home", hash: "faq" }`) em vez da URL; `resolveNavLinks` os converte.
- Cartões da etapa 2 do hero vêm do conteúdo das linhas (fonte única) e linkam cada página de serviço.
- `lastModified` saiu do sitemap: com `new Date()` ele mudava a cada build sem o conteúdo mudar.

### Corrigido

- **Títulos desfocados para sempre com reduced motion** (`BlurReveal`): o HTML do servidor sai com o estado inicial com blur (o servidor não conhece a preferência) e a variante reduzida não desfazia o `filter`. Mesmo problema no `SupplierDiagram`: com reduced motion as linhas do diagrama nunca apareciam (`pathLength` 0). As variantes reduzidas agora cobrem as mesmas propriedades; regra no `AGENTS.md` e teste E2E que falha com o bug (verificado reintroduzindo-o).
- Link de idioma errado no HTML estático das páginas em inglês com URL traduzida: na pré-renderização o `usePathname()` devolve a pasta interna (`/en/servicos/...`), não a URL pública. `matchPath` reconhece as duas formas.

### Medido nesta versão

- JS inicial: home **208 KB gzip**; hub, serviço e time **204 KB** (meta D21: 220 KB).
- Páginas de serviço: ~400 palavras cada (aceite da Fase 5 pede ≥ 600 — depende de conteúdo real, P13).

### Problemas conhecidos

- Copy provisória nas páginas novas: inclusos, prazos, FAQ e modelo de cobrança precisam de validação; não há faixa de preço (P12).
- `/pt/cases` e prova técnica ainda não existem (Fase 5).
- **O repositório no GitHub está público** — a decisão D20 pede privado por causa da licença do React Bits.
- Continua valendo: medição do hero em aparelho real pendente; pôster SVG provisório.

## [0.2.0] - 2026-09-30

Design system, efeitos do React Bits, home completa abaixo do hero e o hero com rótulos de vista explodida. Cobre boa parte das Fases 3, 4 e 5 do plano. **Toda a copy nova é provisória** (Fase 2; pendências P8–P11).

### Adicionado

- **Efeitos portados do React Bits** e endurecidos (decisão D16): `BlurReveal` (BlurText), `Scramble` (DecryptedText), `SpotlightCard`, `Magnet`, `StarBorder`, `GridBackdrop` (ShapeGrid), `Ticker` (LogoLoop). Sem `setState` por movimento de mouse, cores por token, reduced motion, texto acessível. Atribuição e licença em `THIRD_PARTY_NOTICES.md`.
- **Componentes de base** em `ui/`: `Button`, `Section` + `Container`, `Eyebrow`, `StarBorder`, `Ticker` — todos Server Components.
- **Home completa:** "três fornecedores vs um" com diagrama SVG que se desenha ao entrar (técnica do animejs.com feita com Motion), "como trabalhamos" com linha que preenche no scroll e grade técnica de fundo, faixa de tecnologias em loop, FAQ com `<details>` nativo e altura animada em CSS, chamada de contato.
- **Hero:**
  - rótulos das 6 especialidades presos aos cantos do cubo explodido na etapa 3, com linha até a peça (vista explodida, como a seção "toolbox" do animejs.com);
  - inclinação do cubo pelo ponteiro (±5°, amortecida, só com ponteiro fino);
  - título entrando palavra por palavra em CSS puro (não espera hidratação), rótulo decifrando, cartões com luz no hover, borda com brilho na frente prioritária, CTAs magnéticos.
- **Progresso do hero a partir das posições reais das etapas** (`progress.ts`, testado): etapa mais alta que a tela não desalinha mais o cubo do texto no mobile.
- **Header com navegação** e **menu mobile acessível** (foco preso, `Esc`, foco volta ao botão, rolagem travada).
- `THIRD_PARTY_NOTICES.md`; regras novas no `AGENTS.md` (política de componentes de efeito, pastas client, lockfile no Windows).
- 10 testes novos (31 no total): remapeamento de progresso, visibilidade dos rótulos.

### Alterado

- **`LazyMotion` em modo estrito** em todo o site (`MotionProvider`); `motion.*` substituído por `m.*`. As features de animação chegam num chunk separado depois do primeiro paint.
- Meta de JS inicial revista de 200 para **220 KB gzip** com base na medição do framework (decisão D21).
- Etapa 3 do hero: cubo menor e mais ao centro, coluna de texto mais estreita, para caber os rótulos.
- `package-lock.json` completado com os pacotes opcionais de todas as plataformas (o `npm install` no Windows tinha removido `@emnapi/*`, o que quebraria o `npm ci` do CI).

### Corrigido

- Classe `ticker-dup` colada na seguinte (`ticker-dupflex`) depois da formatação do Prettier: a lista da faixa agora é montada com `join`.
- Painel do menu mobile encolhido à altura do header: `backdrop-filter` transforma o header em bloco de contenção de elementos `fixed`. O painel agora é renderizado em portal no `<body>`.

### Medido nesta versão

- JS inicial da home: **213 KB gzip** (v0.1.0: 224 KB), mesmo com 9 componentes novos. Framework ~177 KB + código do site ~36 KB.
- Features de animação do Motion (carregadas depois): 11 KB gzip.
- Chunk da cena 3D: 242 KB gzip (sem mudança, dentro da meta de 250 KB).
- Verificação visual em Chromium headless, desktop 1440×900 e mobile 390×844, em 5 pontos do hero e em cada seção. Menu mobile testado por teclado. Sem erros no console além do aviso conhecido do `THREE.Clock`.

### Problemas conhecidos

- Toda a copy nova é provisória: prazos do processo, respostas do FAQ e lista de tecnologias precisam de validação (P9, P10).
- A chamada de contato não tem botão até existir e-mail/WhatsApp ou o formulário (P11, Fase 6).
- Continua valendo: medição em aparelho real pendente; pôster SVG provisório; transições com fundo cinza médio.

## [0.1.0] - 2026-09-30

Fundação do projeto e spike do hero 3D (Fases 0 e 1 do plano).

### Adicionado

- Projeto Next.js 16.3.7 + React 19.2.8 + TypeScript estrito + Tailwind 4, gerado a partir do `create-next-app` oficial e adaptado.
- Tokens da **direção de arte híbrida** em `globals.css`: base clara institucional e seções escuras técnicas, trocadas por `theme-dark` / `theme-light` sem mudar componentes.
- Fontes auto-hospedadas (Source Serif 4, Inter, JetBrains Mono — woff2 variáveis, subset latin, SIL OFL 1.1). Build independente de Google Fonts.
- **i18n** pt/en com prefixo obrigatório (`/pt`, `/en`): `proxy.ts` negocia o idioma pelo `Accept-Language`, `[locale]` com `generateStaticParams` e `dynamicParams = false`, dicionários tipados com o português como fonte da verdade.
- `global-not-found.tsx` para URLs sem rota (layout raiz vive em `[locale]`).
- Metadados: `canonical`, `hreflang` recíproco com `x-default`, `sitemap.xml`, `robots.txt`, ícone SVG provisório.
- **Hero 3D (spike):** cubo de 27 peças gerado por código com React Three Fiber, guiado pelo scroll em 4 etapas.
  - `cubeStateAt`: coreografia como função pura do progresso de scroll, testada.
  - `StoryScene`: palco sticky, canvas carregado só no cliente depois do primeiro paint, fundo que clareia em sincronia com o cubo virando traço.
  - `frameloop="demand"`: sem render com a página parada.
  - Pôster SVG isométrico renderizado no servidor como primeiro paint e fallback sem WebGL / com reduced motion.
  - `?freeze=1` para screenshots determinísticos.
- Constantes de movimento (`lib/motion.ts`) e componente `Reveal` com suporte a reduced motion.
- Testes (Vitest): coreografia do cubo, negociação de idioma, paridade dos dicionários, mistura de cor — 21 testes.
- CI no GitHub Actions: lint, typecheck, testes, formatação e build.
- `AGENTS.md` / `CLAUDE.md` com as regras do projeto, `README.md`, `.editorconfig`, `.gitattributes` (LF), `.nvmrc`.

### Medido nesta versão

- JS inicial da home: **224 KB gzip** (framework ~175 KB + Motion ~47 KB). Acima da meta de 200 KB; plano de redução (LazyMotion) na Fase 3.
- Chunk da cena 3D (three + R3F), carregado depois do primeiro paint: **242 KB gzip**. Dentro da meta de 250 KB.
- Fontes: 3 woff2, 139 KB no total; mono sem preload.

### Problemas conhecidos

- Aviso `THREE.Clock: This module has been deprecated` no console: vem do React Three Fiber 9.8 com three 0.186. Inofensivo; acompanhar atualização do R3F.
- Pôster SVG é provisório: será trocado por AVIF exportado da própria cena (Fase 4).
- Mobile: na etapa 2 o texto passa de 100svh e desalinha as etapas; o painel de texto cobre parte do cubo no hero. Ajuste na Fase 4.
- Quadros de transição (≈50% e ≈83% do scroll) passam por fundo cinza médio. Ajuste de curva na Fase 4.
- Desempenho medido só em Chromium headless com renderização por software: **falta a medição em aparelho real**, que é o critério de saída do spike.
