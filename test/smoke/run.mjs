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

// A 1x1 PNG, so an avatar pointing at Home Assistant's image API resolves to something
// rather than a 404 the error check would rightly complain about.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  if (path.startsWith('/api/image/serve/')) {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(PIXEL);
    return;
  }
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

// The divider sits inside every day, so the times ride on its tooltip; the left-hand
// column names it in the household's language.
const ttBreaks = await page
  .locator('schoolday-timetable-card .t-break')
  .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('title')));
check(
  'breaks come from the gaps, and none dangles off the end',
  ttBreaks.length === 2 && /09:30–09:50/.test(ttBreaks[0]) && /11:20–11:30/.test(ttBreaks[1]),
  ttBreaks.join(' | '),
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
  dayHeads.length === 1 &&
    /Mittwoch/.test(dayHeads[0]) &&
    /5\.8\./.test(dayHeads[0]) &&
    dayChips === 5,
  `${dayHeads.map((h) => h.replace(/\s+/g, ' ').trim()).join(',')} / ${dayChips} chips`,
);

// The whole point of the outlook: a weekday that has already been this week points at
// next week's, so the column a parent taps is never one that is already over.
const chipDates = await page
  .locator('schoolday-timetable-card .days .chip .chip-date')
  .allTextContents();
check(
  'past weekdays roll on to next week, the rest stay in this one',
  chipDates.map((text) => text.trim()).join(' ') === '10.8. 11.8. 5.8. 6.8. 7.8.',
  chipDates.map((text) => text.trim()).join(' '),
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

// A day the child is not at school says so in its own column, and shows no lessons:
// during the summer holidays the grid must not still promise Monday's German. Marked
// by date, because with rolling on, the Monday column is next Monday's.
const HOLIDAY_WEEK = {
  // Next Monday and this Thursday — the two the rolling view actually shows.
  '2026-08-10': { mode: 'free', label: 'Sommerferien Bayern' },
  '2026-08-06': { mode: 'care', label: 'Ben Ferienbetreuung' },
  // This Monday, which only the non-rolling view shows.
  '2026-08-03': { mode: 'free', label: 'Beweglicher Ferientag' },
};

const closeDays = async (config, closures = HOLIDAY_WEEK) =>
  page.evaluate(
    ({ config, closures }) => {
      const host = document.getElementById('host');
      host.innerHTML = '';
      const card = document.createElement('schoolday-timetable-card');
      card.setConfig(config);
      const sensor = Object.values(window.__hass.states).find(
        (state) => state.attributes?.friendly_name === 'Schoolday Ben',
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

await closeDays({ type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' });
await page.waitForTimeout(400);

const closedLabels = await page
  .locator('schoolday-timetable-card .closure')
  .allTextContents();
check(
  'a closed day is named in its own column, by whatever the calendar called it',
  closedLabels.map((text) => text.trim()).join(' | ') ===
    'Sommerferien Bayern | Ben Ferienbetreuung',
  closedLabels.map((text) => text.trim()).join(' | '),
);

const closedCells = await page.locator('schoolday-timetable-card .cell.closed').count();
const closedSubjects = await page
  .locator('schoolday-timetable-card .cell.closed .subject')
  .count();
check(
  'a closed day shows no lessons at all',
  closedCells > 0 && closedSubjects === 0,
  `${closedCells} closed cells, ${closedSubjects} subjects in them`,
);

// Rolling off shows the week as it stands: Monday is this Monday again, with the day
// off that only this week has, and the date follows it.
await closeDays({
  type: 'custom:schoolday-timetable-card',
  member: 'Ben',
  layout: 'week',
  roll_days: false,
});
await page.waitForTimeout(400);

const staticDates = await page
  .locator('schoolday-timetable-card .col-head .col-date')
  .allTextContents();
const staticClosed = await page
  .locator('schoolday-timetable-card .closure')
  .allTextContents();
check(
  'rolling off shows the week as it stands, past days included',
  staticDates.map((text) => text.trim()).join(' ') === '3.8. 4.8. 5.8. 6.8. 7.8.' &&
    staticClosed.map((text) => text.trim()).join(' | ') ===
      'Beweglicher Ferientag | Ben Ferienbetreuung',
  `${staticDates.map((t) => t.trim()).join(' ')} / ${staticClosed
    .map((t) => t.trim())
    .join(' | ')}`,
);

// A holiday keeps the week on screen — it is still the plan — but nothing is running.
// Read from this member's own outlook rather than from the board: a holiday closes the
// day for everybody, holiday care and an illness close it for one child, and only the
// member's outlook can tell those apart.
await closeDays({ type: 'custom:schoolday-timetable-card', member: 'Ben' }, {
  '2026-08-05': { mode: 'free', label: 'Sommerferien' },
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

// A date may do something other than what its weekday says. Thursday the 6th is a
// normal school day whose second period is covered and whose third is off.
await closeDays({ type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' }, {
  '2026-08-06': {
    changes: { 2: { subject: 'Vertretung', room: 'R2' }, 3: null },
  },
});
await page.waitForTimeout(300);
const changed = await page.evaluate(() => {
  const root = document.querySelector('schoolday-timetable-card').shadowRoot;
  const heads = [...root.querySelectorAll('.col-head')].map((h) =>
    h.querySelector('.col-date')?.textContent.trim(),
  );
  const column = heads.indexOf('6.8.') + 2;
  const cells = [...root.querySelectorAll('.cell')].filter((cell) =>
    (cell.getAttribute('style') ?? '').includes(`grid-column:${column};`),
  );
  return cells.map((cell) => ({
    subject: cell.querySelector('.subject')?.textContent.trim() ?? null,
    changed: cell.classList.contains('changed'),
    free: cell.classList.contains('free'),
  }));
});
const coveredColor = await page.evaluate(() => {
  const root = document.querySelector('schoolday-timetable-card').shadowRoot;
  const cell = [...root.querySelectorAll('.cell')].find(
    (node) => node.querySelector('.subject')?.textContent.trim() === 'Vertretung',
  );
  return getComputedStyle(cell).getPropertyValue('--subject').trim();
});
check(
  'a subject that only ever covers still gets a colour',
  /^#|rgb/.test(coveredColor),
  coveredColor || '(keine)',
);
check(
  'a covered period shows the replacement, and a cancelled one is simply gone',
  changed.some((c) => c.subject === 'Vertretung' && c.changed) &&
    !changed.some((c) => c.subject === 'WG' && !c.changed) &&
    changed.filter((c) => c.changed).length === 1,
  JSON.stringify(changed),
);

// The whole day taken over: a trip is neither a holiday nor care, and gets said so.
await closeDays({ type: 'custom:schoolday-timetable-card', member: 'Ben', layout: 'week' }, {
  '2026-08-06': { mode: 'event', label: 'Wandertag' },
});
await page.waitForTimeout(300);
const trip = await page.evaluate(() => {
  const root = document.querySelector('schoolday-timetable-card').shadowRoot;
  const node = root.querySelector('.closure.event');
  return { label: node?.textContent.trim() ?? null, holiday: !!root.querySelector('.closure.free') };
});
check(
  'a day the school took over is its own kind of closed day',
  trip.label === 'Wandertag' && !trip.holiday,
  JSON.stringify(trip),
);

// An illness closes today for one child and says so in their own colour. The word is
// Schoolday's own: there is no calendar event behind it to borrow a name from.
await closeDays({ type: 'custom:schoolday-timetable-card', member: 'Ben' }, {
  '2026-08-05': { mode: 'sick', label: null },
});
await page.waitForTimeout(300);
const ill = await page.evaluate(() => {
  const root = document.querySelector('schoolday-timetable-card').shadowRoot;
  return {
    status: root.querySelector('.status')?.textContent.replace(/\s+/g, ' ').trim(),
    closure: root.querySelector('.closure.sick')?.textContent.trim() ?? null,
    marked: root.querySelectorAll('.cell.now').length,
  };
});
check(
  'an ill day is drawn as its own kind of closed day',
  ill.closure === 'Krank' && /Schulfrei/.test(ill.status) && ill.marked === 0,
  JSON.stringify(ill),
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

// No member picked is the whole family; picking one narrows the card to that child.
await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'morning', show_empty: true },
    'schoolday-routines-card',
  ),
);
await page.waitForTimeout(300);
const everyone = await page.locator('schoolday-routines-card .person-name').allTextContents();
check(
  'no member configured shows the whole family',
  everyone.map((n) => n.trim()).join(',') === 'Ben,Jan,Nik',
  everyone.map((n) => n.trim()).join(','),
);

await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'morning', show_empty: true, member: 'm3' },
    'schoolday-routines-card',
  ),
);
await page.waitForTimeout(300);
const onlyNik = await page.locator('schoolday-routines-card .person-name').allTextContents();
check(
  'a configured member shows that child alone',
  onlyNik.map((n) => n.trim()).join(',') === 'Nik',
  onlyNik.map((n) => n.trim()).join(','),
);

// A step the timetable generated carries the subject that put it there. It is not a
// second kind of step: it ticks off through the same service as any other.
await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'evening' },
    'schoolday-routines-card',
  ),
);
await page.waitForTimeout(300);
const packed = await page.evaluate(() => {
  const root = document.querySelector('schoolday-routines-card').shadowRoot;
  return [...root.querySelectorAll('.step')].map((step) => ({
    label: step.querySelector('.label')?.textContent.trim(),
    from: step.querySelector('.from')?.textContent.trim() ?? null,
  }));
});
check(
  "a packed-for-tomorrow step names the subject it came from",
  JSON.stringify(packed) ===
    JSON.stringify([
      { label: 'Ranzen packen', from: null },
      { label: 'Sportbeutel', from: 'Sport' },
    ]),
  JSON.stringify(packed),
);

