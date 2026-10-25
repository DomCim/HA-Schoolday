"""Print one version's section of CHANGELOG.md, or fail if it is missing.

The section becomes the GitHub release text, and that text is what HACS shows a household
in its update dialog. A release without one would show nothing, or a list of pull-request
titles, which says nothing to somebody deciding whether to update the kitchen tablet.

    python3 .github/scripts/changelog.py 0.14.0        # the section for 0.14.0
    python3 .github/scripts/changelog.py               # the version in manifest.json
"""

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]

version = (
    sys.argv[1].removeprefix("v")
    if len(sys.argv) > 1
    else json.loads((ROOT / "custom_components/schoolday/manifest.json").read_text())["version"]
)
text = (ROOT / "CHANGELOG.md").read_text()
match = re.search(
    rf"^## {re.escape(version)}[^\n]*\n(.*?)(?=^## |\Z)", text, flags=re.M | re.S
)
section = match.group(1).strip() if match else ""
if not section:
    sys.exit(f"CHANGELOG.md has no section for {version}. Add a '## {version}' entry.")
print(section)
