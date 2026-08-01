import { css } from 'lit';

/**
 * Shared look for every Hearth card.
 *
 * Sized for a wall tablet: touch targets are at least 44px, and nothing depends on
 * hover, which does not exist on the device this is built for.
 */
export const hearthTokens = css`
  :host {
    --hearth-gap: 8px;
    --hearth-radius: 12px;
    --hearth-touch: 44px;
    --hearth-muted: var(--secondary-text-color, #7a7a7a);
    --hearth-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --hearth-surface: var(--card-background-color, #fff);
    --hearth-surface-alt: rgba(127, 127, 127, 0.08);
    --hearth-today: var(--primary-color, #03a9f4);
  }
`;

export const hearthButtons = css`
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--hearth-touch);
    min-height: var(--hearth-touch);
    border-radius: 50%;
    color: var(--hearth-muted);
  }

  .icon-button:active {
    background: var(--hearth-surface-alt);
  }

  .icon-button svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .segmented {
    display: inline-flex;
    border: 1px solid var(--hearth-line);
    border-radius: calc(var(--hearth-touch) / 2);
    overflow: hidden;
  }

  .segmented button {
    min-height: 36px;
    padding: 0 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--hearth-muted);
  }

  .segmented button[aria-pressed='true'] {
    background: var(--hearth-today);
    color: var(--text-primary-color, #fff);
  }
`;

/** A modal overlay drawn inside the card's shadow root. */
export const hearthDialog = css`
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.5);
  }

  .sheet {
    width: min(560px, 100%);
    max-height: 90vh;
    overflow-y: auto;
    background: var(--hearth-surface);
    color: var(--primary-text-color);
    border-radius: var(--hearth-radius);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    padding: 20px;
    box-sizing: border-box;
  }

  .sheet h2 {
    margin: 0 0 16px;
    font-size: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .field > label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--hearth-muted);
  }

  .field input[type='text'],
  .field input[type='date'],
  .field input[type='time'],
  .field textarea,
  .field select {
    font: inherit;
    color: inherit;
    min-height: var(--hearth-touch);
    padding: 8px 12px;
    box-sizing: border-box;
    background: var(--hearth-surface-alt);
    border: 1px solid var(--hearth-line);
    border-radius: 8px;
  }

  .field textarea {
    min-height: 72px;
    resize: vertical;
  }

  .row {
    display: flex;
    gap: var(--hearth-gap);
  }

  .row > .field {
    flex: 1;
  }

  /* The whole row toggles, so the target is the row rather than a 13px native box. */
  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: calc(var(--hearth-touch) + 8px);
    margin-bottom: 14px;
    padding: 0 12px;
    box-sizing: border-box;
    background: var(--hearth-surface-alt);
    border: 1px solid var(--hearth-line);
    border-radius: 8px;
    font: inherit;
    color: inherit;
    text-align: left;
  }

  .switch-row:active {
    border-color: var(--hearth-today);
  }

  .switch {
    position: relative;
    flex: none;
    width: 52px;
    height: 30px;
    border-radius: 15px;
    background: var(--hearth-line);
    transition: background 140ms ease;
  }

  .switch::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    transition: transform 140ms ease;
  }

  .switch-row[aria-checked='true'] .switch {
    background: var(--hearth-today);
  }

  .switch-row[aria-checked='true'] .switch::after {
    transform: translateX(22px);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--hearth-gap);
    margin-top: 20px;
  }

  .actions button {
    min-height: var(--hearth-touch);
    padding: 0 20px;
    border-radius: 8px;
    font-weight: 600;
  }

  .actions .primary {
    background: var(--hearth-today);
    color: var(--text-primary-color, #fff);
  }

  .actions .primary[disabled] {
    opacity: 0.5;
    cursor: default;
  }

  .actions .ghost {
    color: var(--hearth-muted);
  }

  .error {
    margin: 0 0 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(200, 60, 60, 0.12);
    color: var(--error-color, #c33);
    font-size: 0.85rem;
  }
`;
