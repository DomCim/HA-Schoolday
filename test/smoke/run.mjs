/**
 * Renders the built cards in a real browser against a stubbed `hass`.
 *
 * This exercises what unit tests cannot: that events land on the right day, that the
 * exclusive end of an all-day event is honoured, that dashboard churn does not trigger
 * refetches, and that the touch targets are actually big enough.
 *
 * Run with `npm test` after `npm run build`.
 */
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const WWW = new URL('./www/', import.meta.url).pathname;
const BUNDLE = new URL(
  '../../custom_components/hearth/frontend/hearth-panel.js',
  import.meta.url,
).pathname;
const SHOTS = new URL('./screenshots/', import.meta.url).pathname;
const PORT = Number(process.env.HEARTH_TEST_PORT ?? 8765);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

await mkdir(SHOTS, { recursive: true });

const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  try {
    // The bundle is served from where the build writes it, so the test can never pass
    // against a stale copy.
    const file = path === '/hearth-panel.js' ? BUNDLE : join(WWW, path);
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

// HEARTH_CHROMIUM lets a preinstalled browser be used; otherwise Playwright resolves
// whatever `npx playwright install chromium` put in place.
const browser = await chromium.launch({
  ...(process.env.HEARTH_CHROMIUM ? { executablePath: process.env.HEARTH_CHROMIUM } : {}),
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

const setAllDay = async (want) => {
  const toggle = page.locator('hearth-event-dialog #allday');
  const is = (await toggle.getAttribute('aria-checked')) === 'true';
  if (is !== want) await toggle.click();
};

await page.goto(`http://localhost:${PORT}/`);
await page.waitForFunction(() => window.__ready === true);
await page.waitForFunction(() => customElements.get('hearth-calendar-card') !== undefined);

// ---------------------------------------------------------------- month view

await page.evaluate(() => window.__mount({ type: 'custom:hearth-calendar-card' }));
await page.evaluate(() => window.__setAnchor('2026-08-01T00:00:00'));
await page.waitForTimeout(400);

const cellCount = await page.locator('hearth-calendar-card .day-cell').count();
check('month grid renders 6 weeks (42 cells)', cellCount === 42, `got ${cellCount}`);

const weekdays = await page.locator('hearth-calendar-card .weekday').allTextContents();
check(
  'week starts on Monday per locale',
  weekdays[0]?.trim().startsWith('Mo'),
  weekdays.map((w) => w.trim()).join(' '),
);

// Text content of the in-month cell whose day number is N.
const cellText = async (dayNumber) =>
  page.evaluate((day) => {
    const card = document.querySelector('hearth-calendar-card');
    const cells = [...card.shadowRoot.querySelectorAll('.day-cell')];
    const cell = cells.find(
      (c) =>
        !c.classList.contains('outside') &&
        c.querySelector('.day-number')?.textContent.trim() === String(day),
    );
    return cell ? cell.textContent.replace(/\s+/g, ' ').trim() : null;
  }, dayNumber);

const day5 = await cellText(5);
check('timed events land on their day', /Zahnarzt/.test(day5) && /Training/.test(day5), day5);
check('timed events show a 24h time', /14:30/.test(day5) && /18:00/.test(day5), day5);

const day8 = await cellText(8);
check('all-day event lands on its single day', /Ben Dill/.test(day8), day8);

const day9 = await cellText(9);
check('all-day event does not spill past its exclusive end', !/Ben Dill/.test(day9), day9);

const multi = await Promise.all([12, 13, 14, 15].map(cellText));
check(
  'multi-day event covers 12-14 but not 15',
  /Urlaub/.test(multi[0]) && /Urlaub/.test(multi[1]) && /Urlaub/.test(multi[2]) && !/Urlaub/.test(multi[3]),
  multi.map((t, i) => `${12 + i}:${/Urlaub/.test(t) ? 'yes' : 'no'}`).join(' '),
);

check('read-only holiday calendar is displayed', /Himmelfahrt/.test(multi[3]), multi[3]);

const apiPaths = await page.evaluate(() => window.__calls.api.map((c) => c.path));
const fetched = new Set(apiPaths.map((p) => p.split('?')[0]));
check(
  'every configured calendar is fetched exactly once per range',
  fetched.size === 5 && apiPaths.length === 5,
  `${apiPaths.length} calls, ${fetched.size} distinct`,
);

const rangeOk = await page.evaluate(() => {
  const url = new URL(`http://x/${window.__calls.api[0].path}`);
  return { start: url.searchParams.get('start'), end: url.searchParams.get('end') };
});
const localDay = (iso) =>
  new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });
check(
  'fetch range covers the padded month grid',
  localDay(rangeOk.start) === '2026-07-27' && localDay(rangeOk.end) === '2026-09-07',
  `${localDay(rangeOk.start)} → ${localDay(rangeOk.end)} (6 weeks from the Monday before 1 Aug)`,
);

await page.screenshot({ path: join(SHOTS, 'month.png') });

// -------------------------------------------------------- no redundant refetch

await page.evaluate(() => {
  window.__calls.api.length = 0;
  // Simulate the constant hass churn a real dashboard produces.
  for (let i = 0; i < 20; i += 1) {
    window.__card.hass = { ...window.__hass, states: { ...window.__hass.states } };
  }
});
await page.waitForTimeout(300);
const churnCalls = await page.evaluate(() => window.__calls.api.length);
check('unrelated hass updates do not refetch', churnCalls === 0, `${churnCalls} calls`);

// ----------------------------------------------------------------- create flow

await page.evaluate(() => {
  const card = document.querySelector('hearth-calendar-card');
  const cells = [...card.shadowRoot.querySelectorAll('.day-cell')];
  const cell = cells.find(
    (c) => !c.classList.contains('outside') && c.querySelector('.day-number')?.textContent.trim() === '20',
  );
  cell.click();
});
await page.waitForTimeout(300);

const dialogVisible = await page.locator('hearth-event-dialog .sheet').count();
check('tapping a day opens the create sheet', dialogVisible === 1, `${dialogVisible} sheets`);

await setAllDay(false);
await page.locator('hearth-event-dialog input#summary').fill('Elternabend Klasse 7b');
await page.waitForTimeout(150);
const toggleBox = await page.locator('hearth-event-dialog #allday').boundingBox();
check(
  'all-day toggle is a full-width touch target',
  toggleBox.height >= 44 && toggleBox.width > 300,
  `${Math.round(toggleBox.width)}x${Math.round(toggleBox.height)}px`,
);
await page.screenshot({ path: join(SHOTS, 'dialog.png') });
await setAllDay(true);
await page.locator('hearth-event-dialog input#summary').fill('');
await page.waitForTimeout(100);
const calendarOptions = await page.locator('hearth-event-dialog select#calendar option').allTextContents();
check(
  'read-only calendars are excluded from the picker',
  calendarOptions.length === 4 && !calendarOptions.some((o) => /Deutschland/.test(o)),
  calendarOptions.map((o) => o.trim()).join(' | '),
);

await page.locator('hearth-event-dialog input#summary').fill('Elternabend');
await page.locator('hearth-event-dialog button.primary').click();
await page.waitForTimeout(300);

const created = await page.evaluate(() => window.__calls.services.at(-1));
check(
  'saving calls calendar.create_event',
  created?.domain === 'calendar' && created?.service === 'create_event',
  JSON.stringify(created?.data ?? null),
);
check(
  'all-day event uses exclusive end_date',
  created?.data?.start_date === '2026-08-20' && created?.data?.end_date === '2026-08-21',
  `${created?.data?.start_date} → ${created?.data?.end_date}`,
);
const sheetGone = await page.locator('hearth-event-dialog .sheet').count();
check('sheet closes after saving', sheetGone === 0, `${sheetGone} sheets`);

// -------------------------------------------------------- timed create variant

await page.evaluate(() => {
  const card = document.querySelector('hearth-calendar-card');
  const cells = [...card.shadowRoot.querySelectorAll('.day-cell')];
  cells
    .find((c) => !c.classList.contains('outside') && c.querySelector('.day-number')?.textContent.trim() === '21')
    .click();
});
await page.waitForTimeout(250);
await page.locator('hearth-event-dialog input#summary').fill('Zahnarzt Nik');
await setAllDay(false);
await page.waitForTimeout(150);
await page.locator('hearth-event-dialog input#from').fill('14:00');
await page.locator('hearth-event-dialog input#to').fill('15:30');
await page.locator('hearth-event-dialog button.primary').click();
await page.waitForTimeout(300);

const timed = await page.evaluate(() => window.__calls.services.at(-1));
check(
  'timed event sends local start/end datetimes',
  timed?.data?.start_date_time === '2026-08-21 14:00:00' &&
    timed?.data?.end_date_time === '2026-08-21 15:30:00',
  `${timed?.data?.start_date_time} → ${timed?.data?.end_date_time}`,
);

// ------------------------------------------------------------ week / day views

await page.evaluate(() => {
  const card = document.querySelector('hearth-calendar-card');
  [...card.shadowRoot.querySelectorAll('.segmented button')][1].click();
});
await page.waitForTimeout(400);
const weekCols = await page.locator('hearth-calendar-card .week-column').count();
check('week view renders 7 columns', weekCols === 7, `got ${weekCols}`);
await page.screenshot({ path: join(SHOTS, 'week.png') });

await page.evaluate(() => {
  const card = document.querySelector('hearth-calendar-card');
  [...card.shadowRoot.querySelectorAll('.segmented button')][2].click();
  window.__setAnchor('2026-08-05T00:00:00');
});
await page.waitForTimeout(400);
const dayText = await page.locator('hearth-calendar-card .day-list').textContent();
check(
  'day view lists that day\'s events with location',
  /Zahnarzt/.test(dayText) && /Training/.test(dayText) && /Sporthalle/.test(dayText),
  dayText.replace(/\s+/g, ' ').trim().slice(0, 120),
);
await page.screenshot({ path: join(SHOTS, 'day.png') });

// ------------------------------------------------------ one broken calendar

await page.evaluate(() => {
  window.__failCalendars.add('calendar.jan');
  const card = document.querySelector('hearth-calendar-card');
  [...card.shadowRoot.querySelectorAll('.segmented button')][0].click();
  card._reloadToken += 1;
  card.requestUpdate();
});
await page.waitForTimeout(500);
const warning = await page.locator('hearth-calendar-card .warning').textContent().catch(() => null);
const stillRenders = await page.locator('hearth-calendar-card .day-cell').count();
check(
  'a failing calendar warns without blanking the board',
  warning?.includes('calendar.jan') && stillRenders === 42,
  `${(warning ?? 'no warning').trim()} / ${stillRenders} cells`,
);

// ------------------------------------------------------------- no board case

await page.evaluate(() => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement('hearth-calendar-card');
  card.setConfig({ type: 'custom:hearth-calendar-card' });
  card.hass = { ...window.__hass, states: {} };
  host.appendChild(card);
});
await page.waitForTimeout(250);
const notice = await page.locator('hearth-calendar-card .notice').textContent();
check(
  'missing board shows guidance instead of crashing',
  /Kein Hearth-Board gefunden/.test(notice),
  notice.trim().slice(0, 60),
);

