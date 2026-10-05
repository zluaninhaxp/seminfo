# SEMINFO

Website responsivo da XXI Semana da Informática, de 26 a 29 de outubro de 2026, no IFSULDEMINAS — Campus Muzambinho. Organização: Centro Acadêmico Alan Turing.

## Desenvolvimento

Use Node.js 22.12 ou superior. Execute `npm install` e `npm run dev`. Use `npm run build` para verificar TypeScript e gerar a versão de produção. Consulte `package.json` para os demais comandos.

## Manutenção

A fonte compartilhada é `src/data.ts`. `days` contém os quatro dias e `activities` reúne a programação. Cada atividade começa e termina no mesmo dia. Horários usam `HH:mm`, datas usam `AAAA-MM-DD`; a referência é Brasília (`America/Sao_Paulo`).

O conteúdo inicial é **demonstrativo**: títulos, responsáveis, locais, horários, requisitos e situações de inscrição são fictícios. Antes de publicar, a comissão deve substituir os exemplos pela programação aprovada e mudar `event.demo` para `false`. As datas gerais do evento são confirmadas.

Os arquivos oficiais de marca estão em `src/assets`: `LogoSEMINFO.png`, `LogoIF.png`, `LogoCA1.png` e `LogoCA2.png`. Preserve suas proporções. A arte `Apresentação Oficial XXI SEMINFO 2026_compressed-1.png` orienta a composição expressiva do hero; a programação mantém uma superfície limpa e legível.

`event.phase` controla a prioridade editorial:

- `registration`: descoberta e inscrições antes do evento.
- `live`: consulta da programação durante o evento.
- `finished`: programação e informações após o evento.

A configuração é manual. O relógio não confirma inscrições, atrasos ou mudanças operacionais.

## Hero de 2026

`src/Hero.tsx` e `src/Hero.css` implementam a composição aprovada, com “Informática além da aula.” como título e destaque ciano em “além da aula.”. A marca oficial, as ondas vetoriais e a faixa de edição/ano/gratuidade mantêm a identidade da edição, sem carregar o cartaz de 4,5 MB.

A entrada do hero termina em menos de um segundo. Ao rolar, a introdução, a programação, o conteúdo de Sobre, os detalhes e o rodapé entram suavemente na tela uma vez, sem deslocar os dados que o visitante está lendo. O ambiente tem ciclos de 24–30 segundos; cursor e scroll deslocam apenas as camadas decorativas. O cursor funciona somente em desktop com mouse. O movimento pausa fora da tela e em abas ocultas; `prefers-reduced-motion` apresenta a composição estática. Até 760px, a marca do hero fica oculta para manter o fluxo entre título, descrição e CTAs. A programação vem diretamente depois do hero, sem a faixa de aviso demonstrativo.

Na programação, o CTA principal rola até a agenda. Em atividades, “Explorar inscrições” mantém o filtro de inscrições abertas. As demais rotas, filtros e detalhes usam a lógica existente.

Para repetir a verificação no Chrome instalado, disponibilize Playwright fora das dependências do app e execute `node scripts/verify-hero.cjs`. `PLAYWRIGHT_MODULE` aceita o caminho do pacote temporário e `HERO_URL` define a URL local (padrão: `http://127.0.0.1:5174`). O script verifica oito larguras, as outras rotas, cursor, hover, scroll, movimento reduzido, menu, filtros e detalhes; salva as capturas e o relatório em `output/screenshots`.

## Inscrições e atividades online

`registrationStatus` aceita `open`, `closed`, `full`, `none` ou `soon`. `capacity` é o limite numérico ou `null` para ausência de limite. Capacidade não significa vagas restantes. A comissão atualiza o estado quando o formulário encerra ou o limite é atingido.

Preencha `registrationUrl` com o formulário oficial e `onlineUrl` com o acesso público à atividade online. Os campos são opcionais e **nenhum endereço externo fictício foi incluído**. Links pendentes devem ser indicados na interface, sem botões que simulem inscrição ou transmissão. Abrir um formulário não confirma participação ou garantia de vaga.

Use `notice` para alterações relevantes e `cancelled: true` para cancelamento, preservando o detalhe para links compartilhados anteriormente. Mantenha também o formulário externo coerente.

## Antes de publicar

Confira programação, locais, responsáveis, inscrições, links online e textos institucionais. Valide desktop e celular, teclado, contraste e zoom. Emulação verifica layout; toque, teclado virtual e barras do navegador também precisam ser conferidos em aparelho real.
