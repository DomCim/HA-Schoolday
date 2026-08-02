/**
 * Daily routines — the checklist the kids tick off themselves.
 *
 * Deliberately not a reward system: routines are the things that simply have to
 * happen, whether or not anybody notices.
 *
 * Deliberately independent of the timetable, too: "pack the PE kit" belongs to the
 * evening before, so it is a step on the days that have PE rather than something
 * derived from the lesson grid.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { findBoard, memberSensor, type SchooldayMember } from '../lib/board';
import { t } from '../lib/i18n';
import { schooldayButtons, schooldayTokens } from '../lib/styles';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

export type RoutineBlock = 'morning' | 'evening';
export type BlockSetting = RoutineBlock | 'auto' | 'both';

interface RoutineStep {
  step: string;
  done: boolean;
}

const ICONS = {
  unchecked: 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  checked:
    'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z',
  morning: 'M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z',
  evening: 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z',
};

export interface SchooldayRoutinesCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Restrict to these members, by id or name. Defaults to everyone with steps. */
  members?: string[];
  /** Which block to show. "auto" switches by time of day; "both" shows both. */
  block?: BlockSetting;
  /** Hour at which "auto" flips from morning to evening. */
  evening_from?: number;
  /** Show members who have nothing on today. */
  show_empty?: boolean;
}

@customElement('schoolday-routines-card')
export class SchooldayRoutinesCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayRoutinesCardConfig = { type: '' };
  /** Steps awaiting their service call, so the tap feels instant. */
  @state() private _pending = new Set<string>();


  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-routines-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return { block: 'auto', evening_from: 14 };
  }

  public setConfig(config: SchooldayRoutinesCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  private get _blocks(): RoutineBlock[] {
    const setting = this._config.block ?? 'auto';
    if (setting === 'morning' || setting === 'evening') {
      return [setting];
    }
    if (setting === 'both') {
      return ['morning', 'evening'];
    }
    const eveningFrom = this._config.evening_from ?? 14;
    return [new Date().getHours() < eveningFrom ? 'morning' : 'evening'];
  }

  private _steps(member: SchooldayMember, block: RoutineBlock): RoutineStep[] {
    const sensor = memberSensor(this.hass!, member.id);
    const raw = sensor?.attributes?.[`routine_${block}`];
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw
      .filter((item): item is RoutineStep => Boolean(item) && typeof item === 'object')
      .map((item) => ({ step: String(item.step ?? ''), done: Boolean(item.done) }));
  }

  private async _toggle(
    member: SchooldayMember,
    block: RoutineBlock,
    entry: RoutineStep,
  ): Promise<void> {
    const key = `${member.id}|${block}|${entry.step}`;
    this._pending = new Set(this._pending).add(key);
    try {
      await this.hass!.callService('schoolday', 'set_routine_step', {
        member: member.id,
        block,
        step: entry.step,
        done: !entry.done,
      });
    } catch (err) {
      console.warn('[schoolday] could not update routine step', err);
    } finally {
      const next = new Set(this._pending);
      next.delete(key);
      this._pending = next;
    }
  }

  private _icon(path: string, cls = ''): TemplateResult {
    return html`<svg class=${cls} viewBox="0 0 24 24"><path d=${path} /></svg>`;
  }

  private _renderBlock(member: SchooldayMember, block: RoutineBlock): TemplateResult {
    const steps = this._steps(member, block);
    const doneCount = steps.filter((entry) => entry.done).length;
    const complete = steps.length > 0 && doneCount === steps.length;

    return html`
      <section class="block ${complete ? 'complete' : ''}">
        <header class="block-head">
          ${this._icon(block === 'morning' ? ICONS.morning : ICONS.evening, 'block-icon')}
          <span class="progress">${doneCount}/${steps.length}</span>
        </header>

        ${steps.length === 0
          ? html`<div class="empty">${t(this.hass, 'routines.nothing_today')}</div>`
          : html`
              <div class="bar">
                <div
                  class="bar-fill"
                  style=${`width:${steps.length ? (doneCount / steps.length) * 100 : 0}%`}
                ></div>
              </div>
              ${steps.map((entry) => {
                const key = `${member.id}|${block}|${entry.step}`;
                const pending = this._pending.has(key);
                // Show the outcome of the tap immediately; the sensor catches up.
                const done = pending ? !entry.done : entry.done;
                return html`
                  <button
                    class="step ${done ? 'done' : ''} ${pending ? 'pending' : ''}"
                    @click=${() => this._toggle(member, block, entry)}
                  >
                    ${this._icon(done ? ICONS.checked : ICONS.unchecked, 'tick')}
                    <span class="label">${entry.step}</span>
                  </button>
                `;
              })}
            `}
      </section>
    `;
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    const board = findBoard(this.hass, this._config.board_entity);
    if (!board) {
      return html`<ha-card
        ><div class="notice">${t(this.hass, 'board.missing')}</div></ha-card
      >`;
    }

    const blocks = this._blocks;
    const wanted = this._config.members?.map((value) => value.toLowerCase());

    const members = board.members.filter((member) => {
      if (wanted && !wanted.includes(member.id.toLowerCase()) && !wanted.includes(member.name.toLowerCase())) {
        return false;
      }
      if (this._config.show_empty === true) {
        return true;
      }
      return blocks.some((block) => this._steps(member, block).length > 0);
    });

    if (members.length === 0) {
      return html`
        <ha-card>
          <div class="notice">${t(this.hass, 'routines.none_configured')}</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="grid">
          ${members.map(
            (member) => html`
              <div class="person" style=${`--member-color:${member.color}`}>
                <div class="person-name">
                  ${member.avatar
                    ? html`<img class="avatar" src=${member.avatar} alt="" />`
                    : nothing}
                  <span>${member.name}</span>
                </div>
                ${blocks.map((block) => this._renderBlock(member, block))}
              </div>
            `,
          )}
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
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--schoolday-gap);
      }

      .person {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border-radius: var(--schoolday-radius);
        background: color-mix(in srgb, var(--member-color) 10%, transparent);
        border-top: 3px solid var(--member-color);
      }

      .person-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
      }

      .person-name .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--member-color);
      }

      .block-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--schoolday-muted);
      }

      .block-icon {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      .progress {
        font-size: 0.85rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      .block.complete .progress {
        color: var(--member-color);
      }

      .bar {
        height: 4px;
        border-radius: 2px;
        background: var(--schoolday-line);
        overflow: hidden;
        margin-bottom: 4px;
      }

      .bar-fill {
        height: 100%;
        background: var(--member-color);
        transition: width 180ms ease;
      }

      .step {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: calc(var(--schoolday-touch) + 4px);
        padding: 4px 8px;
        margin-bottom: 2px;
        box-sizing: border-box;
        border-radius: 8px;
        text-align: left;
        font-size: 1rem;
        background: var(--schoolday-surface);
      }

      .step:active {
        background: var(--schoolday-surface-alt);
      }

      .step .tick {
        width: 26px;
        height: 26px;
        flex: none;
        fill: var(--schoolday-line);
        transition: fill 140ms ease;
      }

      .step.done .tick {
        fill: var(--member-color);
      }

      .step.done .label {
        text-decoration: line-through;
        color: var(--schoolday-muted);
      }

      .step.pending {
        opacity: 0.65;
      }

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .empty,
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
    'schoolday-routines-card': SchooldayRoutinesCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'schoolday-routines-card',
  name: 'Schoolday Routines',
  description: "Daily routines per child and weekday, ticked off by the kids themselves.",
  preview: true,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
