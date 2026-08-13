/**
 * How the routines are actually going — the record, per child.
 *
 * The routines card is deliberately not a reward system, and this one does not make it
 * into one: it is not on the wall for the children, it is for whoever has to decide
 * whether the evening routine is working. Those are different questions, and the
 * second one has never had an answer, because the ticks are wiped every midnight.
 *
 * So it draws three things and nothing else. How much of what was asked actually got
 * done, day by day. How that splits between the morning and the evening. And which
 * individual steps keep being skipped — which is usually the interesting one, because
 * a routine that fails is rarely failing everywhere at once. It is the same three
 * steps, and they are the ones that belong somewhere else in the day.
 *
 * Every figure comes from the `routine_stats` attribute the member sensor publishes;
 * this card computes no statistics of its own beyond picking a window out of the days.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarUrl, findBoard, memberSensor, type SchooldayMember } from '../lib/board';
import { localeOf } from '../lib/dates';
import { t } from '../lib/i18n';
import { schooldayButtons, schooldayTokens } from '../lib/styles';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';
import { BLOCK_ICONS, type RoutineBlock } from './schoolday-routines-card';

/** One day of the record, as `routine_stats.days` publishes it. */
interface StatsDay {
  date: string;
  /** What kind of day it was: school, care, free, event or sick. */
  mode: string;
  asked: number;
  done: number;
}

/** One step's tally over the window, as `routine_stats.steps` publishes it. */
interface StatsStep {
  block: string;
  step: string;
  asked: number;
  done: number;
  /** Whole percent, or null when the step was never asked for. */
  rate: number | null;
}

interface BlockStats {
  asked: number;
  done: number;
  rate: number | null;
}

interface RoutineStats {
  /** The day the figures were worked out, so the card knows which bar is today's. */
  date: string;
  rate: number | null;
  streak: number;
  best_streak: number;
  blocks: Record<string, BlockStats>;
  steps: StatsStep[];
  days: StatsDay[];
}

const ICONS = {
  streak:
    'M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M16.53,11.06L15.47,10L10.59,14.88L8.47,12.76L7.41,13.82L10.59,17L16.53,11.06Z',
};

/** How far back the card looks by default, and the least it will be narrowed to. */
const DEFAULT_DAYS = 30;
const MIN_DAYS = 7;

export interface SchooldayStatsCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Show only this member, by id or name. Unset shows everyone. */
  member?: string;
  /** Restrict to these members, by id or name. */
  members?: string[];
  /** How many days the strip covers. Capped by what the sensor keeps. */
  days?: number;
  /** The per-step tally under the bars. */
  show_steps?: boolean;
  /** `board` keeps the family's usual order; `rate` puts the best record first. */
  sort?: 'board' | 'rate';
}

