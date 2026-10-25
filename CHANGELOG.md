# Changelog

What changed for a household, one section per release. HACS shows the section of the
version you are updating to; the [manual](https://domcim.github.io/HA-Schoolday/) has the
details. Releases before 0.14.0 are listed on
[GitHub](https://github.com/DomCim/HA-Schoolday/releases).

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
