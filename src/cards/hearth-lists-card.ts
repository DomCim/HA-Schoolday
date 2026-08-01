/**
 * Shopping lists and checklists as tiles, ticked off with one tap.
 *
 * Defaults to the family lists configured in the Hearth options, so dropping the card
 * on a dashboard needs no configuration at all.
 */
import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { findBoard } from '../lib/board';
import { addItem, fetchLists, setItemStatus, type TodoList } from '../lib/todo';
import { t } from '../lib/i18n';
import { hearthButtons, hearthTokens } from '../lib/styles';
import type {
  HassTodoItem,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const ICONS = {
  unchecked: 'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z',
  checked:
    'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z',
  add: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  warning: 'M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
};

export interface HearthListsCardConfig extends LovelaceCardConfig {
  /** Board sensor to read the family setup from. Auto-detected when omitted. */
  board_entity?: string;
  /** Explicit list of `todo.*` entities. Defaults to the configured family lists. */
  entities?: string[];
  /** Show an "add item" row per list. */
  allow_add?: boolean;
  /** Items shown per list before the rest are collapsed. */
  max_items?: number;
  /** Number of tile columns at full width. */
  columns?: number;
}

@customElement('hearth-lists-card')
export class HearthListsCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: HearthListsCardConfig = { type: '' };
  @state() private _lists: TodoList[] = [];
  @state() private _expanded = new Set<string>();
  @state() private _adding?: string;
  @state() private _draft = '';

  /** Items awaiting their service call, so the tick feels instant. */
  @state() private _pending = new Set<string>();

  private _loadedSignature = '';
  private _reloadToken = 0;
  private _timer?: number;


  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('hearth-lists-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return { columns: 3, max_items: 8 };
  }

  public setConfig(config: HearthListsCardConfig): void {
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

  private get _entityIds(): string[] {
    if (this._config.entities?.length) {
      return this._config.entities;
    }
    const board = this.hass ? findBoard(this.hass, this._config.board_entity) : null;
    return board?.sharedTodoLists ?? [];
  }

  private _reload(): void {
    this._reloadToken += 1;
    void this._maybeFetch();
  }

  private async _maybeFetch(): Promise<void> {
    const hass = this.hass;
    if (!hass) {
      return;
    }
    const entityIds = this._entityIds;

    // A to-do entity's state is its open-item count, so it changes whenever the list
    // does — the cheapest possible "something happened" signal.
    const stamps = entityIds.map((id) => `${hass.states[id]?.state ?? '-'}`);
    const signature = [entityIds.join(','), stamps.join(','), this._reloadToken].join('|');
    if (signature === this._loadedSignature) {
      return;
    }
    this._loadedSignature = signature;

    if (entityIds.length === 0) {
      this._lists = [];
      return;
    }

    const lists = await fetchLists(hass, entityIds);
    if (this._loadedSignature === signature) {
      this._lists = lists;
      this._pending = new Set();
    }
  }

  private async _toggle(list: TodoList, item: HassTodoItem): Promise<void> {
    const key = `${list.entityId}|${item.uid || item.summary}`;
    this._pending = new Set(this._pending).add(key);
    try {
      await setItemStatus(this.hass!, list.entityId, item, item.status !== 'completed');
    } catch (err) {
      console.warn('[hearth] could not update item', err);
      const next = new Set(this._pending);
      next.delete(key);
      this._pending = next;
      return;
    }
    // The entity's state change drives the refetch; nudge it in case it does not.
    this._reload();
  }

  private async _submitDraft(list: TodoList): Promise<void> {
    const summary = this._draft.trim();
    if (!summary) {
      return;
    }
    this._draft = '';
    try {
      await addItem(this.hass!, list.entityId, summary);
    } catch (err) {
      console.warn('[hearth] could not add item', err);
    }
    this._reload();
  }

  private _icon(path: string): TemplateResult {
    return html`<svg viewBox="0 0 24 24"><path d=${path} /></svg>`;
  }

  private _renderItem(list: TodoList, item: HassTodoItem): TemplateResult {
    const key = `${list.entityId}|${item.uid || item.summary}`;
    const pending = this._pending.has(key);
    // Optimistically show the outcome of the tap while the service call is in flight.
    const done = pending ? item.status !== 'completed' : item.status === 'completed';

    return html`
      <button
        class="item ${done ? 'done' : ''} ${pending ? 'pending' : ''}"
        @click=${() => this._toggle(list, item)}
      >
        ${this._icon(done ? ICONS.checked : ICONS.unchecked)}
        <span class="item-text">${item.summary}</span>
      </button>
    `;
  }

  private _renderList(list: TodoList): TemplateResult {
    const limit = this._config.max_items ?? 8;
    const expanded = this._expanded.has(list.entityId);
    const shown = expanded ? list.items : list.items.slice(0, limit);
    const hidden = list.items.length - shown.length;

    return html`
      <section class="list">
        <header class="list-header">
          <span class="list-name">${list.name}</span>
          <span class="count">${list.items.length}</span>
        </header>

        ${!list.ok
          ? html`<div class="warning">
              ${this._icon(ICONS.warning)}<span>${t(this.hass, 'lists.unreachable')}</span>
            </div>`
          : nothing}

        <div class="items">
          ${shown.length === 0 && list.ok
            ? html`<div class="empty">${t(this.hass, 'lists.empty')}</div>`
            : shown.map((item) => this._renderItem(list, item))}
        </div>

        ${hidden > 0
          ? html`<button
              class="more"
              @click=${() => {
                this._expanded = new Set(this._expanded).add(list.entityId);
              }}
            >
              ${t(this.hass, 'lists.show_more', { count: hidden })}
            </button>`
          : nothing}
        ${this._config.allow_add === false
          ? nothing
          : this._adding === list.entityId
            ? html`
                <form
                  class="add-row"
                  @submit=${(e: Event) => {
                    e.preventDefault();
                    void this._submitDraft(list);
                  }}
                >
                  <input
                    type="text"
                    autofocus
                    placeholder=${t(this.hass, 'lists.add_placeholder')}
                    .value=${this._draft}
                    @input=${(e: Event) => {
                      this._draft = (e.target as HTMLInputElement).value;
                    }}
                    @blur=${() => {
                      this._adding = undefined;
                    }}
                  />
                </form>
              `
            : html`<button
                class="add"
                @click=${() => {
                  this._draft = '';
                  this._adding = list.entityId;
                }}
              >
                ${this._icon(ICONS.add)}<span>${t(this.hass, 'lists.add')}</span>
              </button>`}
      </section>
    `;
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    if (this._entityIds.length === 0) {
      return html`
        <ha-card>
          <div class="notice">${t(this.hass, 'lists.none_configured')}</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="grid" style=${`--columns:${this._config.columns ?? 3}`}>
          ${this._lists.map((list) => this._renderList(list))}
        </div>
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

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--hearth-gap);
      }

      @media (min-width: 900px) {
        .grid {
          grid-template-columns: repeat(var(--columns, 3), 1fr);
        }
      }

      .list {
        display: flex;
        flex-direction: column;
        border-radius: var(--hearth-radius);
        background: var(--hearth-surface-alt);
        padding: 10px;
      }

      .list-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        padding-bottom: 6px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--hearth-line);
      }

      .list-name {
        font-weight: 700;
        font-size: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .count {
        flex: none;
        font-size: 0.8rem;
        font-variant-numeric: tabular-nums;
        color: var(--hearth-muted);
      }

      .items {
        display: flex;
        flex-direction: column;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: var(--hearth-touch);
        padding: 4px 2px;
        text-align: left;
        border-radius: 6px;
      }

      .item:active {
        background: var(--hearth-line);
      }

      .item svg {
        width: 22px;
        height: 22px;
        flex: none;
        fill: var(--hearth-muted);
      }

      .item.done svg {
        fill: var(--hearth-today);
      }

      .item.done .item-text {
        text-decoration: line-through;
        color: var(--hearth-muted);
      }

      .item.pending {
        opacity: 0.6;
      }

      .item-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .empty,
      .notice {
        padding: 10px 2px;
        color: var(--hearth-muted);
        font-size: 0.85rem;
      }

      .notice code {
        background: var(--hearth-surface-alt);
        padding: 1px 5px;
        border-radius: 4px;
      }

      .more,
      .add {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: var(--hearth-touch);
        padding: 0 2px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--hearth-muted);
      }

      .add svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      .add-row input {
        font: inherit;
        color: inherit;
        width: 100%;
        min-height: var(--hearth-touch);
        padding: 6px 10px;
        box-sizing: border-box;
        background: var(--hearth-surface);
        border: 1px solid var(--hearth-today);
        border-radius: 8px;
      }

      .warning {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 2px;
        color: var(--warning-color, #b8860b);
        font-size: 0.8rem;
      }

      .warning svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-lists-card': HearthListsCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'hearth-lists-card',
  name: 'Hearth Lists',
  description: 'Shopping lists and checklists as tiles, ticked off with one tap.',
  preview: true,
  documentationURL: 'https://github.com/DomCim/Homeassistant-hearth',
});
