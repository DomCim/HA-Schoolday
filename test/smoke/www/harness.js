// Renders the Schoolday cards against a stubbed hass object.
// Fixtures mirror what custom_components/schoolday/sensor.py actually publishes.

const STAMP = '2026-08-01T00:00:00+02:00';

// Today's routine steps per member and block, as sensor.py publishes them.
const ROUTINES = {
  m1: {
    morning: [
      { step: 'Zähne putzen', done: false },
      { step: 'Sportsachen einpacken', done: false },
    ],
    // The last one is generated from tomorrow's Sport lesson rather than typed, which
    // is what the `subject` tag on a step means.
    evening: [
      { step: 'Ranzen packen', done: false },
      { step: 'Sportbeutel', done: false, subject: 'Sport' },
    ],
  },
  m2: { morning: [], evening: [] },
  m3: {
    morning: [
      { step: 'Zähne putzen', done: true },
      { step: 'Brotdose einpacken', done: false },
    ],
    evening: [],
  },
};

// The last thirty days of the record, as store.HistoryStore.stats() publishes it on
// each member sensor. Built here rather than hand-written so the figures under the bars
// really are the figures the bars are drawn from — and built from fixed rules rather
// than random ones, so the manual's picture and the smoke suite see the same record
// every time.
const WINDOW_DAYS = 30;
const TODAY_ISO = '2026-08-05';
// One day at home ill inside the window: it asked for nothing, and must not read as a
// day anybody failed.
const SICK_DAY = '2026-07-20';

// Which step a child lets slide, and how often. Ben forgets the PE bag every seventh
// school day; Nik is newer at this and drops the lunchbox rather more.
const MISSES = {
  m1: (index, block, step) => block === 'evening' && step === 'Sportbeutel' && index % 7 === 2,
  m3: (index, _block, step) => step === 'Brotdose einpacken' && index % 3 !== 0,
};

// What each block asked for on a normal school day of the window. Ben's evening list
// carries the packing step the timetable generates, exactly as it does today.
const ASKED = {
  m1: { morning: ['Zähne putzen', 'Sportsachen einpacken'], evening: ['Ranzen packen', 'Sportbeutel'] },
  m2: { morning: [], evening: [] },
  m3: { morning: ['Zähne putzen', 'Brotdose einpacken'], evening: [] },
};

const percent = (done, asked) => (asked ? Math.round((100 * done) / asked) : null);

