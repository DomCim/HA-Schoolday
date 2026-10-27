---
title: Automations
layout: default
nav_order: 7
---

# Automations

Each member has a sensor whose **state is the subject they are in right now**, or `free` between and
after lessons. It changes at the lesson boundaries and nowhere else, because that is when the
timetable says it changes — there is no polling.

```
sensor.schoolday_ben        →  Sport
```

| Attribute | Contents |
|---|---|
| `member` | The child's name as typed, for an announcement about several children at once |
| `member_id` | The id Schoolday knows this child by. It is how the cards find this sensor, so it is also how a template can |
| `color` / `avatar` | What this child is drawn in and with, for anything rendering them alongside the cards |
| `today` | Today's lessons: `subject`, `room`, `period`, `start`, `end` |
| `today_subjects` | Today's subjects, de-duplicated: `["Deutsch", "Mathe", "Sport"]` |
| `today_summary` | The same, ready to speak: `"Deutsch, Mathe, Sport"` |
| `tomorrow_subjects` / `tomorrow_summary` | The same for tomorrow — empty when tomorrow is a weekend, a holiday, a care day, a trip or a sick day |
| `exams` | Exams from today to the end of the outlook, from this child's [exams calendar](exceptions.md#from-the-schools-own-system): `date`, `title`, `start` and `period` — `start` and `period` are `null` for an all-day one |
| `tomorrow_exams` | Tomorrow's exam titles: `["Mathe"]` — empty when tomorrow is not a school day, like `tomorrow_subjects` |
| `school_start` / `school_end` | When today's first lesson begins and the last one ends, `"08:00"` / `"13:10"`, after what the [school system](exceptions.md#from-the-schools-own-system) cancelled — `null` on a day without school |
| `tomorrow_start` / `tomorrow_end` | The same for tomorrow |
| `leave_at` | The next time this child has to [set off](#time-to-leave), as a timestamp — `null` without a way to school or a time to leave |
| `leave_until` | Until when that leaving time is worth showing: the first lesson for a child who walks, ten minutes past a bus time or a day in holiday care |
| `lesson_now` / `lesson_next` | The running and the next lesson, or `null` |
| `schedule` | Which named [set of lesson times](timetable.md#two-schools-that-do-not-ring-together) this child's school rings to, or `null` for the household's |
| `day_mode` | `school`, `care`, `free`, `event` or `sick` — which routine is showing, and why |
| `sick_until` | The last day of an illness, or `null` |
| `outlook` | This week and the next seven days, each with its date, mode and week of the cycle — plus `changes` where a period is covered or cancelled, and `exams` where there are any |
| `timetable` | The whole week, for the card |
| `routine_morning` / `routine_evening` | Today's steps, each with `done` |
| `routine_stats` | [The record](routines.md#the-record) of the last 30 days: `rate`, `streak`, `best_streak`, `blocks`, `steps` and `days` |

The morning announcement — "today Ben has PE" — is a time trigger and a template:

{% raw %}
```yaml
alias: Schultag-Durchsage
triggers:
  - trigger: time
    at: "07:00:00"
conditions:
  # Nothing to announce at the weekend, or on a day with no school.
  - condition: template
    value_template: "{{ state_attr('sensor.schoolday_ben', 'today_subjects') | count > 0 }}"
actions:
  - action: tts.speak
    target:
      entity_id: tts.home_assistant_cloud
    data:
      media_player_entity_id: media_player.homepod_kuche
      message: >-
        Guten Morgen! Ben hat heute {{ state_attr('sensor.schoolday_ben', 'today_summary') }}.
        {% if 'Sport' in state_attr('sensor.schoolday_ben', 'today_subjects') %}
          Sportsachen nicht vergessen.
        {% endif %}
```
{% endraw %}

### The evening before

The evening is when the PE kit still gets packed, so `tomorrow_subjects` and
`tomorrow_summary` say the same for the next day. They are the same answer the
[packing list](routines.md#what-each-subject-needs) is made from, so the sentence and the bag cannot disagree, and
they are empty whenever tomorrow is not a school day — Friday evening is quiet, Sunday
evening is not, without a weekday condition anywhere.

One child:

{% raw %}
```jinja
Ben hat morgen {{ state_attr('sensor.schoolday_ben', 'tomorrow_summary') }}.
```
{% endraw %}

Every child at once, without naming any of them: each member sensor carries `member`, so
the template finds them all and the automation does not need editing when a child joins.

{% raw %}
```yaml
alias: Morgen ist Sport
triggers:
  - trigger: time
    at: "19:00:00"
variables:
  sport: >-
    {{ states.sensor
       | selectattr('attributes.tomorrow_subjects', 'defined')
       | selectattr('attributes.tomorrow_subjects', 'contains', 'Sport')
       | map(attribute='attributes.member') | list }}
conditions:
  - condition: template
    value_template: "{{ sport | count > 0 }}"
actions:
  - action: tts.speak
    target:
      entity_id: tts.home_assistant_cloud
    data:
      media_player_entity_id: media_player.homepod_kuche
      message: >-
        {% if sport | count == 1 %}
          Morgen hat {{ sport[0] }} Sport.
        {% else %}
          Morgen haben {{ sport[:-1] | join(', ') }} und {{ sport[-1] }} Sport.
        {% endif %}
        Sportsachen einpacken!
```
{% endraw %}

That reads "Morgen haben Ben, Mia und Lea Sport." The comparison is exact, like every other
one on this page — see below for matching loosely.

They move on at midnight, so an announcement at half past midnight is already about the
day after.

A lesson the school's own system cancelled is already gone from `tomorrow_subjects` — a
substitute is already in it — and
`tomorrow_exams` has the tests, so one evening sentence can carry both — see
[From the school's own system](exceptions.md#from-the-schools-own-system):

{% raw %}
```jinja
{% set exams = state_attr('sensor.schoolday_ben', 'tomorrow_exams') %}
{% if exams %}Ben schreibt morgen {{ exams | join(' und ') }}.{% endif %}
```
{% endraw %}

## When the school changes the plan

With a [lessons calendar from the school system](exceptions.md#from-the-schools-own-system)
on a child, Schoolday reads it again every ten minutes. When that changes a day that is
still to come — a lesson cancelled, a substitute, another room — it fires
`schoolday_plan_changed`, once per child and day:

| Field | Contents |
|---|---|
| `member` / `member_id` | Who |
| `date` / `days_ahead` | Which day, and how far off: `0` today, `1` tomorrow |
| `cancelled` | The lessons that are no longer on: `subject`, `room`, `period`, `start`, `end` |
| `changed` | The periods holding something new, the same way, plus `instead` — the subject that was there, or `null` where there was none — and `restored`, true for a cancellation taken back |
| `start` / `end` | When the day now begins and ends, `null` when nothing is left |
| `previous_start` / `previous_end` | When it began and ended before |
| `message` | All of it as a sentence, in Home Assistant's language |

The message reads, in a German household:

```
Ben morgen: Musik (1. Std.) fällt aus. Deutsch statt Mathe (3. Std., Raum 007). Beginn 08:45 statt 08:00.
```

and in an English one "Ben tomorrow: Musik (period 1) is cancelled. Deutsch instead of
Mathe (period 3, room 007). Starts 08:45 instead of 08:00." A double lesson is one lesson
— "Sport (5.–6. Std.) fällt aus" — and a day with nothing left says so rather than
listing it.

A change is believed once it has been read twice: when a reading disagrees, Schoolday
looks again a minute later. A school system's calendar that is being reloaded is briefly
there and empty, and without the second look the next full reading would announce every
cancellation the school already had.

Some things are deliberately not news. The first reading after Home Assistant starts is
only the baseline: what the school changed while it was off cannot be dated, and a phone
that buzzes with the whole week after every restart is a phone nobody reads. Changes you
make yourself — under Exceptions, or to the timetable — are not announced either, and nor
is a holiday appearing in the holiday calendar. Today counts only from now on: a cancelled
lesson that is already over has nothing left for anybody to do about it.

The quickest way to a notification is the [blueprint](#blueprints). By hand:

{% raw %}
```yaml
alias: Stundenplan geändert
triggers:
  - trigger: event
    event_type: schoolday_plan_changed
conditions:
  # Today and tomorrow. Next Thursday can wait until it is tomorrow.
  - condition: template
    value_template: "{{ trigger.event.data.days_ahead <= 1 }}"
actions:
  - action: notify.mobile_app_dominik
    data:
      title: Stundenplan
      message: "{{ trigger.event.data.message }}"
```
{% endraw %}

## Time to leave

Give a child a **way to school** — minutes from the front door to the classroom, set
with the member under **Edit a family member** or in the admin card's Family section —
and Schoolday works out when they have to set off: the first lesson that is actually on,
minus the way. A cancelled first period moves it later by itself, and on a day without
school there is none.

It is published twice. `leave_at` on the child's sensor, for templates, and a sensor of
its own, `sensor.schoolday_ben_time_to_leave` (in German `…_losgehen`), whose state is the
time. Being a timestamp sensor, a time trigger can follow it without a template:

```yaml
alias: Ben – Schuhe an
triggers:
  - trigger: time
    at: sensor.schoolday_ben_time_to_leave
actions:
  - action: tts.speak
    target:
      entity_id: tts.home_assistant_cloud
    data:
      media_player_entity_id: media_player.flur
      message: Ben, Schuhe an, es geht los!
```

It shows today's leaving time until the first lesson has begun, then moves on to the next
school day. The child without a way to school has no such sensor at all; 0 minutes is a
way to school, for a child living next door. The [header card](cards.md#header-card)
counts down to it on the wall.

### A bus, a lift, holiday care

A school bus does not come later because the first lesson is cancelled, and a child who
catches it cannot sleep in. For them, set **Leaves on school days at** instead — the time
they go out of the door, whatever the school cancelled. It wins over the way to school, so
a child can keep both and the bus time is what counts.

Holiday care rarely starts when school does, and has no first lesson to count back from.
**Leaves in holiday care at** is the time on a day the child's own calendar marks as
[holiday care](exceptions.md#holiday-care). When one holiday's care starts earlier than
another's, put the time in the calendar instead: a care event that starts at 06:45, rather
than lasting all day, makes 06:45 the leaving time for that day.

| Day | Leaving time |
|---|---|
| School, with a time on school days | That time, every school day |
| School, with only a way to school | The first lesson that is on, minus the way |
| Holiday care, with a timed care event | The event's start — the earliest, if there are two |
| Holiday care, with a time for care | That time |
| Anything else | None |

A time by the clock shows as "go now" for ten minutes and then moves on to the next day,
where a walk to school does so at the first bell. `leave_time` and `care_leave_time` are
on the leave sensor too, next to `travel_minutes`; its `starts_at` is `null` on a care day.

## Blueprints

Three come with Schoolday. They are copied into `blueprints/automation/schoolday/` every
time Home Assistant starts, so after installing or updating they are simply under
**Settings → Automations & scenes → Blueprints**, and an automation made from one keeps up
with the sensors it reads. A copy you edited is left alone, and one you deleted stays
deleted.

| Blueprint | What it does | Needs |
|---|---|---|
| **The school changed the plan** | A push notification on the phones you pick, with the message above. Choose which children and how far ahead — today and tomorrow unless you say otherwise. | A lessons calendar |
| **Time-to-leave light** | A lamp in the hall turns amber a few minutes before leaving, red when it is time, and goes off again. Colours, brightness and minutes are yours to pick. | A way to school or a time to leave |
| **Before leaving for school** | Anything you like, a set time before leaving: the wake-up light an hour before, the radio, the bathroom heating. It moves with the first lesson — unless the child has a bus time. | A way to school or a time to leave |

The last two follow the leaving time to the minute, so "an hour before" on a morning
whose first lesson is cancelled is an hour before the second one — the extra 45 minutes
of sleep arrive without anybody touching the alarm. A child with a
[bus time](#a-bus-a-lift-holiday-care) gets up for the bus regardless, and on a day in
holiday care for the care time.

The phones are the Home Assistant app on each one. The notification goes to the
`notify.mobile_app_…` action the app registered, which carries the phone's own name, so
renaming the device in Home Assistant does not break it. Anything else — a sentence in
the kitchen, a notify group — goes under **Anything else**, where the text is `message`.

## Subject names

Subject names are free text. `Werken`, `AG Robotik`, `Bläserklasse` — nothing here knows what a
school teaches, and no list of subjects is kept anywhere, so the automation above works whatever the
subject is called.

The flip side is that comparisons are exact: `'Sport' in today_subjects` matches neither `sport` nor
`Sportunterricht`. Within one child's week Schoolday settles that for you — save a week with `Sport`
on Monday and `sport` on Wednesday and both become the first spelling. Across children it
deliberately does not, because that would undo a rename; two spellings then show up as two entries
in the subject-colour step, which is where you notice.

To not have to care at all, match loosely:

{% raw %}
```jinja
{{ state_attr('sensor.schoolday_ben', 'today_subjects') | select('search', '(?i)sport') | list | count > 0 }}
```
{% endraw %}

No holiday condition is needed: on a day one of the holiday calendars covers, `today_subjects` is
empty and the automation stops at the condition. Without those calendars configured it would be
cheerfully wrong for six weeks every summer.

The board sensor says the same thing outright for the household, and each member sensor says it for
that child — including whether they are in holiday care today:

```
sensor.schoolday_board          sensor.schoolday_ben
  school_today: false             day_mode: care
  no_school_reason: "Sommerferien"
```

So a care day gets its own sentence without a second entity to check:

{% raw %}
```jinja
{% if state_attr('sensor.schoolday_ben', 'day_mode') == 'care' %}
  Ben ist heute in der Ferienbetreuung. Badesachen einpacken.
{% endif %}
```
{% endraw %}

Two events fire at every lesson boundary, carrying `member`, `member_id`, `subject`, `room`,
`period`, `start` and `end`:

| Event | When |
|---|---|
| `schoolday_lesson_started` | A lesson begins |
| `schoolday_lesson_ended` | A lesson ends |
| `schoolday_plan_changed` | The school system changed a day still to come — see [below](#when-the-school-changes-the-plan) |

They exist alongside the state because the state cannot show everything: two periods of the same
subject in a row are one state but two lessons. Nothing fires on a Home Assistant restart — the
sensor adopts whatever is running without announcing it, so a restart mid-morning does not shout
"PE has started" into the kitchen.

{% raw %}
```yaml
alias: Sport beginnt
triggers:
  - trigger: event
    event_type: schoolday_lesson_started
    event_data:
      member: Ben
      subject: Sport
actions:
  - action: notify.mobile_app_dominik
    data:
      message: "Ben ist jetzt in Sport ({{ trigger.event.data.room }})."
```
{% endraw %}


## What the routines are doing

`routine_stats` is [the record](routines.md#the-record) rather than today's state, so it
answers questions today's ticks cannot — and it answers them on Sunday evening, which is
when anybody is going to act on them.

{% raw %}
```yaml
alias: Wochenrückblick Routinen
triggers:
  - trigger: time
    at: "19:00:00"
conditions:
  - condition: time
    weekday: [sun]
  # A step that is missed once was a bad day; one missed half the time is a step in the
  # wrong place. Only the second is worth saying anything about.
  - condition: template
    value_template: >-
      {{ (state_attr('sensor.schoolday_ben', 'routine_stats').steps | first).rate < 60 }}
actions:
  - action: notify.mobile_app_dominik
    data:
      message: >-
        {% set worst = state_attr('sensor.schoolday_ben', 'routine_stats').steps | first %}
        „{{ worst.step }}“ hat Ben in den letzten vier Wochen {{ worst.done }} von
        {{ worst.asked }} Mal gemacht. Vielleicht gehört der Schritt woanders hin.
```
{% endraw %}

`steps` arrives worst first, so `| first` is the step most often skipped. A `rate` is
`null` rather than `0` where nothing was ever asked, which is worth a `is not none` before
comparing it.

## Services

Everything the options dialog can change is also a service, because a Lovelace card
cannot edit a config entry but can call one. They validate exactly what the options flow
validates: a card must not be able to write a timetable the sensors can no longer read.

| Service | Purpose |
|---|---|
| `schoolday.set_routine_step` | Tick a routine step off, or put it back |
| `schoolday.reset_routine` | Clear today's ticks |
| `schoolday.set_absent` | Mark a child ill, optionally through a date |
| `schoolday.set_periods` | Replace the lesson times — the household's, or one named school's |
| `schoolday.set_lesson` | One cell of one week |
| `schoolday.set_day` | A whole weekday at once |
| `schoolday.set_routine` | Replace one member's steps for one block on one day |
| `schoolday.set_cycle` | One-week or two-week timetable, and where week A starts |
| `schoolday.set_subject_color` | Recolour a subject, or hand it back its derived colour |
| `schoolday.set_exception` | What one date does differently |
| `schoolday.clear_exception` | Put a date back |
| `schoolday.set_materials` | What a subject needs brought along |
| `schoolday.set_member` | Add or change a family member, including which school they ring to, their way to school, their times to leave on school days and in holiday care (`leave_time`, `care_leave_time`, `HH:MM`) and their school system's calendars and homework list (`lessons_calendar`, `exams_calendar`, `homework_list`) |
| `schoolday.remove_member` | Remove one, and everything that only existed for them |
| `schoolday.set_calendars` | The holiday calendars, the holiday-care keywords, and the cancellation and substitution words |

Every one that takes a `member` accepts a **name** as well as an id, so a script stays
readable.

The first three are open to every user, because ticking a step off is what a child's
wall tablet is for. Everything below them rewrites the configuration and needs an
**administrator**, exactly like the options dialog: a call from any other user is
refused. An automation runs without a user and is not affected.
