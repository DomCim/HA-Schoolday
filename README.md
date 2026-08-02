<img src="assets/logo.png" alt="Schoolday" width="320">

The school week and the daily routines, on the wall — a Home Assistant integration that owns the
timetable, hands it to its own Lovelace cards, and exposes it to your automations.

A timetable is fixed for a school year, which is why Schoolday stores it rather than reading it from
a calendar: forty recurring events a week is not a calendar anybody wants to maintain. Everything is
typed in once, in a handful of short steps, and every card and every automation reads it from there.

> **Status: early development.** Installable through HACS as a custom repository, but not submitted to
> the HACS default store — it is not listed or advertised anywhere.

## What it is

Schoolday ships as a **single custom integration** that also serves its own Lovelace cards. One
install, no separate resource registration, and the integration and cards can never drift apart in
version.

| Card | Purpose |
|---|---|
| `schoolday-timetable-card` | The week per child, colour-coded by subject, with the running lesson marked |
| `schoolday-routines-card` | Daily routines per child and weekday, ticked off by the kids |
| `schoolday-header-card` | Clock, date and weather — the strip along the top of a wall panel |
| `schoolday-homework-card` | What each child still has to do, grouped by when it is due |
| `schoolday-admin-card` | Everything the options dialog can change, on the dashboard |

The cards read `sensor.schoolday_board` and the per-member sensors, so no card has to be told who
your family is. **Adding a card with no options at all is the normal case.**

## Timetable

**Configure → School timetable**, in four steps — the last one is what a stored timetable cannot
work out for itself.

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

**Days off and holiday care** — a timetable repeats forever, holidays do not. Point this at the
calendars that close the school: a subscribed school-holiday calendar, plus a local one for teacher
training days if you keep one.

Any event running on those calendars means today has no school. The week stays on the card as the
plan it is, marked **Schulfrei / No school** with the event's name, but today's lessons go quiet:
`today` empties, the sensor reads `free`, and no lesson events fire. Nothing else has to know about
it — the morning announcement below falls silent by itself, with no second condition to maintain.

Use calendars that hold nothing but days off. The rule is deliberately blunt — *any* event closes
the school — so a "Schulfest, 15:00" sitting on the same calendar would take the afternoon off with
it.

**Holiday care** is a day off with somewhere to be: no school bag, but still a lunchbox and an alarm
clock. It gets its own routine, and it is found by keyword on each child's **own calendar** — the
one you set under *Edit a family member*. One keyword per line, matched anywhere in an event's
title, upper or lower case:

```
Ferienbetreuung
Hort
```

The keywords are yours to write, in your language; the field only suggests something when Home
Assistant is set to German or English. Leave it empty and there are no care days at all.

Schoolday reads that calendar for nothing else. It shows no events anywhere — this is not a calendar
integration, and the child's calendar is only ever searched for these words.

### A calendar per child

You need one only for holiday care. Three ways there, all fine:

- **A calendar per child already exists** — a `local_calendar`, a shared Google or CalDAV calendar.
  Pick it under *Edit a family member* and you are done.