@customElement('schoolday-stats-card')
export class SchooldayStatsCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayStatsCardConfig = { type: '' };

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-stats-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return { days: DEFAULT_DAYS, show_steps: true };
  }

  public setConfig(config: SchooldayStatsCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  private _stats(member: SchooldayMember): RoutineStats | null {
    const raw = memberSensor(this.hass!, member.id)?.attributes?.routine_stats;
    if (!raw || typeof raw !== 'object') {
      // An integration older than this card, or a sensor that has not published yet.
      return null;
    }
    const stats = raw as Partial<RoutineStats>;
    return {
      date: String(stats.date ?? ''),
      rate: typeof stats.rate === 'number' ? stats.rate : null,
      streak: Number(stats.streak ?? 0),
      best_streak: Number(stats.best_streak ?? 0),
      blocks: (stats.blocks ?? {}) as Record<string, BlockStats>,
      steps: Array.isArray(stats.steps) ? (stats.steps as StatsStep[]) : [],
      days: Array.isArray(stats.days) ? (stats.days as StatsDay[]) : [],
    };
  }

  /** The window the strip draws: the last `days` of what the sensor published. */
  private _window(stats: RoutineStats): StatsDay[] {
    const asked = Number(this._config.days);
    const wanted = Number.isFinite(asked) ? Math.max(MIN_DAYS, asked) : DEFAULT_DAYS;
    return stats.days.slice(-wanted);
  }

  private _percent(value: number | null): string {
    return value === null ? '—' : t(this.hass, 'stats.percent', { value });
  }

  private _icon(path: string, cls = ''): TemplateResult {
    return html`<svg class=${cls} viewBox="0 0 24 24"><path d=${path} /></svg>`;
  }

  /** A day's tooltip: the date, then what it asked for and what came of it. */
  private _dayTitle(day: StatsDay): string {
    const label = new Date(`${day.date}T12:00:00`).toLocaleDateString(localeOf(this.hass!), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    if (day.mode === 'sick') {
      return `${label} — ${t(this.hass, 'routines.sick')}`;
    }
    if (!day.asked) {
      return `${label} — ${t(this.hass, 'stats.nothing_asked')}`;
    }
    return `${label} — ${t(this.hass, 'stats.day_done', {
      done: day.done,
      asked: day.asked,
    })}`;
  }

  private _renderStrip(stats: RoutineStats): TemplateResult {
    const days = this._window(stats);
    const edge = (day: StatsDay | undefined): string =>
      day
        ? new Date(`${day.date}T12:00:00`).toLocaleDateString(localeOf(this.hass!), {
            day: 'numeric',
            month: 'short',
          })
        : '';

    return html`
      <div class="strip">
        ${days.map((day) => {
          const share = day.asked ? day.done / day.asked : 0;
          const today = day.date === stats.date;
          return html`
            <div
              class="day ${day.asked ? '' : 'empty'} ${day.mode === 'sick' ? 'sick' : ''} ${today
                ? 'today'
                : ''}"
              title=${this._dayTitle(day)}
            >
              <i style=${`height:${day.asked ? Math.max(share * 100, 4) : 0}%`}></i>
            </div>
          `;
        })}
      </div>
      <div class="axis">
        <span>${edge(days[0])}</span>
        <span>${edge(days[days.length - 1])}</span>
      </div>
    `;
  }

  private _renderBlock(block: RoutineBlock, entry: BlockStats | undefined): TemplateResult {
    const rate = entry?.rate ?? null;
    return html`
      <div class="row" title=${t(this.hass, `routines.${block}`)}>
        ${this._icon(BLOCK_ICONS[block], 'row-icon')}
        <div class="meter">
          <div class="meter-fill" style=${`width:${rate ?? 0}%`}></div>
        </div>
        <span class="value">${this._percent(rate)}</span>
      </div>
    `;
  }

  private _renderStep(entry: StatsStep): TemplateResult {
    const icon = BLOCK_ICONS[entry.block as RoutineBlock];
    return html`
      <div class="row step">
        ${icon ? this._icon(icon, 'row-icon') : nothing}
        <span class="label" title=${entry.step}>${entry.step}</span>
        <div class="meter">
          <div class="meter-fill" style=${`width:${entry.rate ?? 0}%`}></div>
        </div>
        <span class="value">${entry.done}/${entry.asked}</span>
      </div>
    `;
  }

  /**
   * The run of days that went completely, if there is one.
   *
   * Always rendered, even when there is nothing to say, so that the strips of two
   * children sitting side by side start at the same height. A row that appears for one
   * child and not the other moves everything below it, and two graphs that do not line
   * up are two graphs nobody can compare — which is the whole reason they are side by
   * side.
   */
  private _renderStreak(stats: RoutineStats): TemplateResult {
    return html`
      <div class="streak">
        ${stats.best_streak > 0
          ? html`
              ${this._icon(ICONS.streak, 'streak-icon')}
              <span
                >${stats.streak > 0
                  ? t(this.hass, 'stats.streak', { days: stats.streak })
                  : t(this.hass, 'stats.best', { days: stats.best_streak })}</span
              >
              ${stats.streak > 0 && stats.best_streak > stats.streak
                ? html`<span class="best"
                    >${t(this.hass, 'stats.best', { days: stats.best_streak })}</span
                  >`
                : nothing}
            `
          : nothing}
      </div>
    `;
  }

  private _renderMember(member: SchooldayMember, stats: RoutineStats): TemplateResult {
    const days = this._window(stats);
    // Days that asked for nothing are not days anybody failed, so the window is
    // described by the days that counted rather than by the number of columns drawn.
    const counted = days.filter((day) => day.asked > 0).length;
    const showSteps = this._config.show_steps !== false && stats.steps.length > 0;

    return html`
      <div class="person" style=${`--member-color:${member.color}`}>
        <div class="person-head">
          ${avatarUrl(this.hass!, member.avatar)
            ? html`<img class="avatar" src=${avatarUrl(this.hass!, member.avatar)!} alt="" />`
            : nothing}
          <div class="who">
            <span class="name">${member.name}</span>
            ${counted > 0
              ? html`<span class="window"
                  >${t(this.hass, counted === 1 ? 'stats.window_one' : 'stats.window', {
                    days: counted,
                  })}</span
                >`
              : nothing}
          </div>
          <span class="rate">${this._percent(stats.rate)}</span>
        </div>

        ${this._renderStreak(stats)}

        ${counted === 0
          ? html`<div class="empty-note">${t(this.hass, 'stats.nothing_yet')}</div>`
          : html`
              ${this._renderStrip(stats)}
              <div class="blocks">
                ${(['morning', 'evening'] as RoutineBlock[]).map((block) =>
                  this._renderBlock(block, stats.blocks?.[block]),
                )}
              </div>
              ${showSteps
                ? html`<div class="steps">${stats.steps.map((entry) => this._renderStep(entry))}</div>`
                : nothing}
            `}
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

    // Same rule and the same option names as the timetable and routines cards: no child
    // picked means the whole family, side by side.
    const wanted = (this._config.members ?? (this._config.member ? [this._config.member] : []))
      .map((value) => value.toLowerCase());

    const entries = board.members
      .filter(
        (member) =>
          !wanted.length ||
          wanted.includes(member.id.toLowerCase()) ||
          wanted.includes(member.name.toLowerCase()),
      )
      .map((member) => ({ member, stats: this._stats(member) }))
      // A child who has never been asked for anything is left off rather than shown as
      // a column of nothing: the card would be reporting on a routine that does not
      // exist. A child who has one and no record yet stays, and says so.
      .filter(
        (entry): entry is { member: SchooldayMember; stats: RoutineStats } =>
          entry.stats !== null && entry.stats.days.some((day) => day.asked > 0),
      );

    if (this._config.sort === 'rate') {
      // Only where there is something to rank: a child with no record yet goes last
      // rather than to the bottom of a table they are not in.
      entries.sort((a, b) => (b.stats.rate ?? -1) - (a.stats.rate ?? -1));
    }

    if (entries.length === 0) {
      return html`
        <ha-card><div class="notice">${t(this.hass, 'stats.none_configured')}</div></ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="grid">
          ${entries.map((entry) => this._renderMember(entry.member, entry.stats))}
        </div>
      </ha-card>
    `;
  }

  static override styles = [
    schooldayTokens,
    schooldayButtons,
    css`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--schoolday-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: var(--schoolday-radius);
        background: color-mix(in srgb, var(--member-color) 10%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .person-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
      }

      .who {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .name {
        font-size: 1.15rem;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* The window the figure covers, next to the figure itself. A rate with no period
         attached is not a fact, it is a mood. */
      .window {
        color: var(--schoolday-muted);
        font-size: 0.7rem;
      }

      /* The headline, and the only large number on the card. In ink rather than in the
         member's colour: the colour is already carrying who this is, and a number that
         changes hue with the child is a number that is hard to compare. */
      .rate {
        margin-left: auto;
        font-size: 1.9rem;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .streak {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: -4px;
        min-height: 18px;
        color: var(--schoolday-muted);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .streak-icon {
        width: 16px;
        height: 16px;
        flex: none;
        fill: var(--member-color);
      }

      .streak .best {
        margin-left: auto;
        font-weight: 400;
      }

      /* One column per day, magnitude by height. Anchored to a baseline that is drawn,
         so a day nobody did anything on is visibly a day rather than a gap. */
      .strip {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 56px;
        padding-bottom: 3px;
        border-bottom: 1px solid var(--schoolday-line);
      }

      .day {
        display: flex;
        align-items: flex-end;
        flex: 1 1 0;
        min-width: 3px;
        height: 100%;
        position: relative;
      }

      .day i {
        display: block;
        width: 100%;
        min-height: 2px;
        border-radius: 3px 3px 0 0;
        background: var(--member-color);
      }

      /* A day that asked for nothing — a holiday with no list — is a baseline tick and
         not a bar. Shape, not shade: it must not read as a day that went badly. */
      .day.empty i {
        height: 2px;
        background: var(--schoolday-line);
      }

      .day.sick i {
        height: 2px;
        background: var(--schoolday-sick);
      }

      /* Today is still running, so its bar is drawn as provisional rather than as a
         result: it is the one column that is expected to grow before bedtime. */
      .day.today i {
        opacity: 0.45;
      }

      .day.today::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -4px;
        height: 2px;
        border-radius: 1px;
        background: var(--member-color);
      }

      .axis {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        color: var(--schoolday-muted);
        font-size: 0.7rem;
      }

      .blocks,
      .steps {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .steps {
        padding-top: 8px;
        border-top: 1px solid var(--schoolday-line);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
      }

      .row-icon {
        width: 16px;
        height: 16px;
        flex: none;
        fill: var(--schoolday-muted);
      }

      .row .label {
        flex: 1 1 40%;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .meter {
        flex: 1 1 40%;
        height: 6px;
        border-radius: 3px;
        background: var(--schoolday-line);
        overflow: hidden;
      }

      .meter-fill {
        height: 100%;
        border-radius: 3px;
        background: var(--member-color);
      }

      .value {
        flex: none;
        min-width: 3.2em;
        text-align: right;
        color: var(--schoolday-muted);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .empty-note,
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
    'schoolday-stats-card': SchooldayStatsCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'schoolday-stats-card',
  name: 'Schoolday Routine record',
  description: 'How reliably each child gets through their routines, and which steps get skipped.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
