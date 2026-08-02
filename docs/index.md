---
title: Home
layout: default
nav_order: 1
---

# Schoolday

The school week and the daily routines, on the wall.

Schoolday is a Home Assistant integration that **owns** the school timetable rather than
reading it from a calendar, hands it to its own Lovelace cards, and exposes it to your
automations. A timetable is fixed for a school year — forty recurring events a week is
not a calendar anybody wants to maintain — so it is typed in once and everything reads
it from there.

It is built for one thing: a tablet on the kitchen wall that a family walks past.

<img src="https://raw.githubusercontent.com/DomCim/HA-Schoolday/main/assets/logo.png" alt="Schoolday" width="320">

## What it does

| | |
|---|---|
| **[Timetable](timetable.md)** | The week per child, colour-coded by subject, with the running lesson marked. Two-week A/B schools included. |
| **[Routines](routines.md)** | The things that simply have to happen, ticked off by the kids. Plus the packing list the timetable generates for tomorrow. |
| **[Homework](homework.md)** | A Home Assistant todo list per child, grouped by when it is due. |
| **[Days that differ](exceptions.md)** | Holidays, holiday care, school trips, cancelled lessons, and a child at home ill. |
| **[Automations](automations.md)** | A sensor per child whose state is the subject they are in right now, events at every lesson boundary, and services for everything the options dialog can change. |

## Where to start

1. **[Install it](installation.md)** — through HACS, as a custom repository.
2. **[Set it up](installation.md#setting-it-up)** — family members, lesson times, one week per child.
3. **[Put the cards on a dashboard](cards.md)** — a card with no options at all is the normal case.

## Something not working, or missing

Something broken goes in an [issue](https://github.com/DomCim/HA-Schoolday/issues/new/choose) — the
form asks for the version and the log, which is what makes it answerable. Questions and ideas go in
[Discussions](https://github.com/DomCim/HA-Schoolday/discussions), and an idea becomes an issue once
there is a plan.

## What it is not

Not a school-management system, not a homework nag, and not a reward chart. Routines are
the things that have to happen whether or not anybody notices, and Schoolday does not
score them.

It also does not talk to your school's portal. If yours has one, the data may be
reachable — but Schoolday holds what you type in, and that is what makes it work the
same in every country.
