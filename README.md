# Hearth

A family board for Home Assistant — the wall-mounted household command centre, built from the
calendars, lists and people you already have in Home Assistant.

Hearth is inspired by dedicated family-calendar appliances: a month/week calendar colour-coded per
family member, shared lists, chores and points, all on a wall tablet and all touch-first. The
difference is that Hearth stores nothing of its own that Home Assistant can already hold — it reads
your existing `calendar.*`, `todo.*` and `person.*` entities and writes back through the standard
services.

> **Status: early development.** Installable through HACS as a custom repository, but not submitted to
> the HACS default store — it is not listed or advertised anywhere.

## What it is

Hearth ships as a **single custom integration** that also serves its own Lovelace cards. One install,
no separate resource registration, and the integration and cards can never drift apart in version.

| Piece | Responsibility |
|---|---|
| `custom_components/hearth` | Family member profiles (colour, avatar, which calendars and lists belong to whom), aggregated per-member sensors, a WebSocket API for the cards |
| Lovelace cards | The entire look and the touch interaction |
| Your existing integrations | The actual data — Hearth never re-implements calendars, to-do lists or chores |

### Cards

| Card | Purpose |
|---|---|
| `hearth-calendar-card` | Month / week / day grid with per-person colour coding and tap-to-create |
| `hearth-agenda-card` | Today and tomorrow as a large-touch-target list |
| `hearth-people-card` | Avatar row: presence, open tasks, points |
| `hearth-lists-card` | Shopping lists and checklists as tiles, tap to tick off |
| `hearth-header-card` | Clock, date, weather, holiday / school day |

Chores and reward points are deliberately **not** re-implemented — if you use
[Chores4Kids](https://github.com/qlerup/chores4kids), embed its card alongside Hearth's.

## Requirements

- Home Assistant 2025.1 or newer
- At least one `calendar.*` entity (`local_calendar`, CalDAV, Google, Microsoft 365 — anything)
- Optionally `todo.*` entities and `person.*` entities

## Installation

### HACS (custom repository)

1. HACS → three-dot menu → **Custom repositories**
2. Repository: this repository's URL — Type: **Integration** → **Add**
3. Search for **Hearth** in HACS, download it, and restart Home Assistant
4. **Settings → Devices & Services → Add integration → Hearth**

The cards register themselves; there is nothing to add under Lovelace resources.

### Manual

Copy `custom_components/hearth/` into your Home Assistant `config/` directory, restart, then add the
integration under **Settings → Devices & Services**.

## Development

```bash
npm install
npm run build      # writes custom_components/hearth/frontend/hearth-panel.js
npm run watch      # rebuild on change
npm run typecheck
npm test           # renders the built cards in headless Chromium
```

`npm test` boots the built bundle in a real browser against a stubbed `hass` and checks the things
that actually break: events landing on the right day, all-day events honouring their exclusive end,
dashboard churn not triggering refetches, a broken calendar warning instead of blanking the board,
and touch targets being big enough. It needs a browser once: `npx playwright install chromium`.
Set `HEARTH_CHROMIUM` to use one you already have.

The built bundle is **committed on purpose**: HACS installs `custom_components/hearth/` verbatim and
never runs a build step, so the artifact has to be in the tree. CI fails if the committed bundle does
not match the sources.

### Time zones

Cards render dates and times in the **browser's** time zone, matching how Home Assistant's own
calendar views behave. On the wall tablet this is the household's zone. A phone in another country
will show events shifted to local time.

## Licence

MIT — see [LICENSE](LICENSE).
