---
name: apps-script-dashboard-dev
description: >
  Standardize design and development of RevOps Google Apps Script dashboards and
  Workspace web apps on BigQuery extracts. Use when building or extending a
  forecast/supporting dashboard, adding a view, scaffolding shared/+clasp deploy,
  or producing the accompanying tech doc. Enforces mode registry, extract
  architecture, formats, flags, optional AI talking track, Hub link, and Docs
  formatting rules.
metadata:
  display_name: Apps Script Dashboard Development (RevOps)
  author: aniket.banerjee@elastic.co
  version: "1.0"
---

# Apps Script Dashboard Development (RevOps)

Standards contract for RevOps (and adjacent analytics) Workspace web apps. Not a beginner tutorial. Defaults come from the Forecast - Supporting Dashboards reference implementation.

**Canonical tech doc (worked example):** https://docs.google.com/document/d/1dNZHVvf-oFRV-zv-jVLNdzxFXBNnsoZBVQ_Uf6H2q_0/edit

**Companion skill:** `apps-script-dashboard-validation`

## When to use

- "Build / extend a RevOps Apps Script dashboard"
- "Add a view to the forecast supporting dashboards"
- "Scaffold a Workspace web app on certified BigQuery"
- "Standardize our Apps Script dashboard design"

## How to work with the agent

State the outcome, give one concrete example (scope, measure, or workbook), and ask for an audit before deploy. Record decisions in `DECISIONS.md` at the repo root.

## Workflow

1. **Intake** — Ask decision-menu questions (`references/decision-menu.md`). Write answers to `DECISIONS.md`.
2. **Scaffold** — `shared/` is the only editable backend; sync script copies into the clasp deploy folder; one mode registry declares every view.
3. **Data layer** — Certified BigQuery only. Scheduled warm writes Drive extracts. Viewers never query BigQuery. Show SQL on every table. One constant for warm hour (`WARM_HOUR_PT`) printed via one label helper.
4. **Views** — Registry entries only. Client text that depends on registry, enabled list, toggles, or script properties is generated, never hard-coded.
5. **Features** — Essential checklist below. AI only if decided.
6. **Tests** — Offline harness first; then run `apps-script-dashboard-validation`.
7. **Deploy** — `sync` → `clasp push` → `clasp version` → `clasp deploy -i <id> -V <n>`. Re-warm after `schemaRev` bump. Record rollback command.
8. **Exit** — Tech doc per `references/tech-doc-template.md`. Refuse completion until the Google Doc passes the formatting smoke check (or markdown fallback is noted).

## Essential features

Landing; view switcher; scope rail (drill vs filters); as-of Live/Snapshot when chosen; Partners lens when chosen; per-view toggles; scoreboard; projection / trend / pipeline / deals; flags + insight cards (every flag has a card); what-moved-it + named deals; Show SQL; annotated CSV; Additional information; theme; per-user isolation; reload resets scope (theme may persist). **Hub Related link** when chosen (default on for RevOps). **Talking track / chat** only when AI enabled.

## Ground rules (summary)

Full detail in `references/`. Non-negotiables:

- Single mode registry; no literal view ids in client files.
- Dual Live/Snapshot extracts when Snapshot is on; bump `schemaRev` only when extract shape changes.
- Y/Y = same fiscal quarter prior year; in-flight uses same week-in-quarter.
- Assumptions: statement / reasoning / effect. Footnote every exclusion.
- Charts: tip-series end-of-bar totals (1e-6 when tip empty); banded combo axes; tooltip clamp to clipping ancestor; captions match real interactions (hover vs click).
- Cache keys include request scope (no Drive narration mirror keyed only on quarter).
- Security: group/allow-list gate; execute as deployer; bound SQL params; Shared Drive for extracts.
- Accessibility: Okabe & Ito; markers not colour-only; aria-pressed/selected/expanded.

## Hub (RevOps)

RevOps Intelligence Hub is a sibling Sheet-backed catalog, not a dashboard mode. Default **include** on landing Related. Store URL in config.

## AI (optional)

If decision is **none**: skip AI; do not require `BQ_AI_*`.

If on: BigQuery `AI.GENERATE` only; on-screen facts; scope-keyed cache; no Drive mirror; provenance `bigquery_ai` or template; chat rate limit (reference 20 / 600s). See `references/ai-features.md`.

## Tech doc exit criteria

Sections 1–22 + Document Metadata **at the end**. Worked example linked above.

**Google Docs rule:** never paste raw markdown. Prefer Drive markdown→Doc conversion or Docs MCP styles. Smoke check: real headings/tables; no literal `#` / `**` / fences; diagrams as PNG + caption via `insert_image`.

## Publish path

`skills/Field/RevOps/Analytics/apps-script-dashboard-dev/` in `elastic/it-agent-skills`. CODEOWNERS `/skills/Field/RevOps/Analytics/*` (`@elastic/it-ai-services` + `@elastic/sales-insights` + `@elastic/field-team`); request those teams for review (see `references/publish.md`).