await page.locator('schoolday-routines-card .step', { hasText: 'Sportbeutel' }).click();
await page.waitForTimeout(300);
const packedCall = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'set_routine_step').at(-1),
);
check(
  'a generated step ticks off like any other',
  packedCall?.data?.step === 'Sportbeutel' &&
    packedCall?.data?.block === 'evening' &&
    packedCall?.data?.done === true,
  JSON.stringify(packedCall?.data ?? null),
);

// An ill child keeps their place on the board. Dropping them would answer the wrong
// question: the reader wants to know why the list is gone.
await page.evaluate(() => {
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'morning' },
    'schoolday-routines-card',
  );
  window.__setSick('m3', true);
});
await page.waitForTimeout(300);
const whenIll = await page.evaluate(() => {
  const root = document.querySelector('schoolday-routines-card').shadowRoot;
  return {
    people: [...root.querySelectorAll('.person-name')].map((n) => n.textContent.trim()),
    note: root.querySelector('.person.sick .sick-note')?.textContent.trim() ?? null,
    steps: root.querySelectorAll('.person.sick .step').length,
  };
});
check(
  'an ill child stays on the board, with the reason instead of a list',
  whenIll.people.join(',') === 'Ben,Nik' &&
    whenIll.note === 'Krank zu Hause' &&
    whenIll.steps === 0,
  JSON.stringify(whenIll),
);
await page.evaluate(() => window.__setSick('m3', false));

