/**
 * Everything the options dialog can change, on the dashboard.
 *
 * The integration page is where this lived, and finding it to move one lesson is more
 * ceremony than the job deserves. Every change here goes out as a Schoolday service
 * call and is saved the moment it is made — the same bargain the options flow struck,
 * for the same reason: a household edits one thing and walks away.
 *
 * The card never writes the configuration itself. It calls a service, and the service
 * decides whether the value is allowed, so there is one set of rules and not two.
 */
import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import {
  adminOf,
  calendarEntities,
  callSchoolday,
  stepsFor,
  type AdminConfig,
  type AdminMember,
} from '../lib/admin';
import { findBoard } from '../lib/board';
import { localeOf } from '../lib/dates';
import { t } from '../lib/i18n';
import { schooldayButtons, schooldayTokens } from '../lib/styles';
import { lessonAt, weekOf, type TimetableWeek } from '../lib/timetable';
import { memberSensor } from '../lib/board';
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from '../lib/types';

export type AdminSection = 'timetable' | 'routines' | 'family' | 'subjects' | 'holidays';

const SECTIONS: AdminSection[] = ['timetable', 'routines', 'family', 'subjects', 'holidays'];
const BLOCKS = ['morning', 'evening'];
/** 1 January 2024 was a Monday, which makes it a convenient weekday-name origin. */
const WEEKDAY_ORIGIN = new Date(2024, 0, 1);

export interface SchooldayAdminCardConfig extends LovelaceCardConfig {
  board_entity?: string;
  /** Which section to open on. Unset opens the timetable. */
  section?: AdminSection;
}

