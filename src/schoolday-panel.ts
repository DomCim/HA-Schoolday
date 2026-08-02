/**
 * Bundle entry point.
 *
 * The integration serves this file from /schoolday-frontend/schoolday-panel.js and registers it
 * via frontend.add_extra_js_url, so every card below is available without the user having
 * to add a Lovelace resource by hand.
 */
import { SCHOOLDAY_VERSION } from './lib/const';

// Cards are imported for their side effect: each module defines its custom element
// and pushes an entry onto window.customCards.
import './editors/schoolday-card-editors';
import './cards/schoolday-header-card';
import './cards/schoolday-routines-card';
import './cards/schoolday-timetable-card';

console.info(
  `%c SCHOOLDAY %c ${SCHOOLDAY_VERSION} `,
  'color:#fff;background:#3a86c8;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px',
  'color:#3a86c8;background:#16212b;font-weight:700;border-radius:0 3px 3px 0;padding:2px 6px',
);

export { SCHOOLDAY_VERSION };