// By name as well as by id, so a hand-written card does not have to know the ids.
await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-routines-card', block: 'morning', show_empty: true, member: 'Jan' },
    'schoolday-routines-card',
  ),
);
await page.waitForTimeout(300);
const byName = await page.locator('schoolday-routines-card .person-name').allTextContents();
check(
  'the member may be given by name',
  byName.map((n) => n.trim()).join(',') === 'Jan',
  byName.map((n) => n.trim()).join(','),
);

// --------------------------------------------------------------- homework card

await page.evaluate(() =>
  window.__mount({ type: 'custom:schoolday-homework-card' }, 'schoolday-homework-card'),
);
await page.waitForTimeout(400);

const homeworkGroups = await page.evaluate(() => {
  const root = document.querySelector('schoolday-homework-card').shadowRoot;
  const ben = [...root.querySelectorAll('.person')].find((node) =>
    node.textContent.includes('Ben'),
  );
  return [...ben.querySelectorAll('.bucket')].map((bucket) => ({
    head: bucket.querySelector('.bucket-head')?.textContent.trim(),
    items: [...bucket.querySelectorAll('.label')].map((n) => n.textContent.trim()),
  }));
});
check(
  'homework is grouped by when it is due, soonest group first',
  JSON.stringify(homeworkGroups) ===
    JSON.stringify([
      { head: 'Überfällig', items: ['Mathe Seite 42'] },
      { head: 'Heute fällig', items: ['Deutsch Aufsatz'] },
      { head: 'Morgen fällig', items: ['Vokabeln lernen'] },
      { head: 'Später', items: ['Referat vorbereiten'] },
      { head: 'Ohne Datum', items: ['Lesen üben'] },
    ]),
  JSON.stringify(homeworkGroups),
);

const homeworkPeople = await page
  .locator('schoolday-homework-card .person-name')
  .allTextContents();
