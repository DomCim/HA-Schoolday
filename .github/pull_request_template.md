<!--
Thanks for contributing to Schoolday! A few things make a pull request easy to take.
Delete what does not apply.
-->

## What changes for a household

<!-- One or two sentences, the way you would say it to someone using Schoolday. -->

Fixes #

## Checklist

- [ ] `npm run typecheck`, `npm test` and `ruff check custom_components/` pass
- [ ] Cards changed: the rebuilt bundle (`npm run build`) is committed with the sources
- [ ] Configuration changed: `python3 test/config_writes_test.py` passes
- [ ] New or changed text is in **both** `en` and `de` (`src/lib/i18n.ts`, `custom_components/schoolday/translations/`)
- [ ] The manual under `docs/` says what changed (see [CLAUDE.md](../blob/main/CLAUDE.md) for which page)
- [ ] `CHANGELOG.md` has a line for it, written for a household
- [ ] No changes to `.github/workflows/` — or, if there are, they are explained below

CI runs all of this. First-time contributors: the checks start once a maintainer approves
the run, so a waiting check is not a failing one.

<!-- See CONTRIBUTING.md for where bugs, questions and ideas go. -->
