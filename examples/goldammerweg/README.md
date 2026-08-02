# Goldammerweg

The concrete setup this repository is developed against: a KitchenTab on the wall and
five people, three of them at school.

Use it as a worked example — the entity ids are specific to this household.

## Schoolday options

**Settings → Devices & Services → Schoolday → Configure**

### Family members

| Name | Colour | Calendar | Avatar |
|---|---|---|---|
| Dominik | `#e0603a` | — | — |
| Kathi | `#8e6bbf` | — | — |
| Jan | `#3a86c8` | `calendar.jan` | `/local/schoolday/jan.png` |
| Ben | `#4f9d69` | `calendar.ben` | `/local/schoolday/ben.png` |
| Nik | `#c9a227` | `calendar.nik` | `/local/schoolday/nik.png` |

The children's calendars are the ones
[Family Calendar Sync](https://github.com/McCroden/family_calendar_sync) fills: every event in the
family calendar starts with a name — "Ben Ferienbetreuung", "Nik Zahnarzt" — and lands in that
child's own calendar. Schoolday reads them for one thing only, the holiday-care keyword.

The colour is what marks that child everywhere: the chip on the timetable card, the
frame of their routine block. Avatars are optional; without one the card shows a dot in
the same colour.

### Lesson times

**Configure → School timetable → Lesson times**. They belong to the household, so they
are entered once:

```
08:00-08:45
08:45-09:30
09:50-10:35
10:35-11:20
11:30-12:15
12:15-13:00
```

The 09:30–09:50 and 11:20–11:30 gaps become break rows on their own — there is no field
for them.

### The weeks

**Configure → School timetable → Edit someone's timetable**, one field per weekday, one
lesson per line. Ben's Monday:

```
Deutsch
Mathe
Kunst | 1.OG 5
HSU
Deutsch
```

`-` leaves a period free, and a line may name its own period (`6. Chor`) when the day
starts late or has a gap in the middle.

### Days off and holiday care

**Configure → School timetable → Days off and holiday care**. The Bavarian school-holiday
calendar subscribed as an iCal feed, plus `calendar.schulfrei` for the movable days the
school announces itself. On any day one of them covers, the cards say *Schulfrei* and the
morning announcement stays quiet without a second condition.

Keywords: `Ferienbetreuung`, one per line. Writing "Ben Ferienbetreuung" into the family
calendar is therefore the whole of the setup — the sync puts it in `calendar.ben`, and
Ben's day switches to the care routine while Nik's stays a normal holiday.

### Routines

**Configure → Edit routines**, per child and per block, one step per line — seven weekdays
plus **Freier Tag** and **Ferienbetreuung**. Ben's morning:

| Field | Steps |
|---|---|
| Mo–Fr | Zähne putzen, Anziehen, Brotdose einpacken, Ranzen packen |
| Freier Tag | Zähne putzen, Anziehen |
| Ferienbetreuung | Zähne putzen, Anziehen, Brotdose einpacken, Badesachen |

Deliberately independent of the timetable: "Sportsachen einpacken" goes on the evening
before the days that have PE.

## Dashboard

`dashboard-schoolday.yaml` — paste into a new dashboard's **Raw configuration editor**.

Two views: **Schule** (header, routines, timetable for whoever is picked) and **Ben**,
which is the same two cards pinned to one child.

## KitchenTab

The tablet is pointed at a dashboard through `input_text.kitchentab_home_url`. Switch it
to the Schoolday dashboard by setting that helper to the new dashboard's URL, for example
`http://192.168.179.1:8123/schule/schule`.

The existing *UI - WallPanel profile switch (KitchenTab)* automation and
`input_text.kitchentab_wallpanel_profile` keep working unchanged — WallPanel's screensaver
still provides the photo-frame mode, and `kiosk-mode` still hides the header and sidebar.
Schoolday adds no kiosk handling of its own; it deliberately leaves those to the
components already doing the job.

### Touch sizing

Cards target at least 44px for anything tappable. If the tablet's browser is scaled and
the week gets cramped, the timetable card drops to a single day by itself — `layout: week`
forces the week back, at the price of narrower columns.
