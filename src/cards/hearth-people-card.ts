/**
 * The family strip: who is home, what is on today, open tasks and points.
 *
 * This is the card that makes the board feel like it belongs to a household rather
 * than to a server.
 */
import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { calendarStyles, findBoard, memberSensor, type HearthMember } from '../lib/board';
import { fetchEvents, occursOn, type HearthEvent } from '../lib/calendar';
import { addDays, localeOf, prefersHour12, startOfDay } from '../lib/dates';
import { t } from '../lib/i18n';
import { hearthButtons, hearthTokens } from '../lib/styles';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

const ICONS = {
  home: 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z',
  away: 'M14,4V6H18V18H14V20H20V4M13,12L9,8V11H1V13H9V16L13,12Z',
  task: 'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z',
  points: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',
};

export interface HearthPeopleCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Show today's first events per member. */
  show_events?: boolean;
  /** How many of today's events to list per member. */
  max_events?: number;
  /** Show open task counts. */
  show_tasks?: boolean;
  /** Show points, when a points sensor is configured for the member. */
  show_points?: boolean;
}

@customElement('hearth-people-card')
export class HearthPeopleCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: HearthPeopleCardConfig = { type: '' };
  @state() private _events: HearthEvent[] = [];

  private _loadedSignature = '';
  private _reloadToken = 0;
  private _timer?: number;


  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('hearth-people-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return { show_events: true, max_events: 2 };
  }

  public setConfig(config: HearthPeopleCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 4;
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

  private async _maybeFetch(): Promise<void> {
    const hass = this.hass;
    const board = hass ? findBoard(hass, this._config.board_entity) : null;
    if (!hass || !board || this._config.show_events === false) {
      return;
    }

    const styles = calendarStyles(board);
    const entityIds = Object.keys(styles).sort();
    const today = startOfDay(new Date());
    const stamps = entityIds.map((id) => hass.states[id]?.last_changed ?? '-');
    const signature = [today.getTime(), entityIds.join(','), stamps.join(','), this._reloadToken].join('|');

    if (signature === this._loadedSignature || entityIds.length === 0) {
      return;
    }
    this._loadedSignature = signature;

    const { events } = await fetchEvents(hass, styles, today, addDays(today, 1));
    if (this._loadedSignature === signature) {
      this._events = events;
    }
  }

  private _icon(path: string): TemplateResult {
    return html`<svg viewBox="0 0 24 24"><path d=${path} /></svg>`;
  }

  private _formatTime(date: Date): string {
    return new Intl.DateTimeFormat(localeOf(this.hass!), {
      hour: 'numeric',
      minute: '2-digit',
      hour12: prefersHour12(this.hass!),
    }).format(date);
  }

  /** Presence as a short label, preferring the zone name over a bare "away". */
  private _presence(member: HearthMember): { label: string; home: boolean } | null {
    if (!member.person) {
      return null;
    }
    const state = this.hass!.states[member.person]?.state;
    if (!state || state === 'unknown' || state === 'unavailable') {
      return null;
    }
    if (state === 'home') {
      return { label: t(this.hass, 'people.home'), home: true };
    }
    if (state === 'not_home') {
      return { label: t(this.hass, 'people.away'), home: false };
    }
    return { label: state, home: false };
  }

  private _renderMember(member: HearthMember): TemplateResult {
    const sensor = memberSensor(this.hass!, member.id);
    const presence = this._presence(member);

    const tasks = Number(sensor?.state);
    const showTasks = this._config.show_tasks !== false && Number.isFinite(tasks);

    const points = sensor?.attributes?.points;
    const showPoints = this._config.show_points !== false && typeof points === 'number';

    const today = startOfDay(new Date());
    const mine =
      this._config.show_events === false
        ? []
        : this._events
            .filter((event) => event.memberId === member.id && occursOn(event, today))
            .slice(0, this._config.max_events ?? 2);

    const initial = member.name.trim().charAt(0).toUpperCase() || '?';

    return html`
      <div class="person" style=${`--member-color:${member.color}`}>
        <div class="avatar ${presence && !presence.home ? 'away' : ''}">
          ${member.avatar
            ? html`<img src=${member.avatar} alt="" />`
            : html`<span>${initial}</span>`}
        </div>

        <div class="name">${member.name}</div>

        <div class="chips">
          ${presence
            ? html`<span class="chip">
                ${this._icon(presence.home ? ICONS.home : ICONS.away)}${presence.label}
              </span>`
            : nothing}
          ${showTasks && tasks > 0
            ? html`<span class="chip">${this._icon(ICONS.task)}${tasks}</span>`
            : nothing}
          ${showPoints
            ? html`<span class="chip">${this._icon(ICONS.points)}${points}</span>`
            : nothing}
        </div>

        ${mine.length > 0
          ? html`<div class="today">
              ${mine.map(
                (event) => html`
                  <div class="today-event">
                    ${event.allDay
                      ? nothing
                      : html`<span class="time">${this._formatTime(event.start)}</span>`}
                    <span class="summary">${event.summary}</span>
                  </div>
                `,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    const board = findBoard(this.hass, this._config.board_entity);
    if (!board || board.members.length === 0) {
      return html`
        <ha-card>
          <div class="notice">${t(this.hass, 'board.no_members')}</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="strip">${board.members.map((member) => this._renderMember(member))}</div>
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

      .strip {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: var(--hearth-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px 8px;
        border-radius: var(--hearth-radius);
        background: color-mix(in srgb, var(--member-color) 12%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;
        background: var(--member-color);
        color: #fff;
        font-size: 1.5rem;
        font-weight: 700;
      }

      /* Someone who is out reads as dimmed at a glance from across the room. */
      .avatar.away {
        opacity: 0.45;
        filter: grayscale(0.5);
      }

      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .name {
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--hearth-surface);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .chip svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
      }

      .today {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 100%;
        margin-top: 2px;
      }

      .today-event {
        display: flex;
        gap: 4px;
        font-size: 0.75rem;
        line-height: 1.3;
        min-width: 0;
      }

      .time {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        flex: none;
      }

      .summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice {
        padding: 16px 8px;
        color: var(--hearth-muted);
        font-size: 0.9rem;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-people-card': HearthPeopleCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'hearth-people-card',
  name: 'Hearth People',
  description: "Who's home, what's on today, open tasks and points.",
  preview: true,
  documentationURL: 'https://github.com/DomCim/Homeassistant-hearth',
});
