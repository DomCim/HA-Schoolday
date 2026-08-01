/**
 * "What's happening" — the next few days as a list with large touch targets.
 *
 * Complements the calendar grid: the grid answers "how does the month look", this
 * answers "what do I need to know right now".
 */
import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { calendarStyles, findBoard } from '../lib/board';
import { daysBetween, fetchEvents, groupByDay, type HearthEvent } from '../lib/calendar';
import { addDays, isSameDay, localeOf, prefersHour12, startOfDay, toDateKey } from '../lib/dates';
import { hearthButtons, hearthTokens } from '../lib/styles';
import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from '../lib/types';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export interface HearthAgendaCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** How many days ahead to show, today included. */
  days?: number;
  /** Hide days that have nothing on them. */
  hide_empty_days?: boolean;
  /** Cap on events per day. */
  max_events?: number;
}

@customElement('hearth-agenda-card')
export class HearthAgendaCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: HearthAgendaCardConfig = { type: '' };
  @state() private _events: HearthEvent[] = [];

  private _loadedSignature = '';
  private _reloadToken = 0;
  private _timer?: number;

  public setConfig(config: HearthAgendaCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => {
      this._reloadToken += 1;
      void this._maybeFetch();
    }, REFRESH_INTERVAL_MS);
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

  private get _days(): number {
    return Math.max(1, this._config.days ?? 3);
  }

  private async _maybeFetch(): Promise<void> {
    const hass = this.hass;
    const board = hass ? findBoard(hass, this._config.board_entity) : null;
    if (!hass || !board) {
      return;
    }

    const styles = calendarStyles(board);
    const entityIds = Object.keys(styles).sort();
    const start = startOfDay(new Date());
    const end = addDays(start, this._days);

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
      return;
    }

    const { events } = await fetchEvents(hass, styles, start, end);
    if (this._loadedSignature === signature) {
      this._events = events;
    }
  }

  private _formatTime(date: Date): string {
    return new Intl.DateTimeFormat(localeOf(this.hass!), {
      hour: 'numeric',
      minute: '2-digit',
      hour12: prefersHour12(this.hass!),
    }).format(date);
  }

  /** "Today" and "Tomorrow" read better than a date on the two days that matter most. */
  private _dayLabel(day: Date): string {
    const today = startOfDay(new Date());
    const locale = localeOf(this.hass!);
    if (isSameDay(day, today)) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day');
    }
    if (isSameDay(day, addDays(today, 1))) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(1, 'day');
    }
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(day);
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    const board = findBoard(this.hass, this._config.board_entity);
    if (!board) {
      return html`<ha-card
        ><div class="notice">No Hearth board found. Add the Hearth integration.</div></ha-card
      >`;
    }

    const start = startOfDay(new Date());
    const days = daysBetween(start, addDays(start, this._days));
    const buckets = groupByDay(this._events, days);
    const limit = this._config.max_events ?? 6;
    const names = new Map(board.members.map((member) => [member.id, member.name]));

    const visible = days.filter(
      (day) =>
        this._config.hide_empty_days !== true || (buckets.get(toDateKey(day))?.length ?? 0) > 0,
    );

    return html`
      <ha-card>
        ${visible.length === 0
          ? html`<div class="notice">Nothing coming up.</div>`
          : visible.map((day) => {
              const events = (buckets.get(toDateKey(day)) ?? []).slice(0, limit);
              return html`
                <section class="day">
                  <h3 class="day-label">${this._dayLabel(day)}</h3>
                  ${events.length === 0
                    ? html`<div class="empty">Nothing planned</div>`
                    : events.map(
                        (event) => html`
                          <div class="row" style=${`--event-color:${event.color}`}>
                            <span class="when">
                              ${event.allDay ? 'All day' : this._formatTime(event.start)}
                            </span>
                            <span class="what">${event.summary}</span>
                            ${event.memberId && names.has(event.memberId)
                              ? html`<span class="who">${names.get(event.memberId)}</span>`
                              : nothing}
                          </div>
                        `,
                      )}
                </section>
              `;
            })}
      </ha-card>
    `;
  }

  static override styles = [
    hearthTokens,
    hearthButtons,
    css`
      ha-card {
        padding: 12px;
        box-sizing: border-box;
      }

      .day + .day {
        margin-top: 14px;
      }

      .day-label {
        margin: 0 0 6px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--hearth-muted);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: var(--hearth-touch);
        padding: 4px 10px;
        margin-bottom: 4px;
        border-radius: 8px;
        border-left: 4px solid var(--event-color);
        background: color-mix(in srgb, var(--event-color) 12%, transparent);
      }

      .when {
        flex: none;
        min-width: 62px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        font-size: 0.85rem;
      }

      .what {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .who {
        flex: none;
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--event-color);
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .empty,
      .notice {
        padding: 8px 2px;
        color: var(--hearth-muted);
        font-size: 0.85rem;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-agenda-card': HearthAgendaCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'hearth-agenda-card',
  name: 'Hearth Agenda',
  description: 'The next few days as a list, coloured per family member.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/Homeassistant-daely',
});
