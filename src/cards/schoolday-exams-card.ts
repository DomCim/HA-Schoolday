/**
 * The tests still to come, for the whole family, in date order.
 *
 * The timetable labels an exam on its lesson and the evening before says it again, but
 * both only once it is close — and an exam is worth seeing while there is still time to
 * revise. This is the list that answers "what is coming up" weeks ahead.
 *
 * One list rather than a column per child: the question at the kitchen table is when
 * the next busy week is, and that is about everybody at once. Each line carries the
 * child's colour, so the list can still be read by child at a glance.
 *
 * The exams come from each member sensor's `exams`, which the integration reads from
 * the child's exams calendar well beyond the outlook — see EXAMS_AHEAD_DAYS.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarUrl, findBoard, memberSensor, type SchooldayMember } from '../lib/board';
import { localeOf } from '../lib/dates';
import { isRtl, t } from '../lib/i18n';
import { schooldayTokens } from '../lib/styles';
import { parseExams, todayKey, type Exam } from '../lib/timetable';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

export interface SchooldayExamsCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Show only this member, by id or name. Unset shows everyone with an exam. */
  member?: string;
  /** Restrict to these members, by id or name. */
  members?: string[];
  /** How many days ahead to list. Unset lists everything the sensors publish. */
  days?: number;
}

interface Entry {
  member: SchooldayMember;
  exam: Exam;
  /** Whole days from today: 0 is today. */
  inDays: number;
}

const DAY_MS = 86_400_000;