check(
  'a child with nothing to do is left off, and the count is what is left',
  homeworkPeople.map((n) => n.replace(/\s+/g, ' ').trim()).join(',') === 'Ben 5,Nik 1',
  homeworkPeople.map((n) => n.replace(/\s+/g, ' ').trim()).join(','),
);

// Finished work is out of the way by default: the card exists to say what is left.
const doneShown = await page.evaluate(() => {
  const root = document.querySelector('schoolday-homework-card').shadowRoot;
  return [...root.querySelectorAll('.label')].some(
    (n) => n.textContent.trim() === 'HSU Arbeitsblatt',
  );
});
check('what is already done is left out unless asked for', !doneShown, String(doneShown));

const hwBox = await page.locator('schoolday-homework-card .item').first().boundingBox();
check('homework rows are touch-sized', hwBox.height >= 44, `${Math.round(hwBox.height)}px tall`);

await page.locator('schoolday-homework-card .item', { hasText: 'Deutsch Aufsatz' }).click();
await page.waitForTimeout(400);
const hwCall = await page.evaluate(() =>
  window.__calls.services.filter((c) => c.service === 'update_item').at(-1),
);
const benCount = await page.evaluate(() => {
  const root = document.querySelector('schoolday-homework-card').shadowRoot;
  const ben = [...root.querySelectorAll('.person')].find((node) =>
    node.textContent.includes('Ben'),
  );
  return ben.querySelector('.count')?.textContent.trim();
});
check(
  'ticking homework off calls todo.update_item on that child’s list',
  hwCall?.domain === 'todo' &&
    hwCall?.data?.entity_id === 'todo.hausaufgaben_ben' &&
    hwCall?.data?.item === 'h2' &&
    hwCall?.data?.status === 'completed' &&
    benCount === '4',
  `${JSON.stringify(hwCall?.data ?? null)} count=${benCount}`,
);

await page.evaluate(() =>
  window.__mount(
    { type: 'custom:schoolday-homework-card', member: 'Nik', show_done: true },
    'schoolday-homework-card',
  ),
);
await page.waitForTimeout(300);
const onlyNikHomework = await page
  .locator('schoolday-homework-card .person-name')
  .allTextContents();
check(
  'the homework card narrows to one child like the others',
  onlyNikHomework.map((n) => n.replace(/\s+/g, ' ').trim()).join(',') === 'Nik 1',
  onlyNikHomework.map((n) => n.replace(/\s+/g, ' ').trim()).join(','),
);
await page.screenshot({ path: join(SHOTS, 'homework.png') });

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
  'schoolday-homework-card',
  'schoolday-header-card',
  'schoolday-admin-card',
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
  editors.length === CARD_TYPES.length &&
    editors.every((e) => e.defined && e.tag === `${e.type}-editor`),
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
check(
  'the routines editor offers the same member picker',
  editorFields['schoolday-routines-card']?.[0] === 'member',
  (editorFields['schoolday-routines-card'] ?? []).join(','),
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

// An avatar naming a person entity is drawn as that person's picture: Home Assistant
// already knows what they look like, and copying the URL once would go stale.
const avatarSrc = await page.evaluate(async () => {
  window.__mount({ type: 'custom:schoolday-routines-card', block: 'both', show_empty: true },
    'schoolday-routines-card');
  await new Promise((r) => setTimeout(r, 300));
  const img = document.querySelector('schoolday-routines-card').shadowRoot.querySelector('img.avatar');
  return img?.getAttribute('src') ?? null;
});
check(
  "a person entity as the avatar draws that person's picture",
  avatarSrc === '/api/image/serve/abc/512x512',
  String(avatarSrc),
);

// ---------------------------------------------------------------- admin card

// Everything the options dialog offers, from the dashboard. The card never writes the
// configuration itself — it calls a service — so what is checked here is that the right
// call goes out with the right payload.

await page.evaluate(() =>
  window.__mount({ type: 'custom:schoolday-admin-card' }, 'schoolday-admin-card'),
);
await page.waitForTimeout(400);

const adminTabs = await page.locator('schoolday-admin-card .tab').allTextContents();
check(
  'the admin card offers every part of the options dialog',
  adminTabs.map((tab) => tab.trim()).join(',') ===
    'Stundenplan,Routinen,Familie,Fächer,Material,Ausnahmen,Freie Tage',
  adminTabs.map((tab) => tab.trim()).join(','),
);

const adminPeriods = await page
  .locator('schoolday-admin-card textarea')
  .first()
  .inputValue();
check(
  'the lesson times come from the configuration, not from the grid',
  adminPeriods.split('\n').length === 7 && adminPeriods.startsWith('08:00-08:45'),
  adminPeriods.replace(/\n/g, ' | '),
);

// Tapping a cell opens it with what is already there, and saving sends set_lesson.
await page.locator('schoolday-admin-card .slot.filled').first().click();
await page.waitForTimeout(200);
const adminOpenSubject = await page.locator('schoolday-admin-card .editor input').first().inputValue();
check(
  'tapping a lesson opens it with the subject already in it',
  adminOpenSubject.trim().length > 0,
  adminOpenSubject,
);

await page.evaluate(() => {
  const card = document.querySelector('schoolday-admin-card');
  const input = card.shadowRoot.querySelector('.editor input');
  input.value = 'Chemie';
  input.dispatchEvent(new Event('input'));
});
await page.locator('schoolday-admin-card .editor .apply').click();
await page.waitForTimeout(300);

const adminLessonCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_lesson').pop() ?? null,
);
check(
  'saving a cell calls set_lesson for that member, day and period',
  adminLessonCall?.domain === 'schoolday' &&
    adminLessonCall?.data.subject === 'Chemie' &&
    typeof adminLessonCall?.data.weekday === 'number' &&
    typeof adminLessonCall?.data.period === 'number',
  JSON.stringify(adminLessonCall?.data ?? null),
);

