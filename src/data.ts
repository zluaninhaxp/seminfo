export function activityTime(value: { start?: string; end?: string }, showOpenStart = false) {
  if (showOpenStart && value.start && !value.end) return `A partir das ${value.start}`;
  return value.start ? `${value.start}${value.end ? `–${value.end}` : ""}` : value.end ? `Até ${value.end}` : "Horário a divulgar";
}

export interface ActivityMoment {
  id: string;
  kind: "talk" | "ceremony" | "break";
  title?: string;
  start?: string;
  end?: string;
  description?: string;
  speakers?: { name: string; affiliation?: string; bio?: string }[];
  location?: string;
  requirements?: string[];
  links?: { label: string; url: string }[];
}

export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
  flag?: string;
  type: "Abertura" | "Oficina" | "Palestra" | "Competição";
  date: string;
  start?: string;
  end?: string;
  location: string;
  mode?: "Presencial" | "Online";
  speaker: string;
  description: string;
  requirements: (string | { text: string; emphasize: string[] })[];
  capacity?: number | null | "limited";
  registrationStatus: "open" | "closed" | "full" | "none" | "soon" | "unknown";
  registrationUrl?: string;
  registrationDeadline?: string;
  registrationInstructions?: string;
  registrationMode?: "local";
  onlineUrl?: string;
  moments?: ActivityMoment[];
  competitionSchedule?: {
    date: string;
    start?: string;
    end?: string;
    title: string;
  }[];
  cancelled?: boolean;
  notice?: string;
}

export function hasParticipationRequirement(requirement: Activity["requirements"][number]) {
  const text = (typeof requirement === "string" ? requirement : requirement.text).trim();
  return text.length > 0 && !/^(?:nenhum|nenhuma|não|nao)[.!]?$/i.test(text);
}

export const event: {
  phase: "registration" | "live" | "finished";
  demo: boolean;
} = {
  phase: "registration",
  demo: false,
};

export const days = [
  { date: "2026-10-26", label: "Segunda", short: "SEG", number: "26" },
  { date: "2026-10-27", label: "Terça", short: "TER", number: "27" },
  { date: "2026-10-28", label: "Quarta", short: "QUA", number: "28" },
  { date: "2026-10-29", label: "Quinta", short: "QUI", number: "29" },
];

