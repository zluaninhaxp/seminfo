# XXI SEMINFO 2026

Site oficial da **XXI Semana da Informática (SEMINFO)** do IFSULDEMINAS — Campus Muzambinho. O evento acontece de **26 a 29 de outubro de 2026** e é organizado pelo Centro Acadêmico Alan Turing.

O site reúne a programação divulgada, detalhes das atividades e informações sobre o evento. A programação é mantida em um único arquivo de dados para facilitar as atualizações pela organização.

## Começar a desenvolver

**Requisitos:** Node.js 22.12 ou superior e npm.

```bash
npm ci
npm run dev
```

O Vite informa no terminal o endereço local para abrir no navegador.

### Comandos

| Comando | Para que serve |
| --- | --- |
| `npm run dev` | Inicia o servidor local de desenvolvimento. |
| `npm run lint` | Verifica problemas no código com Oxlint. |
| `npm run build` | Verifica os tipos TypeScript e gera a versão de produção em `dist/`. |
| `npm run preview` | Abre localmente a versão gerada pelo build. |

## Páginas

O site usa navegação interna por hash e não depende de um serviço de roteamento externo.

| Rota | Conteúdo |
| --- | --- |
| `#/programacao` | Agenda organizada por dia, com busca e filtros. |
| `#/atividades` | Lista de atividades e acesso às inscrições disponíveis. |
| `#/atividade/desafio-programacao` | Detalhes da CSP, regras, horários e formulário. |
| `#/sobre` | Informações sobre a SEMINFO, patrocinadores e organização. |

## Atualizar a programação

Edite [`src/data.ts`](src/data.ts). O arquivo contém as fases do evento, os dias e a lista de atividades. Atualmente, a única atividade publicada é a **1ª CSP — Competição SEMINFO de Programação**.

Cada atividade tem um `id` estável, usado na rota de detalhes. Os campos principais são:

| Campo | Orientação |
| --- | --- |
| `title`, `subtitle`, `type` | Nome, subtítulo opcional e categoria (`Palestra`, `Oficina` ou `Competição`). |
| `date`, `start`, `end` | Data em `AAAA-MM-DD` e horários em `HH:mm`, no horário de Brasília. |
| `location`, `mode`, `speaker` | Local, modalidade (`Presencial` ou `Online`) e responsável. |
| `description`, `requirements` | Descrição completa e requisitos exibidos nos detalhes da atividade. |
| `registrationStatus` | `open`, `soon`, `closed`, `full` ou `none`. |
| `registrationUrl`, `registrationDeadline` | Link real do formulário e prazo, quando aplicável. |
| `capacity` | Número de vagas, `"limited"` para vagas limitadas sem número divulgado, `null` para sem limite, ou omitido quando a quantidade ainda será confirmada. |
| `onlineUrl` | Link de acesso, somente para atividades online com destino confirmado. |
| `competitionSchedule` | Etapas e horários próprios de uma competição. Use `start` e `end` quando houver intervalo; ambos são opcionais para momentos sem duração definida. |

Inclua apenas informações confirmadas. Não use links de exemplo como destino de inscrição ou transmissão. O botão de inscrição só fica ativo quando a atividade está aberta e possui um destino válido ou instruções de inscrição.

### Fase do evento

`event.phase` define a apresentação geral do site:

- `registration`: período anterior ao evento, com chamadas para conhecer atividades e inscrições;
- `live`: programação em andamento, com informações contextuais do dia;
- `finished`: apresentação após o encerramento.

`event.demo` deve permanecer `false` na versão pública. Ele controla apenas tratamentos para conteúdo e links de demonstração; não determina se as inscrições estão abertas. A disponibilidade é configurada em cada atividade.

## Publicação na Vercel

O projeto usa Vite. Ao importar este repositório ou conectar o projeto existente na Vercel, confira estas configurações:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node.js:** 22.12 ou superior

Com o repositório conectado, commits na branch de produção configurada pela Vercel geram uma nova publicação. Antes de promover uma versão, confira o resultado do build e confirme que o domínio continua associado ao projeto correto.

## Estrutura do projeto

```text
src/
├── assets/           Logos e arte oficial
├── data.ts           Fases, dias e atividades
├── App.tsx           Rotas e conteúdo das páginas
├── App.css           Estilos globais e programação
├── ActivityDetail.css
├── AboutPage.css
├── Hero.tsx          Hero compartilhado
└── Hero.css
```

Os logos e materiais oficiais ficam em `src/assets/`. Preserve a proporção e a aparência dos arquivos originais ao reutilizá-los.

## Antes de publicar atualizações

1. Confira datas, horários, locais, responsáveis, regras e capacidade das atividades.
2. Teste os formulários e demais links externos; confirme que as inscrições continuam abertas.
3. Rode `npm run lint` e `npm run build`.
4. Revise as páginas em desktop e celular, incluindo navegação por teclado e preferência por movimento reduzido.