// Clearing is its own path: an empty subject, which is how a period is emptied.
await page.locator('schoolday-admin-card .slot.filled').first().click();
await page.waitForTimeout(200);
await page.locator('schoolday-admin-card .editor .danger').click();
await page.waitForTimeout(300);
const adminClearCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_lesson').pop() ?? null,
);
check(
  'clearing a cell sends an empty subject',
  adminClearCall?.data.subject === '',
  JSON.stringify(adminClearCall?.data ?? null),
);

// Routines: every day is editable, including the two that are not weekdays.
await page.locator('schoolday-admin-card .tab', { hasText: 'Routinen' }).click();
await page.waitForTimeout(300);
const adminRoutineDays = await page.locator('schoolday-admin-card .chips').last().locator('.chip').allTextContents();
check(
  'routines offer the seven weekdays plus a day off and holiday care',
  adminRoutineDays.length === 9 &&
    /Freier Tag/.test(adminRoutineDays[7]) &&
    /Ferienbetreuung/.test(adminRoutineDays[8]),
  adminRoutineDays.map((d) => d.trim()).join(','),
);

const adminRoutineSteps = await page.locator('schoolday-admin-card textarea').first().inputValue();
check(
  "Monday's steps are the ones already configured",
  adminRoutineSteps.split('\n').join(' | ') === 'Zähne putzen | Sportsachen einpacken',
  adminRoutineSteps.replace(/\n/g, ' | '),
);

await page.locator('schoolday-admin-card .chip', { hasText: 'Ferienbetreuung' }).click();
await page.waitForTimeout(200);
const adminCareSteps = await page.locator('schoolday-admin-card textarea').first().inputValue();
check(
  'holiday care has its own list, not the weekday one',
  adminCareSteps.trim() === 'Brotdose',
  adminCareSteps.replace(/\n/g, ' | '),
);

await page.evaluate(() => {
  const card = document.querySelector('schoolday-admin-card');
  const box = card.shadowRoot.querySelector('textarea');
  box.value = 'Brotdose\nBadesachen';
  card.shadowRoot.querySelector('.apply').click();
});
await page.waitForTimeout(300);
const adminRoutineCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_routine').pop() ?? null,
);
check(
  'saving steps calls set_routine for that block and day',
  adminRoutineCall?.data.day === 'care' &&
    adminRoutineCall?.data.block === 'morning' &&
    adminRoutineCall?.data.steps.join(',') === 'Brotdose,Badesachen',
  JSON.stringify(adminRoutineCall?.data ?? null),
);

// Family: a member carries their own calendar, which no display card ever sees.
await page.locator('schoolday-admin-card .tab', { hasText: 'Familie' }).click();
await page.waitForTimeout(300);
const adminMemberForms = await page.locator('schoolday-admin-card .member').count();
const adminBenCalendar = await page.locator('schoolday-admin-card #calendar-m1').inputValue();
check(
  'every member is editable, plus one empty form to add another',
  adminMemberForms === 4 && adminBenCalendar === 'calendar.ben',
  `${adminMemberForms} forms, Ben: ${adminBenCalendar}`,
);

