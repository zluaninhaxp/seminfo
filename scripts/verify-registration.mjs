import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkRegistration, responderUrl } from '../server/registration.ts';

const form = 'https://docs.google.com/forms/d/test-form/edit';
const openForm = '<form action="https://docs.google.com/forms/d/e/public-id/formResponse" method="POST">';

test('checks the responder page without altering the original URL', async () => {
  assert.equal(responderUrl(form).href, form.replace('/edit', '/viewform'));
  const status = await checkRegistration(form, async (url, options) => {
    assert.equal(url.href, form.replace('/edit', '/viewform'));
    assert.equal(options.redirect, 'manual');
    return new Response(openForm);
  });
  assert.equal(status, 'open');
  assert.ok(form.endsWith('/edit'));
});

test('follows a short link to a public form', async () => {
  let requests = 0;
  assert.equal(await checkRegistration('https://forms.gle/example', async () => {
    requests++;
    return requests === 1
      ? new Response(null, { status: 302, headers: { location: form.replace('/edit', '/viewform') } })
      : new Response(openForm);
  }), 'open');
  assert.equal(requests, 2);
});

test('restricted and unpublished forms are coming soon', async () => {
  for (const status of [401, 403, 404, 410]) {
    assert.equal(await checkRegistration(form, async () => new Response('', { status })), 'soon');
  }
  assert.equal(await checkRegistration(form, async () => new Response(null, {
    status: 302, headers: { location: 'https://accounts.google.com/ServiceLogin' },
  })), 'soon');
});

test('recognizes closed response collection', async () => {
  assert.equal(await checkRegistration(form, async () => new Response('This form is no longer accepting responses.')), 'closed');
  assert.equal(await checkRegistration(form, async url => url.pathname.endsWith('/closedform')
    ? new Response('Closed')
    : new Response(null, { status: 302, headers: { location: '/forms/d/test-form/closedform' } })), 'closed');
});

test('errors and unrecognized pages never imply open or coming soon', async () => {
  assert.equal(await checkRegistration(form, async () => { throw new Error('Network unavailable'); }), 'unknown');
  for (const status of [429, 500, 503]) {
    assert.equal(await checkRegistration(form, async () => new Response('', { status })), 'unknown');
  }
  assert.equal(await checkRegistration(form, async () => new Response('HTTP 200 error page')), 'unknown');
});

test('does not follow redirects outside Google Forms or redirect loops', async () => {
  let requests = 0;
  assert.equal(await checkRegistration(form, async () => {
    requests++;
    return new Response(null, { status: 302, headers: { location: 'https://example.com' } });
  }), 'unknown');
  assert.equal(requests, 1);
  requests = 0;
  assert.equal(await checkRegistration(form, async () => {
    requests++;
    return new Response(null, { status: 302, headers: { location: form } });
  }), 'unknown');
  assert.equal(requests, 6);
});
