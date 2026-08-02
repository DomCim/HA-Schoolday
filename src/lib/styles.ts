import { css } from 'lit';

/**
 * Shared look for every Schoolday card.
 *
 * Sized for a wall tablet: touch targets are at least 44px, and nothing depends on
 * hover, which does not exist on the device this is built for.
 */
export const schooldayTokens = css`
  :host {
    --schoolday-gap: 8px;
    --schoolday-radius: 12px;
    --schoolday-touch: 44px;
    --schoolday-muted: var(--secondary-text-color, #7a7a7a);
    --schoolday-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --schoolday-surface: var(--card-background-color, #fff);
    --schoolday-surface-alt: rgba(127, 127, 127, 0.08);
    --schoolday-today: var(--primary-color, #03a9f4);
    /* A day off and a day in care are both "no lessons" and nothing alike otherwise,
       so each gets its own colour. Neither is drawn from the subject palette: they are
       not subjects, and a household should not have to wonder whether the sand block
       is a holiday or somebody's Art lesson. */
    --schoolday-holiday: #b08d57;
    --schoolday-care: #2f7f8f;
    /* A third kind of closed day, and the only one that is nobody's good news. Muted
       rather than alarming: the board says what is, it does not fuss. */
    --schoolday-sick: #8a8f98;
  }
`;

export const schooldayButtons = css`
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
    min-width: var(--schoolday-touch);
    min-height: var(--schoolday-touch);
    border-radius: 50%;
    color: var(--schoolday-muted);
  }

  .icon-button:active {
    background: var(--schoolday-surface-alt);
  }

  .icon-button svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .segmented {
    display: inline-flex;
    border: 1px solid var(--schoolday-line);
    border-radius: calc(var(--schoolday-touch) / 2);
    overflow: hidden;
  }

  .segmented button {
    min-height: 36px;
    padding: 0 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--schoolday-muted);
  }

  .segmented button[aria-pressed='true'] {
    background: var(--schoolday-today);
    color: var(--text-primary-color, #fff);
  }
`;