// Home Assistant's own entity picker when the frontend has it, the plain input with a
// suggestion list when it does not. A custom card cannot assume another element
// exists — rendering an undefined one leaves a hole where a field should be — so both
// paths are checked, the fallback above and the picker here.
await page.evaluate(() => {
  class Picker extends HTMLElement {
    set value(v) {
      this._value = v;
    }
    get value() {
      return this._value;
    }
  }
  customElements.define('ha-entity-picker', Picker);
  customElements.define('ha-entities-picker', class extends Picker {});
});
await page.evaluate(() =>
  window.__mount({ type: 'custom:schoolday-admin-card', section: 'family' }, 'schoolday-admin-card'),
);
await page.waitForTimeout(400);

const adminPicker = await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  const picker = root.querySelector('ha-entity-picker#calendar-m1');
  return picker
    ? { value: picker.value, domains: picker.includeDomains, hasHass: Boolean(picker.hass) }
    : null;
});
check(
  "the calendar field uses Home Assistant's entity picker when it exists",
  adminPicker?.value === 'calendar.ben' &&
    adminPicker?.domains?.join(',') === 'calendar' &&
    adminPicker?.hasHass === true,
  JSON.stringify(adminPicker),
);

const adminAvatarPicker = await page.evaluate(() => {
  const picker = document
    .querySelector('schoolday-admin-card')
    .shadowRoot.querySelector('ha-entity-picker#avatar-m1');
  return picker
    ? { domains: picker.includeDomains, custom: picker.allowCustomEntity }
    : null;
});
check(
  'the picture field picks a person, but still takes a URL',
  adminAvatarPicker?.domains?.join(',') === 'person' && adminAvatarPicker?.custom === true,
  JSON.stringify(adminAvatarPicker),
);

// What the picker publishes is what gets saved — it owns no input to read back.
await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  root
    .querySelector('ha-entity-picker#calendar-m1')
    .dispatchEvent(
      new CustomEvent('value-changed', { detail: { value: 'calendar.ferien' }, bubbles: true }),
    );
});
await page.waitForTimeout(200);
await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  root.querySelectorAll('.member')[0].querySelector('.apply').click();
});
await page.waitForTimeout(300);
const adminMemberCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_member').pop() ?? null,
);
check(
  'a calendar chosen in the picker is the one saved',
  adminMemberCall?.data.calendar === 'calendar.ferien' && adminMemberCall?.data.name === 'Ben',
  JSON.stringify(adminMemberCall?.data ?? null),
);

// Materials are listed per subject, because the subject is the key the evening routine
// looks them up by — a typed subject name that does not match is a packing list that
// silently never appears.
await page.locator('schoolday-admin-card .tab', { hasText: 'Material' }).click();
await page.waitForTimeout(300);
const materialFields = await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  return [...root.querySelectorAll('.field')].map((field) => ({
    subject: field.querySelector('.label')?.textContent.trim(),
    items: field.querySelector('textarea')?.value ?? null,
  }));
});
check(
  'every subject gets a materials box, filled with what is stored',
  materialFields.length === 11 &&
    materialFields.find((f) => f.subject === 'Sport')?.items === 'Sportbeutel\nTurnschuhe' &&
    materialFields.find((f) => f.subject === 'Mathe')?.items === '',
  JSON.stringify(materialFields.filter((f) => f.items).concat(materialFields.length)),
);

await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  const field = [...root.querySelectorAll('.field')].find(
    (item) => item.querySelector('.label')?.textContent.trim() === 'Sport',
  );
  field.querySelector('textarea').value = 'Sportbeutel\n \nTrinkflasche';
  field.querySelector('.apply').click();
});
await page.waitForTimeout(300);
const materialCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_materials').pop() ?? null,
);
check(
  'saving materials calls set_materials for that subject',
  materialCall?.data.subject === 'Sport' &&
    JSON.stringify(materialCall?.data.items) ===
      JSON.stringify(['Sportbeutel', 'Trinkflasche']),
  JSON.stringify(materialCall?.data ?? null),
);

