/**
 * What each child still has to do.
 *
 * Grouped by when it is due rather than listed flat, because "by when" is the only
 * question anybody asks a homework list. A flat list sorted by date answers it too, in
 * principle — but on a wall panel at seven in the morning, reading dates is work, and
 * "today" is not.
 *
 * The items live in Home Assistant's own `todo` lists, one per child, so anything that
 * can talk to a todo list can add homework: the voice assistant, the todo card, a
 * phone. This card is the reading end.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarUrl, findBoard, type SchooldayMember } from '../lib/board';
import { localeOf } from '../lib/dates';
import { t } from '../lib/i18n';
import { schooldayButtons, schooldayTokens } from '../lib/styles';
import { todayKey } from '../lib/timetable';
import type {
  HassEntity,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

interface Homework {
  uid: string;
  summary: string;
  due: string | null;
  done: boolean;
}

/** When a piece of work is due, relative to today. The order is the order shown. */
type Bucket = 'overdue' | 'today' | 'tomorrow' | 'later' | 'someday';
const BUCKETS: Bucket[] = ['overdue', 'today', 'tomorrow', 'later', 'someday'];

const ICONS = {
  unchecked:
    'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  checked:
    'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z',
};

export interface SchooldayHomeworkCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Show only this member, by id or name. Unset shows everyone with a list. */
  member?: string;
  /** Restrict to these members, by id or name. */
  members?: string[];
  /** Show what has already been done, which is otherwise left out. */
  show_done?: boolean;
  /** Show children with nothing to do. */
  show_empty?: boolean;
}