// ------------------------------------------------------------------- lists card

await page.evaluate(() =>
  window.__mount(
    { type: 'custom:hearth-lists-card', entities: ['todo.kaufland', 'todo.dm'] },
    'hearth-lists-card',
  ),
);
await page.waitForTimeout(400);

const listNames = await page.locator('hearth-lists-card .list-name').allTextContents();
check('lists card renders each configured list', listNames.length === 2, listNames.join(' | '));

const kauflandItems = await page
  .locator('hearth-lists-card .list', { hasText: 'Kaufland' })
  .locator('.item-text')
  .allTextContents();
check(
  'open items are listed',
  kauflandItems.join(',') === 'Milch,Brot,Kaffee',
  kauflandItems.join(','),
);

const itemBox = await page.locator('hearth-lists-card .item').first().boundingBox();
check('list items are touch-sized', itemBox.height >= 44, `${Math.round(itemBox.height)}px tall`);

await page.locator('hearth-lists-card .item', { hasText: 'Brot' }).click();
await page.waitForTimeout(400);
const ticked = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'update_item').at(-1),
);
check(
  'tapping an item completes it',
  ticked?.domain === 'todo' && ticked?.data?.item === 'k2' && ticked?.data?.status === 'completed',
  JSON.stringify(ticked?.data ?? null),
);

