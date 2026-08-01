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
  'calendar.nik': [],
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

function calendarState(entityId, name) {
  return {
    entity_id: entityId,
    state: 'off',
    attributes: { friendly_name: name },
    last_changed: STAMP,
    last_updated: STAMP,
  };
}

window.__calls = { api: [], services: [] };
window.__failCalendars = new Set();

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

window.__mount = (config) => {
  const host = document.getElementById('host');
  host.innerHTML = '';
  const card = document.createElement('hearth-calendar-card');
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
