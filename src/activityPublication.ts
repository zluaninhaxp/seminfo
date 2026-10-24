import type { Activity } from "./data";

// All announcement times use Brasilia time (UTC-03:00).
export const activityPublicationAt: Record<string, number | null> = {
  abertura: Date.parse("2026-10-25T15:30:00-03:00"),
  "criacao-jogos-2d-tarde": 0,
  "criacao-jogos-2d-noite": 0,
  "futuro-engenharia-software-ia": 0,
  "ia-imagens-videos-gemini": 0,
  "acervo-abreu": 0,
  "ia-pc-ollama": 0,
  "computacao-quantica": 0,
  "introducao-blender-3d": 0,
  "desafio-programacao": 0,
  "troubleshooting-dados-mundo-real": Date.parse("2026-10-24T15:30:00-03:00"),
  "pipeline-dados-tempo-real": Date.parse("2026-10-24T19:30:00-03:00"),
  "seguranca-informacao-pratica": Date.parse("2026-10-25T10:00:00-03:00"),
};

export function isActivityPublished(activity: Pick<Activity, "id">, now: number): boolean {
  const publicationAt = activityPublicationAt[activity.id];
  return typeof publicationAt === "number" && now >= publicationAt;
}

export function nextActivityPublication(now: number): number | undefined {
  return Object.values(activityPublicationAt)
    .filter((time): time is number => typeof time === "number" && time > now)
    .sort((a, b) => a - b)[0];
}
