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
| `custom_components/hearth` | Family member profiles (colour, avatar, which calendars and lists belong to whom), routine definitions, aggregated per-member sensors, and the two services the routine card calls |
| Lovelace cards | The entire look and the touch interaction |
| Your existing integrations | The actual data — Hearth never re-implements calendars, to-do lists or chores |

### Cards

| Card | Purpose |
|---|---|
| `hearth-calendar-card` | Month / week / day grid with per-person colour coding and tap-to-create |
| `hearth-agenda-card` | Today and tomorrow as a large-touch-target list |
| `hearth-people-card` | Avatar row: presence, open tasks, points |
| `hearth-routines-card` | Daily routines per child and weekday, ticked off by the kids |
| `hearth-lists-card` | Shopping lists and checklists as tiles, tap to tick off |
| `hearth-header-card` | Clock, date, weather, holiday / school day |

Chores and reward points are deliberately **not** re-implemented — if you use
[Chores4Kids](https://github.com/qlerup/chores4kids), embed its card alongside Hearth's.

## Routines

A routine is the set of things that simply have to happen — brush teeth, pack the PE kit — as
opposed to chores you earn points for. Each family member gets a **morning** and an **evening**
block, and each block holds a different list per weekday.

Set them under **Configure → Edit routines**: pick the member and the block, then fill in seven
fields, one step per line.

The school timetable is **not** read from anywhere, and does not need to be. It is fixed for a
school year, so "Tuesday is PE" is encoded once as Tuesday's steps.

Ticks reset overnight on their own. Nothing has to run at midnight for that to be correct — a
stored day that is not today reads as "nothing done yet" — the scheduled reset exists only so a
wall panel visibly clears itself.

Two services drive it, for automations and for the card:

| Service | Purpose |
|---|---|
| `hearth.set_routine_step` | Tick a step off, or put it back. Takes a member name or id. |
| `hearth.reset_routine` | Clear today's ticks, for one member or everyone. |

## Requirements

- Home Assistant 2025.1 or newer
- At least one `calendar.*` entity (`local_calendar`, CalDAV, Google, Microsoft 365 — anything)
- Optionally `todo.*` entities and `person.*` entities

## Installation

### HACS (custom repository)

1. HACS → three-dot menu → **Custom repositories**
2. Repository: `https://github.com/DomCim/Homeassistant-hearth` — Type: **Integration** → **Add**
3. Search for **Hearth** in HACS, download it, and restart Home Assistant
4. **Settings → Devices & Services → Add integration → Hearth**

The cards register themselves; there is nothing to add under Lovelace resources.

### Manual

Copy `custom_components/hearth/` into your Home Assistant `config/` directory, restart, then add the
integration under **Settings → Devices & Services**.

## Setting it up

1. **Settings → Devices & Services → Hearth → Configure** — add each family member with a colour and
   the calendars and lists that belong to them.
2. Under **Shared calendars and lists**, pick the calendars the whole family shares, and list any
   calendar that cannot take new events (holidays, workday, school terms) as **read-only**. Those stay
   visible on the board but are kept out of the create sheet.
3. Add the cards to a dashboard. Every card has a visual editor, and they read the setup from
   `sensor.hearth_board`, so no card needs to be told who your family is.

The options dialog stays open: each change is saved the moment you make it and you land back on the
menu, so adding five family members and their routines is one visit rather than sixteen.

`examples/goldammerweg/` contains a complete three-view dashboard and the options it assumes.

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

### CI

`hassfest` validates the integration the way Home Assistant does, and the frontend job
typechecks, builds, verifies the committed bundle matches the sources, and runs the smoke suite.

The HACS job only runs on the default branch. `hacs/action` reads the repository through the GitHub
API against the default branch, so on a feature branch it sees none of the files and fails on every
push regardless of what changed.

### Publishing later

Installing as a HACS custom repository needs the repository to be **public** — HACS cannot read
private repositories. Beyond that, for a custom repository nothing else is required.

Submitting to the HACS default store additionally needs a repository description, GitHub topics, and
a licence detectable on the default branch. Those two checks are in `ignore` in the workflow; drop
them from the list if you ever go that route.

### Language

The cards follow Home Assistant's own language — currently German and English, with English as the
fallback for anything else. There is no language option to set; a German frontend gets a German wall
panel. Strings live in `src/lib/i18n.ts`, and the smoke suite fails if a card renders raw keys.

### Time zones

Cards render dates and times in the **browser's** time zone, matching how Home Assistant's own
calendar views behave. On the wall tablet this is the household's zone. A phone in another country
will show events shifted to local time.

## Licence

MIT — see [LICENSE](LICENSE).