const remaining = await page
  .locator('hearth-lists-card .list', { hasText: 'Kaufland' })
  .locator('.item-text')
  .allTextContents();
check(
  'completed item drops off the open list after refresh',
  !remaining.includes('Brot') && remaining.length === 2,
  remaining.join(','),
);

await page.evaluate(() => {
  window.__failLists.add('todo.dm');
  window.__card._reloadToken += 1;
  window.__card.requestUpdate();
});
await page.waitForTimeout(400);
const listWarning = await page
  .locator('hearth-lists-card .list', { hasText: 'DM' })
  .locator('.warning')
  .textContent()
  .catch(() => null);
check(
  'an unreachable list says so without breaking its neighbours',
  /Gerade nicht erreichbar/.test(listWarning ?? '') &&
    (await page.locator('hearth-lists-card .list').count()) === 2,
  (listWarning ?? 'no warning').trim(),
);
await page.screenshot({ path: join(SHOTS, 'lists.png') });

// ------------------------------------------------------------------ people card

await page.evaluate(() => window.__mount({ type: 'custom:hearth-people-card' }, 'hearth-people-card'));
await page.waitForTimeout(500);

const peopleNames = await page.locator('hearth-people-card .name').allTextContents();
check(
  'people card shows every member in order',
  peopleNames.map((n) => n.trim()).join(',') === 'Ben,Jan,Nik',
  peopleNames.map((n) => n.trim()).join(','),
);