function routineStats(memberId) {
  const lists = ASKED[memberId] ?? { morning: [], evening: [] };
  const misses = MISSES[memberId] ?? (() => false);
  const days = [];
  const blocks = { morning: [0, 0], evening: [0, 0] };
  const tallies = new Map();
  const outcomes = [];

  for (let index = 0; index < WINDOW_DAYS; index += 1) {
    const at = new Date(2026, 7, 5);
    at.setDate(at.getDate() - (WINDOW_DAYS - 1 - index));
    const iso = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(
      at.getDate(),
    ).padStart(2, '0')}`;
    const today = iso === TODAY_ISO;
    const weekend = at.getDay() === 0 || at.getDay() === 6;
    const sick = iso === SICK_DAY;
    let asked = 0;
    let done = 0;

    for (const [block, list] of Object.entries(lists)) {
      // Today's record is today's routine: the same two lists the routines card draws,
      // which is what the integration writes down as the day goes.
      const steps = today
        ? (ROUTINES[memberId]?.[block] ?? []).map((entry) => [entry.step, entry.done])
        : (weekend || sick ? [] : list).map((step, position) => [
            step,
            !misses(index, block, step, position),
          ]);
      asked += steps.length;
      done += steps.filter(([, ticked]) => ticked).length;
      if (today) continue;
      for (const [step, ticked] of steps) {
        blocks[block][0] += 1;
        blocks[block][1] += ticked ? 1 : 0;
        const key = `${block}|${step}`;
        const tally = tallies.get(key) ?? [0, 0];
        tallies.set(key, [tally[0] + 1, tally[1] + (ticked ? 1 : 0)]);
      }
    }

    days.push({ date: iso, mode: sick ? 'sick' : weekend ? 'free' : 'school', asked, done });
    if (asked && (!today || done === asked)) outcomes.push(done === asked);
  }

  const askedTotal = blocks.morning[0] + blocks.evening[0];
  const doneTotal = blocks.morning[1] + blocks.evening[1];
  let streak = 0;
  for (let index = outcomes.length - 1; index >= 0 && outcomes[index]; index -= 1) streak += 1;
  let best = 0;
  let run = 0;
  for (const outcome of outcomes) {
    run = outcome ? run + 1 : 0;
    best = Math.max(best, run);
  }

  return {
    date: TODAY_ISO,
    rate: percent(doneTotal, askedTotal),
    streak,
    best_streak: best,
    blocks: Object.fromEntries(
      Object.entries(blocks).map(([block, [asked, done]]) => [
        block,
        { asked, done, rate: percent(done, asked) },
      ]),
    ),
    steps: [...tallies.entries()]
      .map(([key, [asked, done]]) => {
        const [block, step] = key.split('|');
        return { block, step, asked, done, rate: percent(done, asked) };
      })
      .sort((a, b) => a.rate - b.rate || b.asked - a.asked || a.step.localeCompare(b.step)),
    days,
  };
}

// The lesson grid, as models.Timetable.as_card_dict() publishes it on the board.
// Period 7 is deliberately unused by everyone, so the trimming of empty periods —
// and of the break that would hang off the end of the table — is testable.
const TIMETABLE = {
  periods: [
    { index: 1, start: '08:00', end: '08:45' },
    { index: 2, start: '08:45', end: '09:30' },
    { index: 3, start: '09:50', end: '10:35' },
    { index: 4, start: '10:35', end: '11:20' },
    { index: 5, start: '11:30', end: '12:15' },
    { index: 6, start: '12:15', end: '13:00' },
    { index: 7, start: '13:15', end: '14:00' },
  ],
  breaks: [
    { after: 2, start: '09:30', end: '09:50', minutes: 20 },
    { after: 4, start: '11:20', end: '11:30', minutes: 10 },
    { after: 6, start: '13:00', end: '13:15', minutes: 15 },
  ],
  // One week by default. __setCycle switches the household to A/B weeks, exactly as
  // the board sensor would after the option changed.
  cycle_weeks: 1,
  subjects: {
    Chor: '#476d80',
    Deutsch: '#4f9d69',
    Englisch: '#a05195',
    HSU: '#3a86c8',
    Kunst: '#8e6bbf',
    Mathe: '#e0603a',
    Musik: '#2a9d8f',
    Religion: '#5a7d9a',
    Sport: '#c9a227',
    // Only ever a replacement on one date, never in the week — and still coloured,
    // because a lesson with no colour reads as broken rather than as unusual.
    Vertretung: '#7a8b3a',
    WG: '#b5651d',
  },
};

// One week per member, as the member sensor publishes it. Jan has none, which is
// how a parent looks on this card: no timetable, no chip, no column.
const lesson = (period, subject, room = null) => ({ period, subject, room });

const WEEKS = {
  m1: {
    0: [
      lesson(1, 'Deutsch'),
      lesson(2, 'Mathe'),
      lesson(3, 'Kunst', '1.OG 5'),
      lesson(4, 'HSU'),
      lesson(5, 'Deutsch'),
    ],
    1: [
      lesson(1, 'Deutsch'),
      lesson(2, 'Religion'),
      lesson(3, 'WG'),
      lesson(4, 'WG'),
      lesson(6, 'Chor'),
    ],
    2: [lesson(1, 'Mathe'), lesson(2, 'Sport', 'Turnhalle'), lesson(3, 'Deutsch'), lesson(4, 'HSU')],
    3: [lesson(1, 'Englisch'), lesson(2, 'Mathe'), lesson(3, 'Deutsch')],
    4: [lesson(1, 'Deutsch'), lesson(2, 'Musik'), lesson(3, 'Mathe')],
  },
  m3: {
    0: [lesson(1, 'Mathe'), lesson(2, 'Deutsch')],
    2: [lesson(1, 'Englisch'), lesson(2, 'Kunst', 'Werkraum')],
  },
};

// The seven days from the frozen "now" (Wednesday 5 August 2026), keyed by weekday
// exactly as the integration publishes them. Monday and Tuesday have already been this
// week, so they resolve to the 10th and 11th — which is the whole point of the outlook.
const OUTLOOK = (() => {
  // Monday of the frozen week (3 August 2026) through seven days from Wednesday the
  // 5th, exactly the window the integration publishes.
  const today = new Date(2026, 7, 5);
  const first = new Date(today);
  first.setDate(first.getDate() - ((today.getDay() + 6) % 7));
  const last = new Date(today);
  last.setDate(last.getDate() + 6);
  const days = [];
  for (const day = new Date(first); day <= last; day.setDate(day.getDate() + 1)) {
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(
      day.getDate(),
    ).padStart(2, '0')}`;
    days.push({ date: iso, weekday: (day.getDay() + 6) % 7, mode: 'school', label: null, week: 0 });
  }
  return days;
})();

