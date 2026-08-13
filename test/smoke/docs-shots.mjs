/**
 * Renders every card, in every state worth seeing, into docs/images/.
 *
 * Against the same stubbed hass the smoke suite uses, at the same frozen moment — so
 * the pictures in the manual show the same Wednesday, the same running lesson and the
 * same three children as the tests, and cannot drift into showing something the cards
 * no longer do. Regenerate with `npm run shots` after `npm run build`.
 */
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const WWW = new URL('./www/', import.meta.url).pathname;
const BUNDLE = new URL(
  '../../custom_components/schoolday/frontend/schoolday-panel.js',
  import.meta.url,
).pathname;
const OUT = new URL('../../docs/images/', import.meta.url).pathname;
const PORT = Number(process.env.SCHOOLDAY_SHOTS_PORT ?? 8766);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

await mkdir(OUT, { recursive: true });

const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  if (path.startsWith('/api/image/serve/')) {
    res.writeHead(200, { 'Content-Type': 'image/png' }).end(PIXEL);
    return;
  }
  try {
    const file = path === '/schoolday-panel.js' ? BUNDLE : join(WWW, path);
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({
  ...(process.env.SCHOOLDAY_CHROMIUM ? { executablePath: process.env.SCHOOLDAY_CHROMIUM } : {}),
  args: ['--no-sandbox'],
});

const made = [];

/**
 * Render one card at one width and save it, trimmed to the card itself.
 *
 * `maxHeight` caps a section that is simply a long list — the materials editor has one
 * box per subject and would otherwise be a four-thousand-pixel strip that shows nothing
 * the first three boxes do not.
 */
async function shot(name, width, setup, maxHeight) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    timezoneId: 'Europe/Berlin',
    locale: 'de-DE',
    deviceScaleFactor: 2,
  });
  await page.clock.setFixedTime(new Date('2026-08-05T09:15:00+02:00'));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForFunction(() => window.__ready === true);
  const tag = await setup(page);
  await page.waitForTimeout(500);
  const target = page.locator(tag);
  if (maxHeight) {
    const box = await target.boundingBox();
    await page.screenshot({
      path: join(OUT, `${name}.png`),
      clip: { ...box, height: Math.min(box.height, maxHeight) },
    });
  } else {
    await target.screenshot({ path: join(OUT, `${name}.png`) });
  }
  await page.close();
  made.push(name);
  console.log('  ', name);
}

/** Lay closures or per-date changes over Ben's outlook, the way the integration would. */
const withOutlook = (config, closures) => async (page) => {
  await page.evaluate(
    ({ config, closures }) => {
      const host = document.getElementById('host');
      host.innerHTML = '';
      const card = document.createElement('schoolday-timetable-card');
      card.setConfig(config);
      const sensor = Object.values(window.__hass.states).find(
        (s) => s.attributes?.friendly_name === 'Schoolday Ben',
      );
      const outlook = sensor.attributes.outlook.map((day) =>
        closures[day.date] ? { ...day, ...closures[day.date] } : { ...day },
      );
      card.hass = {
        ...window.__hass,
        states: {
          ...window.__hass.states,
          [sensor.entity_id]: { ...sensor, attributes: { ...sensor.attributes, outlook } },
        },
      };
      host.appendChild(card);
    },
    { config, closures },
  );
  return 'schoolday-timetable-card';
};

const mount = (config, tag) => async (page) => {
  await page.evaluate(({ config, tag }) => window.__mount(config, tag), { config, tag });
  return tag;
};

console.log('Rendering:');

// --- timetable ---------------------------------------------------------------
await shot('timetable-week', 1100, mount(
  { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' },
  'schoolday-timetable-card',
));

await shot('timetable-day', 420, mount(
  { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'day' },
  'schoolday-timetable-card',
));

await shot('timetable-holidays', 1100, withOutlook(
  { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' },
  {
    '2026-08-10': { mode: 'free', label: 'Sommerferien Bayern' },
    '2026-08-11': { mode: 'free', label: 'Sommerferien Bayern' },
    '2026-08-06': { mode: 'care', label: 'Ben Ferienbetreuung' },
  },
));

await shot('timetable-exceptions', 1100, withOutlook(
  { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' },
  {
    '2026-08-06': { changes: { 2: { subject: 'Vertretung', room: 'R2' }, 3: null } },
    '2026-08-07': { mode: 'event', label: 'Wandertag' },
  },
));

await shot('timetable-sick', 1100, withOutlook(
  { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' },
  { '2026-08-05': { mode: 'sick', label: null } },
));

await shot('timetable-cycle', 1100, async (page) => {
  await page.evaluate(() => {
    window.__setCycle(2);
    window.__mount(
      { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' },
      'schoolday-timetable-card',
    );
  });
  return 'schoolday-timetable-card';
});

// --- routines, homework, header ----------------------------------------------
await shot('routines', 1100, mount(
  { type: 'custom:schoolday-routines-card', block: 'both', show_empty: true },
  'schoolday-routines-card',
));

await shot('routines-sick', 1100, async (page) => {
  await page.evaluate(() => {
    window.__mount({ type: 'custom:schoolday-routines-card', block: 'morning' },
      'schoolday-routines-card');
    window.__setSick('m3', true);
  });
  return 'schoolday-routines-card';
});

await shot('stats', 1100, mount(
  { type: 'custom:schoolday-stats-card' },
  'schoolday-stats-card',
));

await shot('homework', 1100, mount(
  { type: 'custom:schoolday-homework-card', show_empty: true },
  'schoolday-homework-card',
));

await shot('header', 1100, mount(
  {
    type: 'custom:schoolday-header-card',
    weather_entity: 'weather.forecast_goldammerweg',
    greeting: 'Goldammerweg',
  },
  'schoolday-header-card',
));

// --- admin card, one picture per section --------------------------------------
const adminSection = (label) => async (page) => {
  await page.evaluate(() => window.__mount({ type: 'custom:schoolday-admin-card' }, 'schoolday-admin-card'));
  await page.waitForTimeout(300);
  await page.evaluate((label) => {
    const root = document.querySelector('schoolday-admin-card').shadowRoot;
    [...root.querySelectorAll('.tab')].find((t) => t.textContent.trim() === label)?.click();
  }, label);
  return 'schoolday-admin-card';
};

for (const [name, label, cap] of [
  ['admin-timetable', 'Stundenplan', 0],
  ['admin-routines', 'Routinen', 0],
  ['admin-family', 'Familie', 620],
  ['admin-materials', 'Material', 620],
  ['admin-exceptions', 'Ausnahmen', 0],
  ['admin-holidays', 'Freie Tage', 0],
]) {
  await shot(name, 900, adminSection(label), cap);
}

await browser.close();
server.close();
console.log(`\n${made.length} Bilder in docs/images/`);
