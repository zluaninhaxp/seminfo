// Run with PLAYWRIGHT_MODULE pointing to a temporary Playwright installation.
// No browser-testing dependency is added to the application.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { mkdirSync, writeFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const output = 'output/screenshots';
const url = process.env.HERO_URL || 'http://127.0.0.1:5174';
mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  const results = [];
  try {
    for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1672]) {
      const context = await browser.newContext({ viewport: { width, height: width > 900 ? 941 : 844 }, isMobile: width < 600, hasTouch: width < 600 });
      const page = await context.newPage();
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1100);
      const layout = await page.evaluate(() => {
        const selectors = ['.hero-eyebrow', '.hero-headline', '.hero-official-mark', '.hero-primary', '.hero-secondary', '.hero-facts'];
        const rects = Object.fromEntries(selectors.map((selector) => {
          const element = document.querySelector(selector);
          const rect = element.getBoundingClientRect();
          return [selector, { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }];
        }));
        return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, rects, heroHeight: document.querySelector('.event-hero').offsetHeight, artFetched: performance.getEntriesByType('resource').some((r) => r.name.includes('compressed-1')) };
      });
      assert.ok(layout.documentWidth <= width, `Document overflows at ${width}`);
      for (const [selector, rect] of Object.entries(layout.rects)) {
        // The desktop image has intentional transparent padding outside its grid cell.
        assert.ok(rect.left >= -1 && rect.right <= width + 1, `${selector} exceeds viewport at ${width}`);
        assert.ok(rect.scrollWidth <= rect.clientWidth + 1, `${selector} text overflows at ${width}`);
      }
      assert.ok(layout.rects['.hero-primary'].height >= 48);
      assert.equal(await page.locator('.hero-official-mark').isVisible(), width > 760, `Hero logo visibility at ${width}`);
      assert.equal(await page.locator('.demo-notice').count(), 0, 'The demonstration notice should be removed');
      assert.equal(layout.artFetched, false, 'The 4.5 MB poster must not load for the hero');
      await page.screenshot({ path: `${output}/hero-${width}.png`, fullPage: width <= 430 });
      if (width <= 430) await page.screenshot({ path: `${output}/hero-${width}-viewport.png` });
      if (width === 1672) await page.screenshot({ path: `${output}/hero-desktop-full.png`, fullPage: true });
      for (const route of ['/sobre', '/atividades']) {
        await page.goto(`${url}/#${route}`);
        await page.waitForTimeout(950);
        assert.ok(await page.locator('.hero-headline').evaluate((el) => el.scrollWidth <= el.clientWidth + 1), `Route ${route} headline overflows at ${width}`);
      }
      results.push({ width, ...layout });
      await context.close();
    }

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url);
    await page.waitForTimeout(1000);
    const initial = await page.locator('.hero-scene').evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.move(1300, 240);
    await page.waitForTimeout(800);
    const moved = await page.locator('.hero-scene').evaluate((el) => getComputedStyle(el).transform);
    assert.notEqual(moved, initial, 'Desktop background should react to cursor');
    const matrix = moved.match(/matrix\((.+)\)/)[1].split(',').map(Number);
    assert.ok(Math.abs(matrix[4]) <= 4.1 && Math.abs(matrix[5]) <= 3.1, 'Pointer depth must stay subtle');
    await page.locator('.hero-primary').hover();
    await page.waitForTimeout(250);
    assert.notEqual(await page.locator('.hero-primary svg').evaluate((el) => getComputedStyle(el).transform), 'none');
    await page.mouse.move(20, 50);
    await page.mouse.wheel(0, 240);
    await page.waitForTimeout(500);
    assert.notEqual(await page.locator('.hero-scene').evaluate((el) => getComputedStyle(el).transform), initial);
    await page.screenshot({ path: `${output}/hero-scroll.png` });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('.hero-primary').click();
    await page.waitForTimeout(1000);
    assert.equal(await page.evaluate(() => location.hash), '', 'Programme CTA must keep the current route');
    assert.ok((await page.locator('.programme').boundingBox()).y >= 95, 'Sticky header must not cover the programme');
    assert.ok((await page.locator('.programme').boundingBox()).y < 160, 'Programme CTA must reach the section');
    await page.getByRole('button', { name: 'Terça, 27 de outubro' }).click();
    assert.equal(await page.getByRole('button', { name: 'Terça, 27 de outubro' }).getAttribute('aria-pressed'), 'true');
    await page.getByRole('searchbox').fill('zzzz-nothing');
    assert.ok(await page.locator('.empty').isVisible());
    await page.getByRole('searchbox').fill('');
    await page.locator('.activity-row h3 a').first().click();
    assert.ok((await page.evaluate(() => location.hash)).startsWith('#/atividade/'));
    assert.equal(await page.locator('.event-hero').count(), 0, 'Details must preserve their own view');
    await page.locator('.back-link').click();
    await page.waitForTimeout(100);
    await page.goto(`${url}/#/sobre`);
    await page.waitForTimeout(1000);
    assert.ok(await page.locator('.about-page').isVisible());
    await page.locator('.hero-secondary').click();
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => location.hash), '#/atividades');
    await page.locator('.hero-primary').click();
    assert.equal(await page.locator('input[type="checkbox"]').isChecked(), true, 'Registration CTA must preserve the open-only filter');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url);
    await page.waitForTimeout(150);
    const reduced = await page.evaluate(() => ({ animations: document.getAnimations().filter((a) => a.playState === 'running').length, transform: getComputedStyle(document.querySelector('.hero-scene')).transform, title: getComputedStyle(document.querySelector('.hero-headline')).opacity }));
    assert.equal(reduced.animations, 0);
    assert.equal(reduced.transform, 'none');
    assert.equal(reduced.title, '1');
    await page.screenshot({ path: `${output}/hero-reduced-motion.png` });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(200);
    await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(200);
    assert.equal(await page.locator('.event-hero').getAttribute('data-motion-active'), 'false');
    assert.equal(await page.locator('.hero-wave-drift-upper').evaluate((el) => getComputedStyle(el).animationPlayState), 'paused');

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.goto(url);
    await mobile.getByRole('button', { name: 'Menu', exact: true }).click();
    await mobile.locator('#navigation').getByRole('link', { name: 'Atividades', exact: true }).click();
    await mobile.waitForTimeout(200);
    assert.equal(await mobile.evaluate(() => location.hash), '#/atividades');
    assert.equal(await mobile.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
    assert.deepEqual(errors, []);
    writeFileSync(`${output}/hero-checks.json`, JSON.stringify({ results, reduced, errors, interactions: 'passed' }, null, 2));
    console.log(JSON.stringify({ viewports: results.map((r) => r.width), reducedMotion: 'passed', cursor: 'passed', scroll: 'passed', navigationAndFilters: 'passed', errors }, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