// One sensor per member, matching what custom_components/schoolday/sensor.py publishes:
// the running subject as the state, the day and the routines as attributes.
function memberState(entityId, name, memberId, color) {
  return {
    entity_id: entityId,
    state: 'free',
    attributes: {
      friendly_name: `Schoolday ${name}`,
      member_id: memberId,
      color,
      avatar: null,
      day_mode: 'school',
      sick_until: null,
      routine_morning: ROUTINES[memberId]?.morning ?? [],
      routine_evening: ROUTINES[memberId]?.evening ?? [],
      routine_stats: routineStats(memberId),
      timetable: WEEKS[memberId] ?? {},
      outlook: JSON.parse(JSON.stringify(OUTLOOK)),
      today: [],
      today_subjects: [],
      today_summary: '',
      lesson_now: null,
      lesson_next: null,
    },
    last_changed: STAMP,
    last_updated: STAMP,
  };
}

// One homework list per child, as todo.py publishes it. Dates are around the frozen
// "now" (Wednesday 5 August 2026) so every bucket the card draws is represented.
const HOMEWORK = {
  m1: [
    { uid: 'h1', summary: 'Mathe Seite 42', due: '2026-08-03', done: false },
    { uid: 'h2', summary: 'Deutsch Aufsatz', due: '2026-08-05', done: false },
    { uid: 'h3', summary: 'Vokabeln lernen', due: '2026-08-06', done: false },
    { uid: 'h4', summary: 'Referat vorbereiten', due: '2026-08-20', done: false },
    { uid: 'h5', summary: 'Lesen üben', due: null, done: false },
    { uid: 'h6', summary: 'HSU Arbeitsblatt', due: '2026-08-04', done: true },
  ],
  m2: [],
  m3: [{ uid: 'h7', summary: 'Bild fertig malen', due: '2026-08-06', done: false }],
};

function homeworkState(entityId, name, memberId) {
  const items = HOMEWORK[memberId] ?? [];
  return {
    entity_id: entityId,
    state: String(items.filter((item) => !item.done).length),
    attributes: {
      friendly_name: `Hausaufgaben ${name}`,
      member_id: memberId,
      open: items.filter((item) => !item.done).length,
      homework: items.map((item) => ({ ...item })),
    },
    last_changed: STAMP,
    last_updated: STAMP,
  };
}

window.__calls = { services: [] };

const CALENDAR = (entityId, name) => ({
  entity_id: entityId,
  state: 'off',
  attributes: { friendly_name: name },
  last_changed: STAMP,
  last_updated: STAMP,
});