// Exceptions are edited a date at a time, never a week at a time: the timetable is
// worth typing in once because it repeats, and a per-week editor would end that.
await page.locator('schoolday-admin-card .tab', { hasText: 'Ausnahmen' }).click();
await page.waitForTimeout(300);
await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  const field = root.querySelector('input[type="date"]');
  field.value = '2026-08-06';
  field.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
});
await page.waitForTimeout(300);
const exceptionRows = await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  return [...root.querySelectorAll('.exception-row')].map((row) => ({
    period: row.querySelector('.no')?.textContent.trim(),
    planned: row.querySelector('.planned')?.textContent.trim(),
    gone: row.querySelector('.planned')?.classList.contains('gone') ?? false,
    replacement: row.querySelector('.replacement')?.value ?? '',
  }));
});
check(
  'the stored exception is shown against what the timetable planned',
  exceptionRows.length === 7 &&
    exceptionRows[1].planned === 'Vertretung' &&
    exceptionRows[1].replacement === 'Vertretung' &&
    exceptionRows[2].gone === true,
  JSON.stringify(exceptionRows.slice(0, 4)),
);

await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  // Period 1, the one that is planned and not yet touched: the cancel button is
  // deliberately dead on a period the timetable leaves free.
  const rows = root.querySelectorAll('.exception-row');
  rows[0].querySelector('.link').click();
});
await page.waitForTimeout(300);
const cancelCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_exception').pop() ?? null,
);
check(
  'cancelling a period calls set_exception for that date and period',
  cancelCall?.data.date === '2026-08-06' &&
    cancelCall?.data.period === 1 &&
    cancelCall?.data.cancelled === true,
  JSON.stringify(cancelCall?.data ?? null),
);

await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  const field = [...root.querySelectorAll('.field')].find((item) =>
    item.querySelector('#exception-label'),
  );
  field.querySelector('input').value = 'Wandertag';
  field.querySelector('.apply').click();
});
await page.waitForTimeout(300);
const labelCall = await page.evaluate(
  () => window.__calls.services.filter((c) => c.service === 'set_exception').pop() ?? null,
);
check(
  'naming the day sends it without a period, which is what takes the day over',
  labelCall?.data.label === 'Wandertag' &&
    labelCall?.data.date === '2026-08-06' &&
    labelCall?.data.period === undefined,
  JSON.stringify(labelCall?.data ?? null),
);

// Days off: the calendars are entities and get the multi-picker; the keywords are the
// household's own words and stay free text, one per line.
await page.locator('schoolday-admin-card .tab', { hasText: 'Freie Tage' }).click();
await page.waitForTimeout(300);
const adminHolidayFields = await page.evaluate(() => {
  const root = document.querySelector('schoolday-admin-card').shadowRoot;
  const picker = root.querySelector('ha-entities-picker');
  return {
    calendars: picker?.value ?? null,
    domains: picker?.includeDomains ?? null,
    keywords: root.querySelector('textarea')?.value ?? null,
  };
});
check(
  'days off pick calendars as entities and keep the keywords as words',
  adminHolidayFields.calendars?.join(',') === 'calendar.ferien' &&
    adminHolidayFields.domains?.join(',') === 'calendar' &&
    adminHolidayFields.keywords?.trim() === 'Ferienbetreuung',
  JSON.stringify(adminHolidayFields),
);

// A refused value has to say why. Home Assistant rejects with a plain object rather
// than an Error, and "[object Object]" is the one thing an error message must not be.
const adminErrorText = await page.evaluate(async () => {
  const card = document.querySelector('schoolday-admin-card');
  card.hass = {
    ...window.__hass,
    callService: () =>
      Promise.reject({ code: 'invalid_format', message: '08:00-07:00 ist keine Stundenzeit.' }),
  };
  await new Promise((r) => setTimeout(r, 100));
  card.shadowRoot.querySelector('.apply').click();
  await new Promise((r) => setTimeout(r, 300));
  return card.shadowRoot.querySelector('.notice.error')?.textContent ?? null;
});
check(
  'a refused value shows the reason, not [object Object]',
  adminErrorText?.includes('keine Stundenzeit') && !adminErrorText.includes('object Object'),
  String(adminErrorText).trim(),
);

// --------------------------------------------------------------- card registry

const registered = await page.evaluate(() => window.customCards.map((c) => c.type).sort());
check(
  'every card registers itself in the picker',
  registered.join(',') ===
    'schoolday-admin-card,schoolday-header-card,schoolday-homework-card,' +
      'schoolday-routines-card,schoolday-timetable-card',
  registered.join(','),
);

check('no uncaught page errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

await browser.close();
server.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
