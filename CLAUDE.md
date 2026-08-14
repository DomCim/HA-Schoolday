# Working on Schoolday

## The documentation is part of the change, not a follow-up

**Every change that a household could notice is finished only when the manual says so.**
Not in a later pass, not in a separate pull request — in the same commit as the code.

This is not tidiness. The manual is the only thing most people will ever read about
Schoolday: it is linked from the README, from the HACS panel, and from the integration
page. A feature the manual does not mention does not exist, and a manual that describes
last month's behaviour is worse than one that says nothing, because somebody will act on
it.

Which page, by what changed:

| Changed | Goes in |
|---|---|
| A sensor attribute, an event, a service | `docs/automations.md` — the attribute table and the service table are both meant to be complete |
| A card, or one of its options | `docs/cards.md` — every option in the table, with its default |
| Lesson times, the week, the A/B cycle, schedules | `docs/timetable.md` |
| Routines, materials, the record | `docs/routines.md` |
| Homework | `docs/homework.md` |
| Holidays, care, trips, illness | `docs/exceptions.md` |
| The build, the tests, releasing, HACS | `docs/development.md` |
| What Schoolday is, at a glance | `README.md` and `docs/index.md` — both carry the feature table and the card count |

If a change makes an existing sentence wrong, fixing that sentence is part of the change
too. Grep for what you touched before assuming nothing else mentions it.

Cross-page links are relative and anchor-based (`timetable.md#two-schools-that-do-not-ring-together`).
Anchors come from the heading text, so renaming a heading breaks every link into it.

The site is Jekyll with just-the-docs. It builds in CI on every pull request, so a page
Jekyll cannot render fails before it lands, and deploys from `main` on any change under
`docs/`.

### Screenshots

The pictures in the manual are generated, never taken by hand:

```bash
npm run build && npm run shots      # rewrites docs/images/ from the same fixtures the tests use
```

They render against the stubbed `hass` in `test/smoke/www/harness.js` at a frozen moment,
so the manual shows the same Wednesday, the same three children and the same running
lesson as the tests — and cannot drift into showing something the cards no longer do. If
a change alters what a card draws, run it and commit what changes. Everything untouched
comes out byte-identical, so the diff is honest.

A new picture needs an entry in `test/smoke/docs-shots.mjs`, and every picture in the
manual carries a caption that says what it is showing.

## The checks, before pushing

```bash
npm run typecheck
npm run build                      # the committed bundle must match the sources — CI checks
npm test                           # renders the cards in a real browser; needs the build first
ruff check custom_components/
python3 test/config_writes_test.py
```

Chromium is preinstalled in some environments; point Playwright at it with
`SCHOOLDAY_CHROMIUM=/path/to/chrome` rather than downloading another.

`custom_components/schoolday/frontend/schoolday-panel.js` is a build artefact and is
committed on purpose — HACS installs `custom_components/schoolday/` and does not build.
Rebuild it in the same commit as any frontend change.

## Versions

Four places have to agree, and the release workflow refuses to run if they do not:

- `custom_components/schoolday/manifest.json`
- `custom_components/schoolday/const.py` (`VERSION`)
- `package.json` (and the two copies in `package-lock.json`)
- `src/lib/const.ts` (`SCHOOLDAY_VERSION`)

A change that ships bumps the version in the same commit. A feature takes the minor, a
fix takes the patch. Changes that ship nothing — CI configuration, the manual on its own —
carry no bump; that is the existing convention, not an oversight.

Releasing is the `Release` workflow, either by pushing a `v*` tag or by running it with
the version as input. It verifies the four, rebuilds, re-runs the suite, and creates the
tag and the release itself.

## How this codebase is written

Read a neighbouring file before adding to one. Two habits carry most of it:

**Comments say why, not what.** The interesting comment is the one that stops the next
person undoing a decision — the timezone note in `models.today()`, the reason the routine
ticks are not in the config entry, the reason a day that asked for nothing does not break
a streak. A comment restating the line below it is noise.

**Prefer the answer that cannot rot.** Breaks are derived from the gaps between lesson
times rather than configured. The A/B anchor is a Monday rather than a week number. A
packing list comes from the timetable rather than being typed twice. When two places would
hold the same fact, one of them is the copy nobody updates.

Storage shapes are extended, not migrated: `periods` still means what it meant before
named schedules existed, and a slot above 6 was already a valid week B before the cycle
was added. A household that never uses a feature should not be able to tell it arrived.

## What Schoolday is not

A school-management system, a homework nag, or a reward chart. Routines are the things
that have to happen whether or not anybody notices, and the routines card does not score
them. The record and the statistics card are for the grown-ups deciding whether a routine
works — a different question, and worth keeping different.
