/**
 * The family calendar: a month, week or day grid coloured per family member.
 *
 * Events are fetched from Home Assistant's REST API for exactly the visible range, so
 * paging through months stays snappy and no server-side state is involved.
 */
import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { calendarStyles, findBoard, type HearthBoard } from '../lib/board';
import {
  daysBetween,
  fetchEvents,
  groupByDay,
  type CalendarStyle,
  type HearthEvent,
} from '../lib/calendar';
import {
  addDays,
  addMonths,
  firstWeekday,
  isToday,
  localeOf,
  monthGridRange,
  prefersHour12,
  startOfDay,
  startOfWeek,
  toDateKey,
  type WeekdayIndex,
} from '../lib/dates';
import { hearthButtons, hearthTokens } from '../lib/styles';
import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from '../lib/types';
import './hearth-event-dialog';

export type CalendarView = 'month' | 'week' | 'day';

const VIEWS: CalendarView[] = ['month', 'week', 'day'];
const VIEW_LABELS: Record<CalendarView, string> = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
};

/** Backstop refresh, in case no calendar entity changes state for a while. */
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const ICONS = {
  previous: 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
  next: 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
  today:
    'M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z',
  add: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  warning: 'M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
};

export interface HearthCalendarCardConfig extends LovelaceCardConfig {
  /** Board sensor to read the family setup from. Auto-detected when omitted. */
  board_entity?: string;
  /** Which view to open in. */
  view?: CalendarView;
  /** Which view buttons to offer. Omit the switcher entirely with an empty list. */
  views?: CalendarView[];
  /** Show the coloured family-member legend. */
  show_legend?: boolean;
  /** Allow creating events by tapping a day. */
  create?: boolean;
  /** Calendar preselected in the create sheet. */
  default_calendar?: string;
  /** Events shown per day in the month grid before collapsing into "+N". */
  max_events_per_day?: number;
}