const benChips = await page
  .locator('hearth-people-card .person', { hasText: 'Ben' })
  .locator('.chip')
  .allTextContents();
check(
  'presence, open tasks and points are shown',
  benChips.some((c) => /Zuhause/.test(c)) &&
    benChips.some((c) => /\b1\b/.test(c)) &&
    benChips.some((c) => /42/.test(c)),
  benChips.map((c) => c.trim()).join(' | '),
);

const nikChips = await page
  .locator('hearth-people-card .person', { hasText: 'Nik' })
  .locator('.chip')
  .allTextContents();
check(
  'a zone name is preferred over a bare "away"',
  nikChips.some((c) => /School/.test(c)),
  nikChips.map((c) => c.trim()).join(' | '),
);

const awayCount = await page.locator('hearth-people-card .avatar.away').count();
check('members who are out are dimmed', awayCount === 2, `${awayCount} dimmed`);

// Only today's events belong on this card, and only under their own member.
const nikToday = await page
  .locator('hearth-people-card .person', { hasText: 'Nik' })
  .textContent();
const benToday = await page
  .locator('hearth-people-card .person', { hasText: 'Ben' })
  .textContent();
check(
  "today's events appear under the member who owns them",
  /Klavierstunde/.test(nikToday) && !/Klavierstunde/.test(benToday),
  nikToday.replace(/\s+/g, ' ').trim(),
);
await page.screenshot({ path: join(SHOTS, 'people.png') });

// ------------------------------------------------------------------ agenda card

await page.evaluate(() =>
  window.__mount({ type: 'custom:hearth-agenda-card', days: 3 }, 'hearth-agenda-card'),
);
await page.waitForTimeout(500);

const dayLabels = await page.locator('hearth-agenda-card .day-label').allTextContents();
check(
  'agenda names today and tomorrow relatively',
  dayLabels.length === 3 && /heute/i.test(dayLabels[0]) && /morgen/i.test(dayLabels[1]),
  dayLabels.map((l) => l.trim()).join(' | '),
);
await page.screenshot({ path: join(SHOTS, 'agenda.png') });

