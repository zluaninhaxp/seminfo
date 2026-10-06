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

// Atividades reais divulgadas para a XXI SEMINFO 2026.
export const activities: Activity[] = [
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
    registrationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSff7YKqdC8fUq1C8KE62aiX6vGsb_95-Q0P2dWu6BPmXj0Lxw/viewform?usp=dialog",
    registrationInstructions:
      "Inscrição gratuita por equipe até 23/10.",
    competitionSchedule: [
      { date: "2026-10-29", start: "13:00", end: "13:15", title: "Entrada e preparação nos laboratórios" },
      { date: "2026-10-29", start: "13:15", end: "15:30", title: "Prova" },
      { date: "2026-10-29", start: "15:30", end: "16:00", title: "Deslocamento ao auditório e coffee break" },
      { date: "2026-10-29", start: "16:00", title: "Premiação da CSP e encerramento da SEMINFO" },
    ],
  },
];
