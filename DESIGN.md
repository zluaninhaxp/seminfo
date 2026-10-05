---
name: SEMINFO
description: Website responsivo da Semana da Informática com identidade azul e agenda legível.
colors:
  ink: "#030d2c"
  surface: "#09193d"
  line: "#27395e"
  muted: "#b8c7e5"
  cyan: "#50e5f5"
  pink: "#f591d3"
  electric: "#2348ef"
  text: "#f5f7ff"
  electric-hover: "#3459ff"
  surface-raised: "#0e2047"
  line-strong: "#56698e"
typography:
  display:
    fontFamily: '"SEMINFO Sans", sans-serif'
    fontSize: "clamp(40px, 4.8vw, 68px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"SEMINFO Sans", sans-serif'
    fontSize: "32px"
    fontWeight: 700
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"SEMINFO Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: '"SEMINFO Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: '"SEMINFO Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 600
rounded:
  radius: "5px"
spacing:
  compact: "12px"
  medium: "20px"
  section: "24px"
  wide: "32px"
  desktop-gutter: "48px"
components:
  button-primary:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.text}"
    rounded: "{rounded.radius}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.electric-hover}"
  day-selected:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    padding: "12px 4px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.radius}"
    padding: "11px"
  participation:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.radius}"
    padding: "28px"
---

# Design System: SEMINFO

## Overview

Uma identidade de evento com marcas oficiais e arte gráfica integrada à hero. A direção confirmada é aproximadamente 80% interface limpa e funcional e 20% expressão visual. A programação permanece uma área de leitura, sem competir com o conteúdo.

É um website responsivo com composição própria no desktop. LogoSEMINFO.png identifica header, hero e footer; LogoIF.png e LogoCA2.png compõem a assinatura institucional. Os arquivos oficiais são a fonte de verdade da marca.

**Key Characteristics:**

- Azul profundo como fundo dominante.
- Hero expressiva com arte oficial e destaque ciano/magenta.
- Agenda por horários, linhas e divisórias.
- Superfícies tonais planas e controles discretamente arredondados.

## Colors

### Primary

O azul elétrico identifica a ação principal. Ink sustenta o website; surface e surface-raised distinguem controles e participação sem grandes blocos coloridos.

### Secondary

Ciano destaca horários, links, estados disponíveis, título da hero e dia selecionado. No dia ativo, o texto troca para ink.

### Tertiary

Magenta aparece no sublinhado fino do destaque da hero, nas categorias e em avisos importantes. Estados também recebem texto explícito.

### Neutral

Text é quase branco; muted distingue descrições, placeholders e metadados. Line organiza divisórias; line-strong reforça bordas e separadores. Campos usam surface, participação usa surface-raised.

**Regra do fundo profundo.** Preservar a base escura e o contraste dos controles; branco predominante foi rejeitado.

## Typography

Space Grotesk é hospedada em `/fonts/space-grotesk.ttf`, declarada como SEMINFO Sans, com pesos variáveis de 300 a 700 e `font-display: swap`. Display usa fallback sans-serif; texto usa os fallbacks de sistema do frontmatter.

Os títulos têm espaçamento negativo e quebra balanceada. O título principal usa display; títulos de seção usam headline; atividades usam title. Body descreve os parágrafos gerais. Labels identificam filtros. O tamanho base de texto deriva do padrão do navegador; parágrafos têm entrelinha explícita.

A identidade da edição usa o arquivo gráfico oficial, sem reconstrução tipográfica da logo. Horários usam números tabulares. A introdução tem leitura limitada a 46ch; textos de detalhe chegam a 70ch. Variações responsivas e o modo durante o evento ajustam a hierarquia sem trocar a família.

## Layout

O container principal limita a largura a 1400px. Header, hero, conteúdo e rodapé compartilham recuos laterais de 48px. A hero tem duas colunas (1.05fr e 1fr), separadas por 64px. A agenda tem uma lateral de 270px e lista flexível, com intervalo de 54px; a lateral permanece sticky a 24px do topo.

A agenda agrupa linhas por horário: coluna de 86px e intervalo de 24px. Atividades usam divisórias e 26px de respiro vertical. Detalhes combinam artigo flexível e participação de 320px, separados por 90px.

