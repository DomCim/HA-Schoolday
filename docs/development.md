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

Five jobs:

| Job | What it does |
|---|---|
| `hassfest` | Validates the integration the way Home Assistant does |
| `Python` | `ruff`, and the configuration-writes and model tests |
| `Frontend build` | Typecheck, build, the committed bundle must match the sources, then the smoke suite |
| `Documentation build` | Builds this site and discards it, so a page Jekyll cannot render fails here rather than after the merge |
| `HACS` | Publication readiness |

{: .warning }
> **The HACS job must never be a required status check.** It only runs on the default
> branch: `hacs/action` reads the repository through the GitHub API against that branch,
> sees none of a feature branch's files, and would fail on every push regardless of what
> changed. Required on a pull request it would never report at all, and the pull request
> would wait forever.

The other four are the ones worth requiring.

## The documentation site

Built by `.github/workflows/pages.yml`, not by GitHub's own Jekyll — so
**Settings → Pages → Source** must be **GitHub Actions**, not "Deploy from a branch".

The reason is one plugin. just-the-docs renders through {% raw %}`{% include_cached %}`{% endraw %}, which
needs `jekyll-include-cache`, and that is not on GitHub Pages' allow-list; built the
built-in way every page fails with *Unknown tag 'include_cached'*. Building it ourselves
lifts the plugin restriction.

The same change costs one thing back: GitHub Pages switches `jekyll-relative-links` on
for you and a self-built site does not. It is named in `docs/Gemfile` and `_config.yml`
on purpose — it is what turns `[Timetable](timetable.md)` into a working link, and
without it every link between these pages would 404 on the site while still working
perfectly on GitHub, which is the kind of breakage nobody notices.

### Home Assistant examples fight Jekyll for the braces

Jinja2 and Liquid use the same delimiters, and Jekyll renders a page before the Markdown
is touched — a fenced code block protects nothing. An example like this one:

{% raw %}
```jinja
{% if 'Sport' in state_attr('sensor.schoolday_ben', 'today_subjects') %}
```
{% endraw %}

is therefore not shown to the reader but *executed*, and the build dies on
`Unknown operator in`.

So any block holding a Jinja2 template has to sit between Liquid's `raw` and `endraw`
tags — see the source of this page, or of `automations.md`, for the spelling. The closing
tag cannot itself appear between them, which is why it is named rather than shown here.

The `Documentation build` job in `validate.yml` catches one you miss, and that is the
reason it exists: `pages.yml` runs only on `main`, so until that job there was nothing
standing between a page Jekyll cannot render and the published site.

```bash
cd docs && bundle install && bundle exec jekyll serve
```

## The pictures in this manual

Rendered from the same stubbed `hass` the smoke suite uses, at the same frozen moment,
so they show the same Wednesday, the same running lesson and the same three children as
the tests — and cannot drift into showing something the cards no longer do.

```bash
npm run build
npm run shots      # writes docs/images/
```

Adding a state worth showing means adding it to `test/smoke/docs-shots.mjs`, not taking
a photo of your own dashboard.

## Branch rules

`main` is protected by a repository ruleset: no deletions, no force pushes, and changes
arrive through a pull request whose checks have passed. Required approvals are **zero** —
a single maintainer cannot approve their own pull request, and requiring one would lock
the repository rather than protect it. The gate is the checks, not a second pair of eyes
that does not exist.

Tags are protected against deletion and force-pushing, but **not** against creation: the
release workflow creates them itself.

## Publishing later

Installing as a HACS custom repository needs the repository to be **public** — HACS cannot read
private repositories. Beyond that, for a custom repository nothing else is required.

Getting into the HACS **default store** — where it is found without anybody adding a custom
repository — is a pull request to [`hacs/default`](https://github.com/hacs/default) adding one line
to its `integration` file. HACS will not look at that pull request until `hacs/action` passes **with
an empty `ignore` list**: there, ignoring a check counts as failing it.

Three of those checks need something more than working code:

| Check | How it is satisfied here |
|---|---|
| `brands` | `custom_components/schoolday/brand/`, which ships with the integration. The validator looks there first and only falls back to the [`home-assistant/brands`](https://github.com/home-assistant/brands) repository when it finds nothing — so the store does not wait on a third party merging a pull request. |
| `description` | The repository's own description. A setting on GitHub, not a file in the tree. Set. |
| `topics` | The repository's topics, likewise a setting. Set. |

All three are satisfied, so the HACS job runs with **no `ignore` list at all** and whatever it
says is the real verdict. What is left is the pull request to `hacs/default` itself — one line —
and the wait, which HACS itself puts at months.

The images under `brands/` are a different job and still worth submitting one day: they are what puts
the mark on the integration's page **inside Home Assistant**, which the shipped `brand/` directory
does not do. Both sets come out of `node assets/brands.mjs`, which renders once and writes both, so
they cannot drift apart.

## Changing something

The manual is part of the change. A feature the documentation does not mention does not
exist as far as most people are concerned — it is what the README, the HACS panel and the
integration page all link to — so the page that covers what you touched is updated in the
same commit, and the pictures are regenerated with `npm run shots` if a card now draws
something different.

[`CLAUDE.md`](https://github.com/DomCim/HA-Schoolday/blob/main/CLAUDE.md) in the repository
root writes that down in full, along with the version rule and the habits this codebase is
written with. It is aimed at coding agents and reads perfectly well as a contributor guide.

## Language

The cards follow Home Assistant's own language — currently German and English, with English as the
fallback for anything else. There is no language option to set; a German frontend gets a German wall
panel. Strings live in `src/lib/i18n.ts`, and the smoke suite fails if a card renders raw keys.

## Time zones

Cards render times in the **browser's** time zone; the integration works in Home Assistant's. On the
wall tablet those are the same, which is the case this is built for.