@customElement('hearth-calendar-card')
export class HearthCalendarCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: HearthCalendarCardConfig = { type: '' };
  @state() private _view: CalendarView = 'month';
  @state() private _anchor: Date = startOfDay(new Date());
  @state() private _events: HearthEvent[] = [];
  @state() private _failed: string[] = [];
  @state() private _loading = false;
  @state() private _dialogDay?: Date;

  /** Identifies the data currently loaded, so `hass` churn does not cause refetches. */
  private _loadedSignature = '';
  private _reloadToken = 0;
  private _timer?: number;

  public setConfig(config: HearthCalendarCardConfig): void {
    this._config = { ...config };
    if (config.view && VIEWS.includes(config.view)) {
      this._view = config.view;
    }
  }

  public getCardSize(): number {
    return this._view === 'month' ? 12 : 8;
  }

  public getGridOptions(): { columns: 'full'; rows: number } {
    return { columns: 'full', rows: this._view === 'month' ? 12 : 8 };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => this._reload(), REFRESH_INTERVAL_MS);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) {
      window.clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    void this._maybeFetch();
  }

  // --- data ---------------------------------------------------------------

  private get _board(): HearthBoard | null {
    return this.hass ? findBoard(this.hass, this._config.board_entity) : null;
  }

  private get _firstDay(): WeekdayIndex {
    return this.hass ? firstWeekday(this.hass) : 1;
  }

  /** The half-open [start, end) range the current view covers. */
  private _range(): { start: Date; end: Date } {
    if (this._view === 'month') {
      const { start, end } = monthGridRange(this._anchor, this._firstDay);
      return { start, end };
    }
    if (this._view === 'week') {
      const start = startOfWeek(this._anchor, this._firstDay);
      return { start, end: addDays(start, 7) };
    }
    const start = startOfDay(this._anchor);
    return { start, end: addDays(start, 1) };
  }

  private _reload(): void {
    this._reloadToken += 1;
    void this._maybeFetch();
  }

  private async _maybeFetch(): Promise<void> {
    const hass = this.hass;
    const board = this._board;
    if (!hass || !board) {
      return;
    }

    const styles = calendarStyles(board);
    const entityIds = Object.keys(styles).sort();
    const { start, end } = this._range();

    // Re-fetch when the range or the calendars change, and when a calendar entity
    // flips state (an event started or ended). Everything else in `hass` is noise.
    const stamps = entityIds.map((id) => hass.states[id]?.last_changed ?? '-');
    const signature = [
      start.getTime(),
      end.getTime(),
      entityIds.join(','),
      stamps.join(','),
      this._reloadToken,
    ].join('|');

    if (signature === this._loadedSignature) {
      return;
    }
    this._loadedSignature = signature;

    if (entityIds.length === 0) {
      this._events = [];
      this._failed = [];
      return;
    }

    this._loading = true;
    try {
      const { events, failed } = await fetchEvents(hass, styles, start, end);
      // A newer fetch may have started meanwhile; only the latest one may publish.
      if (this._loadedSignature === signature) {
        this._events = events;
        this._failed = failed;
      }
    } finally {
      if (this._loadedSignature === signature) {
        this._loading = false;
      }
    }
  }

  // --- interaction --------------------------------------------------------

  private _step(direction: -1 | 1): void {
    if (this._view === 'month') {
      this._anchor = addMonths(this._anchor, direction);
    } else if (this._view === 'week') {
      this._anchor = addDays(this._anchor, 7 * direction);
    } else {
      this._anchor = addDays(this._anchor, direction);
    }
  }

  private _goToday(): void {
    this._anchor = startOfDay(new Date());
  }

  private _setView(view: CalendarView): void {
    this._view = view;
  }

  private get _createEnabled(): boolean {
    return this._config.create !== false;
  }

  private _openCreate(day: Date): void {
    if (this._createEnabled) {
      this._dialogDay = day;
    }
  }

  private _openDay(day: Date): void {
    this._anchor = startOfDay(day);
    this._view = 'day';
  }

  // --- formatting ---------------------------------------------------------

  private _formatTime(date: Date): string {
    return new Intl.DateTimeFormat(localeOf(this.hass!), {
      hour: 'numeric',
      minute: '2-digit',
      hour12: prefersHour12(this.hass!),
    }).format(date);
  }

  private _title(): string {
    const locale = localeOf(this.hass!);
    if (this._view === 'month') {
      return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(this._anchor);
    }
    if (this._view === 'week') {
      const { start, end } = this._range();
      const formatter = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      return formatter.formatRange(start, addDays(end, -1));
    }
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(this._anchor);
  }

  private _weekdayLabels(): string[] {
    const formatter = new Intl.DateTimeFormat(localeOf(this.hass!), { weekday: 'short' });
    const base = startOfWeek(new Date(), this._firstDay);
    return Array.from({ length: 7 }, (_, index) => formatter.format(addDays(base, index)));
  }

  // --- rendering ----------------------------------------------------------

  private _icon(path: string): TemplateResult {
    return html`<svg viewBox="0 0 24 24"><path d=${path} /></svg>`;
  }

  private _renderEvent(event: HearthEvent, compact: boolean): TemplateResult {
    const time = event.allDay ? '' : this._formatTime(event.start);
    return html`
      <div
        class="event ${event.allDay ? 'all-day' : ''}"
        style=${`--event-color:${event.color}`}
        title=${event.summary}
      >
        ${event.allDay
          ? nothing
          : html`<span class="dot"></span><span class="time">${time}</span>`}
        <span class="summary">${event.summary}</span>
        ${compact || !event.location
          ? nothing
          : html`<span class="location">${event.location}</span>`}
      </div>
    `;
  }

  private _renderMonth(): TemplateResult {
    const { start, end } = this._range();
    const days = daysBetween(start, end);
    const buckets = groupByDay(this._events, days);
    const limit = this._config.max_events_per_day ?? 3;
    const month = this._anchor.getMonth();

    return html`
      <div class="weekday-row">
        ${this._weekdayLabels().map((label) => html`<div class="weekday">${label}</div>`)}
      </div>
      <div class="month-grid" style=${`--weeks:${days.length / 7}`}>
        ${days.map((day) => {
          const events = buckets.get(toDateKey(day)) ?? [];
          const shown = events.slice(0, limit);
          const hidden = events.length - shown.length;
          return html`
            <div
              class="day-cell ${day.getMonth() === month ? '' : 'outside'} ${isToday(day)
                ? 'today'
                : ''}"
              @click=${() => this._openCreate(day)}
            >
              <button
                class="day-number"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._openDay(day);
                }}
              >
                ${day.getDate()}
              </button>
              <div class="day-events">
                ${shown.map((event) => this._renderEvent(event, true))}
                ${hidden > 0
                  ? html`<button
                      class="more"
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._openDay(day);
                      }}
                    >
                      +${hidden}
                    </button>`
                  : nothing}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderWeek(): TemplateResult {
    const { start, end } = this._range();
    const days = daysBetween(start, end);
    const buckets = groupByDay(this._events, days);
    const formatter = new Intl.DateTimeFormat(localeOf(this.hass!), {
      weekday: 'short',
      day: 'numeric',
    });

    return html`
      <div class="week-grid">
        ${days.map((day) => {
          const events = buckets.get(toDateKey(day)) ?? [];
          return html`
            <div
              class="week-column ${isToday(day) ? 'today' : ''}"
              @click=${() => this._openCreate(day)}
            >
              <div class="week-heading">${formatter.format(day)}</div>
              <div class="week-events">
                ${events.length === 0
                  ? html`<div class="empty-hint">—</div>`
                  : events.map((event) => this._renderEvent(event, true))}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderDay(): TemplateResult {
    const { start, end } = this._range();
    const events = groupByDay(this._events, daysBetween(start, end)).get(toDateKey(start)) ?? [];

    return html`
      <div class="day-list" @click=${() => this._openCreate(start)}>
        ${events.length === 0
          ? html`<div class="empty-day">
              Nothing planned.${this._createEnabled ? ' Tap to add something.' : ''}
            </div>`
          : events.map((event) => this._renderEvent(event, false))}
      </div>
    `;
  }

  private _renderLegend(board: HearthBoard): TemplateResult | typeof nothing {
    if (this._config.show_legend === false || board.members.length === 0) {
      return nothing;
    }
    return html`
      <div class="legend">
        ${board.members.map(
          (member) => html`
            <span class="legend-item">
              <span class="swatch" style=${`background:${member.color}`}></span>
              ${member.name}
            </span>
          `,
        )}
      </div>
    `;
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }

    const board = this._board;
    if (!board) {
      return html`
        <ha-card>
          <div class="notice">
            No Hearth board found. Add the Hearth integration, or set
            <code>board_entity</code> in this card's configuration.
          </div>
        </ha-card>
      `;
    }

    const styles: Record<string, CalendarStyle> = calendarStyles(board);
    const switcher = this._config.views ?? VIEWS;

    return html`
      <ha-card>
        <div class="toolbar">
          <button class="icon-button" @click=${() => this._step(-1)} aria-label="Previous">
            ${this._icon(ICONS.previous)}
          </button>
          <button class="icon-button" @click=${this._goToday} aria-label="Today">
            ${this._icon(ICONS.today)}
          </button>
          <button class="icon-button" @click=${() => this._step(1)} aria-label="Next">
            ${this._icon(ICONS.next)}
          </button>
          <h1 class="title">${this._title()}</h1>
          ${switcher.length > 1
            ? html`<div class="segmented">
                ${switcher.map(
                  (view) => html`
                    <button
                      aria-pressed=${this._view === view}
                      @click=${() => this._setView(view)}
                    >
                      ${VIEW_LABELS[view]}
                    </button>
                  `,
                )}
              </div>`
            : nothing}
          ${this._createEnabled
            ? html`<button
                class="icon-button"
                aria-label="New event"
                @click=${() => this._openCreate(startOfDay(this._anchor))}
              >
                ${this._icon(ICONS.add)}
              </button>`
            : nothing}
        </div>

        ${this._renderLegend(board)}
        ${Object.keys(styles).length === 0
          ? html`<div class="notice">
              No calendars are assigned yet. Open the Hearth integration's options and give
              your family members their calendars.
            </div>`
          : nothing}
        ${this._failed.length > 0
          ? html`<div class="warning">
              ${this._icon(ICONS.warning)}
              <span>Could not load: ${this._failed.join(', ')}</span>
            </div>`
          : nothing}

        <div class="body ${this._loading ? 'loading' : ''}">
          ${this._view === 'month'
            ? this._renderMonth()
            : this._view === 'week'
              ? this._renderWeek()
              : this._renderDay()}
        </div>

        ${this._dialogDay
          ? html`<hearth-event-dialog
              .hass=${this.hass}
              .board=${board}
              .day=${this._dialogDay}
              .defaultCalendar=${this._config.default_calendar}
              @hearth-close=${() => {
                this._dialogDay = undefined;
              }}
              @hearth-created=${() => this._reload()}
            ></hearth-event-dialog>`
          : nothing}
      </ha-card>
    `;
  }

  static override styles = [
    hearthTokens,
    hearthButtons,
    css`
      ha-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        padding: 12px;
        box-sizing: border-box;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }

      .title {
        flex: 1;
        margin: 0 8px;
        font-size: 1.3rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding: 8px 4px 4px;
      }

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: var(--hearth-muted);
      }

      .swatch {
        width: 12px;
        height: 12px;
        border-radius: 3px;
      }

      .notice,
      .empty-day {
        padding: 20px 8px;
        color: var(--hearth-muted);
        font-size: 0.9rem;
      }

      .notice code {
        background: var(--hearth-surface-alt);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .warning {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px;
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(230, 160, 30, 0.14);
        color: var(--warning-color, #b8860b);
        font-size: 0.82rem;
      }

      .warning svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
        flex: none;
      }

      .body {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        transition: opacity 120ms ease;
      }

      .body.loading {
        opacity: 0.55;
      }

      /* --- month --- */

      .weekday-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        padding: 6px 0 4px;
      }

      .weekday {
        text-align: center;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--hearth-muted);
      }

      .month-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(var(--weeks, 6), minmax(64px, 1fr));
        gap: 2px;
      }

      .day-cell {
        display: flex;
        flex-direction: column;
        min-width: 0;
        padding: 2px;
        border-radius: 8px;
        background: var(--hearth-surface-alt);
        overflow: hidden;
      }

      .day-cell.outside {
        opacity: 0.45;
      }

      .day-cell.today {
        outline: 2px solid var(--hearth-today);
        outline-offset: -2px;
      }

      .day-number {
        align-self: flex-start;
        min-width: 26px;
        height: 26px;
        border-radius: 13px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .day-cell.today .day-number {
        background: var(--hearth-today);
        color: var(--text-primary-color, #fff);
      }

      .day-events {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
      }

      .more {
        align-self: flex-start;
        padding: 0 4px;
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--hearth-muted);
      }

      /* --- week --- */

      .week-grid {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }

      .week-column {
        display: flex;
        flex-direction: column;
        min-width: 0;
        border-radius: 8px;
        background: var(--hearth-surface-alt);
        overflow: hidden;
      }

      .week-column.today {
        outline: 2px solid var(--hearth-today);
        outline-offset: -2px;
      }

      .week-heading {
        padding: 6px 4px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        border-bottom: 1px solid var(--hearth-line);
      }

      .week-events {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 4px 3px;
        overflow-y: auto;
      }

      .empty-hint {
        text-align: center;
        color: var(--hearth-muted);
        opacity: 0.5;
      }

      /* --- day --- */

      .day-list {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 8px 2px;
        overflow-y: auto;
      }

      .day-list .event {
        min-height: var(--hearth-touch);
        font-size: 1rem;
        align-items: center;
      }

      /* --- events --- */

      .event {
        display: flex;
        align-items: baseline;
        gap: 5px;
        min-width: 0;
        padding: 3px 6px;
        border-radius: 5px;
        border-left: 3px solid var(--event-color);
        background: color-mix(in srgb, var(--event-color) 18%, transparent);
        font-size: 0.78rem;
        line-height: 1.25;
      }

      .event.all-day {
        background: var(--event-color);
        color: #fff;
        border-left-color: transparent;
        font-weight: 600;
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--event-color);
        flex: none;
      }

      .time {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        flex: none;
      }

      .summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .location {
        color: var(--hearth-muted);
        font-size: 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-calendar-card': HearthCalendarCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'hearth-calendar-card',
  name: 'Hearth Calendar',
  description: 'Family calendar as a month, week or day grid, coloured per member.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/Homeassistant-daely',
});
