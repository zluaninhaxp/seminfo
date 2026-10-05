# SEMINFO

Website responsivo da XXI Semana da Informática, de 26 a 29 de outubro de 2026, no IFSULDEMINAS — Campus Muzambinho. Organização: Centro Acadêmico Alan Turing.

## Desenvolvimento

Execute `npm install` e `npm run dev`. Use `npm run build` para verificar TypeScript e gerar a versão de produção. Consulte `package.json` para os demais comandos.

## Manutenção

A fonte compartilhada é `src/data.ts`. `days` contém os quatro dias e `activities` reúne a programação. Cada atividade começa e termina no mesmo dia. Horários usam `HH:mm`, datas usam `AAAA-MM-DD`; a referência é Brasília (`America/Sao_Paulo`).

O conteúdo inicial é **demonstrativo**: títulos, responsáveis, locais, horários, requisitos e situações de inscrição são fictícios. Antes de publicar, a comissão deve substituir os exemplos pela programação aprovada e mudar `event.demo` para `false`. As datas gerais do evento são confirmadas.

A marca tipográfica da interface é temporária. Os logos enviados na conversa não estão disponíveis como arquivos no projeto; a versão final deve receber os arquivos oficiais, preservando suas proporções. As artes de redes sociais servem como referência de identidade.

`event.phase` controla a prioridade editorial:

- `registration`: descoberta e inscrições antes do evento.
- `live`: consulta da programação durante o evento.
- `finished`: programação e informações após o evento.

A configuração é manual. O relógio não confirma inscrições, atrasos ou mudanças operacionais.

## Inscrições e atividades online

`registrationStatus` aceita `open`, `closed`, `full`, `none` ou `soon`. `capacity` é o limite numérico ou `null` para ausência de limite. Capacidade não significa vagas restantes. A comissão atualiza o estado quando o formulário encerra ou o limite é atingido.

Preencha `registrationUrl` com o formulário oficial e `onlineUrl` com o acesso público à atividade online. Os campos são opcionais e **nenhum endereço externo fictício foi incluído**. Links pendentes devem ser indicados na interface, sem botões que simulem inscrição ou transmissão. Abrir um formulário não confirma participação ou garantia de vaga.

Use `notice` para alterações relevantes e `cancelled: true` para cancelamento, preservando o detalhe para links compartilhados anteriormente. Mantenha também o formulário externo coerente.

## Antes de publicar

Confira programação, locais, responsáveis, inscrições, links online e textos institucionais. Valide desktop e celular, teclado, contraste e zoom. Emulação verifica layout; toque, teclado virtual e barras do navegador também precisam ser conferidos em aparelho real.
