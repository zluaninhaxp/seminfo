---
name: SEMINFO
description: Website responsivo da Semana da Informática com identidade azul e agenda legível.
colors:
  ink: "#071337"
  surface: "#0c1c47"
  line: "#32436c"
  muted: "#bac8e9"
  cyan: "#75e8f7"
  pink: "#f993d5"
  electric: "#254bf1"
  text: "#f4f6ff"
  white: "#fff"
  electric-hover: "#365dfc"
  stamp: "#143ce4"
  field: "#0b1c47"
  field-border: "#43537c"
  placeholder: "#afbfdf"
  participation: "#102554"
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
    letterSpacing: "-0.025em"
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
  control: "4px"
  action: "5px"
spacing:
  compact: "12px"
  medium: "20px"
  section: "24px"
  wide: "32px"
  desktop-gutter: "48px"
components:
  button-primary:
    backgroundColor: "{colors.electric}"
    textColor: "{colors.white}"
    rounded: "{rounded.action}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.electric-hover}"
  day-selected:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 4px"
  field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "11px"
  participation:
    backgroundColor: "{colors.participation}"
    rounded: "{rounded.action}"
    padding: "28px"
---

# Design System: SEMINFO

## Overview

Uma identidade de evento construída com tipografia, campos de azul e acentos luminosos. A composição dá espaço à edição e à programação, com densidade suficiente para comparar atividades simultâneas sem esconder horário e local.

É um website responsivo, com navegação de páginas e composição própria no desktop. A marca textual SEMINFO é temporária: os arquivos originais da marca geométrica ainda não estão disponíveis. Não criar uma nova marca gráfica como se fosse oficial.

**Key Characteristics:**

- Azul profundo como fundo dominante.
- Contraste tipográfico e acentos ciano e magenta.
- Agenda organizada por linhas, horários e divisórias.
- Superfícies planas e controles discretamente arredondados.

## Colors

### Primary

O azul elétrico identifica a ação principal; o azul do selo concentra a presença visual da edição. O azul profundo sustenta o website inteiro.

### Secondary

O ciano destaca horários, links, estados disponíveis e o dia selecionado. No dia ativo, o texto troca para azul profundo.

### Tertiary

O magenta destaca palavras no título e avisos importantes. Estados também recebem texto explícito: a cor complementa a informação.

### Neutral

O texto principal é quase branco; o tom muted distingue descrições e metadados. Line organiza divisórias. Campos e participação usam fundos azuis específicos do frontmatter.

**Regra do fundo profundo.** Preservar a base escura e o contraste dos controles; branco predominante foi rejeitado pelo usuário.

## Typography

Space Grotesk é hospedada em `/fonts/space-grotesk.ttf`, declarada como SEMINFO Sans, com pesos variáveis de 300 a 700 e `font-display: swap`. Display usa fallback sans-serif; texto usa os fallbacks de sistema do frontmatter.

Os títulos têm espaçamento negativo e quebra balanceada. O título principal usa display; títulos de seção usam headline; atividades usam title. Body descreve os parágrafos gerais. Labels identificam filtros. O tamanho base de texto deriva do padrão do navegador; parágrafos têm entrelinha explícita.

O selo usa numeração grande (`clamp(72px, 9vw, 132px)`) e nome da edição (`clamp(34px, 4.1vw, 58px)`). Horários usam números tabulares. A introdução tem leitura limitada a 46ch; textos de detalhe chegam a 70ch. Variações responsivas e o modo durante o evento ajustam a hierarquia sem trocar a família.

## Layout

O container principal limita a largura a 1400px. Header, hero, conteúdo e rodapé compartilham recuos laterais de 48px. A hero tem duas colunas (1.05fr e 1fr), separadas por 64px. A agenda tem uma lateral de 270px e lista flexível, com intervalo de 54px; a lateral permanece sticky a 24px do topo.

A agenda agrupa linhas por horário: coluna de 86px e intervalo de 24px. Atividades usam divisórias e 26px de respiro vertical. Detalhes combinam artigo flexível e participação de 320px, separados por 90px.

Até 1100px, os recuos passam a 32px e a lateral da agenda a 230px. Até 760px, os recuos passam a 20px, a hero e detalhes ficam em uma coluna e os filtros passam para cima da lista. Os dias continuam em quatro colunas. A coluna de horário passa a 55px, com intervalo de 14px; metadados se empilham. A navegação se abre por botão de menu. Até 380px, os filtros passam a uma coluna. O body mantém largura mínima de 320px.

Durante o evento, a hero fica mais compacta; no celular, o selo e o parágrafo introdutório desse modo ficam ocultos para aproximar a programação.

## Elevation & Depth

Não há sombras. A profundidade vem de contraste entre fundos azuis, divisórias e hierarquia tipográfica. O selo editorial é um campo de cor plano. A participação é uma superfície tonal, sem efeito de flutuação.

## Shapes

Containers editoriais permanecem retos. Campos, dias e menu usam o arredondamento control; botão principal e participação usam action. A agenda é uma lista de linhas, sem transformar cada atividade em um cartão elevado.

## Components

### Buttons

O botão principal é compacto e firme, com altura mínima de 48px. Hover troca o azul; active desloca 1px para baixo. A transição de background e transform dura 0.18s. Links secundários recebem sublinhado e destaque ciano no hover. Botões de texto preservam a leitura de ação textual.

### Day picker

Quatro opções verticais combinam dia da semana, número e mês. O estado selecionado usa fundo ciano e texto profundo, exposto também por `aria-pressed`. Altura mínima de 86px no desktop e 78px no celular.

### Inputs / Fields

Busca e selects usam fundo escuro, borda visível e altura mínima de 46px. Placeholder tem tom próprio. No celular, busca e selects usam 16px. Checkbox usa ciano e dimensão de 18px.

### Navigation

Links de 14px têm indicador inferior ciano no hover e na página atual. Até 760px, o botão de menu abre a navegação em uma linha própria; controles e links de navegação têm altura mínima de 44px.

### Agenda

Horários em ciano ancoram cada grupo. Cada atividade mostra tipo, estado textual, título, metadados e acesso aos detalhes. Divisórias substituem cartões. Mudanças de estado não escondem horário e local.

### Participation

O painel tonal reúne disponibilidade descritiva e ações. Tem recuo de 28px no desktop e 24px no celular. Inscrição e acesso à transmissão são ações distintas.

### Focus and motion

Botões, links, campos e selects recebem outline ciano de 3px com offset de 5px ao foco pelo teclado. O link de salto fica visível ao receber foco. `prefers-reduced-motion: reduce` desativa animações e transições e retorna o scroll a auto.

## Do's and Don'ts

- **Do** preservar azul profundo, azul elétrico, ciano e magenta como identidade.
- **Do** manter horário, local, estado textual e foco de teclado legíveis.
- **Do** usar Space Grotesk hospedada localmente e uma composição própria para desktop.
- **Don't** introduzir circuitos ou branco predominante.
- **Don't** converter o website em uma interface de aplicativo mobile.
- **Don't** apresentar a marca textual temporária como o arquivo oficial da identidade.