/** A `YYYY-MM-DD` as local midnight, so day arithmetic never crosses a zone change. */
function parseDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function daysBetween(from: Date, to: Date): number {
  // Rounded rather than floored: a day with a clock change is 23 or 25 hours long.
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

/**
 * The first day of the week a date falls in, for a household whose week begins on
 * `weekStart` (0 = Monday … 6 = Sunday) — so a school that starts on Sunday puts
 * Sunday's test in the same week as the Thursday after it, as its timetable does.
 */
function weekStartOf(date: Date, weekStart: number): Date {
  const first = new Date(date);
  const weekday = (first.getDay() + 6) % 7;
  first.setDate(first.getDate() - ((weekday - weekStart + 7) % 7));
  return first;
}

@customElement('schoolday-exams-card')
export class SchooldayExamsCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayExamsCardConfig = { type: '' };

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-exams-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public setConfig(config: SchooldayExamsCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 4;
  }

  public getGridOptions(): { columns: number; rows: 'auto'; min_columns: number } {
    return { columns: 12, rows: 'auto', min_columns: 6 };
  }

  private _entries(members: SchooldayMember[]): Entry[] {
    const today = parseDate(todayKey());
    const limit = Number(this._config.days);
    const entries: Entry[] = [];
    for (const member of members) {
      for (const exam of parseExams(memberSensor(this.hass!, member.id)?.attributes?.exams)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(exam.date)) {
          continue;
        }
        const inDays = daysBetween(today, parseDate(exam.date));
        // The sensor drops yesterday's exams only when it next reads the calendar, so
        // the card does not trust it to have done so by the time the date changes.
        if (inDays < 0 || (limit > 0 && inDays >= limit)) {
          continue;
        }
        entries.push({ member, exam, inDays });
      }
    }
    return entries.sort(
      (a, b) =>
        a.exam.date.localeCompare(b.exam.date) ||
        (a.exam.start ?? '').localeCompare(b.exam.start ?? '') ||
        a.member.order - b.member.order,
    );
  }

  /** "This week", "Next week", "In 3 weeks", counted in calendar weeks, not in days. */
  private _weekHead(weeks: number): string {
    if (weeks === 0) {
      return t(this.hass, 'exams.this_week');
    }
    if (weeks === 1) {
      return t(this.hass, 'exams.next_week');
    }
    return t(this.hass, 'exams.in_weeks', { weeks });
  }

  /** The school days of a week: its first five, as the timetable's "school" days are. */
  private _weekRange(first: Date): string {
    const fifth = new Date(first);
    fifth.setDate(fifth.getDate() + 4);
    const format = new Intl.DateTimeFormat(localeOf(this.hass!), {
      day: 'numeric',
      month: 'short',
    });
    return `${format.format(first)} – ${format.format(fifth)}`;
  }

  private _when(inDays: number): string {
    if (inDays === 0) {
      return t(this.hass, 'exams.today');
    }
    if (inDays === 1) {
      return t(this.hass, 'exams.tomorrow');
    }
    return t(this.hass, 'exams.in_days', { days: inDays });
  }

  private _renderEntry(entry: Entry, showName: boolean): TemplateResult {
    const { member, exam, inDays } = entry;
    const date = parseDate(exam.date);
    const locale = localeOf(this.hass!);
    const avatar = showName ? avatarUrl(this.hass!, member.avatar) : null;
    // The period says more than a clock time at a school, where nobody thinks of the
    // third lesson as 09:50; the time is only the fallback for one outside the grid.
    const slot =
      exam.period !== null
        ? t(this.hass, 'exams.period', { period: exam.period })
        : exam.start ?? '';
    return html`
      <div
        class="exam ${inDays <= 1 ? 'soon' : ''}"
        style=${`--member-color:${member.color}`}
      >
        <div class="date">
          <span class="weekday">
            ${new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)}
          </span>
          <span class="day">
            ${new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'numeric' }).format(date)}
          </span>
        </div>
        <div class="what">
          <span class="title"><bdi>${exam.title}</bdi></span>
          <span class="meta">
            ${showName
              ? html`<span class="who">
                  ${avatar ? html`<img class="avatar" src=${avatar} alt="" />` : nothing}
                  <bdi>${member.name}</bdi>
                </span>`
              : nothing}
            ${slot ? html`<span class="slot">${slot}</span>` : nothing}
          </span>
        </div>
        <span class="when">${this._when(inDays)}</span>
      </div>
    `;
  }

  protected override willUpdate(): void {
    // As the other cards: a preview or a docs shot has no rtl page to inherit from.
    this.dir = isRtl(this.hass) ? 'rtl' : '';
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    const board = findBoard(this.hass, this._config.board_entity);
    if (!board) {
      return html`<ha-card><div class="notice">${t(this.hass, 'board.missing')}</div></ha-card>`;
    }

    const wanted = (this._config.members ?? (this._config.member ? [this._config.member] : []))
      .map((value) => value.toLowerCase());
    const members = board.members.filter(
      (member) =>
        !wanted.length ||
        wanted.includes(member.id.toLowerCase()) ||
        wanted.includes(member.name.toLowerCase()),
    );
    const entries = this._entries(members);
    if (!entries.length) {
      return html`<ha-card><div class="notice">${t(this.hass, 'exams.none')}</div></ha-card>`;
    }

    // A name on every line is noise when the card only ever shows one child.
    const showName = members.length > 1;
    const weekStart = board.timetable?.weekStart ?? 0;
    const thisWeek = weekStartOf(parseDate(todayKey()), weekStart);
    const weeks = new Map<number, Entry[]>();
    for (const entry of entries) {
      const week = Math.round(
        daysBetween(thisWeek, weekStartOf(parseDate(entry.exam.date), weekStart)) / 7,
      );
      weeks.set(week, [...(weeks.get(week) ?? []), entry]);
    }

    return html`
      <ha-card>
        ${[...weeks.entries()].map(([week, group]) => {
          const first = new Date(thisWeek);
          first.setDate(first.getDate() + week * 7);
          return html`
            <div class="week">
              <div class="week-head">
                <span>${this._weekHead(week)}</span>
                <span class="range">${this._weekRange(first)}</span>
              </div>
              ${group.map((entry) => this._renderEntry(entry, showName))}
            </div>
          `;
        })}
      </ha-card>
    `;
  }

  static override styles = [
    schooldayTokens,
    css`
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        box-sizing: border-box;
      }

      .week {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .week-head {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--schoolday-muted);
      }

      .week-head .range {
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0;
      }

      .exam {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: var(--schoolday-touch);
        padding: 6px 10px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--member-color) 14%, var(--schoolday-surface));
      }

      /* Today and tomorrow are the two days where the list stops being a plan and
         becomes the evening's revision, so they are the ones that stand out. */
      .exam.soon {
        background: color-mix(in srgb, var(--member-color) 24%, var(--schoolday-surface));
      }

      .date {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 44px;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
      }

      .weekday {
        font-size: 0.72rem;
        text-transform: uppercase;
        color: var(--schoolday-muted);
      }

      /* The child's colour on the date as well as on the name, so a card showing one
         child, which leaves the name off, still says whose list it is. */
      .day {
        font-weight: 700;
        color: var(--member-color);
      }

      .what {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }

      .title {
        font-size: 1rem;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: var(--schoolday-muted);
      }

      .who {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
        color: var(--member-color);
      }

      .who .avatar {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        object-fit: cover;
      }

      .when {
        flex: none;
        font-size: 0.8rem;
        color: var(--schoolday-muted);
        white-space: nowrap;
      }

      .exam.soon .when {
        font-weight: 700;
        color: var(--primary-text-color);
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
    'schoolday-exams-card': SchooldayExamsCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'schoolday-exams-card',
  name: 'Schoolday Exams',
  description: 'The exams still to come for every child, week by week.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
