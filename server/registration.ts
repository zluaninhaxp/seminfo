import { activities } from '../src/data.ts';

export type RegistrationStatus = 'open' | 'soon' | 'closed' | 'unknown';

// Check only the event's own links. The CSP retains its existing configuration.
const checkedActivities = activities.filter(activity =>
  activity.id !== 'desafio-programacao' && !activity.registrationStatusLocked && activity.registrationUrl,
);

export function responderUrl(value: string) {
  const url = new URL(value);
  if (url.hostname === 'docs.google.com') {
    url.pathname = url.pathname.replace(/\/edit\/?$/, '/viewform');
  }
  url.search = '';
  url.hash = '';
  return url;
}

export async function checkRegistration(value: string, request = fetch): Promise<RegistrationStatus> {
  try {
    let url = responderUrl(value);
    const signal = AbortSignal.timeout(8000);
    for (let redirects = 0; redirects <= 5; redirects++) {
      if (url.protocol !== 'https:') return 'unknown';
      if (url.hostname === 'accounts.google.com') return 'soon';
      if (!['docs.google.com', 'forms.gle'].includes(url.hostname)) return 'unknown';
      const response = await request(url, {
        redirect: 'manual', signal,
        headers: { 'Accept-Language': 'en-US,en;q=0.9', Accept: 'text/html' },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) return 'unknown';
        url = new URL(location, url);
        continue;
      }
      if ([401, 403, 404, 410].includes(response.status)) return 'soon';
      if (!response.ok) return 'unknown';
      const html = await response.text();
      if (/\/closedform(?:[?"\s<]|$)/i.test(url.href) || /no longer accepting responses|not accepting responses|não (?:está |est[aã]o )?aceitando respostas/i.test(html)) return 'closed';
      if (/<form\b[^>]*\baction=["'][^"']*\/formResponse(?:[?"'])/i.test(html)) return 'open';
      // HTTP 200 alone can also be a login, unpublished, or error page.
      if (/accounts\.google\.com\/ServiceLogin|not published|hasn't been published|não foi publicado/i.test(html)) return 'soon';
      return 'unknown';
    }
  } catch {
    // A network failure is not evidence that a form is unpublished.
  }
  return 'unknown';
}

let cache: { expires: number; statuses: Record<string, RegistrationStatus> } | undefined;
let pending: Promise<Record<string, RegistrationStatus>> | undefined;

export function registrationStatuses() {
  if (cache && cache.expires > Date.now()) return Promise.resolve(cache.statuses);
  if (!pending) {
    pending = Promise.all(checkedActivities.map(async activity => [
      activity.id, await checkRegistration(activity.registrationUrl!),
    ] as const)).then(entries => {
      const statuses = Object.fromEntries(entries);
      cache = { expires: Date.now() + 60_000, statuses };
      return statuses;
    }).finally(() => { pending = undefined; });
  }
  return pending;
}
