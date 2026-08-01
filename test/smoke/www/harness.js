// Renders hearth-calendar-card against a stubbed hass object.
// Fixtures mirror real payloads taken from the live instance.

const STAMP = '2026-08-01T00:00:00+02:00';

const EVENTS = {
  // All-day, exclusive end — exactly the shape CalDAV returns.
  'calendar.familien_kalender_dill': [
    {
      start: { date: '2026-08-08' },
      end: { date: '2026-08-09' },
      summary: 'Ben Dill',
      description: null,
      location: 'Goldammerweg 25\nNaila, Deutschland',
      uid: '6D8D7F43-28B0-4AB9-B8F7-3E27C7D1A6AD',
      recurrence_id: '2026-08-08',
      rrule: null,
    },
    {
      // Multi-day all-day event, to prove it lands on every covered day.
      start: { date: '2026-08-12' },
      end: { date: '2026-08-15' },
      summary: 'Urlaub',
      description: null,
      location: null,
      uid: 'multi-1',
      recurrence_id: null,
      rrule: null,
    },
  ],
  // Timed events from a local_calendar.
  'calendar.ben': [
    {
      start: { dateTime: '2026-08-05T14:30:00+02:00' },
      end: { dateTime: '2026-08-05T16:00:00+02:00' },
      summary: 'Zahnarzt',
      description: null,
      location: null,
      uid: 'ben-1',
      recurrence_id: null,
      rrule: null,
    },
  ],
  'calendar.jan': [
    {
      start: { dateTime: '2026-08-05T18:00:00+02:00' },
      end: { dateTime: '2026-08-05T19:30:00+02:00' },
      summary: 'Training',
      description: null,
      location: 'Sporthalle',
      uid: 'jan-1',
      recurrence_id: null,
      rrule: null,
    },
  ],
  // Nik gets an event on whatever "today" happens to be, so the cards that only ever
  // show today stay testable no matter when the suite runs.
  'calendar.nik': [
    (() => {
      const pad = (n) => `${n}`.padStart(2, '0');
      const now = new Date();
      const key = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      return {
        start: { dateTime: `${key}T16:00:00+02:00` },
        end: { dateTime: `${key}T17:00:00+02:00` },
        summary: 'Klavierstunde',
        description: null,
        location: null,
        uid: 'nik-today',
        recurrence_id: null,
        rrule: null,
      };
    })(),
  ],
  // Read-only holiday calendar.
  'calendar.deutschland_by': [
    {
      start: { date: '2026-08-15' },
      end: { date: '2026-08-16' },
      summary: 'Mariä Himmelfahrt',
      description: null,
      location: 'Deutschland, BY',
      uid: null,
      recurrence_id: null,
      rrule: null,
    },
  ],
};

// Open items per to-do list, returned through the todo.get_items action response.
const TODO_ITEMS = {
  'todo.kaufland': [
    { uid: 'k1', summary: 'Milch', status: 'needs_action' },
    { uid: 'k2', summary: 'Brot', status: 'needs_action' },
    { uid: 'k3', summary: 'Kaffee', status: 'needs_action' },
  ],
  'todo.dm': [{ uid: 'd1', summary: 'Zahnpasta', status: 'needs_action' }],
  'todo.jan_todo': [{ uid: 'j1', summary: 'Zimmer aufräumen', status: 'needs_action' }],
};

function calendarState(entityId, name) {
  return {
    entity_id: entityId,
    state: 'off',
    attributes: { friendly_name: name },
    last_changed: STAMP,
    last_updated: STAMP,
  };
}

function todoState(entityId, name) {
  return {
    entity_id: entityId,
    state: String((TODO_ITEMS[entityId] ?? []).length),
    attributes: { friendly_name: name },
    last_changed: STAMP,
    last_updated: STAMP,
  };
}

