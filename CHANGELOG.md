# Changelog

What changed for a household, one section per release. HACS shows the section of the
version you are updating to; the [manual](https://domcim.github.io/HA-Schoolday/) has the
details. Releases before 0.14.0 are listed on
[GitHub](https://github.com/DomCim/HA-Schoolday/releases).

## 0.15.0

### A message when the school changes the plan

With a lessons calendar from a school system on a child, Schoolday now notices when the
school cancels a lesson, puts a substitute in or moves a room, and says so in one
sentence in your language:

> Ben morgen: Musik (1. Std.) fällt aus. Beginn 08:45 statt 08:00.

The new **"The school changed the plan"** blueprint sends that to your phones. Pick the
phones, the children and how far ahead you want to hear, which is today and tomorrow
unless you choose otherwise. Changes made while Home Assistant was off are not sent, and
neither are your own edits.

Schoolday now also reads the school system's calendar every ten minutes. Before, a change
to a later lesson could go unnoticed until the next lesson began, so the evening packing
list was sometimes still packing for a cancelled lesson.

### Time to leave

Each child can now have a **way to school** in minutes, under **Edit a family member** or
in the admin card's Family section. Schoolday then works out when they have to set off:
their first lesson that is actually on, minus the way. If the first lesson is cancelled,
the time moves later by itself.

- **The header card** shows it on a school morning. It gives the time, then a countdown
  for the last hour, and "time to go" in red until the first lesson begins. Switch it off
  with `show_leave: false`.
- **A new sensor per child**, "Ben: time to leave", which a time trigger can follow
  directly.
- **"Time-to-leave light" blueprint:** a lamp in the hall turns amber a few minutes before
  leaving, then red, then goes off.
- **"Before leaving for school" blueprint:** anything you like a set time before, such as
  a wake-up light an hour before. On a morning the first lesson is cancelled, it happens
  later too.

A child without a way to school gets no leaving time and no new sensor. Nothing changes
until you set one.

### Blueprints install themselves

Schoolday copies its three blueprints into Home Assistant every time it starts. They show
up under **Settings → Automations & scenes → Blueprints** without importing anything, and
they are updated along with Schoolday. A copy you edited is left alone, and one you
deleted stays deleted.

### For automations

New attributes on each child's sensor:

- `school_start`, `school_end`, `tomorrow_start` and `tomorrow_end`: when the day begins
  and ends, after cancellations.
- `leave_at`: the next leaving time.

The new event `schoolday_plan_changed` carries the cancelled and changed lessons, the
times before and after, and the ready-made `message`. See
[Automations](https://domcim.github.io/HA-Schoolday/automations.html) in the manual.

## 0.14.0

### Cancellations, substitutions and exams from the school's own system

Each child can now have a **lessons calendar** and an **exams calendar** from a school
system, for example the ones the
[WebUntis integration](https://github.com/JonasJoKuJonas/homeassistant-WebUntis) creates.
Schoolday reads only what changed from them. The timetable stays the one you typed in.

- **A cancelled lesson** disappears from the timetable card, from today's and tomorrow's
  subjects and from the packing list.
- **A substitution** shows the subject that is actually taught, in its room, marked as a
  change. If Deutsch replaces Musik tomorrow, the reading book goes on the packing list
  instead of the recorder.
- **An exam** is labelled on its lesson and mentioned in the evening routine the day
  before. Two new sensor attributes, `exams` and `tomorrow_exams`, carry it into
  automations.

Set them under **Edit a family member**, or in the admin card's Family section, behind
**School system (WebUntis or similar)**. Nothing changes for a household that does not set
them, and the new fields stay folded away.

**Using WebUntis?**

- Switch on **Calendar - cancelled lessons** in its options. It is off by default, and
  without it no cancellation ever reaches the calendar.
- Under **Replace Lesson name**, map its subject names to yours, for example
  `Mathematik: Mathe` and `M: Mathe`. Otherwise a substitution shows up as `Mathematik`
  rather than in your subject's name and colour.

All of it is in the manual under
[From the school's own system](https://domcim.github.io/HA-Schoolday/exceptions.html#from-the-schools-own-system).
