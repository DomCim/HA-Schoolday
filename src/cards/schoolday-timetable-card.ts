/**
 * The school timetable — the week on the wall, in the family's own colours.
 *
 * Everything it draws comes from the Schoolday options: the periods and their breaks
 * from the board sensor, the lessons from the member sensors. A card with no options
 * at all is the normal case — it picks the household's lesson grid, the members who
 * actually have a timetable, and the days they have school on.
 *
 * Like the routines, the timetable is typed in rather than read from a calendar: it
 * is fixed for a school year, and forty recurring events a week is not a calendar
 * anybody wants to maintain.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarUrl, findBoard, memberSensor, type SchooldayMember } from '../lib/board';
import { localeOf } from '../lib/dates';
import { t } from '../lib/i18n';
import { schooldayButtons, schooldayTokens } from '../lib/styles';
import {
  buildRows,
  currentPeriod,
  formatTime,
  hasLessons,
  lessonsOn,
  SLOTS_PER_WEEK,
  nowMinutes,
  dayFor,
  outlookDate,
  outlookOf,
  periodProgress,
  weekOf,
  weekdayIndex,
  type Outlook,
  type TimetableGrid,
  type TimetableLesson,
  type TimetableWeek,
} from '../lib/timetable';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

export type TimetableLayout = 'auto' | 'week' | 'day';
export type TimetableDays = 'auto' | 'school' | 'week';

/** Below this the week does not fit legibly, so the card shows one day instead. */
const NARROW_PX = 560;

/** 1 January 2024 was a Monday, which makes it a convenient weekday-name origin. */
const WEEKDAY_ORIGIN = new Date(2024, 0, 1);

export interface SchooldayTimetableCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Show only this member, by id or name. Otherwise the card offers a switcher. */
  member?: string;
  /** Limit the switcher to these members, by id or name. */
  members?: string[];
  /** "auto" shows the week when there is room for it, one day when there is not. */
  layout?: TimetableLayout;
  /** Which weekdays to show. "auto" follows the timetable itself. */
  week_days?: TimetableDays;
  show_rooms?: boolean;
  show_breaks?: boolean;
  show_times?: boolean;
  /** Hide periods that are free on every day shown. */
  hide_empty_periods?: boolean;
  /** Mark today, the running lesson and what is coming next. */
  highlight?: boolean;
  /**
   * Point each weekday at the next one it can mean, rolling days that have been on to
   * next week. Off shows the week as it stands, past days included.
   */
  roll_days?: boolean;
}