@customElement('schoolday-admin-card')
export class SchooldayAdminCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config: SchooldayAdminCardConfig = { type: '' };
  @state() private _section: AdminSection = 'timetable';
  /** Whose timetable or routine is being edited; unset means the first member. */
  @state() private _memberId?: string;
  @state() private _block = 'morning';
  /** Which routine day is open: "0".."6", "free" or "care". */
  @state() private _routineDay = '0';
  /** The cell being edited, as `weekday:period`. */
  @state() private _cell?: string;
  @state() private _draftSubject = '';
  @state() private _draftRoom = '';
  /** Set while a service call is in flight, so a double tap cannot race itself. */
  @state() private _busy = false;
  @state() private _error?: string;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('schoolday-admin-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return { section: 'timetable' };
  }

  public setConfig(config: SchooldayAdminCardConfig): void {
    this._config = { ...config };
    if (config.section && SECTIONS.includes(config.section)) {
      this._section = config.section;
    }
  }

  public getCardSize(): number {
    return 10;
  }

  public getGridOptions(): { columns: 'full'; rows: 'auto' } {
    return { columns: 'full', rows: 'auto' };
  }

  // --- plumbing -----------------------------------------------------------

  private get _board() {
    return findBoard(this.hass!, this._config.board_entity);
  }

  private _admin(): AdminConfig {
    const board = this._board;
    return adminOf(board ? this.hass!.states[board.entityId] : undefined);
  }

  private _selected(config: AdminConfig): AdminMember | undefined {
    return config.members.find((member) => member.id === this._memberId) ?? config.members[0];
  }

  /**
   * Send one change.
   *
   * Nothing is written locally first: the sensor republishes when the entry changes,
   * so what the card shows is always what was actually saved rather than what it
   * hoped would be.
   */
  private async _call(service: string, data: Record<string, unknown>): Promise<void> {
    if (this._busy) {
      return;
    }
    this._busy = true;
    this._error = undefined;
    try {
      await callSchoolday(this.hass!, service, data);
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._busy = false;
    }
  }

  private _weekdayName(weekday: number, style: 'short' | 'long'): string {
    const date = new Date(WEEKDAY_ORIGIN);
    date.setDate(date.getDate() + weekday);
    return new Intl.DateTimeFormat(localeOf(this.hass!), { weekday: style }).format(date);
  }

  private _memberChips(config: AdminConfig, selected: AdminMember | undefined): TemplateResult {
    return html`
      <div class="chips">
        ${config.members.map(
          (member) => html`
            <button
              class="chip ${member.id === selected?.id ? 'on' : ''}"
              style=${`--member-color:${member.color}`}
              @click=${() => {
                this._memberId = member.id;
                this._cell = undefined;
              }}
            >
              ${member.name}
            </button>
          `,
        )}
      </div>
    `;
  }

  /** A list of lines, edited as one textarea. Used for steps and keywords alike. */
  private _lines(
    label: string,
    value: string[],
    hint: string,
    save: (lines: string[]) => void,
  ): TemplateResult {
    const id = `lines-${label}`;
    return html`
      <label class="field">
        <span class="label">${label}</span>
        <textarea
          id=${id}
          rows=${Math.max(3, value.length + 1)}
          placeholder=${hint}
          .value=${value.join('\n')}
        ></textarea>
        <button
          class="apply"
          ?disabled=${this._busy}
          @click=${(event: Event) => {
            const root = (event.target as HTMLElement).closest('.field');
            const field = root?.querySelector('textarea') as HTMLTextAreaElement | null;
            save(
              (field?.value ?? '')
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            );
          }}
        >
          ${t(this.hass, 'admin.save')}
        </button>
      </label>
    `;
  }

  // --- timetable ----------------------------------------------------------

  private _renderTimetable(config: AdminConfig): TemplateResult {
    const member = this._selected(config);
    const grid = this._board?.timetable;
    const week: TimetableWeek = member
      ? weekOf(memberSensor(this.hass!, member.id))
      : {};
    const weekdays = [0, 1, 2, 3, 4, 5, 6].filter(
      (day) => day <= 4 || (week[day] ?? []).length > 0,
    );

    return html`
      ${this._lines(
        t(this.hass, 'admin.periods'),
        config.periods,
        '08:00-08:45',
        (lines) => this._call('set_periods', { periods: lines }),
      )}
      ${!grid?.periods.length
        ? html`<div class="notice">${t(this.hass, 'admin.periods_first')}</div>`
        : !member
          ? html`<div class="notice">${t(this.hass, 'admin.no_members')}</div>`
          : html`
              ${this._memberChips(config, member)}
              <div
                class="week"
                style=${`grid-template-columns:max-content repeat(${weekdays.length}, minmax(0, 1fr))`}
              >
                <div></div>
                ${weekdays.map(
                  (day) => html`<div class="head">${this._weekdayName(day, 'short')}</div>`,
                )}
                ${grid.periods.map(
                  (period) => html`
                    <div class="no">${period.index}</div>
                    ${weekdays.map((day) => {
                      const key = `${day}:${period.index}`;
                      const lesson = lessonAt(week, day, period.index);
                      return html`
                        <button
                          class="slot ${lesson ? 'filled' : ''} ${this._cell === key ? 'open' : ''}"
                          style=${lesson
                            ? `--subject:${grid.subjects[lesson.subject] ?? 'var(--schoolday-line)'}`
                            : ''}
                          @click=${() => {
                            this._cell = this._cell === key ? undefined : key;
                            this._draftSubject = lesson?.subject ?? '';
                            this._draftRoom = lesson?.room ?? '';
                          }}
                        >
                          <span class="subject">${lesson?.subject ?? '+'}</span>
                          ${lesson?.room ? html`<span class="room">${lesson.room}</span>` : nothing}
                        </button>
                      `;
                    })}
                  `,
                )}
              </div>
              ${this._cell ? this._renderCellEditor(member) : nothing}
            `}
    `;
  }

  private _renderCellEditor(member: AdminMember): TemplateResult {
    const [weekday, period] = this._cell!.split(':').map(Number);
    const known = Object.keys(this._board?.timetable?.subjects ?? {}).sort();
    return html`
      <div class="editor">
        <div class="editor-head">
          ${member.name} · ${this._weekdayName(weekday, 'long')} · ${period}.
        </div>
        <div class="row">
          <label class="field grow">
            <span class="label">${t(this.hass, 'admin.subject')}</span>
            <input
              list="schoolday-subjects"
              .value=${this._draftSubject}
              @input=${(e: Event) => {
                this._draftSubject = (e.target as HTMLInputElement).value;
              }}
            />
            <datalist id="schoolday-subjects">
              ${known.map((subject) => html`<option value=${subject}></option>`)}
            </datalist>
          </label>
          <label class="field grow">
            <span class="label">${t(this.hass, 'admin.room')}</span>
            <input
              .value=${this._draftRoom}
              @input=${(e: Event) => {
                this._draftRoom = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
        </div>
        <div class="row">
          <button
            class="apply"
            ?disabled=${this._busy}
            @click=${async () => {
              await this._call('set_lesson', {
                member: member.id,
                weekday,
                period,
                subject: this._draftSubject,
                room: this._draftRoom,
              });
              this._cell = undefined;
            }}
          >
            ${t(this.hass, 'admin.save')}
          </button>
          <button
            class="danger"
            ?disabled=${this._busy}
            @click=${async () => {
              await this._call('set_lesson', { member: member.id, weekday, period, subject: '' });
              this._cell = undefined;
            }}
          >
            ${t(this.hass, 'admin.clear')}
          </button>
        </div>
      </div>
    `;
  }

  // --- routines -----------------------------------------------------------

  private _renderRoutines(config: AdminConfig): TemplateResult {
    const member = this._selected(config);
    if (!member) {
      return html`<div class="notice">${t(this.hass, 'admin.no_members')}</div>`;
    }
    const days = ['0', '1', '2', '3', '4', '5', '6', 'free', 'care'];
    const dayLabel = (day: string) =>
      day === 'free'
        ? t(this.hass, 'admin.day_free')
        : day === 'care'
          ? t(this.hass, 'admin.day_care')
          : this._weekdayName(Number(day), 'short');

    return html`
      ${this._memberChips(config, member)}
      <div class="chips">
        ${BLOCKS.map(
          (block) => html`
            <button
              class="chip ${block === this._block ? 'on' : ''}"
              @click=${() => {
                this._block = block;
              }}
            >
              ${t(this.hass, `admin.block_${block}`)}
            </button>
          `,
        )}
      </div>
      <div class="chips">
        ${days.map(
          (day) => html`
            <button
              class="chip ${day === this._routineDay ? 'on' : ''}"
              @click=${() => {
                this._routineDay = day;
              }}
            >
              ${dayLabel(day)}
            </button>
          `,
        )}
      </div>
      ${this._lines(
        `${member.name} · ${t(this.hass, `admin.block_${this._block}`)} · ${dayLabel(
          this._routineDay,
        )}`,
        stepsFor(config, member.id, this._block, this._routineDay),
        t(this.hass, 'admin.steps_hint'),
        (lines) =>
          this._call('set_routine', {
            member: member.id,
            block: this._block,
            day: this._routineDay,
            steps: lines,
          }),
      )}
    `;
  }

  // --- family -------------------------------------------------------------

  private _renderFamily(config: AdminConfig): TemplateResult {
    const calendars = calendarEntities(this.hass!);
    const form = (member: AdminMember | null) => {
      const key = member?.id ?? 'new';
      return html`
        <div class="member" style=${`--member-color:${member?.color ?? '#3a86c8'}`}>
          <div class="row">
            <label class="field grow">
              <span class="label">${t(this.hass, 'admin.name')}</span>
              <input id=${`name-${key}`} .value=${member?.name ?? ''} />
            </label>
            <label class="field">
              <span class="label">${t(this.hass, 'admin.color')}</span>
              <input type="color" id=${`color-${key}`} .value=${member?.color ?? '#3a86c8'} />
            </label>
          </div>
          <div class="row">
            <label class="field grow">
              <span class="label">${t(this.hass, 'admin.calendar')}</span>
              <input
                id=${`calendar-${key}`}
                list="schoolday-calendars"
                .value=${member?.calendar ?? ''}
                placeholder="calendar.…"
              />
            </label>
            <label class="field grow">
              <span class="label">${t(this.hass, 'admin.avatar')}</span>
              <input id=${`avatar-${key}`} .value=${member?.avatar ?? ''} />
            </label>
          </div>
          <div class="row">
            <button
              class="apply"
              ?disabled=${this._busy}
              @click=${(event: Event) => {
                const root = (event.target as HTMLElement).closest('.member')!;
                const read = (prefix: string) =>
                  (root.querySelector(`#${prefix}-${key}`) as HTMLInputElement | null)?.value ?? '';
                this._call('set_member', {
                  ...(member ? { member: member.id } : {}),
                  name: read('name'),
                  color: read('color'),
                  calendar: read('calendar'),
                  avatar: read('avatar'),
                });
              }}
            >
              ${member ? t(this.hass, 'admin.save') : t(this.hass, 'admin.add')}
            </button>
            ${member
              ? html`
                  <button
                    class="danger"
                    ?disabled=${this._busy}
                    @click=${() => {
                      // Removing takes their week and routines with it, so it asks.
                      if (confirm(t(this.hass, 'admin.remove_confirm', { name: member.name }))) {
                        this._call('remove_member', { member: member.id });
                      }
                    }}
                  >
                    ${t(this.hass, 'admin.remove')}
                  </button>
                `
              : nothing}
          </div>
        </div>
      `;
    };

    return html`
      <datalist id="schoolday-calendars">
        ${calendars.map((entityId) => html`<option value=${entityId}></option>`)}
      </datalist>
      ${config.members.map((member) => form(member))}
      <div class="sub-head">${t(this.hass, 'admin.add_member')}</div>
      ${form(null)}
    `;
  }

  // --- subjects -----------------------------------------------------------

  private _renderSubjects(config: AdminConfig): TemplateResult {
    const subjects = Object.keys(this._board?.timetable?.subjects ?? {}).sort();
    if (!subjects.length) {
      return html`<div class="notice">${t(this.hass, 'admin.no_subjects')}</div>`;
    }
    return html`
      <div class="notice quiet">${t(this.hass, 'admin.colors_hint')}</div>
      <div class="subjects">
        ${subjects.map((subject) => {
          const current = this._board?.timetable?.subjects[subject] ?? '#888888';
          const custom = subject in config.colors;
          return html`
            <div class="subject-row">
              <input
                type="color"
                .value=${current}
                @change=${(e: Event) =>
                  this._call('set_subject_color', {
                    subject,
                    color: (e.target as HTMLInputElement).value,
                  })}
              />
              <span class="name">${subject}</span>
              ${custom
                ? html`
                    <button
                      class="link"
                      ?disabled=${this._busy}
                      @click=${() => this._call('set_subject_color', { subject })}
                    >
                      ${t(this.hass, 'admin.reset_color')}
                    </button>
                  `
                : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }

  // --- holidays -----------------------------------------------------------

  private _renderHolidays(config: AdminConfig): TemplateResult {
    const calendars = calendarEntities(this.hass!);
    return html`
      <div class="notice quiet">${t(this.hass, 'admin.calendars_hint')}</div>
      <datalist id="schoolday-calendars">
        ${calendars.map((entityId) => html`<option value=${entityId}></option>`)}
      </datalist>
      ${this._lines(
        t(this.hass, 'admin.school_calendars'),
        config.schoolCalendars,
        'calendar.schulferien',
        (lines) => this._call('set_calendars', { school_calendars: lines }),
      )}
      ${this._lines(
        t(this.hass, 'admin.care_keywords'),
        config.careKeywords,
        t(this.hass, 'admin.care_hint'),
        (lines) => this._call('set_calendars', { care_keywords: lines }),
      )}
    `;
  }

  // --- render -------------------------------------------------------------

  protected override render(): TemplateResult {
    if (!this.hass) {
      return html`<ha-card></ha-card>`;
    }
    if (!this._board) {
      return html`<ha-card><div class="notice">${t(this.hass, 'board.missing')}</div></ha-card>`;
    }
    const config = this._admin();

    return html`
      <ha-card>
        <div class="tabs">
          ${SECTIONS.map(
            (section) => html`
              <button
                class="tab ${section === this._section ? 'on' : ''}"
                @click=${() => {
                  this._section = section;
                  this._cell = undefined;
                  this._error = undefined;
                }}
              >
                ${t(this.hass, `admin.tab_${section}`)}
              </button>
            `,
          )}
        </div>
        ${this._error ? html`<div class="notice error">${this._error}</div>` : nothing}
        <div class="body">
          ${this._section === 'timetable'
            ? this._renderTimetable(config)
            : this._section === 'routines'
              ? this._renderRoutines(config)
              : this._section === 'family'
                ? this._renderFamily(config)
                : this._section === 'subjects'
                  ? this._renderSubjects(config)
                  : this._renderHolidays(config)}
        </div>
      </ha-card>
    `;
  }

  static override styles = [
    schooldayTokens,
    schooldayButtons,
    css`
      :host {
        display: block;
      }

      ha-card {
        padding: 12px;
      }

      .tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
      }

      .tab,
      .chip {
        min-height: var(--schoolday-touch);
        padding: 6px 12px;
        border-radius: 999px;
        background: var(--schoolday-surface-alt);
        font-size: 0.9rem;
      }

      .tab.on {
        background: var(--schoolday-today);
        color: var(--text-primary-color, #fff);
        font-weight: 700;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 8px 0;
      }

      .chip.on {
        background: color-mix(in srgb, var(--member-color, var(--schoolday-today)) 30%, transparent);
        font-weight: 700;
      }

      .body {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field.grow {
        flex: 1;
        min-width: 0;
      }

      .label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      input,
      textarea {
        font: inherit;
        color: inherit;
        min-height: var(--schoolday-touch);
        padding: 6px 10px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid var(--schoolday-line);
        background: var(--schoolday-surface);
      }

      input[type='color'] {
        width: 56px;
        padding: 2px;
      }

      textarea {
        resize: vertical;
        line-height: 1.5;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: flex-end;
      }

      .apply,
      .danger,
      .link {
        align-self: flex-start;
        min-height: var(--schoolday-touch);
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 700;
        background: var(--schoolday-surface-alt);
      }

      .apply {
        background: color-mix(in srgb, var(--schoolday-today) 25%, transparent);
      }

      .danger {
        color: var(--error-color, #d33);
      }

      .link {
        background: none;
        font-weight: 400;
        text-decoration: underline;
        color: var(--schoolday-muted);
      }

      button[disabled] {
        opacity: 0.5;
      }

      .week {
        display: grid;
        row-gap: 4px;
        column-gap: 8px;
        align-items: stretch;
      }

      .head {
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      .no {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 4px;
        font-weight: 700;
        color: var(--schoolday-muted);
      }

      .slot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: var(--schoolday-touch);
        padding: 4px 8px;
        overflow: hidden;
        border-radius: 8px;
        border: 1px dashed var(--schoolday-line);
        background: none;
        color: var(--schoolday-muted);
        font-size: 0.9rem;
      }

      .slot.filled {
        border: none;
        border-left: 3px solid var(--subject);
        background: color-mix(in srgb, var(--subject) 22%, transparent);
        color: inherit;
        font-weight: 700;
      }

      .slot.open {
        outline: 2px solid var(--schoolday-today);
      }

      .slot .room {
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--schoolday-muted);
      }

      .editor,
      .member {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        border-radius: 10px;
        background: var(--schoolday-surface-alt);
        border-left: 3px solid var(--member-color, var(--schoolday-today));
      }

      .editor-head,
      .sub-head {
        font-weight: 700;
      }

      .subjects {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .subject-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .subject-row .name {
        flex: 1;
        font-weight: 700;
      }

      .notice {
        padding: 10px;
        border-radius: 10px;
        background: var(--schoolday-surface-alt);
        color: var(--schoolday-muted);
      }

      .notice.quiet {
        font-size: 0.85rem;
      }

      .notice.error {
        color: var(--error-color, #d33);
        background: color-mix(in srgb, var(--error-color, #d33) 12%, transparent);
      }
    `,
  ];
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'schoolday-admin-card',
  name: 'Schoolday Admin',
  description: 'Edit the timetable, routines, family and holidays from the dashboard.',
  preview: false,
  documentationURL: 'https://github.com/DomCim/HA-Schoolday',
});
