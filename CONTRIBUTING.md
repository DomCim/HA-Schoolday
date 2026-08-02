# Contributing

There is one rule for finding the right place: **is it broken, or is it not there yet?**

| | Where | Why there |
|---|---|---|
| Something does not work the way it says it does | [Bug report](https://github.com/DomCim/HA-Schoolday/issues/new?template=bug.yml) | The form asks for the version and the log, which is what makes it answerable |
| How do I …? | [Q&A discussion](https://github.com/DomCim/HA-Schoolday/discussions/new?category=q-a) | Usually an answer, sometimes a hole in the documentation |
| Schoolday should be able to … | [Ideas discussion](https://github.com/DomCim/HA-Schoolday/discussions/new?category=ideas) | Ideas become issues once there is a plan, so nothing is lost by starting here |

Issues are for what is broken or already decided. That is deliberate: a tracker full of
maybes stops being a list of things to do.

## Working on the code

See [Development](https://domcim.github.io/HA-Schoolday/development.html) for the build,
the tests and how a release is cut. In short:

```bash
npm ci
npm run typecheck
npm run build          # the committed bundle must match the sources
npm test               # renders the cards in a real browser
python3 test/config_writes_test.py
ruff check custom_components/
```

CI runs all of it, plus hassfest and the HACS check. A pull request that changes the
cards needs the rebuilt bundle committed with it — there is a check for exactly that.

## What Schoolday is not

A school-management system, a homework nag, or a reward chart. Routines are the things
that have to happen whether or not anybody notices, and Schoolday does not score them.
It is worth knowing before proposing something large.
