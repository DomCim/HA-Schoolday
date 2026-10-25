<!-- Markdown rather than an <img>, and absolute rather than relative, and both for the
     same reader: HACS renders this file inside Home Assistant, which resolves a relative
     path against the house instead of against the repository, and which drops raw HTML
     on the way through its own renderer. Either mistake leaves a broken image at the top
     of the page somebody reads immediately before deciding whether to install. The cost
     is the width attribute -- markdown has no way to set one -- so the mark now renders
     at its own 888px rather than the 320 it used to be held to. -->
![Schoolday](https://raw.githubusercontent.com/DomCim/HA-Schoolday/main/assets/logo.png)

[![HACS Default](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://hacs.xyz)
[![Release](https://img.shields.io/github/v/release/DomCim/HA-Schoolday)](https://github.com/DomCim/HA-Schoolday/releases)
[![Home Assistant 2025.1+](https://img.shields.io/badge/Home%20Assistant-2025.1%2B-41BDF5.svg)](https://www.home-assistant.io)
[![Licence: MIT](https://img.shields.io/github/license/DomCim/HA-Schoolday)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/DomCim/HA-Schoolday?style=social)](https://github.com/DomCim/HA-Schoolday/stargazers)

The school week and the daily routines, on the wall — a Home Assistant integration that owns the
timetable, hands it to its own Lovelace cards, and exposes it to your automations.

A timetable is fixed for a school year, which is why Schoolday stores it rather than reading it from
a calendar: forty recurring events a week is not a calendar anybody wants to maintain. Everything is
typed in once, in a handful of short steps, and every card and every automation reads it from there.

**📖 [Documentation](https://domcim.github.io/HA-Schoolday/)** — setting up the timetable, routines,
homework, days off, the cards and the automations.

## What it does

| | |
|---|---|
| **Timetable** | The week per child, colour-coded by subject, with the running lesson marked. Two-week A/B schools included. |
| **Routines** | The things that simply have to happen, ticked off by the kids — plus the packing list tomorrow's lessons generate. |
| **Homework** | A Home Assistant todo list per child, grouped by when it is due. |
| **Days that differ** | Holidays, holiday care, school trips, cancelled lessons, substitutions, exams, and a child at home ill. Cancellations, substitutions and exams can be read from WebUntis or any school calendar. |
| **The record** | How reliably each child gets through their routines over the last month, and which steps keep being skipped. |
| **Automations** | A sensor per child whose state is the subject they are in right now, today's and tomorrow's subjects ready to speak — "Ben has PE tomorrow" — events at every lesson boundary, and a service for everything the options dialog can change. |
| **On time** | A leaving time per child that moves by itself when the first lesson is cancelled — or stays put for the bus, with its own time for holiday care — counted down on the wall, and a push notification when the school changes tomorrow's plan. Three blueprints ship with it: the notification, a hallway light that turns red when it is time to go, and anything you like an hour before — the wake-up light sleeps in when the first lesson does. |

Six Lovelace cards come with it — timetable, routines, the routine record, homework, header and
an admin card that replaces the options dialog. They read the board sensor, so **a card with no options at all is the
normal case**.

## Install

[![Open Schoolday in HACS on your Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=DomCim&repository=HA-Schoolday&category=integration)

1. **HACS** → search for **Schoolday** → download it
2. Restart Home Assistant
3. **Settings → Devices & Services → Add integration → Schoolday**

Then [set it up](https://domcim.github.io/HA-Schoolday/installation.html#setting-it-up): family
members, lesson times, one week per child. Everything after that is optional.

Requires Home Assistant **2025.1** or newer.

## If it works in your house

**Give it a ⭐ on GitHub.** It costs a click, and the star count is what the next family
looks at before deciding whether to try it. A photo of your wall panel in
[Show and tell](https://github.com/DomCim/HA-Schoolday/discussions/categories/show-and-tell) does
even more — it shows what Schoolday looks like in a real kitchen rather than in the manual.

Schoolday is free and stays free. If it saves your mornings and you want to give something
back, there is a coffee:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/did0m)

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
