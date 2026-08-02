/**
 * Renders the built cards in a real browser against a stubbed `hass`.
 *
 * This exercises what unit tests cannot: that the timetable marks the lesson that is
 * really running, that a routine tick survives the round trip through the sensor, and
 * that the touch targets are big enough for the wall tablet.
 *
 * Run with `npm test` after `npm run build`.
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
const SHOTS = new URL('./screenshots/', import.meta.url).pathname;
const PORT = Number(process.env.SCHOOLDAY_TEST_PORT ?? 8765);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

await mkdir(SHOTS, { recursive: true });

const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  try {
    // The bundle is served from where the build writes it, so the test can never pass
    // against a stale copy.
    const file = path === '/schoolday-panel.js' ? BUNDLE : join(WWW, path);
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
};

// SCHOOLDAY_CHROMIUM lets a preinstalled browser be used; otherwise Playwright resolves
// whatever `npx playwright install chromium` put in place.
const browser = await chromium.launch({
  ...(process.env.SCHOOLDAY_CHROMIUM ? { executablePath: process.env.SCHOOLDAY_CHROMIUM } : {}),
  args: ['--no-sandbox'],
});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  timezoneId: 'Europe/Berlin',
  locale: 'de-DE',
});

const consoleErrors = [];
page.on('pageerror', (err) => consoleErrors.push(String(err)));
page.on('console', (msg) => {
  if (msg.type() !== 'error') return;
  const url = msg.location()?.url ?? '';
  // The harness page has no favicon; that 404 is not the card's problem.
  if (url.includes('favicon')) return;
  consoleErrors.push(`${msg.text()} ${url}`);
});

// Wednesday 5 August 2026, 09:15 — inside the second period, so "the lesson running
// now" is a fact rather than whatever the clock says when CI happens to run.
await page.clock.setFixedTime(new Date('2026-08-05T09:15:00+02:00'));

await page.goto(`http://localhost:${PORT}/`);
await page.waitForFunction(() => window.__ready === true);
await page.waitForFunction(() => customElements.get('schoolday-timetable-card') !== undefined);

// --------------------------------------------------------------- timetable card

await page.evaluate(() =>
  window.__mount({ type: 'custom:schoolday-timetable-card' }, 'schoolday-timetable-card'),
);
await page.waitForTimeout(400);

const ttChips = await page.locator('schoolday-timetable-card .chips .chip').allTextContents();
check(
  'only members with a timetable are offered',
  ttChips.map((c) => c.trim()).join(',') === 'Ben,Nik',
  ttChips.map((c) => c.trim()).join(','),
);

const ttHeads = await page.locator('schoolday-timetable-card .col-head').allTextContents();
check(
  'the week runs Monday to Friday when nobody has weekend lessons',
  ttHeads.length === 5 && /^Mo/.test(ttHeads[0].trim()) && /^Fr/.test(ttHeads[4].trim()),
  ttHeads.map((h) => h.trim()).join(' '),
);

const ttRows = await page.locator('schoolday-timetable-card .time').count();
check('periods nobody has are left out', ttRows === 6, `${ttRows} period rows`);

const ttBreaks = await page.locator('schoolday-timetable-card .break').allTextContents();
check(
  'breaks come from the gaps, and none dangles off the end',
  ttBreaks.length === 2 && /09:30–09:50/.test(ttBreaks[0]) && /11:20–11:30/.test(ttBreaks[1]),
  ttBreaks.map((b) => b.replace(/\s+/g, ' ').trim()).join(' | '),
);

const nowCells = await page.locator('schoolday-timetable-card .cell.now').count();
const nowSubject = await page
  .locator('schoolday-timetable-card .cell.now .subject')
  .textContent()
  .catch(() => null);
check(
  'the lesson running right now is the one marked',
  nowCells === 1 && nowSubject?.trim() === 'Sport',
  `${nowCells} marked, ${nowSubject?.trim()}`,
);

const todayHead = await page.locator('schoolday-timetable-card .col-head.today').textContent();
check('today is the column that is highlighted', /^Mi/.test(todayHead.trim()), todayHead.trim());

const status = await page.locator('schoolday-timetable-card .status').textContent();
check(
  'the status line names the running lesson and the time left',
  /Jetzt/.test(status) && /Sport/.test(status) && /Turnhalle/.test(status) && /15 min/.test(status),
  status.replace(/\s+/g, ' ').trim(),
);

const rooms = await page.locator('schoolday-timetable-card .room').allTextContents();
check(
  'rooms are shown under their subject',
  rooms.some((r) => r.trim() === '1.OG 5') && rooms.some((r) => r.trim() === 'Turnhalle'),
  rooms.map((r) => r.trim()).join(' | '),
);

const cellBox = await page.locator('schoolday-timetable-card .cell').first().boundingBox();
check('lesson cells are touch-sized', cellBox.height >= 44, `${Math.round(cellBox.height)}px tall`);

await page.screenshot({ path: join(SHOTS, 'timetable.png') });

// Switching member redraws for the other child, without touching the card config.
await page.locator('schoolday-timetable-card .chip', { hasText: 'Nik' }).click();
await page.waitForTimeout(300);
const nikTitle = await page.locator('schoolday-timetable-card .title').textContent();
const nikRows = await page.locator('schoolday-timetable-card .time').count();
check(
  "tapping a chip switches to that child's week",
  nikTitle.trim() === 'Nik' && nikRows === 2,
  `${nikTitle.trim()}, ${nikRows} period rows`,
);

// One day at a time, the way the card falls back on a phone.
await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'day' },
    'schoolday-timetable-card',
  ),
);
await page.waitForTimeout(400);

const dayHeads = await page.locator('schoolday-timetable-card .col-head').allTextContents();
const dayChips = await page.locator('schoolday-timetable-card .days .chip').count();
check(
  'day view opens on today and offers the other days',
  dayHeads.length === 1 && dayHeads[0].trim() === 'Mittwoch' && dayChips === 5,
  `${dayHeads.map((h) => h.trim()).join(',')} / ${dayChips} chips`,
);
check(
  'a single member is not offered as a switcher',
  (await page.locator('schoolday-timetable-card .chips .chip').count()) === 0,
);

await page.locator('schoolday-timetable-card .days .chip', { hasText: 'Mo' }).click();
await page.waitForTimeout(250);
const mondayCells = await page.locator('schoolday-timetable-card .cell .subject').allTextContents();
check(
  'picking a day shows that day',
  mondayCells.map((c) => c.trim()).join(',') === 'Deutsch,Mathe,Kunst,HSU,Deutsch',
  mondayCells.map((c) => c.trim()).join(','),
);
await page.screenshot({ path: join(SHOTS, 'timetable-day.png') });

// Every option off: nothing may disappear that the option did not name.
await page.evaluate(() =>
  window.__mount(
    {
      type: 'custom:schoolday-timetable-card',
      member: 'Ben',
      show_rooms: false,
      show_breaks: false,
      hide_empty_periods: false,
      highlight: false,
    },
    'schoolday-timetable-card',
  ),
);
await page.waitForTimeout(400);
const bare = await page.evaluate(() => {
  const root = document.querySelector('schoolday-timetable-card').shadowRoot;
  return {
    rooms: root.querySelectorAll('.room').length,
    breaks: root.querySelectorAll('.break').length,
    periods: root.querySelectorAll('.time').length,
    marked: root.querySelectorAll('.cell.now').length,
    today: root.querySelectorAll('.col-head.today').length,
    status: root.querySelectorAll('.status').length,
  };
});
check(
  'the options switch off exactly what they name',
  bare.rooms === 0 &&
    bare.breaks === 0 &&
    bare.periods === 7 &&
    bare.marked === 0 &&
    bare.today === 0 &&
    bare.status === 0,
  JSON.stringify(bare),
);

// A household that never configured a timetable gets guidance, not an empty card.
await page.evaluate(() => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement('schoolday-timetable-card');
  card.setConfig({ type: 'custom:schoolday-timetable-card' });
  const board = window.__hass.states['sensor.schoolday_board'];
  card.hass = {
    ...window.__hass,
    states: {
      ...window.__hass.states,
      'sensor.schoolday_board': {
        ...board,
        attributes: { ...board.attributes, timetable: { periods: [], breaks: [], subjects: {} } },
      },
    },
  };
  host.appendChild(card);
});
await page.waitForTimeout(300);
const ttNotice = await page.locator('schoolday-timetable-card .notice').textContent();
check(
  'a missing timetable explains where to add one',
  /Stundenzeiten/.test(ttNotice),
  ttNotice.trim().slice(0, 60),
);

// A holiday keeps the week on screen — it is still the plan — but nothing is running.
await page.evaluate(() => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement('schoolday-timetable-card');
  card.setConfig({ type: 'custom:schoolday-timetable-card', member: 'Ben' });
  const board = window.__hass.states['sensor.schoolday_board'];
  card.hass = {
    ...window.__hass,
    states: {
      ...window.__hass.states,
      'sensor.schoolday_board': {
        ...board,
        attributes: {
          ...board.attributes,
          school_today: false,
          no_school_reason: 'Sommerferien',
        },
      },
    },
  };
  host.appendChild(card);
});
await page.waitForTimeout(300);
const holiday = await page.evaluate(() => {
  const root = document.querySelector('schoolday-timetable-card').shadowRoot;
  return {
    status: root.querySelector('.status')?.textContent.replace(/\s+/g, ' ').trim(),
    marked: root.querySelectorAll('.cell.now').length,
    lessons: root.querySelectorAll('.cell .subject').length,
  };
});
check(
  'a holiday says so and marks nothing, without hiding the week',
  /Schulfrei/.test(holiday.status) &&
    /Sommerferien/.test(holiday.status) &&
    holiday.marked === 0 &&
    holiday.lessons > 0,
  JSON.stringify(holiday),
);

// ---------------------------------------------------------------- routines card

await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'morning' },
    'schoolday-routines-card',
  ),
);
await page.waitForTimeout(400);

const routinePeople = await page.locator('schoolday-routines-card .person-name').allTextContents();
check(
  'members with nothing on today are hidden',
  routinePeople.map((n) => n.trim()).join(',') === 'Ben,Nik',
  routinePeople.map((n) => n.trim()).join(','),
);

const progress = await page.locator('schoolday-routines-card .progress').allTextContents();
check(
  'progress counts already-completed steps',
  progress.map((p) => p.trim()).join(' ') === '0/2 1/2',
  progress.map((p) => p.trim()).join(' '),
);

const stepBox = await page.locator('schoolday-routines-card .step').first().boundingBox();
check('routine steps are touch-sized', stepBox.height >= 44, `${Math.round(stepBox.height)}px tall`);

const preTicked = await page.locator('schoolday-routines-card .step.done').count();
check('an already-done step renders ticked', preTicked === 1, `${preTicked} ticked`);

await page.locator('schoolday-routines-card .step', { hasText: 'Sportsachen einpacken' }).click();
await page.waitForTimeout(400);

const routineCall = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'set_routine_step').at(-1),
);
check(
  'tapping a step calls schoolday.set_routine_step',
  routineCall?.domain === 'schoolday' &&
    routineCall?.data?.member === 'm1' &&
    routineCall?.data?.block === 'morning' &&
    routineCall?.data?.step === 'Sportsachen einpacken' &&
    routineCall?.data?.done === true,
  JSON.stringify(routineCall?.data ?? null),
);

const benProgress = await page
  .locator('schoolday-routines-card .person', { hasText: 'Ben' })
  .locator('.progress')
  .textContent();
check('progress advances after ticking', benProgress.trim() === '1/2', benProgress.trim());

// Tapping a done step must put it back, not be a one-way trip.
await page.locator('schoolday-routines-card .step', { hasText: 'Sportsachen einpacken' }).click();
await page.waitForTimeout(400);
const untick = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'set_routine_step').at(-1),
);
const benAgain = await page
  .locator('schoolday-routines-card .person', { hasText: 'Ben' })
  .locator('.progress')
  .textContent();
check(
  'tapping again unticks the step',
  untick?.data?.done === false && benAgain.trim() === '0/2',
  `done=${untick?.data?.done} progress=${benAgain.trim()}`,
);

await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'both' },
    'schoolday-routines-card',
  ),
);
await page.waitForTimeout(300);
const blockCount = await page
  .locator('schoolday-routines-card .person', { hasText: 'Ben' })
  .locator('.block')
  .count();
check('block "both" shows morning and evening', blockCount === 2, `${blockCount} blocks`);
await page.screenshot({ path: join(SHOTS, 'routines.png') });

// ------------------------------------------------------------------ header card

await page.evaluate(() =>
  window.__mount(
    {
      type: 'custom:schoolday-header-card',
      weather_entity: 'weather.forecast_goldammerweg',
      greeting: 'Goldammerweg',
    },
    'schoolday-header-card',
  ),
);
await page.waitForTimeout(300);

const clock = await page.locator('schoolday-header-card .clock').textContent();
const headerDate = await page.locator('schoolday-header-card .date').textContent();
const temperature = await page.locator('schoolday-header-card .temperature').textContent();
check('header shows a 24h clock', clock.trim() === '09:15', clock.trim());
check(
  'header shows a German long date',
  /Mittwoch, 5\.\s*August\s*2026/.test(headerDate.trim()),
  headerDate.trim(),
);
check('header rounds the temperature', temperature.trim() === '23°C', temperature.trim());
await page.screenshot({ path: join(SHOTS, 'header.png') });

// -------------------------------------------------------------- translations

// The harness hass is German, so every card must speak German without configuration.
const germanStatus = await page.evaluate(async () => {
  window.__mount({ type: 'custom:schoolday-timetable-card' }, 'schoolday-timetable-card');
  await new Promise((r) => setTimeout(r, 300));
  return document.querySelector('schoolday-timetable-card').shadowRoot.textContent;
});
check(
  'cards follow the Home Assistant language',
  /Jetzt/.test(germanStatus) && /Pause/.test(germanStatus),
  germanStatus.replace(/\s+/g, ' ').trim().slice(0, 60),
);

const englishStatus = await page.evaluate(async () => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement('schoolday-timetable-card');
  card.setConfig({ type: 'custom:schoolday-timetable-card' });
  // Same data, English frontend.
  card.hass = {
    ...window.__hass,
    language: 'en',
    locale: { ...window.__hass.locale, language: 'en' },
  };
  host.appendChild(card);
  await new Promise((r) => setTimeout(r, 300));
  return card.shadowRoot.textContent;
});
check(
  'switching the Home Assistant language switches the cards',
  /Now/.test(englishStatus) && /Break/.test(englishStatus) && !/Jetzt/.test(englishStatus),
  englishStatus.replace(/\s+/g, ' ').trim().slice(0, 60),
);

const unknownLang = await page.evaluate(async () => {
  const el = document.createElement('schoolday-routines-card');
  el.setConfig({ type: 'custom:schoolday-routines-card' });
  el.hass = { ...window.__hass, language: 'fi', locale: { ...window.__hass.locale, language: 'fi' } };
  document.getElementById('host').appendChild(el);
  await new Promise((r) => setTimeout(r, 300));
  return el.shadowRoot.textContent;
});
check(
  'an unsupported language falls back to English, not to raw keys',
  !/^\s*$/.test(unknownLang) && !/board\.|routines\.|timetable\./.test(unknownLang),
  unknownLang.replace(/\s+/g, ' ').trim().slice(0, 60),
);

// ------------------------------------------------------------- card editors

const CARD_TYPES = [
  'schoolday-timetable-card',
  'schoolday-routines-card',
  'schoolday-header-card',
];

const editors = await page.evaluate(async (types) => {
  const out = [];
  for (const type of types) {
    const cls = customElements.get(type);
    const el = await cls.getConfigElement();
    out.push({
      type,
      tag: el.tagName.toLowerCase(),
      defined: customElements.get(el.tagName.toLowerCase()) !== undefined,
      stub: typeof cls.getStubConfig === 'function' ? cls.getStubConfig() : null,
    });
  }
  return out;
}, CARD_TYPES);
check(
  'every card offers a defined visual editor',
  editors.length === 3 && editors.every((e) => e.defined && e.tag === `${e.type}-editor`),
  editors.map((e) => `${e.tag}:${e.defined ? 'ok' : 'MISSING'}`).join(' '),
);
check(
  'every card ships a stub config for the card picker',
  editors.every((e) => e.stub && typeof e.stub === 'object'),
  editors.map((e) => JSON.stringify(e.stub)).join(' '),
);

// No editor may ask for the board sensor: the cards find it themselves, and only one
// can ever exist, so the field was a question with a single right answer — none.
const editorFields = await page.evaluate(async (types) => {
  const out = {};
  for (const type of types) {
    const el = await customElements.get(type).getConfigElement();
    el.hass = window.__hass;
    el.setConfig({ type: `custom:${type}` });
    document.getElementById('host').appendChild(el);
    await new Promise((r) => setTimeout(r, 100));
    out[type] = (el.shadowRoot.querySelector('ha-form')?.schema ?? []).map((item) => item.name);
  }
  return out;
}, CARD_TYPES);
check(
  'no editor asks for the board sensor',
  Object.values(editorFields).every((names) => !names.includes('board_entity')),
  JSON.stringify(editorFields),
);
check(
  'the timetable editor offers a member picker when there is a choice',
  editorFields['schoolday-timetable-card']?.[0] === 'member',
  (editorFields['schoolday-timetable-card'] ?? []).join(','),
);

// The editor publishes config-changed with the merged config, dropping cleared fields.
const editorEvent = await page.evaluate(async () => {
  const el = await customElements.get('schoolday-routines-card').getConfigElement();
  el.hass = window.__hass;
  el.setConfig({ type: 'custom:schoolday-routines-card', evening_from: 14, block: '' });
  document.getElementById('host').appendChild(el);
  await new Promise((r) => setTimeout(r, 200));
  return new Promise((resolve) => {
    el.addEventListener('config-changed', (ev) => resolve(ev.detail.config));
    el.shadowRoot
      .querySelector('ha-form')
      .dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: { evening_from: 16 } },
          bubbles: true,
          composed: true,
        }),
      );
  });
});
check(
  'the editor merges changes and drops emptied fields',
  editorEvent?.evening_from === 16 &&
    !('block' in editorEvent) &&
    editorEvent.type === 'custom:schoolday-routines-card',
  JSON.stringify(editorEvent),
);

// --------------------------------------------------------------- card registry

const registered = await page.evaluate(() => window.customCards.map((c) => c.type).sort());
check(
  'every card registers itself in the picker',
  registered.join(',') === 'schoolday-header-card,schoolday-routines-card,schoolday-timetable-card',
  registered.join(','),
);

check('no uncaught page errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();
server.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