@customElement('schoolday-timetable-card')
export class SchooldayTimetableCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayTimetableCardConfig = { type: '' };
  /** The member picked with the chips; unset means "the first one". */
  @state() private _memberId?: string;
  /** The day picked in day view; unset means "today, or the first school day". */
  @state() private _day?: number;
  @state() private _narrow = false;
  /** Bumped on a timer so the running lesson stays the running lesson. */
  @state() private _tick = 0;

  private _resizeObserver?: ResizeObserver;
  private _timer?: ReturnType<typeof setInterval>;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-timetable-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return { layout: 'auto', week_days: 'auto' };
  }

  public setConfig(config: SchooldayTimetableCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 8;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver(([entry]) => {
      this._narrow = entry.contentRect.width < NARROW_PX;
    });
    this._resizeObserver.observe(this);
    // Half a minute is close enough for a lesson that lasts forty-five.
    this._timer = setInterval(() => {
      this._tick += 1;
    }, 30_000);
  }

  public override disconnectedCallback(): void {
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
    super.disconnectedCallback();
  }

  // --- data ---------------------------------------------------------------

  /** The members this card may show: they have a timetable, and are not filtered out. */
  private _candidates(
    members: SchooldayMember[],
  ): { member: SchooldayMember; week: TimetableWeek; outlook: Outlook }[] {
    const wanted = (this._config.members ?? (this._config.member ? [this._config.member] : []))
      .map((value) => value.toLowerCase());

    return members
      .filter(
        (member) =>
          !wanted.length ||
          wanted.includes(member.id.toLowerCase()) ||
          wanted.includes(member.name.toLowerCase()),
      )
      .map((member) => {
        const sensor = memberSensor(this.hass!, member.id);
        return { member, week: weekOf(sensor), outlook: outlookOf(sensor) };
      })
      .filter((entry) => hasLessons(entry.week));
  }

  /** The weekdays to draw, 0 = Monday. */
  private _weekdays(week: TimetableWeek): number[] {
    const setting = this._config.week_days ?? 'auto';
    if (setting === 'week') {
      return [0, 1, 2, 3, 4, 5, 6];
    }
    if (setting === 'school') {
      return [0, 1, 2, 3, 4];
    }
    // Monday to Friday, extended only if there really is something at the weekend.
    // A Wednesday off stays a visible gap rather than vanishing from the grid.
    //
    // Slots are folded back to weekdays first: with a two-week timetable the map runs
    // to 13, and taking the maximum of that would draw a fortnight of columns.
    const used = Object.keys(week)
      .map(Number)
      .filter((slot) => (week[slot] ?? []).length > 0)
      .map((slot) => slot % SLOTS_PER_WEEK);
    const last = Math.max(4, ...used);
    return Array.from({ length: last + 1 }, (_, index) => index);
  }

  private _weekdayName(weekday: number, style: 'short' | 'long'): string {
    const date = new Date(WEEKDAY_ORIGIN);
    date.setDate(date.getDate() + weekday);
    return new Intl.DateTimeFormat(localeOf(this.hass!), { weekday: style }).format(date);
  }

  /**
   * The date a column stands for, as day and month.
   *
   * A column no longer means "Tuesdays in general" but one particular Tuesday, and
   * once Monday's column has rolled on to next week the reader has no way to tell
   * which one without seeing it.
   */
  /** The dated day a column stands for, honouring the roll switch in one place. */
  private _dayFor(outlook: Outlook, weekday: number) {
    return dayFor(outlook, weekday, this._config.roll_days !== false);
  }

  private _columnDate(outlook: Outlook, weekday: number): string | null {
    const date = outlookDate(this._dayFor(outlook, weekday));
    if (!date) {
      return null;
    }
    return new Intl.DateTimeFormat(localeOf(this.hass!), {
      day: 'numeric',
      month: 'numeric',
    }).format(date);
  }

  /**
   * What closes this day and in what way, or null when lessons are happening.
   *
   * The kind travels with the words because the two read differently: a holiday is
   * the absence of something, holiday care is a thing the child is actually doing.
   * Drawn alike, a week of both says nothing about which day is which.
   */
  private _closure(outlook: Outlook, weekday: number): { mode: string; label: string } | null {
    const day = this._dayFor(outlook, weekday);
    if (!day || day.mode === 'school') {
      return null;
    }
    // An illness has no label of its own — there is no event behind it — so it always
    // falls through to the word, which is the whole of what there is to say.
    const fallback = {
      care: 'timetable.care',
      sick: 'timetable.sick',
      event: 'timetable.event',
      free: 'timetable.free',
    }[day.mode];
    return {
      mode: day.mode,
      label: (day.mode === 'sick' ? null : day.label) ?? t(this.hass, fallback ?? 'timetable.free'),
    };
  }

  /**
   * The columns grouped into stretches that close the same way.
   *
   * Six weeks of summer holidays wrote the same words into every column, which says
   * no more than writing them once and reads like a stutter. Neighbouring days that
   * are shut for the same reason become one block; a day that differs — a day in
   * care in the middle of the holidays — is exactly what stands out then.
   */
  private _closureRuns(
    outlook: Outlook,
    columns: number[],
  ): { start: number; span: number; closed: { mode: string; label: string } | null }[] {
    const runs: { start: number; span: number; closed: { mode: string; label: string } | null }[] =
      [];
    columns.forEach((weekday, index) => {
      const closed = this._closure(outlook, weekday);
      const last = runs[runs.length - 1];
      if (
        last &&
        last.closed?.mode === closed?.mode &&
        last.closed?.label === closed?.label &&
        (last.closed === null) === (closed === null)
      ) {
        last.span += 1;
        return;
      }
      runs.push({ start: index, span: 1, closed });
    });
    return runs;
  }

  private _color(grid: TimetableGrid, subject: string): string {
    return grid.subjects[subject] ?? 'var(--schoolday-line)';
  }

  /**
   * What one column actually holds, by period.
   *
   * A column is a date, not a weekday, and only the date knows that the third period
   * was cancelled or is being covered by somebody else. Everything the card draws goes
   * through here, so the grid, the hiding of empty periods and the running-lesson line
   * can never disagree about what is on.
   */
  private _columnLessons(
    week: TimetableWeek,
    outlook: Outlook,
    weekday: number,
  ): Map<number, { lesson: TimetableLesson; changed: boolean }> {
    return new Map(
      lessonsOn(week, weekday, this._dayFor(outlook, weekday)).map((entry) => [
        entry.lesson.period,
        entry,
      ]),
    );
  }

  // --- pieces -------------------------------------------------------------

  private _renderChips(
    candidates: { member: SchooldayMember; week: TimetableWeek }[],
    selected: SchooldayMember,
  ): TemplateResult | typeof nothing {
    if (candidates.length < 2) {
      return nothing;
    }
    return html`
      <div class="chips">
        ${candidates.map(
          ({ member }) => html`
            <button
              class="chip"
              style=${`--member-color:${member.color}`}
              aria-pressed=${member.id === selected.id}
              @click=${() => {
                this._memberId = member.id;
              }}
            >
              ${member.name}
            </button>
          `,
        )}
      </div>
    `;
  }

  /** A holiday: the plan stays on screen, but today is not happening. */
  private _renderNoSchool(reason: string | null): TemplateResult {
    return html`
      <div class="status">
        <span class="pill closed">${t(this.hass, 'timetable.no_school')}</span>
        ${reason ? html`<span class="status-text">${reason}</span>` : nothing}
      </div>
    `;
  }

  /** What is running now, or what comes next — the line a wall panel is read for. */
  private _renderStatus(
    grid: TimetableGrid,
    day: Map<number, { lesson: TimetableLesson; changed: boolean }>,
  ): TemplateResult | typeof nothing {
    if (this._config.highlight === false) {
      return nothing;
    }
    const minutes = nowMinutes();
    const running = currentPeriod(grid, minutes);
    const lesson = running ? day.get(running.index)?.lesson : undefined;

    if (running && lesson) {
      const left = running.endMinutes - minutes;
      return html`
        <div class="status">
          <span class="pill" style=${`--subject:${this._color(grid, lesson.subject)}`}
            >${t(this.hass, 'timetable.now')}</span
          >
          <span class="status-text">
            ${lesson.subject}${lesson.room ? html` · ${lesson.room}` : nothing}
          </span>
          <span class="status-muted">${t(this.hass, 'timetable.remaining', { minutes: left })}</span>
        </div>
      `;
    }

    const upcoming = grid.periods.find(
      (period) => period.startMinutes > minutes && day.has(period.index),
    );
    if (upcoming) {
      const next = day.get(upcoming.index)!.lesson;
      return html`
        <div class="status">
          <span class="pill next">${t(this.hass, 'timetable.next')}</span>
          <span class="status-text">
            ${next.subject}${next.room ? html` · ${next.room}` : nothing}
          </span>
          <span class="status-muted">${formatTime(this.hass, upcoming.start)}</span>
        </div>
      `;
    }

    // Nothing left today, but there was something: say so rather than stay blank.
    if (day.size) {
      return html`<div class="status">
        <span class="status-muted">${t(this.hass, 'timetable.done_for_today')}</span>
      </div>`;
    }
    return nothing;
  }

  private _renderCell(
    grid: TimetableGrid,
    entry: { lesson: TimetableLesson; changed: boolean } | undefined,
    isNow: boolean,
    progress: number | null,
    place: string,
  ): TemplateResult {
    if (!entry) {
      return html`<div class="cell free ${isNow ? 'now' : ''}" style=${place}></div>`;
    }
    const { lesson, changed } = entry;
    const showRoom = this._config.show_rooms !== false && lesson.room;
    return html`
      <div
        class="cell ${isNow ? 'now' : ''} ${changed ? 'changed' : ''}"
        style=${`--subject:${this._color(grid, lesson.subject)};${place}`}
        title=${`${lesson.room ? `${lesson.subject} · ${lesson.room}` : lesson.subject}${
          changed ? ` · ${t(this.hass, 'timetable.changed')}` : ''
        }`}
      >
        <span class="subject">${lesson.subject}</span>
        ${showRoom ? html`<span class="room">${lesson.room}</span>` : nothing}
        ${changed
          ? html`<span class="swap" aria-label=${t(this.hass, 'timetable.changed')}></span>`
          : nothing}
        ${isNow && progress !== null
          ? html`<div class="progress"><div style=${`width:${Math.round(progress * 100)}%`}></div></div>`
          : nothing}
      </div>
    `;
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }

    const board = findBoard(this.hass, this._config.board_entity);
    if (!board) {
      return html`<ha-card><div class="notice">${t(this.hass, 'board.missing')}</div></ha-card>`;
    }

    const grid = board.timetable;
    if (!grid) {
      return html`<ha-card
        ><div class="notice">${t(this.hass, 'timetable.no_periods')}</div></ha-card
      >`;
    }

    const candidates = this._candidates(board.members);
    if (!candidates.length) {
      return html`<ha-card
        ><div class="notice">${t(this.hass, 'timetable.none_configured')}</div></ha-card
      >`;
    }

    const selected =
      candidates.find((entry) => entry.member.id === this._memberId) ?? candidates[0];
    const { member, week, outlook } = selected;

    const weekdays = this._weekdays(week);
    const today = weekdayIndex();
    const highlight = this._config.highlight !== false;

    // One day at a time when the card is too narrow for a week, or when asked to.
    const layout = this._config.layout ?? 'auto';
    const dayView = layout === 'day' || (layout === 'auto' && this._narrow);
    const day =
      this._day !== undefined && weekdays.includes(this._day)
        ? this._day
        : weekdays.includes(today)
          ? today
          : weekdays[0];
    const columns = dayView ? [day] : weekdays;

    /*
     * Whether today is happening for *this* member, which is not the same question as
     * whether the school is open. A holiday closes it for everybody; holiday care and
     * an illness close it for one child, and the board sensor cannot know either. Read
     * from their own outlook, so the running-lesson line falls silent for the child who
     * is in bed without falling silent for their brother.
     */
    const closedToday = this._closure(outlook, today);
    const openColumns = columns.filter((weekday) => this._closure(outlook, weekday) === null);
    const closures = openColumns.length < columns.length;

    // Worked out once per column and then only read: the grid, the hiding of empty
    // periods and the running-lesson line all have to agree about what is on.
    const byColumn = new Map(
      columns.map((weekday) => [weekday, this._columnLessons(week, outlook, weekday)]),
    );

    const rows = buildRows(grid, (period) => {
      if (this._config.hide_empty_periods === false) {
        return true;
      }
      return openColumns.some((weekday) => byColumn.get(weekday)?.has(period.index));
    });

    const running = highlight && !closedToday ? currentPeriod(grid) : undefined;
    const showTimes = this._config.show_times !== false;
    const showBreaks = this._config.show_breaks !== false;
    // Every item is placed explicitly below, so the rows have to be settled first:
    // a hidden break must not leave a numbered gap behind.
    const visibleRows = showBreaks ? rows : rows.filter((row) => row.kind === 'period');

    return html`
      <ha-card style=${`--member-color:${member.color}`}>
        <div class="head">
          <div class="title">
            ${avatarUrl(this.hass, member.avatar)
              ? html`<img class="avatar" src=${avatarUrl(this.hass, member.avatar)!} alt="" />`
              : html`<span class="dot"></span>`}
            <span>${member.name}</span>
          </div>
          ${this._renderChips(candidates, member)}
        </div>
        ${highlight && closedToday
          ? this._renderNoSchool(closedToday.label)
          : highlight && weekdays.includes(today)
            ? this._renderStatus(grid, this._columnLessons(week, outlook, today))
            : nothing}
        ${dayView
          ? html`
              <div class="days">
                ${weekdays.map(
                  (weekday) => html`
                    <button
                      class="chip day ${weekday === today && highlight ? 'is-today' : ''}"
                      aria-pressed=${weekday === day}
                      @click=${() => {
                        this._day = weekday;
                      }}
                    >
                      ${this._weekdayName(weekday, 'short')}
                      ${this._columnDate(outlook, weekday)
                        ? html`<span class="chip-date"
                            >${this._columnDate(outlook, weekday)}</span
                          >`
                        : nothing}
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}

        <div
          class="grid"
          style=${`grid-template-columns:${showTimes ? 'max-content' : 'min-content'} repeat(${columns.length}, minmax(0, 1fr))`}
        >
          <!-- One surface per day, behind everything else in that column. Drawn first
               so the cells paint on top of it without needing a stacking context. -->
          ${columns.map(
            (_weekday, index) =>
              html`<div class="day-panel" style=${`grid-column:${index + 2};grid-row:1 / -1`}></div>`,
          )}
          <div class="corner" style="grid-column:1;grid-row:1"></div>
          ${columns.map(
            (weekday, index) => html`
              <div
                class="col-head ${highlight && weekday === today ? 'today' : ''}"
                style=${`grid-column:${index + 2};grid-row:1`}
              >
                <span class="col-day"
                  >${this._weekdayName(weekday, dayView ? 'long' : 'short')}</span
                >
                ${grid.cycleWeeks > 1
                  ? html`<span class="col-week"
                      >${this._dayFor(outlook, weekday)?.week === 1 ? 'B' : 'A'}</span
                    >`
                  : nothing}
                ${this._columnDate(outlook, weekday)
                  ? html`<span class="col-date">${this._columnDate(outlook, weekday)}</span>`
                  : nothing}
              </div>
            `,
          )}
          ${closures
            ? this._closureRuns(outlook, columns).map((run) =>
                run.closed
                  ? html`
                      <div
                        class="closure ${run.closed.mode}"
                        style=${`grid-column:${run.start + 2} / span ${run.span};grid-row:2`}
                        title=${run.closed.label}
                      >
                        ${run.closed.label}
                      </div>
                    `
                  : html`
                      <div
                        style=${`grid-column:${run.start + 2} / span ${run.span};grid-row:2`}
                      ></div>
                    `,
              )
            : nothing}
          ${visibleRows.map((row, rowIndex) => {
            const line = rowIndex + (closures ? 3 : 2);
            if (row.kind === 'break') {
              const span = `${formatTime(this.hass, row.gap.start)}\u2013${formatTime(
                this.hass,
                row.gap.end,
              )}`;
              return html`
                <div
                  class="t-break"
                  style=${`grid-column:1;grid-row:${line}`}
                  title=${`${t(this.hass, 'timetable.break')} \u00b7 ${span}`}
                >
                  ${t(this.hass, 'timetable.break')}
                </div>
                ${columns.map(
                  (_weekday, index) => html`
                    <div
                      class="d-break"
                      style=${`grid-column:${index + 2};grid-row:${line}`}
                      title=${`${t(this.hass, 'timetable.break')} \u00b7 ${span}`}
                    ></div>
                  `,
                )}
              `;
            }

            const { period } = row;
            const progress = highlight ? periodProgress(period) : null;
            return html`
              <div class="time" style=${`grid-column:1;grid-row:${line}`}>
                <span class="no">${period.index}</span>
                ${showTimes
                  ? html`<span class="span"
                      >${formatTime(this.hass, period.start)}<br />${formatTime(
                        this.hass,
                        period.end,
                      )}</span
                    >`
                  : nothing}
              </div>
              ${columns.map((weekday, index) =>
                this._closure(outlook, weekday) !== null
                  ? html`<div
                      class="cell closed"
                      style=${`grid-column:${index + 2};grid-row:${line}`}
                    ></div>`
                  : this._renderCell(
                      grid,
                      byColumn.get(weekday)?.get(period.index),
                      highlight && weekday === today && running?.index === period.index,
                      progress,
                      `grid-column:${index + 2};grid-row:${line}`,
                    ),
              )}
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static override styles = [
    schooldayTokens,
    schooldayButtons,
    css`
      /* The card measures itself to decide between the week and a single day, and an
         inline host has no width worth measuring. */
      :host {
        display: block;
      }

      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--schoolday-gap);
        margin-bottom: 8px;
      }

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--member-color);
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
      }

      .chips,
      .days {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .days {
        margin-bottom: 8px;
      }

      .chip {
        min-height: 36px;
        padding: 0 14px;
        border: 1px solid var(--schoolday-line);
        border-radius: 18px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--schoolday-muted);
      }

      .chip[aria-pressed='true'] {
        border-color: var(--member-color);
        background: color-mix(in srgb, var(--member-color) 18%, transparent);
        color: var(--primary-text-color);
      }

      .chip.day.is-today {
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .status {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 10px;
        font-size: 0.95rem;
      }

      .pill {
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: color-mix(in srgb, var(--subject) 22%, transparent);
        color: var(--primary-text-color);
      }

      .pill.next,
      .pill.closed {
        background: var(--schoolday-surface-alt);
        color: var(--schoolday-muted);
      }

      .status-text {
        font-weight: 600;
      }

      .status-muted {
        color: var(--schoolday-muted);
        font-size: 0.85rem;
      }

      .grid {
        display: grid;
        /* Wider between the days than between the periods: the eye needs a bigger gap
           across than down to read five columns as five days rather than one field. */
        row-gap: 4px;
        column-gap: 10px;
        align-items: stretch;
      }

      /* One unbroken surface per day, spanning the head and every period. This is what
         lets the eye take a column as one day instead of a run of loose chips — and it
         has to sit behind them, which is why nothing in this grid is auto-placed. */
      /* A day that is not happening keeps its place in the grid so the rows still line
         up, but carries nothing: stated outright rather than left to an undefined
         --subject quietly invalidating the chip's own background. */
      .cell.closed {
        background: none;
        border-left: none;
      }

      .day-panel {
        border-radius: 12px;
        background: var(--schoolday-surface-alt);
        /* Vertical only. Widening it would eat into the column gap that separates one
           day from the next, and the last day would push the grid into a scrollbar. */
        margin: -6px 0;
      }

      .col-head {
        padding: 2px 0 4px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      /* Which week of the cycle this column belongs to. Only drawn by an A/B school,
         where it is the difference between two entirely different Tuesdays. */
      .col-week {
        margin-left: 4px;
        padding: 0 4px;
        border-radius: 5px;
        background: color-mix(in srgb, currentColor 20%, transparent);
        font-size: 0.65rem;
      }

      .col-head.today {
        color: var(--text-primary-color, #fff);
        background: var(--schoolday-today);
        border-radius: 8px;
      }

      /* Sits under the date rather than beside it: the two are different questions —
         which day, and whether it is happening. */
      .closure {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: var(--schoolday-touch);
        padding: 6px 8px;
        margin-bottom: 2px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 10px;
        border-left: 3px solid var(--closure);
        background: color-mix(in srgb, var(--closure) 22%, transparent);
        color: var(--primary-text-color);
        font-size: 0.78rem;
        font-weight: 700;
        line-height: 1.2;
        text-align: center;
      }

      .closure.free {
        --closure: var(--schoolday-holiday);
      }

      .closure.care {
        --closure: var(--schoolday-care);
      }

      .closure.sick {
        --closure: var(--schoolday-sick);
      }

      .closure.event {
        --closure: var(--schoolday-event);
      }

      /* A lesson that is not the one the timetable promised. Marked rather than merely
         shown: a substitution the reader cannot see is worse than no substitution
         layer at all, because they would trust the wrong thing without knowing. */
      .cell.changed {
        outline: 2px dashed color-mix(in srgb, var(--subject) 65%, transparent);
        outline-offset: -2px;
      }

      .cell.changed .swap {
        position: absolute;
        top: 3px;
        right: 4px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--subject);
      }

      .cell {
        position: relative;
      }

      .time {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: 8px;
        text-align: right;
        font-size: 0.68rem;
        line-height: 1.25;
        color: var(--schoolday-muted);
        white-space: nowrap;
      }

      .time .no {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: var(--schoolday-touch);
        padding: 4px 8px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 10px;
        border-left: 3px solid var(--subject);
        background: color-mix(in srgb, var(--subject) 22%, transparent);
      }

      .cell .subject {
        font-size: 0.95rem;
        font-weight: 600;
        line-height: 1.15;
        overflow-wrap: anywhere;
      }

      .cell .room {
        margin-top: 2px;
        font-size: 0.72rem;
        color: var(--schoolday-muted);
      }

      /* A free period is drawn, not left out: the grid has to keep its shape, and an
         empty slot with nothing in it reads as a rendering fault. */
      .cell.free {
        background: transparent;
        border: 1px dashed var(--schoolday-line);
        opacity: 0.6;
      }

      .cell.now {
        box-shadow: inset 0 0 0 2px var(--schoolday-today);
      }

      .progress {
        height: 3px;
        margin-top: 4px;
        border-radius: 2px;
        background: var(--schoolday-line);
        overflow: hidden;
      }

      .progress > div {
        height: 100%;
        background: var(--schoolday-today);
      }

      .t-break {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 1px 4px 1px 0;
        font-size: 0.65rem;
        line-height: 1;
        color: var(--schoolday-muted);
        white-space: nowrap;
      }

      .d-break {
        display: flex;
        align-items: center;
        padding: 1px 0;
        min-height: 0.65rem;
      }

      .d-break::before {
        content: '';
        flex: 1;
        height: 1px;
        margin: 0 10px;
        background: var(--schoolday-line);
      }

      .break .line {
        flex: 1;
        height: 1px;
        background: var(--schoolday-line);
      }

      .notice {
        padding: 8px 2px;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'schoolday-timetable-card': SchooldayTimetableCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'schoolday-timetable-card',
  name: 'Schoolday Timetable',
  description:
    'The school timetable per child, colour-coded by subject, with the running lesson marked.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
