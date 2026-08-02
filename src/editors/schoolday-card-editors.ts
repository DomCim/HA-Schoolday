/**
 * Visual editors for every Schoolday card.
 *
 * Built on `ha-form`, which — unlike `ha-dialog` — is always defined wherever a
 * card editor can be opened, because every built-in card editor uses it.
 *
 * Labels come from the same translation table as the cards, so the editor speaks
 * whatever language Home Assistant is set to.
 *
 * `board_entity` is deliberately absent from every schema below. The cards find the
 * board sensor themselves, only one of them can exist, and an entity picker that is
 * meant to stay empty is a question the user should never be asked. It still works
 * in YAML for the rare case of a renamed entity.
 */
import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { findBoard } from '../lib/board';
import { fireEvent } from '../lib/dom';
import { t } from '../lib/i18n';
import type { HomeAssistant, LovelaceCardConfig, LovelaceCardEditor } from '../lib/types';

interface FormItem {
  name: string;
  selector: Record<string, unknown>;
  required?: boolean;
}

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
abstract class SchooldayCardEditor extends LitElement implements LovelaceCardEditor {
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

/** The board's members as dropdown options, for the cards that show one child at a time. */
function memberOptions(hass: HomeAssistant | undefined): { value: string; label: string }[] {
  return (findBoard(hass!)?.members ?? []).map((member) => ({
    value: member.id,
    label: member.name,
  }));
}

@customElement('schoolday-routines-card-editor')
export class SchooldayRoutinesCardEditor extends SchooldayCardEditor {
  protected schema(): FormItem[] {
    // Left empty the card shows the whole family, which is the usual wall-panel case;
    // the dropdown clears back to that, so picking one child is not a one-way door.
    const members = memberOptions(this.hass);

    return [
      ...(members.length > 1 ? [select('member', members)] : []),
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

@customElement('schoolday-timetable-card-editor')
export class SchooldayTimetableCardEditor extends SchooldayCardEditor {
  protected schema(): FormItem[] {
    // The members come from the board, so this is a name to pick rather than an id to
    // look up. Everything else about the timetable lives in the integration.
    const members = memberOptions(this.hass);

    return [
      ...(members.length > 1 ? [select('member', members)] : []),
      select('layout', [
        { value: 'auto', label: t(this.hass, 'timetable.layout_auto') },
        { value: 'week', label: t(this.hass, 'timetable.layout_week') },
        { value: 'day', label: t(this.hass, 'timetable.layout_day') },
      ]),
      select('week_days', [
        { value: 'auto', label: t(this.hass, 'timetable.days_auto') },
        { value: 'school', label: t(this.hass, 'timetable.days_school') },
        { value: 'week', label: t(this.hass, 'timetable.days_week') },
      ]),
      boolean('show_rooms'),
      boolean('show_times'),
      boolean('show_breaks'),
      boolean('hide_empty_periods'),
      boolean('highlight'),
      boolean('roll_days'),
    ];
  }
}

@customElement('schoolday-admin-card-editor')
export class SchooldayAdminCardEditor extends SchooldayCardEditor {
  protected schema(): FormItem[] {
    return [
      select('section', [
        { value: 'timetable', label: t(this.hass, 'admin.tab_timetable') },
        { value: 'routines', label: t(this.hass, 'admin.tab_routines') },
        { value: 'family', label: t(this.hass, 'admin.tab_family') },
        { value: 'subjects', label: t(this.hass, 'admin.tab_subjects') },
        { value: 'materials', label: t(this.hass, 'admin.tab_materials') },
        { value: 'exceptions', label: t(this.hass, 'admin.tab_exceptions') },
        { value: 'holidays', label: t(this.hass, 'admin.tab_holidays') },
      ]),
    ];
  }
}

@customElement('schoolday-header-card-editor')
export class SchooldayHeaderCardEditor extends SchooldayCardEditor {
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
    'schoolday-routines-card-editor': SchooldayRoutinesCardEditor;
    'schoolday-timetable-card-editor': SchooldayTimetableCardEditor;
    'schoolday-header-card-editor': SchooldayHeaderCardEditor;
  }
}
