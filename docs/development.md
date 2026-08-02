---
title: Development
layout: default
nav_order: 9
---

# Development

```bash
npm install
npm run build      # writes custom_components/schoolday/frontend/schoolday-panel.js
npm run watch      # rebuild on change
npm run typecheck
npm test           # renders the built cards in headless Chromium
```

`npm test` boots the built bundle in a real browser against a stubbed `hass` and checks the things
that actually break: the running lesson being the one marked, breaks appearing from the gaps between
periods and not dangling off the end of the table, a routine tick surviving the round trip through
the sensor, the cards speaking Home Assistant's language, and touch targets being big enough. The
clock is frozen at a Wednesday morning inside the second period, so "the lesson running now" is a
fact rather than whatever the clock says when CI happens to run. It needs a browser once:
`npx playwright install chromium`. Set `SCHOOLDAY_CHROMIUM` to use one you already have.

The built bundle is **committed on purpose**: HACS installs `custom_components/schoolday/` verbatim
and never runs a build step, so the artifact has to be in the tree. CI fails if the committed bundle
does not match the sources.

## CI

`hassfest` validates the integration the way Home Assistant does, and the frontend job typechecks,
builds, verifies the committed bundle matches the sources, and runs the smoke suite.

The HACS job only runs on the default branch. `hacs/action` reads the repository through the GitHub
API against the default branch, so on a feature branch it sees none of the files and fails on every
push regardless of what changed.

## Publishing later

Installing as a HACS custom repository needs the repository to be **public** — HACS cannot read
private repositories. Beyond that, for a custom repository nothing else is required.

Submitting to the HACS default store additionally needs a repository description, GitHub topics, and
a licence detectable on the default branch. Those two checks are in `ignore` in the workflow; drop
them from the list if you ever go that route.

## Language

The cards follow Home Assistant's own language — currently German and English, with English as the
fallback for anything else. There is no language option to set; a German frontend gets a German wall
panel. Strings live in `src/lib/i18n.ts`, and the smoke suite fails if a card renders raw keys.

## Time zones

Cards render times in the **browser's** time zone; the integration works in Home Assistant's. On the
wall tablet those are the same, which is the case this is built for.

