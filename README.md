<!-- Markdown rather than an <img>, and absolute rather than relative, and both for the
     same reader: HACS renders this file inside Home Assistant, which resolves a relative
     path against the house instead of against the repository, and which drops raw HTML
     on the way through its own renderer. Either mistake leaves a broken image at the top
     of the page somebody reads immediately before deciding whether to install. The cost
     is the width attribute -- markdown has no way to set one -- so the mark now renders
     at its own 888px rather than the 320 it used to be held to. -->
![Schoolday](https://raw.githubusercontent.com/DomCim/HA-Schoolday/main/assets/logo.png)

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
| **The record** | How reliably each child gets through their routines over the last month, and which steps keep being skipped. |
| **Automations** | A sensor per child whose state is the subject they are in right now, events at every lesson boundary, and a service for everything the options dialog can change. |

Six Lovelace cards come with it — timetable, routines, the routine record, homework, header and
an admin card that replaces the options dialog. They read the board sensor, so **a card with no options at all is the
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

Something broken goes in an [issue](https://github.com/DomCim/HA-Schoolday/issues/new/choose);
questions and ideas go in [Discussions](https://github.com/DomCim/HA-Schoolday/discussions), and an
idea becomes an issue once there is a plan. [CONTRIBUTING.md](CONTRIBUTING.md) has the whole of it,
including how to build and test.

## Licence

MIT. See [LICENSE](LICENSE).

The Schoolday mark in `assets/` is part of this project and covered by the same licence. The same
four images appear twice, built from it by `node assets/brands.mjs`: in
`custom_components/schoolday/brand/`, which ships with the integration and is where HACS and Home
Assistant look for an icon, and under `brands/`, shaped for
[home-assistant/brands](https://github.com/home-assistant/brands) should they ever go there. Neither
is Home Assistant branding.
