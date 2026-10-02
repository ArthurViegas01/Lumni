# Avisos de terceiros

Código de terceiros incluído neste repositório (além das dependências do `package.json`, que trazem suas próprias licenças em `node_modules`).

## React Bits

- **Origem:** https://reactbits.dev · https://github.com/DavidHDev/react-bits (variantes TS + Tailwind, copiadas do repositório em 30/09/2026)
- **Licença:** MIT + Commons Clause, © 2026 David Haz
- **O que a licença permite:** usar, copiar e modificar **como parte de uma aplicação, site ou produto**, inclusive comercialmente.
- **O que a licença proíbe:** vender, sublicenciar ou redistribuir **os componentes em si**, sozinhos, em pacote ou portados. Na prática: não publicar estes arquivos como biblioteca, template ou kit de componentes. Mantenha este repositório privado ou, se ele for aberto, trate os arquivos abaixo como exceção.

| Arquivo                                                                         | Componente de origem | Relação              |
| ------------------------------------------------------------------------------- | -------------------- | -------------------- |
| `src/components/effects/BlurReveal.tsx`                                         | BlurText             | Adaptado             |
| `src/components/effects/SpotlightCard.tsx` + `.spotlight-card` em `globals.css` | SpotlightCard        | Adaptado             |
| `src/components/effects/Magnet.tsx`                                             | Magnet               | Adaptado             |
| `src/components/ui/StarBorder.tsx` + `.star-border` em `globals.css`            | StarBorder           | Adaptado             |
| `src/components/effects/Scramble.tsx`                                           | DecryptedText        | Reescrito, inspirado |
| `src/components/effects/GridBackdrop.tsx` + `.grid-backdrop` em `globals.css`   | ShapeGrid            | Reescrito, inspirado |
| `src/components/ui/Ticker.tsx` + `.ticker` em `globals.css`                     | LogoLoop             | Reescrito, inspirado |

Texto da licença, como publicado no repositório de origem:

```
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software as part of an
application, website, or product, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Commons Clause Restriction

You may use this Software, including for any commercial purpose, so long as you
do not sell, sublicense, or redistribute the components themselves-whether
alone, in a bundle, or as a ported version.

No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Fontes

Inter e JetBrains Mono — SIL Open Font License 1.1 (Source Serif 4 saiu na v0.4.0). Licenças completas em `src/app/fonts/LICENSE-*.txt`.