// ------------------------------------------------------------------ header card

await page.evaluate(() =>
  window.__mount(
    {
      type: 'custom:hearth-header-card',
      weather_entity: 'weather.forecast_goldammerweg',
      greeting: 'Goldammerweg',
    },
    'hearth-header-card',
  ),
);
await page.waitForTimeout(300);

const clock = await page.locator('hearth-header-card .clock').textContent();
const headerDate = await page.locator('hearth-header-card .date').textContent();
const temperature = await page.locator('hearth-header-card .temperature').textContent();
check('header shows a 24h clock', /^\d{2}:\d{2}$/.test(clock.trim()), clock.trim());
check('header shows a German long date', /\d{1,2}\.\s*\w+\s*2026/.test(headerDate.trim()), headerDate.trim());
check('header rounds the temperature', temperature.trim() === '23°C', temperature.trim());
await page.screenshot({ path: join(SHOTS, 'header.png') });

// ---------------------------------------------------------------- routines card

await page.evaluate(() =>
  window.__mount({ type: 'custom:hearth-routines-card', block: 'morning' }, 'hearth-routines-card'),
);
await page.waitForTimeout(400);

const routinePeople = await page.locator('hearth-routines-card .person-name').allTextContents();
check(
  'members with nothing on today are hidden',
  routinePeople.map((n) => n.trim()).join(',') === 'Ben,Nik',
  routinePeople.map((n) => n.trim()).join(','),
);

const progress = await page.locator('hearth-routines-card .progress').allTextContents();
check(
  'progress counts already-completed steps',
  progress.map((p) => p.trim()).join(' ') === '0/2 1/2',
  progress.map((p) => p.trim()).join(' '),
);

const stepBox = await page.locator('hearth-routines-card .step').first().boundingBox();
check('routine steps are touch-sized', stepBox.height >= 44, `${Math.round(stepBox.height)}px tall`);

const preTicked = await page.locator('hearth-routines-card .step.done').count();
check('an already-done step renders ticked', preTicked === 1, `${preTicked} ticked`);

await page.locator('hearth-routines-card .step', { hasText: 'Sportsachen einpacken' }).click();
await page.waitForTimeout(400);

const routineCall = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'set_routine_step').at(-1),
);
check(
  'tapping a step calls hearth.set_routine_step',
  routineCall?.domain === 'hearth' &&
    routineCall?.data?.member === 'm1' &&
    routineCall?.data?.block === 'morning' &&
    routineCall?.data?.step === 'Sportsachen einpacken' &&
    routineCall?.data?.done === true,
  JSON.stringify(routineCall?.data ?? null),
);

const benProgress = await page
  .locator('hearth-routines-card .person', { hasText: 'Ben' })
  .locator('.progress')
  .textContent();
check('progress advances after ticking', benProgress.trim() === '1/2', benProgress.trim());

// Tapping a done step must put it back, not be a one-way trip.
await page.locator('hearth-routines-card .step', { hasText: 'Sportsachen einpacken' }).click();
await page.waitForTimeout(400);
const untick = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'set_routine_step').at(-1),
);
const benAgain = await page
  .locator('hearth-routines-card .person', { hasText: 'Ben' })
  .locator('.progress')
  .textContent();
check(
  'tapping again unticks the step',
  untick?.data?.done === false && benAgain.trim() === '0/2',
  `done=${untick?.data?.done} progress=${benAgain.trim()}`,
);

await page.evaluate(() =>
  window.__mount({ type: 'custom:hearth-routines-card', block: 'both' }, 'hearth-routines-card'),
);
await page.waitForTimeout(300);
const blockCount = await page
  .locator('hearth-routines-card .person', { hasText: 'Ben' })
  .locator('.block')
  .count();
check('block "both" shows morning and evening', blockCount === 2, `${blockCount} blocks`);
await page.screenshot({ path: join(SHOTS, 'routines.png') });

// -------------------------------------------------------------- translations