const hass = {
  states: {
    'sensor.schoolday_board': {
      entity_id: 'sensor.schoolday_board',
      state: '3',
      attributes: {
        schoolday_board: true,
        members: [
          { id: 'm1', name: 'Ben', color: '#e0603a', avatar: 'person.ben', order: 0 },
          { id: 'm2', name: 'Jan', color: '#3a86c8', avatar: null, order: 1 },
          { id: 'm3', name: 'Nik', color: '#4f9d69', avatar: null, order: 2 },
        ],
        routine_blocks: ['morning', 'evening'],
        timetable: TIMETABLE,
        // What the management card edits, exactly as the board sensor publishes it.
        admin: {
          members: [
            { id: 'm1', name: 'Ben', color: '#e0603a', avatar: 'person.ben', order: 0, calendar: 'calendar.ben' },
            { id: 'm2', name: 'Jan', color: '#3a86c8', avatar: null, order: 1, calendar: null },
            { id: 'm3', name: 'Nik', color: '#4f9d69', avatar: null, order: 2, calendar: null },
          ],
          routines: {
            m1: { morning: { 0: ['Zähne putzen', 'Sportsachen einpacken'], care: ['Brotdose'] }, evening: {} },
            m2: { morning: {}, evening: {} },
            m3: { morning: { 2: ['Zähne putzen'] }, evening: {} },
          },
          periods: TIMETABLE.periods.map((period) => `${period.start}-${period.end}`),
          colors: { Deutsch: '#ff4015' },
          school_calendars: ['calendar.ferien'],
          care_keywords: ['Ferienbetreuung'],
          materials: { Sport: ['Sportbeutel', 'Turnschuhe'] },
          subjects: Object.keys(TIMETABLE.subjects),
          // Thursday the 6th: second period covered, third period off.
          exceptions: {
            m1: {
              '2026-08-06': {
                label: null,
                periods: { 2: { subject: 'Vertretung', room: 'R2' }, 3: {} },
              },
            },
          },
        },
        version: '0.5.0',
      },
      last_changed: STAMP,
      last_updated: STAMP,
    },
    'sensor.schoolday_ben': memberState('sensor.schoolday_ben', 'Ben', 'm1', '#e0603a'),
    'sensor.schoolday_jan': memberState('sensor.schoolday_jan', 'Jan', 'm2', '#3a86c8'),
    'sensor.schoolday_nik': memberState('sensor.schoolday_nik', 'Nik', 'm3', '#4f9d69'),
    'todo.hausaufgaben_ben': homeworkState('todo.hausaufgaben_ben', 'Ben', 'm1'),
    'todo.hausaufgaben_jan': homeworkState('todo.hausaufgaben_jan', 'Jan', 'm2'),
    'todo.hausaufgaben_nik': homeworkState('todo.hausaufgaben_nik', 'Nik', 'm3'),
    'person.ben': {
      entity_id: 'person.ben',
      state: 'home',
      attributes: { friendly_name: 'Ben', entity_picture: '/api/image/serve/abc/512x512' },
      last_changed: STAMP,
      last_updated: STAMP,
    },
    'calendar.ferien': CALENDAR('calendar.ferien', 'Schulferien'),
    'calendar.ben': CALENDAR('calendar.ben', 'Ben'),
    'weather.forecast_goldammerweg': {
      entity_id: 'weather.forecast_goldammerweg',
      state: 'sunny',
      attributes: {
        friendly_name: 'Forecast Goldammerweg',
        temperature: 23.4,
        temperature_unit: '°C',
      },
      last_changed: STAMP,
      last_updated: STAMP,
    },
  },
  config: { time_zone: 'Europe/Berlin' },
  themes: { darkMode: false },
  language: 'de',
  locale: {
    language: 'de',
    number_format: 'language',
    time_format: '24',
    first_weekday: 'monday',
  },
  user: { id: 'u1', name: 'Dominik', is_admin: true },

  async callService(domain, service, data) {
    window.__calls.services.push({ domain, service, data });

    if (domain === 'todo' && service === 'update_item') {
      const sensorId = Object.keys(hass.states).find(
        (id) => id === data.entity_id,
      );
      const memberId = hass.states[sensorId]?.attributes?.member_id;
      const entry = (HOMEWORK[memberId] ?? []).find((item) => item.uid === data.item);
      if (entry) entry.done = data.status === 'completed';
      if (sensorId) {
        hass.states[sensorId] = homeworkState(
          sensorId,
          hass.states[sensorId].attributes.friendly_name.replace('Hausaufgaben ', ''),
          memberId,
        );
      }
      window.__pushHass();
    }

    if (domain === 'schoolday' && service === 'set_routine_step') {
      const block = ROUTINES[data.member]?.[data.block] ?? [];
      const entry = block.find((s) => s.step === data.step);
      if (entry) entry.done = data.done;
      // Mirror the integration: the member sensor republishes its attributes.
      const sensorId = Object.keys(hass.states).find(
        (id) => hass.states[id].attributes?.member_id === data.member,
      );
      if (sensorId) {
        hass.states[sensorId] = {
          ...hass.states[sensorId],
          attributes: {
            ...hass.states[sensorId].attributes,
            routine_morning: [...(ROUTINES[data.member]?.morning ?? [])],
            routine_evening: [...(ROUTINES[data.member]?.evening ?? [])],
          },
          last_updated: new Date().toISOString(),
        };
      }
      window.__pushHass();
    }

    return {};
  },

  formatEntityState(stateObj) {
    return stateObj.state;
  },
};

