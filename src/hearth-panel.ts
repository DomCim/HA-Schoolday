/**
 * Bundle entry point.
 *
 * The integration serves this file from /hearth-frontend/hearth-panel.js and registers it
 * via frontend.add_extra_js_url, so every card below is available without the user having
 * to add a Lovelace resource by hand.
 */
import { HEARTH_VERSION } from './lib/const';

// Cards are imported for their side effect: each module defines its custom element
// and pushes an entry onto window.customCards.
import './cards/hearth-header-card';
import './cards/hearth-people-card';
import './cards/hearth-calendar-card';
import './cards/hearth-agenda-card';
import './cards/hearth-routines-card';
import './cards/hearth-lists-card';

console.info(
  `%c HEARTH %c ${HEARTH_VERSION} `,
  'color:#fff;background:#e0603a;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px',
  'color:#e0603a;background:#2b2118;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px',
);

export { HEARTH_VERSION };
