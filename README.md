<img src="assets/logo.png" alt="Hearth" width="300">

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
| `hearth-timetable-card` | The school timetable per child, colour-coded by subject |
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

Routines are deliberately independent of the timetable below: "pack the PE kit" belongs to the
evening before, not to the lesson. Put it on the days that have PE and be done with it.

Ticks reset overnight on their own. Nothing has to run at midnight for that to be correct — a
stored day that is not today reads as "nothing done yet" — the scheduled reset exists only so a
wall panel visibly clears itself.

Two services drive it, for automations and for the card:

| Service | Purpose |
|---|---|
| `hearth.set_routine_step` | Tick a step off, or put it back. Takes a member name or id. |
| `hearth.reset_routine` | Clear today's ticks, for one member or everyone. |

## Timetable

The school timetable is part of Hearth, under **Configure → School timetable**. Like the routines
it is typed in rather than read from a calendar: it is fixed for a school year, and forty recurring
events a week is not a calendar anybody wants to maintain.

It is deliberately three short steps, not a page of YAML:

**Lesson times** — one period per line, for the whole household:

```
08:00-08:45
08:45-09:30
09:50-10:35
10:35-11:20
```

Breaks are never entered. Every gap of five minutes or more between two periods *is* a break, and
the card draws it as one — the twenty minutes above appear by themselves.

**Someone's timetable** — one lesson per line, in period order, one field per weekday:

```
Deutsch
Mathe | 1.OG 5
-
6. Sport | Turnhalle
```

The room follows a vertical bar, `-` leaves a period free, and a line may name its own period, so a
day that starts at the third lesson needs no placeholders above it. Days you leave empty simply have
no school.

**Subject colours** — every subject already has one, derived from its name, so Maths is the same
colour on every child's card and stays that colour when the week is rewritten. This step only exists
to change the ones you do not like, and it is a colour picker per subject.

The card needs no configuration at all. It finds the household's lesson grid, offers the members who
have a timetable, shows Monday to Friday unless somebody has weekend lessons, hides periods nobody
has, marks today and the lesson that is running right now, and falls back to a single day when it is
too narrow for a week:

```yaml
type: custom:hearth-timetable-card
```

| Option | Default | What it does |
|---|---|---|
| `member` | all | Show one child only, by name or id. Otherwise the card offers a switcher. |
| `layout` | `auto` | `auto` shows the week and drops to one day when narrow; `week`; `day`. |
| `week_days` | `auto` | `auto` follows the timetable; `school` is Mon–Fri; `week` is all seven. |
| `show_rooms` | `true` | The room under the subject. |
| `show_times` | `true` | The times next to the period number. |
| `show_breaks` | `true` | The break rows between the periods. |
| `hide_empty_periods` | `true` | Leave out periods that are free on every day shown. |
| `highlight` | `true` | Today, the running lesson and the "now / next" line. |

Coming from
[student-schedule-card](https://github.com/DomCim/student-schedule-card)? `times:` becomes the
lesson-times field one line each, and each day of `subjects:` becomes that weekday's field —
`{subject: Kunst, room: 1.OG 5}` is `Kunst | 1.OG 5`, and `{free: true}` is `-`. `days:`, `breaks:`
and `colors:` have no counterpart on purpose: the weekday names come from Home Assistant's language,
the breaks from the gaps in the times, and the colours from the subject names.

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
the timetable marking the lesson that is running at a frozen point in time, and touch targets being
big enough. It needs a browser once: `npx playwright install chromium`.
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

## Logo

`assets/hearth-icon.svg` is the source; `npm run assets` re-renders the PNGs so the README never
depends on the viewer's fonts.

The icon does **not** appear next to the integration in Home Assistant or HACS, and nothing in this
repository can change that. Both ask the same CDN:

```
https://brands.home-assistant.io/hearth/icon.png    → 404
https://brands.home-assistant.io/_/hearth/icon.png  → 200, the generic placeholder
```

That CDN is fed by [home-assistant/brands](https://github.com/home-assistant/brands), which needs a
pull request adding `custom_integrations/hearth/` with `icon.png` (256×256) and `icon@2x.png`
(512×512). `npm run assets` produces both at exactly those sizes.
