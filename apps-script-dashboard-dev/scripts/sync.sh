#!/usr/bin/env bash
#
# Copies the shared backend into the Workspace (Option B) directory.
#
# Apps Script projects are standalone, so the deployed app needs its own copy
# of every backend file. `shared/` is the only place to edit them.
#
# A copy that has drifted from shared/ is reported and left alone rather than
# overwritten, because the drift is either an edit made in the wrong directory
# or a write by clasp, and silently discarding either one loses work. Pass
# --force to overwrite anyway.
#
# Option A (`v1-briefing`) was retired 2026-09-21; sync targets Workspace only.

set -euo pipefail

force=0
[[ "${1:-}" == "--force" ]] && force=1

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

# Regenerated before every sync, so shared/ScopeEngine.html never goes stale
# relative to the buildScope_ source it is lifted from.
node "$root/tools/gen_scope_engine.js"

shared_files=(appsscript.json Config.gs BigQueryClient.gs Cache.gs FiscalCalendar.gs Queries.gs Definitions.gs Assumptions.gs Dashboard.gs Narration.gs Code.gs Formatters.html ScopeEngine.html)
versions=(v2-workspace)

drift=0
copied=0

for version in "${versions[@]}"; do
  for file in "${shared_files[@]}"; do
    source="shared/$file"
    target="$version/$file"

    if [[ -e "$target" ]] && ! cmp -s "$source" "$target"; then
      if [[ "$target" -nt "$source" && $force -eq 0 ]]; then
        echo "drift: $target is newer than $source and differs; not overwriting"
        drift=$((drift + 1))
        continue
      fi
    fi

    cp "$source" "$target"
    copied=$((copied + 1))
  done
done

echo "copied $copied file(s) into ${versions[*]}"
if [[ $drift -gt 0 ]]; then
  echo "$drift file(s) left in place. Fold the change into shared/ or rerun with --force."
  exit 1
fi