// Atividades reais divulgadas para a XXI SEMINFO 2026.
export const activities: Activity[] = [
  {
    "id": "abertura",
    "title": "Abertura Oficial - XXI SEMINFO 2026",
    "type": "Abertura",
    "date": "2026-10-26",
    "start": "13:00",
    "location": "Auditório Novo",
    "mode": "Presencial",
    "speaker": "Centro Acadêmico Alan Turing",
    "description": "A abertura oficial da XXI Semana da Informática (SEMINFO 2026) marca o início das atividades do evento, reunindo estudantes, professores e demais participantes para uma programação de integração e troca de conhecimentos.",
    "requirements": [],
    "registrationStatus": "open",
    "registrationInstructions": "O link do formulário será disponibilizado no local do evento.",
    "registrationMode": "local",
    "moments": [
      {
        "id": "cerimonia",
        "kind": "ceremony",
        "start": "13:00",
        "title": "Credenciamento e Cerimônia de abertura."
      },
      {
        "id": "palestra-1",
        "kind": "talk",
        "title": "Inteligência Artificial e Inovação: muito além de um prompt e um conjunto de dados",
        "start": "14:00",
        "description": "Palestra sobre a aplicação da Inteligência Artificial na resolução de problemas reais, explorando como a tecnologia pode contribuir para a modelagem de soluções e o desenvolvimento de uma visão estratégica.\n\nA atividade abordará as expectativas e discussões em torno da popularização da IA, além de apresentar como algoritmos e modelos podem auxiliar na construção de sistemas confiáveis.\n\nTambém serão discutidos aspectos relacionados à ética e ao uso consciente de ferramentas de Inteligência Artificial Generativa.",
        "speakers": [
          {
            "name": "Prof. Dr. Douglas Donizeti de Castilho Braz"
          }
        ],
        "requirements": [
          "Nenhum."
        ]
      },
      {
        "id": "coffee-break",
        "kind": "break",
        "start": "16:00",
        "title": "Coffee break"
      }
    ],
    "end": "17:00",
    "capacity": null
  },
  {
    "id": "troubleshooting-dados-mundo-real",
    "title": "Troubleshooting e Dados no Mundo Real",
    "type": "Palestra",
    "date": "2026-10-26",
    "location": "Online",
    "speaker": "Ana Carolina Brazão",
    "description": "Palestra sobre a importância da investigação orientada por dados na identificação e resolução de problemas em operações de e-commerce de alcance global.\n\nA atividade abordará como a análise de informações pode contribuir para o diagnóstico de falhas, a estabilidade dos sistemas e a continuidade das operações em ambientes digitais complexos.",
    "requirements": [
      "Nenhum."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/vDC8LMxd45UBkJqV7",
    "onlineUrl": "https://meet.google.com/zgz-motj-bar",
    "start": "19:30",
    "mode": "Online",
    "capacity": null
  },
  {
    "id": "criacao-jogos-2d-tarde",
    "title": "Criação de Jogos 2D",
    "type": "Oficina",
    "date": "2026-10-27",
    "location": "Sala 14",
    "speaker": "Ricardo Martins",
    "description": "Oficina prática de desenvolvimento de jogos 2D utilizando o GameMaker, com foco nos fundamentos da lógica de programação aplicada à criação de jogos.\n\nA atividade abordará o desenvolvimento de mecânicas, personagens e fases, permitindo aos participantes aplicar os conhecimentos adquiridos na construção da primeira fase de um jogo.",
    "requirements": [
      "Atividade destinada a iniciantes e interessados em desenvolvimento de jogos, sem exigência de conhecimento prévio."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/J8BbxKKZanb6PNrXA",
    "start": "13:00",
    "capacity": 30,
    "mode": "Presencial"
  },
  {
    "id": "criacao-jogos-2d-noite",
    "title": "Criação de Jogos 2D",
    "type": "Oficina",
    "date": "2026-10-27",
    "location": "Sala 14",
    "speaker": "Ricardo Martins",
    "description": "Oficina prática de desenvolvimento de jogos 2D utilizando o GameMaker, com foco nos fundamentos da lógica de programação aplicada à criação de jogos.\n\nA atividade abordará o desenvolvimento de mecânicas, personagens e fases, permitindo aos participantes aplicar os conhecimentos adquiridos na construção da primeira fase de um jogo.",
    "requirements": [
      "Atividade destinada a iniciantes e interessados em desenvolvimento de jogos, sem exigência de conhecimento prévio."
    ],
    "registrationStatus": "open",
    "registrationUrl": "https://forms.gle/JLT1qqLAFPNuwmUy6",
    "start": "19:00",
    "capacity": 30,
    "mode": "Presencial"
  },
  {
    "id": "pipeline-dados-tempo-real",
    "title": "Pipeline de Dados em Tempo Real: Do Zero ao Dashboard",
    "type": "Oficina",
    "date": "2026-10-27",
    "location": "Sala 16",
    "speaker": "Tiago Fernandes Moraes",
    "description": "Oficina prática sobre a construção de pipelines de processamento de dados em tempo real, utilizando Python para gerenciar fluxos de eventos e visualizar métricas continuamente.\n\nA partir de um cenário de e-commerce, os participantes irão simular transações de vendas, estruturar um fluxo de mensageria assíncrona com Python e desenvolver um dashboard interativo utilizando Streamlit e Plotly.\n\nA atividade abordará conceitos fundamentais de processamento de dados em fluxo (streaming), agregação de informações em tempo real e criação de painéis dinâmicos para apoiar a tomada de decisões.",
    "requirements": [
      "Conhecimentos básicos em lógica de programação e Python, incluindo estruturas condicionais, laços de repetição e funções simples."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/cqNfxjiGQfii2BjQ8",
    "start": "13:00",
    "capacity": 30,
    "subtitle": "Construindo arquiteturas de streaming de dados com Python, WebSockets e Streamlit",
    "mode": "Presencial"
  },
  {
    "id": "introducao-blender-3d",
    "title": "Introdução: Blender 3D",
    "type": "Oficina",
    "date": "2026-10-27",
    "location": "Sala 15",
    "speaker": "Caio Henrique de Almeida Magalhães",
    "description": "Oficina prática de introdução ao Blender, abordando as principais etapas do processo de criação de cenas tridimensionais.\n\nA atividade apresentará os conceitos básicos de modelagem e topologia, além de técnicas de iluminação, criação de materiais e renderização, acompanhando o processo criativo desde a construção dos objetos até a finalização da cena.",
    "requirements": [
      "São necessários apenas conhecimentos básicos de informática e familiaridade com o uso cotidiano do computador."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/6zfxeRuSGv3qx5Db9",
    "start": "13:00",
    "capacity": 20,
    "mode": "Presencial"
  },
  {
    "id": "ia-pc-ollama",
    "title": "Rodando Inteligência Artificial no seu PC com Ollama",
    "type": "Oficina",
    "date": "2026-10-27",
    "location": "Sala 5 (Laboratório de redes).",
    "speaker": "Gabriel Darosa",
    "description": "Oficina prática sobre a execução local de modelos de Inteligência Artificial utilizando o Ollama, ferramenta que permite rodar Grandes Modelos de Linguagem (Large Language Models - LLMs) diretamente no computador, de forma gratuita e sem depender de conexão com a internet durante sua utilização.\n\nA atividade abordará a instalação e execução de modelos de IA, permitindo aos participantes experimentar diferentes modelos, aprender a elaborar comandos eficientes e explorar possibilidades de integração dessa tecnologia em projetos de desenvolvimento.",
    "requirements": [
      "Nenhum."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/WrSY8bjHdyVj4Cwo8",
    "start": "13:00",
    "capacity": 15,
    "mode": "Presencial"
  },
  {
    "id": "ia-imagens-videos-gemini",
    "title": "IA Além do Chat: Guia Prático para Geração de Imagens e Vídeos com o Gemini",
    "type": "Oficina",
    "date": "2026-10-27",
    "location": "Sala 13",
    "speaker": "Rafaela Alves Magalhães e Felipe Antony Baquião Avelar",
    "description": "Oficina prática sobre o uso do Google Gemini, explorando funcionalidades de Inteligência Artificial que vão além da geração de textos.\n\nA atividade abordará técnicas de estruturação de prompts para geração de imagens e vídeos, além da utilização do Gemini Live para interação por voz com a IA e identificação de erros em códigos em tempo real.\n\nAo final, será realizado um mini-hackathon de prompts, no qual os participantes poderão colocar em prática os conhecimentos adquiridos durante a oficina.",
    "requirements": [
      "Nenhum."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/nA26oDZ34o2TLcL57",
    "start": "13:00",
    "capacity": 30,
    "mode": "Presencial"
  },
  {
    "id": "acervo-abreu",
    "capacity": null,
    "title": "Acervo Brasileiro de Referências sobre Eugenia (ABREU): o uso de ferramentas Google na construção de uma plataforma de divulgação científica",
    "type": "Palestra",
    "date": "2026-10-27",
    "location": "Auditório H",
    "speaker": "Prof. Dr. Guilherme Prado Roitberg (Coordenador), Alisson Gabriel Reis Carmo (bolsista), Nicoly Elisa de Oliveira Souza (bolsista).",
    "description": "Apresentação do projeto de extensão com interface em pesquisa Acervo Brasileiro de Referências sobre Eugenia, uma Plataforma Digital Educacional desenvolvida com ferramentas gratuitas do Google, como Google Sites, Google Docs, Google Meet, Google Analytics e Google Search Console.\n\nA palestra abordará a estrutura e o funcionamento do projeto, demonstrando como ferramentas digitais acessíveis podem ser utilizadas de forma integrada em iniciativas educacionais e de pesquisa.",
    "requirements": [
      "Nenhum."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/W5Encex3PbXMNz9N7",
    "mode": "Presencial",
    "start": "13:30"
  },
  {
    "id": "seguranca-informacao-pratica",
    "title": "Segurança da Informação na Prática: Aprenda, Identifique e Proteja-se",
    "type": "Oficina",
    "date": "2026-10-28",
    "location": "Sala 15",
    "speaker": "Rafaela Alves Magalhães e Nycollas Icrad Luz Machado",
    "description": "Oficina introdutória sobre Segurança da Informação e Cibersegurança, abordando conceitos fundamentais relacionados a ameaças digitais, engenharia social, golpes virtuais e medidas de proteção aplicáveis ao cotidiano.\n\nApós a apresentação teórica, será realizada uma atividade gamificada, na qual os participantes poderão testar seus conhecimentos e analisar situações práticas, aprendendo de forma interativa a reconhecer riscos e adotar comportamentos mais seguros no ambiente digital.",
    "requirements": [
      "Nenhum."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/znUXSJ36U5Ejm1HL9",
    "start": "13:00",
    "capacity": 30,
    "mode": "Presencial"
  },
  {
    "id": "computacao-quantica",
    "title": "Computação Quântica: Entendendo o contexto para inovar no futuro",
    "type": "Palestra",
    "date": "2026-10-28",
    "location": "Online",
    "speaker": "Daniele Tavares",
    "description": "Palestra introdutória sobre os fundamentos da Computação Quântica e suas relações com a Ciência da Computação, explorando as novas possibilidades dessa tecnologia para a resolução de problemas específicos.\n\nA atividade abordará os conhecimentos e as habilidades necessários para que profissionais da computação possam atuar no desenvolvimento de tecnologias quânticas, incluindo projeto de algoritmos, desenvolvimento de compiladores, ferramentas de software e arquiteturas de hardware.\n\nTambém serão discutidas as conexões entre a computação quântica, a Engenharia de Software e as infraestruturas de comunicação, destacando os desafios envolvidos na integração entre sistemas clássicos e quânticos.",
    "requirements": [
      "não"
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/tHazG5a34BtcZMrD6",
    "onlineUrl": "https://meet.google.com/qtj-gjbg-pao",
    "start": "19:30",
    "mode": "Online",
    "capacity": null
  },
  {
    "id": "futuro-engenharia-software-ia",
    "title": "Ainda precisamos aprender a programar? O futuro da Engenharia de Software na era da Inteligência Artificial",
    "type": "Palestra",
    "date": "2026-10-29",
    "location": "Online",
    "speaker": "Johnatan Alves de Oliveira",
    "description": "Palestra sobre as transformações no desenvolvimento de software com o avanço da Inteligência Artificial, abordando a evolução das ferramentas capazes de analisar projetos completos, executar testes e implementar funcionalidades.\n\nConduzida pelo Prof. Johnatan Oliveira, da Universidade Federal de Lavras (UFLA), a atividade apresentará, com base em estudos recentes, uma comparação entre o desenvolvimento de software antes e depois da popularização da IA. Serão discutidos o paradoxo da produtividade, os impactos na qualidade e segurança do código e os riscos de perda de habilidades técnicas decorrentes da dependência dessas ferramentas.\n\nA palestra também abordará as mudanças no mercado de trabalho e os desafios para o ensino de Engenharia de Software, incluindo as dificuldades de ingresso para profissionais iniciantes, as transformações nas carreiras e os questionamentos sobre o ensino e a avaliação de conteúdos como programação, requisitos e UML na era da IA.",
    "requirements": [
      "Nenhum."
    ],
    "registrationStatus": "closed",
    "registrationUrl": "https://forms.gle/nUNMxjPwkrkSie9J9",
    "onlineUrl": "https://meet.google.com/tii-zouj-eab",
    "start": "19:30",
    "mode": "Online",
    "capacity": null
  },
  {
    id: "desafio-programacao",
    title: "1ª CSP: Competição SEMINFO de Programação",
    subtitle: "Encerramento da SEMINFO",
    flag: "Encerramento",
    type: "Competição",
    date: "2026-10-29",
    start: "13:00",
    end: "17:00",
    location: "Prédio da Informática",
    mode: "Presencial",
    speaker: "Centro Acadêmico Alan Turing",
    description:
      "A CSP é uma competição de programação organizada pelo Centro Acadêmico Alan Turing como parte da SEMINFO. Haverá uma prova de 7 problemas para cada categoria, Técnico e Graduação.",
    requirements: [
      {
        text: "Exclusiva para estudantes do IFSULDEMINAS Campus Muzambinho dos cursos Técnico em Informática Integrado ou Subsequente, ou Ciência da Computação.",
        emphasize: ["Técnico em Informática Integrado ou Subsequente", "Ciência da Computação"],
      },
      {
        text: "Equipes de 1 a 3 estudantes da mesma categoria. Quem tiver equipe incompleta pode pedir para encontrar outros participantes no formulário.",
        emphasize: ["1 a 3 estudantes", "mesma categoria"],
      },
      {
        text: "Linguagens permitidas: C, C++, Java e Python.",
        emphasize: ["C, C++, Java e Python"],
      },
      {
        text: "Cada equipe usa um computador do campus, com o ambiente já preparado. Material impresso e conversa entre integrantes são permitidos; internet e dispositivos digitais pessoais não.",
        emphasize: ["computador do campus", "Material impresso e conversa entre integrantes são permitidos", "internet e dispositivos digitais pessoais não"],
      },
    ],
    capacity: "limited",
    registrationStatus: "closed",
    registrationDeadline: "23/10",
    registrationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSff7YKqdC8fUq1C8KE62aiX6vGsb_95-Q0P2dWu6BPmXj0Lxw/viewform?usp=dialog",
    registrationInstructions:
      "Inscrições encerradas em 23/10.",
    competitionSchedule: [
      { date: "2026-10-29", start: "13:00", end: "13:15", title: "Entrada e preparação nos laboratórios" },
      { date: "2026-10-29", start: "13:15", end: "15:30", title: "Prova" },
      { date: "2026-10-29", start: "15:30", end: "16:00", title: "Deslocamento ao Auditório H e coffee break" },
      { date: "2026-10-29", start: "16:00", end: "17:00", title: "Premiação da CSP e encerramento da SEMINFO" },
    ],
  },
];
