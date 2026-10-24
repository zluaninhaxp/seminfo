import type { Activity } from "./data";

export const registrationReleaseAt = Date.parse("2026-10-25T15:30:00-03:00");
export const registrationReleaseNotice = "Inscrições disponíveis no domingo, 25/10, às 15h30 (horário de Brasília).";

export function scheduledRegistration(activity: Activity, released: boolean): Activity {
  if (released || activity.id === "desafio-programacao") return activity;
  return {
    ...activity,
    registrationStatus: "soon",
    registrationUrl: undefined,
    registrationDeadline: undefined,
    registrationInstructions: registrationReleaseNotice,
  };
}
