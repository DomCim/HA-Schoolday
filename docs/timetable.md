---
title: Timetable
layout: default
nav_order: 3
---

# Timetable

A timetable is fixed for a school year, which is why Schoolday stores it rather than
reading it from a calendar. Everything is typed in once and every card and every
automation reads it from there.

## Lesson times

One `HH:MM-HH:MM` per line, in order:

```
08:00-08:45
08:45-09:30
09:50-10:35
10:35-11:20
```

**Breaks come from the gaps.** Anything from five minutes upwards between two periods is
a break and is drawn as one — which is exactly the five-, ten- and sixty-minute gaps a
school day already has. There is nothing to configure.

The times are shared by the whole household. A child whose day starts later simply has
no lesson in the first period.

## One week per child

Tap a cell and type the subject. A room can go with it.

In the options dialog the same week is a text field, one line per period:

```
Deutsch
Mathe
Kunst | 1.OG 5
-
Deutsch
```

- `-` leaves a period free
- `Fach | Raum` or `Fach @ Raum` puts the room next to the subject
- `5. Sport` names its period outright, so a day that starts at the third period does
  not need two placeholder lines first

**Subject names are free text**, and they are exact strings everywhere downstream: the
sensor state, the colour, and whatever an automation compares against. Typing `Sport` on
Monday and `sport` on Wednesday would therefore be two subjects with two colours — so
when a week is saved, the first spelling in it wins for the whole week.

## Colours

Every subject already has a colour, derived from its name by a stable hash. Maths is the
same colour on every child's card and stays that colour when the week is rewritten. The
colour editor is only ever a **correction**, which is why it offers the current colour
rather than an empty field.

## Two-week timetables

Some schools alternate an **A week** and a **B week**. Switch the cycle to two weeks and
say which **calendar week** week A starts in — the way a school says it. The editor then
has an A/B switch above the grid, and the display card marks every column with the week
it belongs to.

What gets **stored** is the Monday that week begins on, not the week number. An ISO year
has 52 or 53 weeks — 2026 has 53 — so "A is the odd weeks" would swap itself over some
new years and not others, and you would find out in February. A Monday keeps meaning the
same thing.

Turning the cycle back off does not throw week B away. It stops showing it.

```yaml
action: schoolday.set_cycle
data:
  weeks: 2
  iso_week: 37
```

## Which day a column means

A timetable repeats forever, so on its own a column can only say what a Tuesday is
usually like. Schoolday's columns point at **dates**: each one carries the date it
stands for, and by default a weekday that has already been rolls on to next week's — so
on Wednesday, the Monday column is next Monday.

Turn that off with `roll_days: false` on the card to see the week as it stands, past days
included.

Because a column is a date, everything dated follows from it without any extra option:
holidays, holiday care, a child at home ill, a cancelled period, and which week of an A/B
cycle you are looking at.
