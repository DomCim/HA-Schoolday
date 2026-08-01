/**
 * Visual editors for every Hearth card.
 *
 * Built on `ha-form`, which — unlike `ha-dialog` — is always defined wherever a
 * card editor can be opened, because every built-in card editor uses it.
 *
 * Labels come from the same translation table as the cards, so the editor speaks
 * whatever language Home Assistant is set to.
 */
import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { fireEvent } from '../lib/dom';
import { t } from '../lib/i18n';
import type { HomeAssistant, LovelaceCardConfig, LovelaceCardEditor } from '../lib/types';

interface FormItem {
  name: string;
  selector: Record<string, unknown>;
  required?: boolean;
}

const BOARD_ENTITY: FormItem = {
  name: 'board_entity',
  selector: { entity: { domain: 'sensor' } },
};

const boolean = (name: string): FormItem => ({ name, selector: { boolean: {} } });

const number = (name: string, min: number, max: number): FormItem => ({
  name,
  selector: { number: { min, max, mode: 'box' } },
});

const select = (
  name: string,
  options: { value: string; label: string }[],
  multiple = false,
): FormItem => ({
  name,
  selector: { select: { options, multiple, mode: multiple ? 'list' : 'dropdown' } },
});

/** Shared plumbing: render an ha-form and publish changes back to Lovelace. */
abstract class HearthCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected _config: LovelaceCardConfig = { type: '' };

  public setConfig(config: LovelaceCardConfig): void {
    this._config = { ...config };
  }

  protected abstract schema(): FormItem[];

  private _label = (item: FormItem): string => t(this.hass, `editor.${item.name}`);

  private _valueChanged(event: CustomEvent): void {
    event.stopPropagation();
    const merged = { ...this._config, ...(event.detail?.value ?? {}) } as Record<
      string,
      unknown
    >;
    // ha-form reports cleared optional fields as undefined or "". Dropping them keeps
    // the stored YAML to what the user actually set.
    for (const [key, value] of Object.entries(merged)) {
      if (value === undefined || value === '' || (Array.isArray(value) && !value.length)) {
        delete merged[key];
      }
    }
    fireEvent(this, 'config-changed', { config: merged });
  }

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this.schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}

@customElement('hearth-calendar-card-editor')
export class HearthCalendarCardEditor extends HearthCardEditor {
  protected schema(): FormItem[] {
    const views = [
      { value: 'month', label: t(this.hass, 'calendar.month') },
      { value: 'week', label: t(this.hass, 'calendar.week') },
      { value: 'day', label: t(this.hass, 'calendar.day') },
    ];
    return [
      BOARD_ENTITY,
      select('view', views),
      select('views', views, true),
      { name: 'default_calendar', selector: { entity: { domain: 'calendar' } } },
      number('max_events_per_day', 1, 10),
      boolean('show_legend'),
      boolean('create'),
    ];
  }
}

@customElement('hearth-agenda-card-editor')
export class HearthAgendaCardEditor extends HearthCardEditor {
  protected schema(): FormItem[] {
    return [
      BOARD_ENTITY,
      number('days', 1, 14),
      number('max_events', 1, 20),
      boolean('hide_empty_days'),
    ];
  }
}

@customElement('hearth-people-card-editor')
export class HearthPeopleCardEditor extends HearthCardEditor {
  protected schema(): FormItem[] {
    return [
      BOARD_ENTITY,
      boolean('show_events'),
      number('max_events', 1, 5),
      boolean('show_tasks'),
      boolean('show_points'),
    ];
  }
}

@customElement('hearth-lists-card-editor')
export class HearthListsCardEditor extends HearthCardEditor {
  protected schema(): FormItem[] {
    return [
      BOARD_ENTITY,
      { name: 'entities', selector: { entity: { domain: 'todo', multiple: true } } },
      number('columns', 1, 6),
      number('max_items', 1, 50),
      boolean('allow_add'),
    ];
  }
}

@customElement('hearth-routines-card-editor')
export class HearthRoutinesCardEditor extends HearthCardEditor {
  protected schema(): FormItem[] {
    return [
      BOARD_ENTITY,
      select('block', [
        { value: 'auto', label: t(this.hass, 'routines.auto') },
        { value: 'morning', label: t(this.hass, 'routines.morning') },
        { value: 'evening', label: t(this.hass, 'routines.evening') },
        { value: 'both', label: t(this.hass, 'routines.both') },
      ]),
      number('evening_from', 0, 23),
      boolean('show_empty'),
    ];
  }
}

@customElement('hearth-header-card-editor')
export class HearthHeaderCardEditor extends HearthCardEditor {
  protected schema(): FormItem[] {
    return [
      { name: 'weather_entity', selector: { entity: { domain: 'weather' } } },
      { name: 'greeting', selector: { text: {} } },
      boolean('show_seconds'),
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-calendar-card-editor': HearthCalendarCardEditor;
    'hearth-agenda-card-editor': HearthAgendaCardEditor;
    'hearth-people-card-editor': HearthPeopleCardEditor;
    'hearth-lists-card-editor': HearthListsCardEditor;
    'hearth-routines-card-editor': HearthRoutinesCardEditor;
    'hearth-header-card-editor': HearthHeaderCardEditor;
  }
}
