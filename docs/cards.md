---
title: Cards
layout: default
nav_order: 8
---

# Cards

The cards read `sensor.schoolday_board` and the per-member sensors, so **no card has to
be told who your family is**. Adding a card with no options at all is the normal case.

Every card takes `board_entity` as an escape hatch for a renamed board sensor. It is
deliberately absent from every visual editor: only one board can exist, and an entity
picker that is meant to stay empty is a question nobody should be asked.

## Timetable card

```yaml
type: custom:schoolday-timetable-card
```

The card finds the household's lesson grid, offers the members who have a timetable,
shows Monday to Friday unless somebody has weekend lessons, hides periods nobody has,
marks today and the lesson running right now, and falls back to a single day when it is
too narrow for a week.

| Option | Default | What it does |
|---|---|---|
| `member` | all | One child only, by name or id. Otherwise the card offers a switcher. |
| `layout` | `auto` | `auto` shows the week and drops to one day when narrow; `week`; `day`. |
| `week_days` | `auto` | `auto` follows the timetable; `school` is Mon–Fri; `week` is all seven. |
| `show_rooms` | `true` | The room under the subject. |
| `show_times` | `true` | The times next to the period number. |
| `show_breaks` | `true` | The break rows between the periods. |
| `hide_empty_periods` | `true` | Leave out periods that are free on every day shown. |
| `highlight` | `true` | Today, the running lesson and the "now / next" line. |
| `roll_days` | `true` | Point a weekday that has been at next week's. Off shows the week as it stands. |


![The header card: clock, date and weather along the top of a wall panel](images/header.png)
*The header card: clock, date and weather along the top of a wall panel*

## Routines card

```yaml
type: custom:schoolday-routines-card
```

| Option | Default | What it does |
|---|---|---|
| `member` | all | One child only. Unset shows the whole family side by side. |
| `block` | `auto` | `auto` switches by time of day; `morning`; `evening`; `both`. |
| `evening_from` | `14` | The hour at which `auto` flips to the evening list. |
| `show_empty` | `false` | Keep children who have nothing on today. |

A child [at home ill](exceptions.md#off-ill) stays on the board either way, with the
reason instead of a list: dropping them would answer the wrong question.

## Homework card

```yaml
type: custom:schoolday-homework-card
```

| Option | Default | What it does |
|---|---|---|
| `member` | all | One child only. |
| `show_done` | `false` | Show what is already finished. |
| `show_empty` | `false` | Keep children with nothing to do. |

## Header card

```yaml
type: custom:schoolday-header-card
weather_entity: weather.home
```

Clock, date and weather — the strip along the top of a wall panel.

| Option | Default | What it does |
|---|---|---|
| `weather_entity` | — | Which weather to show. Omit for no weather. |
| `greeting` | — | A word after the greeting, usually the household's name. |
| `show_seconds` | `false` | Seconds on the clock. |

## Admin card

```yaml
type: custom:schoolday-admin-card
```

Everything the options dialog can change, on the dashboard: the timetable, routines, the
family, subject colours, materials, exceptions and days off. Finding the integration page
to move one lesson is more ceremony than the job deserves.

The card **never writes the configuration itself.** It calls a service, and the service
decides whether the value is allowed — so there is one set of rules and not two, and a
refused value comes back as a readable reason.

| Option | Default | What it does |
|---|---|---|
| `section` | `timetable` | Which section to open on. |

### Timetable

![Tap a cell to set a lesson. With a two-week timetable, the cycle and an A/B switch sit above the grid.](images/admin-timetable.png)
*Tap a cell to set a lesson. With a two-week timetable, the cycle and an A/B switch sit above the grid.*

### Routines

![One block, one day at a time — including the two kinds of day off](images/admin-routines.png)
*One block, one day at a time — including the two kinds of day off*

### Family

![Name, colour, the calendar searched for the holiday-care keyword, and a picture taken from a person entity](images/admin-family.png)
*Name, colour, the calendar searched for the holiday-care keyword, and a picture taken from a person entity*

### Material

![One box per subject. These become the evening packing list on the day before.](images/admin-materials.png)
*One box per subject. These become the evening packing list on the day before.*

### Exceptions

![One date at a time: a name takes the whole day, or a single period is cancelled or covered](images/admin-exceptions.png)
*One date at a time: a name takes the whole day, or a single period is cancelled or covered*

### Days off

![Holiday calendars are picked as entities; the care keywords stay the household’s own words](images/admin-holidays.png)
*Holiday calendars are picked as entities; the care keywords stay the household’s own words*


## Language

The cards follow **Home Assistant's own language** rather than a card option, so a German
household gets a German wall panel without configuring anything. English is the fallback,
key by key.

Shipped today: **German** and **English**. A third is a translation file and one block in
`src/lib/i18n.ts` — no code changes.
