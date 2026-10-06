export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
  type: "Palestra" | "Oficina" | "Competição";
  date: string;
  start: string;
  end: string;
  location: string;
  mode: "Presencial" | "Online";
  speaker: string;
  description: string;
  requirements: (string | { text: string; emphasize: string[] })[];
  capacity?: number | null | "limited";
  registrationStatus: "open" | "closed" | "full" | "none" | "soon";
  registrationUrl?: string;
  registrationDeadline?: string;
  registrationInstructions?: string;
  onlineUrl?: string;
  competitionSchedule?: {
    date: string;
    start?: string;
    end?: string;
    title: string;
  }[];
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
    id: "desafio-programacao",
    title: "1ª CSP: Competição SEMINFO de Programação",
    subtitle: "Encerramento da SEMINFO",
    type: "Competição",
    date: "2026-10-29",
    start: "13:15",
    end: "15:30",
    location: "Prédio da Informática",
    mode: "Presencial",
    speaker: "Centro Acadêmico Alan Turing",
    description:
      "A CSP é uma competição de programação organizada pelo Centro Acadêmico Alan Turing como parte da SEMINFO. Haverá uma prova de 7 problemas para cada categoria, Técnico e Graduação. Não é necessária experiência em programação competitiva.",
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
    registrationStatus: "open",
    registrationDeadline: "23/10",
    registrationInstructions:
      "Inscrição gratuita por equipe até 23/10. Link do formulário a divulgar.",
    competitionSchedule: [
      { date: "2026-10-29", start: "13:00", end: "13:15", title: "Entrada e preparação nos laboratórios" },
      { date: "2026-10-29", start: "13:15", end: "15:30", title: "Prova" },
      { date: "2026-10-29", start: "15:30", end: "16:00", title: "Deslocamento ao auditório e coffee break" },
      { date: "2026-10-29", start: "16:00", title: "Premiação da CSP e encerramento da SEMINFO" },
    ],
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
];
