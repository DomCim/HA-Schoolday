/**
 * Create-an-event sheet.
 *
 * Built from plain elements inside the card's shadow root rather than `ha-dialog`:
 * Home Assistant lazy-loads its dialog components, so they are not reliably defined on
 * a kiosk that only ever shows one dashboard.
 */
import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { calendarName, writableCalendars, type HearthBoard } from '../lib/board';
import { createEvent } from '../lib/calendar';
import { addDays, fromDateKey, toDateKey, toTimeValue } from '../lib/dates';
import { hearthButtons, hearthDialog, hearthTokens } from '../lib/styles';
import type { HomeAssistant } from '../lib/types';

const DEFAULT_START_HOUR = 9;
const DEFAULT_DURATION_HOURS = 1;

@customElement('hearth-event-dialog')
export class HearthEventDialog extends LitElement {
  static override styles = [hearthTokens, hearthButtons, hearthDialog];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public board!: HearthBoard;
  /** The day the user tapped. */
  @property({ attribute: false }) public day!: Date;
  @property({ attribute: false }) public defaultCalendar?: string;

  @state() private _summary = '';
  @state() private _calendar = '';
  @state() private _dateKey = '';
  @state() private _allDay = true;
  @state() private _startTime = '';
  @state() private _endTime = '';
  @state() private _description = '';
  @state() private _saving = false;
  @state() private _error?: string;

  public override connectedCallback(): void {
    super.connectedCallback();
    const options = writableCalendars(this.board);
    this._calendar =
      this.defaultCalendar && options.includes(this.defaultCalendar)
        ? this.defaultCalendar
        : (options[0] ?? '');

    this._dateKey = toDateKey(this.day);

    const start = new Date(this.day);
    start.setHours(DEFAULT_START_HOUR, 0, 0, 0);
    this._startTime = toTimeValue(start);
    start.setHours(start.getHours() + DEFAULT_DURATION_HOURS);
    this._endTime = toTimeValue(start);
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent('hearth-close', { bubbles: true, composed: true }));
  }

  private _onScrimClick(event: MouseEvent): void {
    // Only a tap on the backdrop itself dismisses; taps inside the sheet must not.
    if (event.target === event.currentTarget) {
      this._close();
    }
  }

  private async _save(): Promise<void> {
    const summary = this._summary.trim();
    if (!summary || !this._calendar || this._saving) {
      return;
    }

    const day = fromDateKey(this._dateKey);
    let start: Date;
    let end: Date;

    if (this._allDay) {
      start = day;
      // `end_date` is exclusive: a single all-day event ends the next morning.
      end = addDays(day, 1);
    } else {
      const [startHour, startMinute] = this._startTime.split(':').map(Number);
      const [endHour, endMinute] = this._endTime.split(':').map(Number);
      start = new Date(day);
      start.setHours(startHour, startMinute, 0, 0);
      end = new Date(day);
      end.setHours(endHour, endMinute, 0, 0);
      if (end <= start) {
        // Treat an earlier end as crossing midnight rather than rejecting it.
        end = addDays(end, 1);
      }
    }

    this._saving = true;
    this._error = undefined;
    try {
      await createEvent(this.hass, this._calendar, {
        summary,
        start,
        end,
        allDay: this._allDay,
        description: this._description.trim() || undefined,
      });
      this.dispatchEvent(
        new CustomEvent('hearth-created', { bubbles: true, composed: true }),
      );
      this._close();
    } catch (err) {
      this._error =
        err instanceof Error ? err.message : 'The event could not be created.';
    } finally {
      this._saving = false;
    }
  }

  private _calendarOptions(): TemplateResult[] {
    const byCalendar = new Map<string, string>();
    for (const member of this.board.members) {
      for (const entityId of member.calendars) {
        byCalendar.set(entityId, member.name);
      }
    }
    return writableCalendars(this.board).map((entityId) => {
      const owner = byCalendar.get(entityId);
      const label = owner
        ? `${owner} — ${calendarName(this.hass, entityId)}`
        : calendarName(this.hass, entityId);
      return html`<option value=${entityId} ?selected=${entityId === this._calendar}>
        ${label}
      </option>`;
    });
  }

  protected override render(): TemplateResult {
    const options = this._calendarOptions();
    const canSave = Boolean(this._summary.trim() && this._calendar) && !this._saving;

    return html`
      <div class="scrim" @click=${this._onScrimClick}>
        <div class="sheet" role="dialog" aria-modal="true">
          <h2>New event</h2>

          ${this._error ? html`<p class="error">${this._error}</p>` : nothing}
          ${options.length === 0
            ? html`<p class="error">
                No writable calendar is configured. Add calendars to a family member, or
                remove one from the read-only list.
              </p>`
            : nothing}

          <div class="field">
            <label for="summary">Title</label>
            <input
              id="summary"
              type="text"
              .value=${this._summary}
              autocomplete="off"
              @input=${(e: Event) => {
                this._summary = (e.target as HTMLInputElement).value;
              }}
            />
          </div>

          <div class="field">
            <label for="calendar">Calendar</label>
            <select
              id="calendar"
              @change=${(e: Event) => {
                this._calendar = (e.target as HTMLSelectElement).value;
              }}
            >
              ${options}
            </select>
          </div>

          <div class="field">
            <label for="date">Date</label>
            <input
              id="date"
              type="date"
              .value=${this._dateKey}
              @change=${(e: Event) => {
                this._dateKey = (e.target as HTMLInputElement).value;
              }}
            />
          </div>

          <button
            id="allday"
            class="switch-row"
            role="switch"
            aria-checked=${this._allDay}
            @click=${() => {
              this._allDay = !this._allDay;
            }}
          >
            <span>All day</span>
            <span class="switch"></span>
          </button>

          ${this._allDay
            ? nothing
            : html`
                <div class="row">
                  <div class="field">
                    <label for="from">From</label>
                    <input
                      id="from"
                      type="time"
                      .value=${this._startTime}
                      @change=${(e: Event) => {
                        this._startTime = (e.target as HTMLInputElement).value;
                      }}
                    />
                  </div>
                  <div class="field">
                    <label for="to">To</label>
                    <input
                      id="to"
                      type="time"
                      .value=${this._endTime}
                      @change=${(e: Event) => {
                        this._endTime = (e.target as HTMLInputElement).value;
                      }}
                    />
                  </div>
                </div>
              `}

          <div class="field">
            <label for="note">Note</label>
            <textarea
              id="note"
              .value=${this._description}
              @input=${(e: Event) => {
                this._description = (e.target as HTMLTextAreaElement).value;
              }}
            ></textarea>
          </div>

          <div class="actions">
            <button class="ghost" @click=${this._close}>Cancel</button>
            <button class="primary" ?disabled=${!canSave} @click=${this._save}>
              ${this._saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hearth-event-dialog': HearthEventDialog;
  }
}
