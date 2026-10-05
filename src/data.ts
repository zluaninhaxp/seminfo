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
  phase: "registration",
  demo: true,
};

export const days = [
  { date: "2026-10-26", label: "Segunda", short: "SEG", number: "26" },
  { date: "2026-10-27", label: "Terça", short: "TER", number: "27" },
  { date: "2026-10-28", label: "Quarta", short: "QUA", number: "28" },
  { date: "2026-10-29", label: "Quinta", short: "QUI", number: "29" },
];

// Exemplos fictícios: a comissão substituirá títulos, salas, responsáveis e horários.
// Não incluir URLs fictícias. Datas gerais do evento são confirmadas.
export const activities: Activity[] = [
  {
    id: "tecnologia-e-futuros",
    title: "Tecnologia e os futuros que queremos construir",
    type: "Palestra",
    date: "2026-10-26",
    start: "09:00",
    end: "10:30",
    location: "Auditório · local ilustrativo",
    mode: "Presencial",
    speaker: "Convidado a confirmar",
    description:
      "Exemplo de palestra sobre o impacto da informática nas comunidades e possibilidades de atuação em tecnologia.",
    requirements: [],
    capacity: null,
    registrationStatus: "open",
  },
  {
    id: "interfaces-na-pratica",
    title: "Interfaces web: da ideia à primeira página",
    type: "Oficina",
    date: "2026-10-26",
    start: "09:00",
    end: "12:00",
    location: "Laboratório 1 · local ilustrativo",
    mode: "Presencial",
    speaker: "Instrutor a confirmar",
    description:
      "Exemplo de oficina prática para explorar a estrutura de uma página e sua apresentação em diferentes tamanhos de tela.",
    requirements: [
      "Conhecimentos básicos de HTML e CSS",
      "Notebook, se disponível",
    ],
    capacity: 30,
    registrationStatus: "open",
  },
  {
    id: "dados-no-cotidiano",
    title: "Dados no cotidiano: perguntas antes dos gráficos",
    type: "Minicurso",
    date: "2026-10-26",
    start: "14:00",
    end: "17:00",
    location: "Laboratório 2 · local ilustrativo",
    mode: "Presencial",
    speaker: "Instrutor a confirmar",
    description:
      "Exemplo de minicurso sobre formular perguntas, organizar dados e comunicar resultados com clareza.",
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
    location: "Auditório · local ilustrativo",
    mode: "Presencial",
    speaker: "Participantes a confirmar",
    description:
      "Exemplo de conversa sobre formação, experiências de trabalho e caminhos para entrar na área.",
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
    location: "Laboratório 1 · local ilustrativo",
    mode: "Presencial",
    speaker: "Equipe a confirmar",
    description:
      "Exemplo de atividade que ocupa um único dia, com desafios colaborativos. Etapas e intervalos serão definidos na programação oficial.",
    requirements: ["Familiaridade com uma linguagem de programação"],
    capacity: 30,
    registrationStatus: "soon",
  },
  {
    id: "seguranca-aplicacoes",
    title: "Segurança de aplicações na prática",
    type: "Oficina",
    date: "2026-10-28",
    start: "09:00",
    end: "12:00",
    location: "Laboratório 2 · local ilustrativo",
    mode: "Presencial",
    speaker: "Instrutor a confirmar",
    description:
      "Exemplo de oficina sobre cuidados de segurança durante o desenvolvimento de aplicações.",
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
    location: "Online · plataforma a confirmar",
    mode: "Online",
    speaker: "Convidado a confirmar",
    description:
      "Exemplo de atividade online sobre colaboração e comunidades de software. O acesso será público quando o endereço oficial estiver disponível.",
    requirements: ["Conexão com a internet"],
    capacity: null,
    registrationStatus: "open",
  },
  {
    id: "acessibilidade-digital",
    title: "Acessibilidade digital começa nas escolhas",
    type: "Palestra",
    date: "2026-10-29",
    start: "09:00",
    end: "10:30",
    location: "Online · plataforma a confirmar",
    mode: "Online",
    speaker: "Convidado a confirmar",
    description:
      "Exemplo de palestra online sobre produtos digitais acessíveis e decisões de conteúdo, design e desenvolvimento.",
    requirements: ["Conexão com a internet"],
    capacity: null,
    registrationStatus: "open",
  },
  {
    id: "conexoes-encerramento",
    title: "Conexões para além da SEMINFO",
    type: "Encontro",
    date: "2026-10-29",
    start: "16:00",
    end: "17:00",
    location: "Auditório · local ilustrativo",
    mode: "Presencial",
    speaker: "Equipe a confirmar",
    description:
      "Exemplo de encontro de encerramento para compartilhar aprendizados e continuar as trocas depois do evento.",
    requirements: [],
    capacity: null,
    registrationStatus: "none",
  },
];
