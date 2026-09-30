<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Regras do projeto (site Lumni)

Leia antes de qualquer alteração:

1. `PLANO_DE_IMPLEMENTACAO.md` — arquitetura, decisões, fases e critérios de aceite. A fase atual está no topo.
2. `CHANGELOG.md` — o que já existe, por versão. **Toda mudança entra aqui**, na seção `[Não lançado]`.

## Antes de criar algo, procure o que já existe

| Precisa de… | Use |
| --- | --- |
| Duração, easing, stagger, mola | `src/lib/motion.ts` (`DUR`, `EASE`, `STAGGER`, `SCROLL_SPRING`) |
| Revelar ao entrar na tela | `src/components/motion/Reveal.tsx` |
| Texto visível ao usuário | `src/i18n/dictionaries/pt.json` + `en.json` (mesma forma; o teste falha se divergirem) |
| Idiomas, `lang`, idioma alternativo | `src/i18n/config.ts` |
| Nome e URL do site | `src/lib/site.ts` |
| Cores da cena 3D | `SCENE_COLORS` em `src/components/scene/color.ts` |
| Estado do cubo por scroll | `cubeStateAt` em `src/components/scene/cubeState.ts` |
| Botão / link de ação | `src/components/ui/Button.tsx` (variantes `primary`, `secondary`, `ghost`) |
| Seção de página com tema e espaçamento | `src/components/ui/Section.tsx` (`Section`, `Container`) |
| Rótulo acima de título | `src/components/ui/Eyebrow.tsx` (`scramble` para o efeito de decifrar) |
| Título que entra desfocando | `src/components/effects/BlurReveal.tsx` |
| Cartão com luz no hover | `src/components/effects/SpotlightCard.tsx` |
| Destacar UM item por tela | `src/components/ui/StarBorder.tsx` |
| Botão "magnético" (CTA principal) | `src/components/effects/Magnet.tsx` |
| Fundo técnico em seção escura | `src/components/effects/GridBackdrop.tsx` |
| Faixa em loop | `src/components/ui/Ticker.tsx` |
| Linha que preenche com o scroll | `src/components/effects/ScrollLine.tsx` |

Se não existir, crie no lugar certo da estrutura descrita no plano, não dentro do componente que precisa.

## Componentes de efeito (React Bits, Motion, anime.js)

- **Fonte primária de efeitos: React Bits** (reactbits.dev). Antes de trazer um novo, confira a dependência: só entra componente que use `motion` ou nenhuma lib. GSAP, ogl, three extra e lenis ficam fora (decisões D16–D19 do plano).
- **Todo componente trazido é endurecido antes de entrar:** sem `setState` por movimento de mouse ou por frame (use variável CSS ou motion value), cor por token, `m.*` em vez de `motion.*`, reduced motion respeitado, texto acessível. Cabeçalho de atribuição no arquivo e linha em `THIRD_PARTY_NOTICES.md` (a licença exige).
- **Motion+ (pago) não é usado.** anime.js não é dependência: as técnicas do animejs.com são feitas com Motion.
- **Nada de efeito em loop contínuo** (canvas animado, cursor customizado, partículas): custo de bateria constante e cara de template.
- **`motion.*` quebra o site:** o `MotionProvider` roda `LazyMotion` em modo estrito. Importe `* as m from "motion/react-m"`.

## Estilo visual (não genérico)

- Cores **só** por token semântico: `bg-bg`, `bg-surface`, `text-ink`, `text-ink-quiet`, `border-border`, `bg-accent`, `text-accent-ink`. Nada de hex solto nem paleta padrão do Tailwind (`gray-500`, `blue-600`…) em componente.
- Tema por seção com `theme-dark` / `theme-light`. Os tokens trocam sozinhos; o componente não muda.
- Tipografia: `font-display` (serifa) só em título grande (`text-hero`, `text-h2`); corpo em sans; `font-mono` para rótulos e números.
- Texto corrido com `max-w-measure` (68ch). Container com `max-w-site`. Gutter lateral de 16px no mobile (`px-4`).
- Raios: `rounded-sm` (6px) e `rounded-lg` (14px). Nenhum outro.

## Fronteiras cliente/servidor

- `"use client"` só em `src/components/motion/`, `effects/`, `interactive/` e `scene/`. `ui/`, `sections/` e `layout/` são Server Components e importam de lá.
- Efeito que dá para fazer em CSS (loop, borda, entrada do `<h1>`) fica em CSS no `globals.css`, sem JavaScript.
- three.js e React Three Fiber entram **apenas** via `next/dynamic` com `ssr: false` (ver `StoryScene.tsx`). Nunca importe `three` fora de `src/components/scene/`.

## Hero 3D

- A coreografia é a função pura `cubeStateAt`. Mudou keyframe → rode e ajuste `cubeState.test.ts`.
- Nada de `useState`/`setState` por frame: estado visual muda em `useFrame`, via refs.
- `?freeze=1` desliga mola e balanço ocioso (render determinístico para screenshot).

## Antes de dar a tarefa por encerrada

```bash
npm run check   # lint + typecheck + testes + prettier
npm run build
```

**Windows e o lockfile:** `npm install` no Windows pode remover do `package-lock.json` pacotes opcionais de outras plataformas (`@emnapi/*`), e aí o `npm ci` do CI falha. Para instalar o projeto use `npm ci`. Depois de adicionar uma dependência, rode `npm install --package-lock-only` e confira que o `git diff` do lockfile não removeu pacotes `@emnapi`.

Commits no padrão Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
