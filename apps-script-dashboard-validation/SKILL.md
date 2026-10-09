---
name: apps-script-dashboard-validation
description: >
  Audit RevOps Google Apps Script dashboards against the Apps Script Dashboard
  Development skill. Use before deploy, after a view change, or when asked to
  validate/QA a Workspace web app on BigQuery extracts. Produces a scored
  checklist with pass/fail/skip, evidence paths, and blockers.
metadata:
  display_name: Apps Script Dashboard Validation (RevOps)
  author: aniket.banerjee@elastic.co
  version: "1.0"
---

# Apps Script Dashboard Validation (RevOps)

Companion to `apps-script-dashboard-dev`. Runs an audit; does not implement features.

**Canonical tech doc (reference product):** https://docs.google.com/document/d/1dNZHVvf-oFRV-zv-jVLNdzxFXBNnsoZBVQ_Uf6H2q_0/edit

## When to use

- "Validate / audit / QA this Apps Script dashboard"
- "Ready to deploy?"
- "Does this match the RevOps dashboard standard?"
- After adding a view or changing extracts / registry / AI / Hub link

## How to work with the agent

Point at the repo (or clasp project). Prefer `DECISIONS.md` if present. Ask for a full audit report, not a summary-only pass.

## Workflow

1. **Locate** — Find `shared/`, deploy folder, sync script, tests, tech doc / Doc URL.
2. **Load decisions** — Read `DECISIONS.md`. Missing decisions → use development skill defaults; mark those rows **skip** with reason "decision not recorded".
3. **Run checklist** — `references/checklist.md` (architecture, registry, extracts, UI, flags, SQL/CSV, security, a11y, Hub, AI, docs, deploy).
4. **Evidence** — Cite file path + symbol or Doc section for every fail. Prefer automated tests when present (`tools/test_*.js`).
5. **Score** — Pass / fail / skip. Any **blocker** fail → do not recommend deploy.
6. **Report** — Template in `references/report-template.md`. List remediations ordered by severity.
7. **Exit** — Hand remediations to development skill or engineer; re-run after fixes.

## Blockers (always fail deploy recommendation)

- Viewers query BigQuery on scope change
- Mode ids hard-coded in client HTML/JS instead of registry
- Snapshot on but only one extract generation path
- Flag markers without matching insight cards
- Secrets or SaaS keys in repo / plaintext in audit outputs
- Tech doc missing Document Metadata at end, or Google Doc fails formatting smoke check when Doc is the delivery format
- `schemaRev` bumped without re-warm plan

## Conditional rows

- **Hub Related** — fail only if decision is include and link missing
- **AI** — if decision is none, skip AI rows; if on, fail missing provenance / Drive mirror / unbound cache key
- **Partners / Snapshot** — skip if decision is off

## Publish path

`skills/Field/RevOps/Analytics/apps-script-dashboard-validation/` in `elastic/it-agent-skills` (fork/PR; see development skill `references/publish.md`).
