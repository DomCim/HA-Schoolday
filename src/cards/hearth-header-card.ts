/**
 * Clock, date and weather — the strip along the top of the board.
 *
 * Readable from across the room, which is the whole point of a wall panel.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { localeOf, prefersHour12 } from '../lib/dates';
import { hearthTokens } from '../lib/styles';
import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from '../lib/types';

export interface HearthHeaderCardConfig extends LovelaceCardConfig {
  /** A `weather.*` entity. Omit to hide the weather block. */
  weather_entity?: string;
  /** Free text shown under the date, e.g. a household motto. */
  greeting?: string;
  /** Show seconds. Off by default: a ticking clock is noise on a wall. */
  show_seconds?: boolean;
}

@customElement('hearth-header-card')
export class HearthHeaderCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: HearthHeaderCardConfig = { type: '' };
  @state() private _now = new Date();

  private _timer?: number;

  public setConfig(config: HearthHeaderCardConfig): void {
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
      </ha-card>
    `;
  }

  static override styles = [
    hearthTokens,
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
        color: var(--hearth-muted);
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
        color: var(--hearth-muted);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-header-card': HearthHeaderCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'hearth-header-card',
  name: 'Hearth Header',
  description: 'Clock, date and weather, sized to be read from across the room.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/Homeassistant-hearth',
});