Até 1100px, os recuos passam a 32px e a lateral da agenda a 230px. Até 760px, os recuos passam a 20px, a hero e detalhes ficam em uma coluna e os filtros passam para cima da lista. Os dias continuam em quatro colunas. A coluna de horário passa a 55px, com intervalo de 14px; metadados se empilham. A navegação se abre por botão de menu. Até 380px, os filtros passam a uma coluna. O body mantém largura mínima de 320px.

Durante o evento, a hero fica mais compacta; no celular, a marca da hero, a arte decorativa e o parágrafo introdutório desse modo ficam ocultos para aproximar a programação.

## Elevation & Depth

Não há sombras. A profundidade vem de contraste entre fundos azuis, divisórias e hierarquia tipográfica. A hero integra a composição gráfica oficial ao fundo com máscara horizontal e fade vertical; não é uma fotografia nem um card de imagem. Participação usa uma superfície tonal. Não há glow nem textura atrás da agenda.

## Shapes

Containers editoriais permanecem retos. Campos, dias, menu, aviso demonstrativo, botão principal e participação compartilham radius. A agenda é uma lista de linhas, sem transformar cada atividade em um cartão elevado.

## Components

### Buttons

O botão principal é compacto e firme, com altura mínima de 48px. Hover troca o azul; active desloca 1px para baixo. Background, border-color e transform usam 180ms com cubic-bezier(.16, 1, .3, 1). Links secundários recebem sublinhado e destaque ciano no hover. Botões de texto preservam a leitura de ação textual.

### Day picker

Quatro opções verticais combinam dia da semana, número e mês. Opções inativas usam surface sem borda aparente; hover usa surface-raised e borda line-strong. O estado selecionado usa fundo ciano e texto profundo, exposto também por `aria-pressed`. Altura mínima de 86px no desktop e 78px no celular.

### Inputs / Fields

Busca e selects usam surface, borda line-strong e altura mínima de 46px. Placeholder usa muted. No celular, busca e selects usam 16px. Checkbox usa ciano e dimensão de 18px.

### Navigation

Links de 14px têm indicador inferior ciano curto (24px por 2px), que cresce por scaleX no hover e na página atual. Até 760px, o botão de menu abre a navegação em uma linha própria; controles e links de navegação têm altura mínima de 44px.

### Agenda

Horários em ciano ancoram cada grupo. Cada atividade mostra tipo, estado textual, título, metadados e acesso aos detalhes. Divisórias substituem cartões. Mudanças de estado não escondem horário e local.

### Participation

O painel tonal reúne disponibilidade descritiva e ações. Tem recuo de 28px no desktop e 24px no celular. Inscrição e acesso à transmissão são ações distintas.

### Official identity and hero

A marca do header tem largura de 126px, reduzida a 112px no mobile e 98px até 380px. A marca da hero ocupa a coluna visual, com largura máxima de 370px no mobile; o footer usa 140px. Logos institucionais aparecem menores, com respiro e proporções preservadas.

A arte oficial ocupa o fundo direito da hero, com opacidade de 0.32, máscara horizontal e fade vertical. No mobile, a opacidade cai para 0.18. O modo durante o evento usa 0.12 no desktop e remove a decoração no celular. Os grafismos e texturas existentes na arte ficam restritos à região expressiva. Não foram adicionados efeitos constantes, >>> ou glows independentes. O título usa ciano com sublinhado magenta fino.

### Focus and motion

Botões, links, campos e selects recebem outline ciano de 3px com offset de 5px ao foco pelo teclado. O link de salto fica visível ao receber foco. `prefers-reduced-motion: reduce` desativa animações e transições e retorna o scroll a auto.

## Do's and Don'ts

- **Do** preservar a identidade cromática e usar os arquivos oficiais da edição.
- **Do** concentrar a expressão visual na hero; linhas e circuitos discretos da arte oficial são permitidos nessa região.
- **Do** manter horário, local, estado textual e foco de teclado legíveis.
- **Do** usar Space Grotesk hospedada localmente e composição própria para desktop.
- **Don't** usar branco predominante, neon na agenda, textura atrás de textos pequenos ou glow em atividades.
- **Don't** converter o website em uma interface de aplicativo mobile.
- **Don't** recriar logos oficiais com texto, CSS ou formas aproximadas.
