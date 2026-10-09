# Validation checklist

Mark each row **pass** / **fail** / **skip**. Failures need evidence (path + symbol). Blockers are marked **[B]**.

## Architecture

| ID | Check | Severity |
|---|---|---|
| A1 | Backend edits live under `shared/`; deploy folder is synced, not hand-edited for shared code | normal |
| A2 | Sync script present and used before clasp push | normal |
| A3 | **[B]** Viewers do not call BigQuery on scope / filter changes | blocker |
| A4 | Warm path writes Drive extracts; hour constant + label helper agree | normal |
| A5 | Dual Live/Snapshot extract paths when Snapshot decision is on | blocker if Snapshot on |

## Registry and copy

| ID | Check | Severity |
|---|---|---|
| R1 | **[B]** Single mode registry; no hard-coded view ids in client HTML/JS | blocker |
| R2 | Landing / FAQ / guide text derived from registry + enabled list | normal |
| R3 | Disabled modes show Not enabled (or equivalent), not broken links | normal |
| R4 | `enableDashboard` / property overlay documented | normal |

## Scope and comparisons

| ID | Check | Severity |
|---|---|---|
| S1 | Drill path vs filters separated in UI and request payload | normal |
| S2 | Y/Y uses same fiscal quarter prior year; in-flight uses week-in-quarter | normal |
| S3 | Reload resets scope/filters/toggles (theme may persist) | normal |
| S4 | Cache keys include full request scope | normal |

## Charts and flags

| ID | Check | Severity |
|---|---|---|
| C1 | Stacked tip totals present; tip empty uses near-zero segment so labels show | normal |
| C2 | Combo charts use banded axes where bar+line labels would collide | normal |
| C3 | Tooltips clamp to clipping ancestor | normal |
| C4 | Captions match interaction (hover vs click) | normal |
| C5 | **[B]** Every flag marker has an insight card | blocker |
| C6 | Concentration markers distinct from spike/drop | normal |

## SQL, CSV, assumptions

| ID | Check | Severity |
|---|---|---|
| Q1 | Show SQL on every table / panel that claims SQL | normal |
| Q2 | CSV annotated (headers / units / as-of) when decision is annotated | normal |
| Q3 | Assumptions use statement / reasoning / effect | normal |
| Q4 | Exclusions footnoted | normal |

## Security and a11y

| ID | Check | Severity |
|---|---|---|
| X1 | Group or allow-list gate; execute as deployer | normal |
| X2 | Bound parameters in SQL builders | normal |
| X3 | Extracts on Shared Drive (or documented equivalent) | normal |
| X4 | Okabe & Ito (or documented palette); markers not colour-only | normal |
| X5 | aria-pressed / selected / expanded on interactive controls | normal |

## Hub and AI

| ID | Check | Severity |
|---|---|---|
| H1 | Hub Related link present when decision is include | conditional |
| I1 | AI absent when decision is none | conditional skip |
| I2 | AI uses BQ generate path; no Drive AI mirror; scope-keyed cache; provenance set | conditional |
| I3 | Chat rate limit enforced when chat is on | conditional |

## Docs and deploy

| ID | Check | Severity |
|---|---|---|
| D1 | Tech doc sections 1–22 present (or mapped equivalent) | normal |
| D2 | **[B]** Document Metadata at end | blocker |
| D3 | Google Doc formatting smoke check (no raw markdown artifacts) when Doc is deliverable | blocker if Doc |
| D4 | Production deploy id recorded; rollback command known | normal |
| D5 | **[B]** schemaRev change has re-warm in release notes | blocker |
| D6 | Offline tests exist and pass for changed surfaces | normal |