- **You keep one family calendar** and write whose event it is into the title — "Ben
  Ferienbetreuung", "Nik Zahnarzt". The HACS integration
  [Family Calendar Sync](https://github.com/McCroden/family_calendar_sync) copies each event into
  that child's own calendar when their name is in the title. Set your family calendar as the source
  and a `local_calendar` per child as the target, then point Schoolday at the child's calendar. One
  caveat from its author: iCloud calendars cannot be targets, because CalDAV there does not accept
  events created by Home Assistant — use `local_calendar` for the children.
- **Neither, and you would rather not** — leave the field empty. There are then no care days, and
  the day-off routine covers the holidays.

### The card

```yaml
type: custom:schoolday-timetable-card
```

That is the whole configuration. The card finds the household's lesson grid, offers the members who
have a timetable, shows Monday to Friday unless somebody has weekend lessons, hides periods nobody
has, marks today and the lesson that is running right now, and falls back to a single day when it is
too narrow for a week.

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

## Routines

A routine is the set of things that simply have to happen — brush teeth, pack the PE kit. Each
family member gets a **morning** and an **evening** block, and each block holds a list per weekday
plus two more, under **Configure → Edit routines**:

| Field | When it applies |
|---|---|
| Monday … Sunday | A normal school day |
| Day off | A day one of the holiday calendars covers |
| Holiday care | A day off this child spends in holiday care |

A holiday morning is not a school morning with items crossed out — it is its own short list — which
is why the days off get their own fields rather than a rule about which steps to skip. Leave
**Holiday care** empty and care days use the **Day off** list; leave both empty and holidays have no
routine at all.

Routines are deliberately independent of the timetable: "pack the PE kit" belongs to the evening
before, not to the lesson.

With one exception, and it is the exception that stops the two drifting apart. Under **What each
subject needs** you say once what a subject needs brought along:

```
Sport      →  Sportbeutel, Turnschuhe
Schwimmen  →  Badesachen, Handtuch
```

Those appear in the **evening** routine on the day before that subject, for whoever has it, and tick
off exactly like any other step. Typed into Monday evening by hand, "pack the PE kit" states the
same fact as Tuesday's timetable — and the copy is the one nobody updates when the timetable
changes. A tomorrow that is a holiday, a care day or a sick day asks for nothing, which is also why
Friday evening is quiet and Sunday evening is not.

Ticks reset overnight on their own. Nothing has to run at midnight for that to be correct — a stored
day that is not today reads as "nothing done yet" — the scheduled reset exists only so a wall panel
visibly clears itself.

Two services drive it, for automations and for the card:

| Service | Purpose |
|---|---|
| `schoolday.set_routine_step` | Tick a step off, or put it back. Takes a member name or id. |
| `schoolday.reset_routine` | Clear today's ticks, for one member or everyone. |

## Homework

Each child gets a Home Assistant **todo list**:

```
todo.hausaufgaben_ben
```

A `todo` list rather than something of Schoolday's own, because Home Assistant already
has a shape for "things still to do" — and it arrives with a voice interface, a card, a
calendar view and an API that Schoolday would only have reinvented worse. Anything that
can talk to a todo list can put homework on it: Assist, the built-in todo card, a phone.

`schoolday-homework-card` is the reading end. It groups by **when it is due** — overdue,
today, tomorrow, later, no date — because that is the only question anybody asks a
homework list, and reading dates at seven in the morning is work while "today" is not.
Finished work stays for a fortnight and is then swept: not for the child's benefit, but
so that *"did you do the maths?"* on Thursday still has an answer on Friday.

## When one date is not like its weekday

A timetable is worth typing in once because it repeats. That is also what makes it lie
the moment a lesson is cancelled — so there is a thin layer that says otherwise, under
**Exceptions** on the admin card.

Two things it can say, per child and per date:

- **a name for the day** — "Wandertag", "Sportfest". That takes the whole day over: the
  column says so in its own colour and shows no lessons. There is no separate "closed"
  switch, because a name and *"the timetable still applies"* is not a combination
  anybody means.
- **something about one period** — it is cancelled, or somebody else is covering it with
  another subject. A covered lesson is drawn but **marked**: a substitution the reader
  cannot see is worse than no substitution layer at all.

Dates, not rules — and everything before today is dropped on every write, so this can
never quietly become a second timetable nobody maintains.

```yaml
action: schoolday.set_exception
data:
  member: Jan
  date: "2026-09-18"
  period: 3
  cancelled: true
```

## Off ill

Each child gets a switch:

```
switch.schoolday_ben_ist_krank
```

Switching it on closes the day for that child and nobody else. Their timetable column says so, their
routine falls silent, and `sensor.schoolday_ben` goes to `free` — so a morning announcement skips
them without a single extra condition anywhere.

It is stored as a **last day, not a flag**, and defaults to today. That is deliberate: a flag has to
be switched off by somebody remembering to, and the one thing worse than a board that does not know
a child is ill is a board that still thinks so on Thursday. Two days of flu is one more tap, or one
call with a date:

```yaml
action: schoolday.set_absent
data:
  member: Ben
  until: "2026-09-18"
```

## Automations

Each member has a sensor whose **state is the subject they are in right now**, or `free` between and
after lessons. It changes at the lesson boundaries and nowhere else, because that is when the
timetable says it changes — there is no polling.

```
sensor.schoolday_ben        →  Sport
```

| Attribute | Contents |
|---|---|
| `today` | Today's lessons: `subject`, `room`, `period`, `start`, `end` |
| `today_subjects` | Today's subjects, de-duplicated: `["Deutsch", "Mathe", "Sport"]` |
| `today_summary` | The same, ready to speak: `"Deutsch, Mathe, Sport"` |
| `lesson_now` / `lesson_next` | The running and the next lesson, or `null` |
| `day_mode` | `school`, `care` or `free` — which routine is showing, and why |
| `timetable` | The whole week, for the card |
| `routine_morning` / `routine_evening` | Today's steps, each with `done` |

The morning announcement — "today Ben has PE" — is a time trigger and a template:

```yaml
alias: Schultag-Durchsage
triggers:
  - trigger: time
    at: "07:00:00"
conditions:
  # Nothing to announce at the weekend, or on a day with no school.
  - condition: template
    value_template: "{{ state_attr('sensor.schoolday_ben', 'today_subjects') | count > 0 }}"
actions:
  - action: tts.speak
    target:
      entity_id: tts.home_assistant_cloud
    data:
      media_player_entity_id: media_player.homepod_kuche
      message: >-
        Guten Morgen! Ben hat heute {{ state_attr('sensor.schoolday_ben', 'today_summary') }}.
        {% if 'Sport' in state_attr('sensor.schoolday_ben', 'today_subjects') %}
          Sportsachen nicht vergessen.
        {% endif %}
```

### Subject names

Subject names are free text. `Werken`, `AG Robotik`, `Bläserklasse` — nothing here knows what a
school teaches, and no list of subjects is kept anywhere, so the automation above works whatever the
subject is called.

The flip side is that comparisons are exact: `'Sport' in today_subjects` matches neither `sport` nor
`Sportunterricht`. Within one child's week Schoolday settles that for you — save a week with `Sport`
on Monday and `sport` on Wednesday and both become the first spelling. Across children it
deliberately does not, because that would undo a rename; two spellings then show up as two entries
in the subject-colour step, which is where you notice.

To not have to care at all, match loosely:

```jinja
{{ state_attr('sensor.schoolday_ben', 'today_subjects') | select('search', '(?i)sport') | list | count > 0 }}
```

No holiday condition is needed: on a day one of the holiday calendars covers, `today_subjects` is
empty and the automation stops at the condition. Without those calendars configured it would be
cheerfully wrong for six weeks every summer.

The board sensor says the same thing outright for the household, and each member sensor says it for
that child — including whether they are in holiday care today:

```
sensor.schoolday_board          sensor.schoolday_ben
  school_today: false             day_mode: care
  no_school_reason: "Sommerferien"
```

So a care day gets its own sentence without a second entity to check:

```jinja
{% if state_attr('sensor.schoolday_ben', 'day_mode') == 'care' %}
  Ben ist heute in der Ferienbetreuung. Badesachen einpacken.
{% endif %}
```

Two events fire at every lesson boundary, carrying `member`, `member_id`, `subject`, `room`,
`period`, `start` and `end`:

| Event | When |
|---|---|
| `schoolday_lesson_started` | A lesson begins |
| `schoolday_lesson_ended` | A lesson ends |

They exist alongside the state because the state cannot show everything: two periods of the same
subject in a row are one state but two lessons. Nothing fires on a Home Assistant restart — the
sensor adopts whatever is running without announcing it, so a restart mid-morning does not shout
"PE has started" into the kitchen.

```yaml
alias: Sport beginnt
triggers:
  - trigger: event
    event_type: schoolday_lesson_started
    event_data:
      member: Ben
      subject: Sport
actions:
  - action: notify.mobile_app_dominik
    data:
      message: "Ben ist jetzt in Sport ({{ trigger.event.data.room }})."
```

## Requirements

- Home Assistant 2025.1 or newer
- Optionally a `calendar.*` entity holding the school holidays — any source will do: a subscribed
  iCal feed, `local_calendar`, CalDAV, Google

Nothing else. Without a holiday calendar every weekday is a school day.

## Installation

### HACS (custom repository)

1. HACS → three-dot menu → **Custom repositories**
2. Repository: `https://github.com/DomCim/HA-Schoolday` — Type: **Integration** → **Add**
3. Search for **Schoolday** in HACS, download it, and restart Home Assistant
4. **Settings → Devices & Services → Add integration → Schoolday**

The cards register themselves; there is nothing to add under Lovelace resources.

### Manual

Copy `custom_components/schoolday/` into your Home Assistant `config/` directory, restart, then add
the integration under **Settings → Devices & Services**.

## Setting it up

1. **Settings → Devices & Services → Schoolday → Configure** — add each family member with a colour.
2. **School timetable** — the lesson times once, then a week per child, then the holiday calendars.
3. **Edit routines** — morning and evening per child, per weekday.
4. Add the cards to a dashboard. Every card has a visual editor, and they read the setup from
   `sensor.schoolday_board`, so no card needs to be told who your family is.

The options dialog stays open: each change is saved the moment you make it and you land back on the
menu, so five family members and their weeks are one visit rather than sixteen.

`examples/goldammerweg/` contains a complete two-view dashboard and the options it assumes.

## Development

```bash
npm install
npm run build      # writes custom_components/schoolday/frontend/schoolday-panel.js
npm run watch      # rebuild on change
npm run typecheck
npm test           # renders the built cards in headless Chromium
```

`npm test` boots the built bundle in a real browser against a stubbed `hass` and checks the things
that actually break: the running lesson being the one marked, breaks appearing from the gaps between
periods and not dangling off the end of the table, a routine tick surviving the round trip through
the sensor, the cards speaking Home Assistant's language, and touch targets being big enough. The
clock is frozen at a Wednesday morning inside the second period, so "the lesson running now" is a
fact rather than whatever the clock says when CI happens to run. It needs a browser once:
`npx playwright install chromium`. Set `SCHOOLDAY_CHROMIUM` to use one you already have.

The built bundle is **committed on purpose**: HACS installs `custom_components/schoolday/` verbatim
and never runs a build step, so the artifact has to be in the tree. CI fails if the committed bundle
does not match the sources.

### CI

`hassfest` validates the integration the way Home Assistant does, and the frontend job typechecks,
builds, verifies the committed bundle matches the sources, and runs the smoke suite.

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

Cards render times in the **browser's** time zone; the integration works in Home Assistant's. On the
wall tablet those are the same, which is the case this is built for.

## Licence

MIT — see [LICENSE](LICENSE).

## Logo

`assets/schoolday-icon.svg` is the source; `npm run assets` re-renders the PNGs so the README never
depends on the viewer's fonts.

The icon does **not** appear next to the integration in Home Assistant or HACS, and nothing in this
repository can change that. Both ask the same CDN:

```
https://brands.home-assistant.io/schoolday/icon.png    → 404
https://brands.home-assistant.io/_/schoolday/icon.png  → 200, the generic placeholder
```

That CDN is fed by [home-assistant/brands](https://github.com/home-assistant/brands), which needs a
pull request adding `custom_integrations/schoolday/` with `icon.png` (256×256) and `icon@2x.png`
(512×512). `npm run assets` produces both at exactly those sizes.