// Today's routine steps per member and block, as sensor.py publishes them.
const ROUTINES = {
  m1: {
    morning: [
      { step: 'Zähne putzen', done: false },
      { step: 'Sportsachen einpacken', done: false },
    ],
    evening: [{ step: 'Ranzen packen', done: false }],
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

// One sensor per member, matching what custom_components/hearth/sensor.py publishes.
function memberState(entityId, name, memberId, color, openTasks, points) {
  return {
    entity_id: entityId,
    state: String(openTasks),
    attributes: {
      friendly_name: `Hearth ${name}`,
      member_id: memberId,
      color,
      avatar: null,
      presence: null,
      points,
      calendars: [],
      todo_lists: [],
      routine_morning: ROUTINES[memberId]?.morning ?? [],
      routine_evening: ROUTINES[memberId]?.evening ?? [],
    },
    last_changed: STAMP,
    last_updated: STAMP,
  };
}

window.__calls = { api: [], services: [] };
window.__failCalendars = new Set();
window.__failLists = new Set();

const hass = {
  states: {
    'sensor.hearth_board': {
      entity_id: 'sensor.hearth_board',
      state: '3',
      attributes: {
        hearth_board: true,
        members: [
          {
            id: 'm1',
            name: 'Ben',
            color: '#e0603a',
            avatar: null,
            person: 'person.ben',
            calendars: ['calendar.ben'],
            todo_lists: ['todo.jan_todo'],
            order: 0,
          },
          {
            id: 'm2',
            name: 'Jan',
            color: '#3a86c8',
            avatar: null,
            person: 'person.jan_dill',
            calendars: ['calendar.jan'],
            todo_lists: [],
            order: 1,
          },
          {
            id: 'm3',
            name: 'Nik',
            color: '#4f9d69',
            avatar: null,
            person: 'person.nik',
            calendars: ['calendar.nik'],
            todo_lists: [],
            order: 2,
          },
        ],
        shared_calendars: ['calendar.familien_kalender_dill'],
        shared_todo_lists: ['todo.kaufland'],
        readonly_calendars: ['calendar.deutschland_by'],
        version: '0.1.0',
      },
      last_changed: STAMP,
      last_updated: STAMP,
    },
    'calendar.ben': calendarState('calendar.ben', 'Ben'),
    'calendar.jan': calendarState('calendar.jan', 'Jan'),
    'calendar.nik': calendarState('calendar.nik', 'Nik'),
    'calendar.familien_kalender_dill': calendarState(
      'calendar.familien_kalender_dill',
      'Familien Kalender Dill',
    ),
    'calendar.deutschland_by': calendarState('calendar.deutschland_by', 'Deutschland, BY'),
    'todo.kaufland': todoState('todo.kaufland', 'Kaufland'),
    'todo.dm': todoState('todo.dm', 'DM'),
    'todo.jan_todo': todoState('todo.jan_todo', 'Jan Todo'),
    'person.ben': {
      entity_id: 'person.ben',
      state: 'home',
      attributes: { friendly_name: 'Ben' },
      last_changed: STAMP,
      last_updated: STAMP,
    },
    'person.jan_dill': {
      entity_id: 'person.jan_dill',
      state: 'not_home',
      attributes: { friendly_name: 'Jan' },
      last_changed: STAMP,
      last_updated: STAMP,
    },
    'person.nik': {
      entity_id: 'person.nik',
      state: 'School',
      attributes: { friendly_name: 'Nik' },
      last_changed: STAMP,
      last_updated: STAMP,
    },
    'sensor.hearth_ben': memberState('sensor.hearth_ben', 'Ben', 'm1', '#e0603a', 1, 42),
    'sensor.hearth_jan': memberState('sensor.hearth_jan', 'Jan', 'm2', '#3a86c8', 0, 7),
    'sensor.hearth_nik': memberState('sensor.hearth_nik', 'Nik', 'm3', '#4f9d69', 3, null),
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

  async callApi(method, path) {
    window.__calls.api.push({ method, path });
    const entityId = path.replace(/^calendars\//, '').split('?')[0];
    if (window.__failCalendars.has(entityId)) {
      throw new Error(`boom: ${entityId}`);
    }
    return EVENTS[entityId] ?? [];
  },

  async callService(domain, service, data, target) {
    window.__calls.services.push({ domain, service, data, target });

    if (domain === 'todo' && service === 'get_items') {
      const entityId = target.entity_id;
      if (window.__failLists.has(entityId)) {
        throw new Error(`boom: ${entityId}`);
      }
      // Honour the status filter the way Home Assistant does, so a completed item
      // really does disappear from an open-items request.
      const wanted = data?.status ?? ['needs_action', 'completed'];
      const items = (TODO_ITEMS[entityId] ?? []).filter((i) => wanted.includes(i.status));
      return { response: { [entityId]: { items } } };
    }

    if (domain === 'todo' && service === 'update_item') {
      const items = TODO_ITEMS[target.entity_id] ?? [];
      const item = items.find((i) => i.uid === data.item || i.summary === data.item);
      if (item) item.status = data.status;
      // Mirror what Home Assistant does: the entity's state is the open-item count.
      hass.states[target.entity_id] = {
        ...hass.states[target.entity_id],
        state: String(items.filter((i) => i.status === 'needs_action').length),
        last_changed: new Date().toISOString(),
      };
      window.__pushHass();
    }

    if (domain === 'hearth' && service === 'set_routine_step') {
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

    if (domain === 'todo' && service === 'add_item') {
      (TODO_ITEMS[target.entity_id] ??= []).push({
        uid: `new-${Math.random().toString(36).slice(2, 8)}`,
        summary: data.item,
        status: 'needs_action',
      });
      window.__pushHass();
    }

    return {};
  },

  async callWS() {
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

window.__mount = (config, tag = 'hearth-calendar-card') => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement(tag);
  card.setConfig(config);
  card.hass = hass;
  host.appendChild(card);
  window.__card = card;
  return card;
};

// Default mount, anchored to August 2026 so fixtures are in view.
window.__setAnchor = (isoDate) => {
  // The card keeps its anchor private; drive it the way a user would instead.
  const card = window.__card;
  card._anchor = new Date(isoDate);
  card.requestUpdate();
};

window.__ready = true;
