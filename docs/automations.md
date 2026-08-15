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
| `member_id` | The id Schoolday knows this child by. It is how the cards find this sensor, so it is also how a template can |
| `color` / `avatar` | What this child is drawn in and with, for anything rendering them alongside the cards |
| `today` | Today's lessons: `subject`, `room`, `period`, `start`, `end` |
| `today_subjects` | Today's subjects, de-duplicated: `["Deutsch", "Mathe", "Sport"]` |
| `today_summary` | The same, ready to speak: `"Deutsch, Mathe, Sport"` |
| `lesson_now` / `lesson_next` | The running and the next lesson, or `null` |
| `schedule` | Which named [set of lesson times](timetable.md#two-schools-that-do-not-ring-together) this child's school rings to, or `null` for the household's |
| `day_mode` | `school`, `care`, `free`, `event` or `sick` — which routine is showing, and why |
| `sick_until` | The last day of an illness, or `null` |
| `outlook` | This week and the next seven days, each with its date, mode and week of the cycle |
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
| `schoolday.set_member` | Add or change a family member, including which school they ring to |
| `schoolday.remove_member` | Remove one, and everything that only existed for them |
| `schoolday.set_calendars` | The holiday calendars and the holiday-care keywords |

Every one that takes a `member` accepts a **name** as well as an id, so a script stays
readable.
