<img src="assets/logo.png" alt="Schoolday" width="320">

The school week and the daily routines, on the wall — a Home Assistant integration that owns the
timetable, hands it to its own Lovelace cards, and exposes it to your automations.

A timetable is fixed for a school year, which is why Schoolday stores it rather than reading it from
a calendar: forty recurring events a week is not a calendar anybody wants to maintain. Everything is
typed in once, in a handful of short steps, and every card and every automation reads it from there.

**📖 [Documentation](https://domcim.github.io/HA-Schoolday/)** — setting up the timetable, routines,
homework, days off, the cards and the automations.

> **Status: early development.** Installable through HACS as a custom repository, but not submitted to
> the HACS default store — it is not listed or advertised anywhere.

## What it does

| | |
|---|---|
| **Timetable** | The week per child, colour-coded by subject, with the running lesson marked. Two-week A/B schools included. |
| **Routines** | The things that simply have to happen, ticked off by the kids — plus the packing list tomorrow's lessons generate. |
| **Homework** | A Home Assistant todo list per child, grouped by when it is due. |
| **Days that differ** | Holidays, holiday care, school trips, cancelled lessons, and a child at home ill. |
| **Automations** | A sensor per child whose state is the subject they are in right now, events at every lesson boundary, and a service for everything the options dialog can change. |

Five Lovelace cards come with it — timetable, routines, homework, header and an admin card that
replaces the options dialog. They read the board sensor, so **a card with no options at all is the
normal case**.

## Install

1. **HACS → three dots → Custom repositories** → `https://github.com/DomCim/HA-Schoolday`, category
   **Integration**
2. Install **Schoolday**, then restart Home Assistant
3. **Settings → Devices & Services → Add integration → Schoolday**

Then [set it up](https://domcim.github.io/HA-Schoolday/installation.html#setting-it-up): family
members, lesson times, one week per child. Everything after that is optional.

Requires Home Assistant **2025.1** or newer.

## Contributing

Issues and ideas are welcome — there are
[templates](https://github.com/DomCim/HA-Schoolday/issues/new/choose) for both. For working on the
code, see [Development](https://domcim.github.io/HA-Schoolday/development.html).

## Licence

MIT. See [LICENSE](LICENSE).

The Schoolday mark in `assets/` is part of this project and covered by the same licence. The images
under `brands/` are shaped for
[home-assistant/brands](https://github.com/home-assistant/brands) and are not Home Assistant
branding.
