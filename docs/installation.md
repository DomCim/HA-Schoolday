---
title: Installation
layout: default
nav_order: 2
---

# Installation

Schoolday ships as a **single custom integration** that also serves its own Lovelace
cards. One install, no separate resource registration, and the integration and cards can
never drift apart in version.

## Requirements

- Home Assistant **2025.1** or newer
- [HACS](https://hacs.xyz)
- One `calendar` entity holding your school holidays, if you want Schoolday to know
  about them. Optional, and it can be added later.

## Through HACS

[![Open Schoolday in HACS on your Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=DomCim&repository=HA-Schoolday&category=integration)

The button opens Schoolday's page in HACS on your own Home Assistant, which saves step 1.
By hand:

1. **HACS** → search for **Schoolday**
2. Open it and **download** it
3. **Restart Home Assistant**
4. **Settings → Devices & Services → Add integration → Schoolday**

{: .note }
> Step 3 is not optional and not a formality. The cards are registered while Home
> Assistant starts, so before a restart the integration installs but the dashboard has
> nothing to show — which reads exactly like a broken install.

Schoolday is in the HACS default store, so there is no repository to add. An install made
earlier as a **custom repository** keeps working and keeps updating; there is nothing to
move.

## Setting it up

Everything below can be done twice: once in the integration's own options dialog, and
once from the [admin card](cards.md#admin-card) on a dashboard. They write the same
configuration through the same rules — the card exists so nobody has to go and find the
integration page to move one lesson.

1. **Add each family member** with a colour. Optionally a picture — point it at a
   `person.` entity and Home Assistant's own picture is used, so it follows whatever
   they change it to.
2. **Lesson times**, one `HH:MM-HH:MM` per line. Breaks are derived from the gaps, so
   there is nothing else to configure. Children at
   [a second school that rings differently](timetable.md#two-schools-that-do-not-ring-together)
   get their own set; everybody else shares these.
3. **One week per child.** See [Timetable](timetable.md).
4. **Days off**, if you have a holiday calendar. See [Days that differ](exceptions.md).
5. **Routines**, when you want them. See [Routines](routines.md).

None of the later steps are required for the earlier ones to work.

## The cards look stale after an update

Close the Companion app **completely** and open it again. The bundle is served without a
long-lived cache and its URL carries the version, so the server side is not the problem —
the app holds its own copy until it is properly restarted. A browser reload is enough on
a desktop.