window.__hass = hass;

// Hand every mounted card a fresh hass reference, the way the dashboard does.
window.__pushHass = () => {
  const next = { ...hass, states: { ...hass.states } };
  for (const card of document.getElementById('host').children) {
    card.hass = next;
  }
};

// Mark a member ill the way the integration does: their own outlook closes from today
// onwards, and their day mode says why. Nothing else about the board changes — that is
// the whole point of an illness as against a holiday.
window.__setCycle = (weeks) => {
  const board = hass.states['sensor.schoolday_board'];
  hass.states['sensor.schoolday_board'] = {
    ...board,
    attributes: {
      ...board.attributes,
      timetable: { ...board.attributes.timetable, cycle_weeks: weeks },
      admin: {
        ...board.attributes.admin,
        cycle_weeks: weeks,
        cycle_anchor: '2026-08-03',
        cycle_now: 0,
      },
    },
  };
  // Ben gets a B week that is nothing like his A week, so telling them apart is a
  // fact the test can check rather than a shade of grey.
  const sensorId = 'sensor.schoolday_ben';
  const timetable = { ...WEEKS.m1 };
  if (weeks === 2) {
    timetable[7] = [lesson(1, 'Physik'), lesson(2, 'Chemie')];
    timetable[8] = [lesson(1, 'Latein')];
  }
  const outlook = JSON.parse(JSON.stringify(OUTLOOK)).map((day) => ({
    ...day,
    // Monday 3 August is week A, so the following Monday is week B.
    week: weeks === 2 && day.date >= '2026-08-10' ? 1 : 0,
  }));
  hass.states[sensorId] = {
    ...hass.states[sensorId],
    attributes: { ...hass.states[sensorId].attributes, timetable, outlook },
  };
  window.__pushHass();
};

window.__setSick = (memberId, on) => {
  const sensorId = Object.keys(hass.states).find(
    (id) => hass.states[id].attributes?.member_id === memberId,
  );
  if (!sensorId) return;
  const today = '2026-08-05';
  const outlook = JSON.parse(JSON.stringify(OUTLOOK)).map((day) =>
    on && day.date === today ? { ...day, mode: 'sick', label: null } : day,
  );
  hass.states[sensorId] = {
    ...hass.states[sensorId],
    attributes: {
      ...hass.states[sensorId].attributes,
      day_mode: on ? 'sick' : 'school',
      sick_until: on ? today : null,
      outlook,
      routine_morning: on ? [] : [...(ROUTINES[memberId]?.morning ?? [])],
      routine_evening: on ? [] : [...(ROUTINES[memberId]?.evening ?? [])],
    },
    last_updated: new Date().toISOString(),
  };
  window.__pushHass();
};

window.__mount = (config, tag) => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement(tag);
  card.setConfig(config);
  card.hass = hass;
  host.appendChild(card);
  window.__card = card;
  return card;
};

window.__ready = true;