@customElement('schoolday-homework-card')
export class SchooldayHomeworkCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayHomeworkCardConfig = { type: '' };
  /** Items awaiting their service call, so the tap feels instant. */
  @state() private _pending = new Set<string>();

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-homework-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public setConfig(config: SchooldayHomeworkCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  /**
   * One member's homework list entity.
   *
   * Found by its `member_id` attribute rather than by name, exactly as the member
   * sensors are, so renaming the entity does not break the card.
   */
  private _list(memberId: string): HassEntity | undefined {
    return Object.values(this.hass!.states).find(
      (entity) =>
        entity.entity_id.startsWith('todo.') && entity.attributes?.member_id === memberId,
    );
  }

  private _items(memberId: string): Homework[] {
    const raw = this._list(memberId)?.attributes?.homework;
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw
      .filter((item): item is Homework => Boolean(item) && typeof item === 'object')
      .map((item) => ({
        uid: String(item.uid ?? ''),
        summary: String(item.summary ?? ''),
        due: typeof item.due === 'string' && item.due ? item.due : null,
        done: Boolean(item.done),
      }))
      .filter((item) => item.uid && item.summary);
  }

  /** Which group a piece of work belongs in. Dates only, because homework has no time. */
  private static _bucket(due: string | null, today: string): Bucket {
    if (!due) {
      return 'someday';
    }
    if (due < today) {
      return 'overdue';
    }
    if (due === today) {
      return 'today';
    }
    const tomorrow = new Date(`${today}T00:00:00`);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return due === todayKey(tomorrow) ? 'tomorrow' : 'later';
  }

  private _dueLabel(due: string | null): string | null {
    if (!due) {
      return null;
    }
    const [year, month, day] = due.split('-').map(Number);
    return new Intl.DateTimeFormat(localeOf(this.hass!), {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    }).format(new Date(year, month - 1, day));
  }

  private async _toggle(memberId: string, item: Homework): Promise<void> {
    const list = this._list(memberId);
    if (!list) {
      return;
    }
    this._pending = new Set(this._pending).add(item.uid);
    try {
      await this.hass!.callService('todo', 'update_item', {
        entity_id: list.entity_id,
        item: item.uid,
        status: item.done ? 'needs_action' : 'completed',
      });
    } catch (err) {
      console.warn('[schoolday] could not update homework', err);
    } finally {
      const next = new Set(this._pending);
      next.delete(item.uid);
      this._pending = next;
    }
  }

  private _icon(path: string, cls = ''): TemplateResult {
    return html`<svg class=${cls} viewBox="0 0 24 24"><path d=${path} /></svg>`;
  }

  private _renderItem(
    member: SchooldayMember,
    item: Homework,
    bucket: Bucket,
  ): TemplateResult {
    const pending = this._pending.has(item.uid);
    // Show the outcome of the tap immediately; the entity catches up.
    const done = pending ? !item.done : item.done;
    // In "due today" and "due tomorrow" the date is what the heading already said, and
    // a date repeated beside every line is one more thing to read past. Overdue keeps
    // it — how late matters — and so does "later", where the heading says nothing.
    const due = bucket === 'today' || bucket === 'tomorrow' ? null : this._dueLabel(item.due);
    return html`
      <button
        class="item ${done ? 'done' : ''} ${pending ? 'pending' : ''}"
        @click=${() => this._toggle(member.id, item)}
      >
        ${this._icon(done ? ICONS.checked : ICONS.unchecked, 'tick')}
        <span class="label">${item.summary}</span>
        ${due ? html`<span class="due">${due}</span>` : nothing}
      </button>
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

    const wanted = (this._config.members ?? (this._config.member ? [this._config.member] : []))
      .map((value) => value.toLowerCase());
    const showDone = this._config.show_done === true;
    const today = todayKey();

    const people = board.members
      .filter(
        (member) =>
          !wanted.length ||
          wanted.includes(member.id.toLowerCase()) ||
          wanted.includes(member.name.toLowerCase()),
      )
      .map((member) => ({
        member,
        items: this._items(member.id).filter((item) => showDone || !item.done),
      }))
      .filter((entry) => this._config.show_empty === true || entry.items.length > 0);

    if (!people.length) {
      return html`
        <ha-card><div class="notice">${t(this.hass, 'homework.all_done')}</div></ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="grid">
          ${people.map(
            ({ member, items }) => html`
              <div class="person" style=${`--member-color:${member.color}`}>
                <div class="person-name">
                  ${avatarUrl(this.hass!, member.avatar)
                    ? html`<img class="avatar" src=${avatarUrl(this.hass!, member.avatar)!} alt="" />`
                    : nothing}
                  <span>${member.name}</span>
                  <span class="count">${items.filter((item) => !item.done).length}</span>
                </div>
                ${items.length === 0
                  ? html`<div class="empty">${t(this.hass, 'homework.nothing')}</div>`
                  : BUCKETS.map((bucket) => {
                      const group = items.filter(
                        (item) => SchooldayHomeworkCard._bucket(item.due, today) === bucket,
                      );
                      if (!group.length) {
                        return nothing;
                      }
                      return html`
                        <div class="bucket ${bucket}">
                          <div class="bucket-head">${t(this.hass, `homework.${bucket}`)}</div>
                          ${group.map((item) => this._renderItem(member, item, bucket))}
                        </div>
                      `;
                    })}
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

      /* How much is left, where the eye lands first — the number is the whole point
         of walking past this card. */
      .count {
        margin-left: auto;
        min-width: 26px;
        padding: 1px 8px;
        border-radius: 12px;
        background: var(--member-color);
        color: var(--text-primary-color, #fff);
        font-size: 0.85rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      .bucket-head {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--schoolday-muted);
        margin-bottom: 2px;
      }

      /* Late work is the one thing on this card that is not merely information. */
      .bucket.overdue .bucket-head {
        color: var(--error-color, #d33);
      }

      .item {
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
        background: color-mix(in srgb, var(--member-color) 20%, var(--schoolday-surface));
      }

      .bucket.overdue .item {
        background: color-mix(in srgb, var(--error-color, #d33) 16%, var(--schoolday-surface));
      }

      .item:active {
        background: color-mix(in srgb, var(--member-color) 32%, var(--schoolday-surface));
      }

      .item .tick {
        width: 26px;
        height: 26px;
        flex: none;
        fill: var(--schoolday-muted);
        transition: fill 140ms ease;
      }

      .item.done .tick {
        fill: var(--member-color);
      }

      .item.done .label {
        text-decoration: line-through;
        color: var(--schoolday-muted);
      }

      .item.pending {
        opacity: 0.65;
      }

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .due {
        flex: none;
        margin-left: auto;
        color: var(--schoolday-muted);
        font-size: 0.75rem;
        white-space: nowrap;
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
    'schoolday-homework-card': SchooldayHomeworkCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'schoolday-homework-card',
  name: 'Schoolday Homework',
  description: "What each child still has to do, grouped by when it is due.",
  preview: true,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
