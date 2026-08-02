---
title: Routines
layout: default
nav_order: 4
---

# Routines

A routine is the set of things that simply have to happen — brush teeth, pack the PE
kit. Each child has a **morning** and an **evening** list, and a separate list per
weekday, because Monday morning is not Friday morning.

Deliberately **not a reward system**. Routines are the things that have to happen
whether or not anybody notices, and Schoolday does not score them.

## Days that are not school days

A holiday morning is not a school morning with items crossed out — it is its own short
list. So the two kinds of day off get their own fields rather than a rule about which
steps to skip:

- **Day off** — the list for a holiday
- **Holiday care** — the list for a holiday spent in care, which needs the lunchbox but
  not the school bag

Leave **Holiday care** empty and care days fall back to the **Day off** list. Leave both
empty and holidays have no routine at all.

A child [at home ill](exceptions.md#off-ill) has no list, and deliberately no fallback
either: a holiday list offers swimming things to a child in bed.

## What each subject needs

This is the one place the timetable and the routines know about each other.

"Pack the PE kit" typed into Monday evening states the same fact as Tuesday's timetable —
that there is PE on Tuesday. The copy is the one nobody updates when the timetable
changes, and a forgotten kit is not a subtle failure. So it is stated **once, per
subject**:

```
Sport      →  Sportbeutel, Turnschuhe
Schwimmen  →  Badesachen, Handtuch
```

Those appear in the **evening** routine on the day before that subject, for whoever has
it, and tick off exactly like any other step. A tomorrow that is a holiday, a care day or
a sick day asks for nothing — which is why Friday evening is quiet and Sunday evening is
not, with no rule about weekends anywhere.

A step somebody typed by hand **wins**: if you already have "Sportbeutel" in the routine,
the generated one is left out rather than shown twice. Delete the typed one to let the
timetable take over.

## Ticks reset overnight

Nothing has to run at midnight for that to be correct — a stored day that is not today
reads as "nothing done yet". The scheduled reset exists only so a wall panel visibly
clears itself.

## Services

| Service | Purpose |
|---|---|
| `schoolday.set_routine_step` | Tick a step off, or put it back. Takes a member name or id. |
| `schoolday.reset_routine` | Clear today's ticks, for one member or everyone. |
| `schoolday.set_materials` | Say what a subject needs brought along. |