// The harness hass is German, so every card must speak German without configuration.
await page.evaluate(() =>
  window.__mount({ type: 'custom:hearth-people-card' }, 'hearth-people-card'),
);
await page.waitForTimeout(300);
const germanChips = await page.locator('hearth-people-card .chip').allTextContents();
check(
  'cards follow the Home Assistant language',
  germanChips.some((c) => /Zuhause/.test(c)) && germanChips.some((c) => /Unterwegs/.test(c)),
  germanChips.map((c) => c.trim()).join(' | '),
);

await page.evaluate(() => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement('hearth-agenda-card');
  card.setConfig({ type: 'custom:hearth-agenda-card' });
  // Same data, English frontend.
  card.hass = { ...window.__hass, language: 'en', locale: { ...window.__hass.locale, language: 'en' } };
  host.appendChild(card);
});
await page.waitForTimeout(400);
const englishAgenda = await page.evaluate(
  () => document.querySelector('hearth-agenda-card').shadowRoot.textContent,
);
check(
  'switching the Home Assistant language switches the cards',
  /Nothing planned|All day/.test(englishAgenda) && !/Nichts geplant/.test(englishAgenda),
  englishAgenda.replace(/\s+/g, ' ').trim().slice(0, 80),
);

const unknownLang = await page.evaluate(() => {
  const el = document.createElement('hearth-agenda-card');
  el.setConfig({ type: 'custom:hearth-agenda-card' });
  el.hass = { ...window.__hass, language: 'fi', locale: { ...window.__hass.locale, language: 'fi' } };
  document.getElementById('host').appendChild(el);
  return new Promise((r) => setTimeout(() => r(el.shadowRoot.textContent), 300));
});
check(
  'an unsupported language falls back to English, not to raw keys',
  !/^\s*$/.test(unknownLang) && !/board\.|agenda\./.test(unknownLang),
  unknownLang.replace(/\s+/g, ' ').trim().slice(0, 60),
);

// ------------------------------------------------------------- card editors

const editors = await page.evaluate(async () => {
  const types = [
    'hearth-calendar-card',
    'hearth-agenda-card',
    'hearth-people-card',
    'hearth-lists-card',
    'hearth-routines-card',
    'hearth-header-card',
  ];
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
});
check(
  'every card offers a defined visual editor',
  editors.length === 6 && editors.every((e) => e.defined && e.tag === `${e.type}-editor`),
  editors.map((e) => `${e.tag}:${e.defined ? 'ok' : 'MISSING'}`).join(' '),
);
check(
  'every card ships a stub config for the card picker',
  editors.every((e) => e.stub && typeof e.stub === 'object'),
  editors.map((e) => JSON.stringify(e.stub)).join(' '),
);

// The editor publishes config-changed with the merged config, dropping cleared fields.
const editorEvent = await page.evaluate(async () => {
  const el = await customElements.get('hearth-agenda-card').getConfigElement();
  el.hass = window.__hass;
  el.setConfig({ type: 'custom:hearth-agenda-card', days: 3, max_events: '' });
  document.getElementById('host').appendChild(el);
  await new Promise((r) => setTimeout(r, 200));
  return new Promise((resolve) => {
    el.addEventListener('config-changed', (ev) => resolve(ev.detail.config));
    el.shadowRoot
      .querySelector('ha-form')
      .dispatchEvent(
        new CustomEvent('value-changed', {
          detail: { value: { days: 5 } },
          bubbles: true,
          composed: true,
        }),
      );
  });
});
check(
  'the editor merges changes and drops emptied fields',
  editorEvent?.days === 5 && !('max_events' in editorEvent) && editorEvent.type === 'custom:hearth-agenda-card',
  JSON.stringify(editorEvent),
);

// --------------------------------------------------------------- card registry

const registered = await page.evaluate(() => window.customCards.map((c) => c.type).sort());
check(
  'every card registers itself in the picker',
  registered.join(',') ===
    'hearth-agenda-card,hearth-calendar-card,hearth-header-card,hearth-lists-card,hearth-people-card,hearth-routines-card',
  registered.join(','),
);

check('no uncaught page errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();
server.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
