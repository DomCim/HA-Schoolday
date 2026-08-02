---
title: Days that differ
layout: default
nav_order: 6
---

# Days that differ

Four different things can stop a day being an ordinary school day, and Schoolday keeps
them apart because they mean different things and are drawn differently.

| | Whose day | Where it comes from |
|---|---|---|
| **Holiday** | Everyone's | A calendar you name |
| **Holiday care** | One child's | A keyword on that child's own calendar |
| **A day the school took over** | One child's | Typed in, per date |
| **Off ill** | One child's | A switch |

## Holidays

Name one or more calendars that hold **nothing but days off** — school holidays, teacher
training days. The contract is deliberately blunt: **any** event running on those
calendars closes the school. That is why the option asks for calendars with nothing else
in them.

A German household can create one with the `remote_calendar` integration and a Schulferien
ICS feed for their state.

## Holiday care

A holiday spent in care is not a holiday at home: the child is out of the house and needs
a lunchbox. Schoolday spots it by looking at **that child's own calendar** for a keyword
you choose — `Ferienbetreuung`, `Hort`, whatever your household calls it, matched
case-insensitively anywhere in the title.

Their own calendar also holds the dentist and football, which is why only your keywords
count.

## A day the school took over

A timetable repeats forever, which is what makes it worth typing in once and also what
makes it lie the moment the third period is cancelled. The **Exceptions** section is the
thin layer that says otherwise — per child, per date:

- **a name for the day** takes the whole day over: "Wandertag", "Sportfest". The column
  says so in its own colour and shows no lessons. There is no separate "closed" switch,
  because a name and *"the timetable still applies"* is not a combination anybody means.
- **something about one period** — it is cancelled, or somebody is covering it with
  another subject. A covered lesson is drawn but **marked**: a substitution the reader
  cannot see is worse than no substitution layer at all.

A period nobody mentions runs exactly as the timetable says. Everything before today is
dropped on every write, so this can never quietly become a second timetable nobody
maintains.

```yaml
action: schoolday.set_exception
data:
  member: Jan
  date: "2026-09-18"
  period: 3
  cancelled: true
```

## Off ill

Each child has a switch:

```
switch.schoolday_ben_ist_krank
```

Switching it on closes the day for **that child and nobody else**. Their timetable column
says so, their routine falls silent, and `sensor.schoolday_ben` goes to `free` — so a
morning announcement skips them without a single extra condition anywhere.

It is stored as a **last day, not a flag**, and defaults to today. A flag has to be
switched off by somebody remembering to, and the one thing worse than a board that does
not know a child is ill is a board that still thinks so on Thursday. Two days of flu is
one more tap, or one call with a date:

```yaml
action: schoolday.set_absent
data:
  member: Ben
  until: "2026-09-18"
```
