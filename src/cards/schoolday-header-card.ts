/**
 * Clock, date and weather — the strip along the top of the board.
 *
 * Readable from across the room, which is the whole point of a wall panel. On a school
 * morning it also says when each child has to leave, because the clock is where
 * everybody is already looking.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { findBoard, memberSensor } from '../lib/board';
import { localeOf, prefersHour12 } from '../lib/dates';
import { t } from '../lib/i18n';
import { schooldayTokens } from '../lib/styles';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

export interface SchooldayHeaderCardConfig extends LovelaceCardConfig {
  /** A `weather.*` entity. Omit to hide the weather block. */
  weather_entity?: string;
  /** Free text shown under the date, e.g. a household motto. */
  greeting?: string;
  /** Show seconds. Off by default: a ticking clock is noise on a wall. */
  show_seconds?: boolean;
  /** Say when each child has to leave, on a school morning. On by default. */
  show_leave?: boolean;
}

/** An hour before leaving is when "leave at 07:35" turns into a countdown. */
const COUNTDOWN_MINUTES = 60;

@customElement('schoolday-header-card')
export class SchooldayHeaderCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayHeaderCardConfig = { type: '' };
  @state() private _now = new Date();

  private _timer?: number;


  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-header-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return { show_seconds: false, show_leave: true };
  }

  public setConfig(config: SchooldayHeaderCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 2;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    // Tick once a second only when seconds are shown; otherwise every 20s is plenty
    // to keep the minute honest without waking the renderer constantly.
    const period = this._config.show_seconds ? 1000 : 20_000;
    this._timer = window.setInterval(() => {
      this._now = new Date();
    }, period);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) {
      window.clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  private _weather(): TemplateResult | typeof nothing {
    const entityId = this._config.weather_entity;
    if (!entityId) {
      return nothing;
    }
    const entity = this.hass!.states[entityId];
    if (!entity) {
      return nothing;
    }

    const temperature = entity.attributes?.temperature;
    const unit = (entity.attributes?.temperature_unit as string) ?? '';
    const condition = this.hass!.formatEntityState(entity);

    return html`
      <div class="weather">
        <div class="temperature">
          ${typeof temperature === 'number' ? `${Math.round(temperature)}${unit}` : '—'}
        </div>
        <div class="condition">${condition}</div>
      </div>
    `;
  }

  /**
   * One line per child with a leaving time today, until their first lesson begins.
   *
   * Read from the member sensor's `leave_at` rather than worked out here: the sensor
   * already knows the first lesson that is actually on, and a card doing the sums again
   * would send a child off for a period the school cancelled.
   */
  private _leaving(): TemplateResult | typeof nothing {
    if (this._config.show_leave === false) {
      return nothing;
    }
    const board = findBoard(this.hass!);
    if (!board) {
      return nothing;
    }
    const now = this._now;
    const today = now.toDateString();
    const rows = board.members.flatMap((member) => {
      const attributes = memberSensor(this.hass!, member.id)?.attributes ?? {};
      const raw = attributes.leave_at;
      const start = attributes.school_start;
      if (typeof raw !== 'string' || typeof start !== 'string') {
        return [];
      }
      const leave = new Date(raw);
      // Only today's: from the evening on, the sensor already points at tomorrow, and
      // a wall saying "leave at 07:35" all night is a wall nobody reads in the morning.
      if (Number.isNaN(leave.getTime()) || leave.toDateString() !== today) {
        return [];
      }
      const [hour, minute] = start.split(':').map(Number);
      const bell = new Date(leave);
      bell.setHours(hour, minute, 0, 0);
      if (now >= bell) {
        return [];
      }
      const left = Math.ceil((leave.getTime() - now.getTime()) / 60_000);
      const text =
        left <= 0
          ? t(this.hass, 'header.leave_now')
          : left <= COUNTDOWN_MINUTES
            ? t(this.hass, 'header.leave_in', { minutes: left })
            : t(this.hass, 'header.leave_at', {
                time: new Intl.DateTimeFormat(localeOf(this.hass!), {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: prefersHour12(this.hass!),
                }).format(leave),
              });
      const tone = left <= 0 ? 'go' : left <= 10 ? 'soon' : '';
      return [
        html`
          <div class=${`leave ${tone}`} style=${`--member-color:${member.color}`}>
            <span class="dot"></span>
            <span class="who">${member.name}</span>
            <span class="when">${text}</span>
          </div>
        `,
      ];
    });
    return rows.length ? html`<div class="leaving">${rows}</div>` : nothing;
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    const locale = localeOf(this.hass);

    const time = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...(this._config.show_seconds ? { second: '2-digit' } : {}),
      hour12: prefersHour12(this.hass),
    }).format(this._now);

    const date = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(this._now);

    return html`
      <ha-card>
        <div class="bar">
          <div class="left">
            <div class="clock">${time}</div>
            <div class="date">${date}</div>
            ${this._config.greeting
              ? html`<div class="greeting">${this._config.greeting}</div>`
              : nothing}
          </div>
          ${this._weather()}
        </div>
        ${this._leaving()}
      </ha-card>
    `;
  }

  static override styles = [
    schooldayTokens,
    css`
      ha-card {
        padding: 16px 20px;
        box-sizing: border-box;
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .clock {
        font-size: 3.2rem;
        font-weight: 300;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .date {
        margin-top: 4px;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .greeting {
        margin-top: 2px;
        font-size: 0.9rem;
        color: var(--schoolday-muted);
      }

      .weather {
        text-align: right;
      }

      .temperature {
        font-size: 2.2rem;
        font-weight: 300;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }

      .condition {
        margin-top: 4px;
        font-size: 0.9rem;
        color: var(--schoolday-muted);
      }

      .leaving {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
        margin-top: 12px;
      }

      .leave {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-variant-numeric: tabular-nums;
      }

      .leave .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--member-color);
      }

      .leave .who {
        font-weight: 700;
      }

      .leave.soon .when {
        color: var(--warning-color, #f4a100);
        font-weight: 700;
      }

      .leave.go .when {
        color: var(--error-color, #db4437);
        font-weight: 700;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'schoolday-header-card': SchooldayHeaderCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'schoolday-header-card',
  name: 'Schoolday Header',
  description: 'Clock, date and weather, sized to be read from across the room.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
