export interface Activity {
  id: string;
  title: string;
  type: "Palestra" | "Oficina" | "Minicurso" | "Encontro";
  date: string;
  start: string;
  end: string;
  location: string;
  mode: "Presencial" | "Online";
  speaker: string;
  description: string;
  requirements: string[];
  capacity: number | null;
  registrationStatus: "open" | "closed" | "full" | "none" | "soon";
  registrationUrl?: string;
  onlineUrl?: string;
  cancelled?: boolean;
  notice?: string;
}

export const event: {
  phase: "registration" | "live" | "finished";
  demo: boolean;
} = {
  phase: "live",
  demo: true,
};

export const days = [
  { date: "2026-10-26", label: "Segunda", short: "SEG", number: "26" },
  { date: "2026-10-27", label: "Terça", short: "TER", number: "27" },
  { date: "2026-10-28", label: "Quarta", short: "QUA", number: "28" },
  { date: "2026-10-29", label: "Quinta", short: "QUI", number: "29" },
];

// Dados e links fictícios para prévia do modo durante o evento. A comissão
// deve substituir os exemplos antes da publicação. Datas do evento confirmadas.
export const activities: Activity[] = [
  {
    id: "tecnologia-e-futuros",
    title: "Tecnologia e os futuros que queremos construir",
    type: "Palestra",
    date: "2026-10-26",
    start: "09:00",
    end: "10:30",
    location: "Auditório Central",
    mode: "Presencial",
    speaker: "Marina Costa · nome fictício",
    description:
      "Demonstração fictícia de palestra sobre o impacto da informática nas comunidades e possibilidades de atuação em tecnologia.",
    requirements: [],
    capacity: null,
    registrationStatus: "open",
    registrationUrl: "https://example.com/seminfo/inscricao-palestra",
  },
  {
    id: "interfaces-na-pratica",
    title: "Interfaces web: da ideia à primeira página",
    type: "Oficina",
    date: "2026-10-26",
    start: "09:00",
    end: "12:00",
    location: "Laboratório de Informática 1",
    mode: "Presencial",
    speaker: "Rafael Mendes · instrutor fictício",
    description:
      "Oficina prática para criar uma página web responsiva, da estrutura HTML aos primeiros ajustes de CSS.",
    requirements: [
      "Conhecimentos básicos de HTML e CSS",
      "Notebook, se disponível",
    ],
    capacity: 30,
    registrationStatus: "open",
    registrationUrl: "https://example.com/seminfo/inscricao-interfaces",
  },
  {
    id: "dados-no-cotidiano",
    title: "Dados no cotidiano: perguntas antes dos gráficos",
    type: "Minicurso",
    date: "2026-10-26",
    start: "14:00",
    end: "17:00",
    location: "Laboratório de Informática 2",
    mode: "Presencial",
    speaker: "Camila Rocha · instrutora fictícia",
    description:
      "Minicurso para formular perguntas, organizar uma base simples e comunicar resultados em gráficos claros.",
    requirements: ["Noções básicas de planilhas"],
    capacity: 30,
    registrationStatus: "full",
  },
  {
    id: "primeiros-passos-carreira",
    title: "Primeiros passos na carreira em tecnologia",
    type: "Encontro",
    date: "2026-10-26",
    start: "14:00",
    end: "15:30",
    location: "Auditório Central",
    mode: "Presencial",
    speaker: "João Lima e Ana Souza · participantes fictícios",
    description:
      "Conversa sobre formação, primeiras experiências de trabalho e caminhos para entrar na área de tecnologia.",
    requirements: [],
    capacity: null,
    registrationStatus: "open",
  },
  {
    id: "desafio-programacao",
    title: "Um dia de desafios de programação",
    type: "Encontro",
    date: "2026-10-27",
    start: "09:00",
    end: "17:00",
    location: "Laboratório de Informática 1",
    mode: "Presencial",
    speaker: "Equipe de organização · demonstração",
    description:
      "Um dia de desafios colaborativos de programação, com etapas em equipes e pausas entre rodadas.",
    requirements: ["Familiaridade com uma linguagem de programação"],
    capacity: 30,
    registrationStatus: "open",
    registrationUrl: "https://example.com/seminfo/inscricao-desafio",
  },
  {
    id: "seguranca-aplicacoes",
    title: "Segurança de aplicações na prática",
    type: "Oficina",
    date: "2026-10-28",
    start: "09:00",
    end: "12:00",
    location: "Laboratório de Informática 2",
    mode: "Presencial",
    speaker: "Beatriz Nunes · instrutora fictícia",
    description:
      "Oficina de análise de riscos comuns e práticas para proteger aplicações desde o desenvolvimento.",
    requirements: ["Conhecimentos básicos de programação"],
    capacity: 30,
    registrationStatus: "closed",
  },
  {
    id: "comunidades-abertas",
    title: "Comunidades abertas, conhecimento compartilhado",
    type: "Palestra",
    date: "2026-10-28",
    start: "14:00",
    end: "15:30",
    location: "Online · transmissão de demonstração",
    mode: "Online",
    speaker: "Pedro Almeida · convidado fictício",
    description:
      "Palestra sobre colaboração em comunidades de software livre, participação e compartilhamento de conhecimento.",
    requirements: ["Conexão com a internet"],
    capacity: null,
    registrationStatus: "open",
    registrationUrl: "https://example.com/seminfo/inscricao-comunidades",
    onlineUrl: "https://example.com/seminfo/transmissao-comunidades",
  },
  {
    id: "acessibilidade-digital",
    title: "Acessibilidade digital começa nas escolhas",
    type: "Palestra",
    date: "2026-10-29",
    start: "09:00",
    end: "10:30",
    location: "Online · transmissão de demonstração",
    mode: "Online",
    speaker: "Luiza Ferreira · convidada fictícia",
    description:
      "Palestra sobre acessibilidade digital e decisões de conteúdo, design e desenvolvimento que ampliam o acesso.",
    requirements: ["Conexão com a internet"],
    capacity: null,
    registrationStatus: "open",
    registrationUrl: "https://example.com/seminfo/inscricao-acessibilidade",
    onlineUrl: "https://example.com/seminfo/transmissao-acessibilidade",
  },
  {
    id: "conexoes-encerramento",
    title: "Conexões para além da SEMINFO",
    type: "Encontro",
    date: "2026-10-29",
    start: "16:00",
    end: "17:00",
    location: "Auditório Central",
    mode: "Presencial",
    speaker: "Centro Acadêmico Alan Turing",
    description:
      "Encontro de encerramento para compartilhar aprendizados e combinar formas de manter as trocas depois do evento.",
    requirements: [],
    capacity: null,
    registrationStatus: "none",
  },
];
