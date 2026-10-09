# Apps-Scripts-Skills

RevOps Google Apps Script dashboard skills for AI agents (Cursor, Claude, and other [Agent Skills](https://agentskills.io)-compatible tools).

## Skills

| Skill | Purpose |
|---|---|
| [`apps-script-dashboard-dev`](./apps-script-dashboard-dev/) | Design and build standards for RevOps Apps Script dashboards on BigQuery extracts |
| [`apps-script-dashboard-validation`](./apps-script-dashboard-validation/) | Pre-deploy audit checklist against the development skill |

Canonical tech doc (worked example): [Forecast - Supporting Dashboards](https://docs.google.com/document/d/1dNZHVvf-oFRV-zv-jVLNdzxFXBNnsoZBVQ_Uf6H2q_0/edit)

Hub PR (optional upstream): [elastic/it-agent-skills#40](https://github.com/elastic/it-agent-skills/pull/40)

## Install from zip

Download from [`dist/`](./dist/):

- [apps-script-dashboard-dev.zip](./dist/apps-script-dashboard-dev.zip)
- [apps-script-dashboard-validation.zip](./dist/apps-script-dashboard-validation.zip)

### Cursor

1. Unzip.
2. Copy the skill folder to `~/.cursor/skills/` (personal) or `<repo>/.cursor/skills/` (project).
3. Open a new agent chat.

### From this repo (no zip)

```bash
git clone https://github.com/aniket-banerjee-elastic/Apps-Scripts-Skills.git
cp -R Apps-Scripts-Skills/apps-script-dashboard-dev ~/.cursor/skills/
cp -R Apps-Scripts-Skills/apps-script-dashboard-validation ~/.cursor/skills/
```

## Ownership

CODEOWNERS-style owners on the hub: `@elastic/it-ai-services` and `@elastic/sales-insights` (Sales Insights / RevOps).

## Document Metadata

| Field | Value |
|---|---|
| Owner | aniket-banerjee-elastic |
| Status | published |
| Source of truth | this repository |
| Related hub path | `skills/RevOps/Analytics/` in elastic/it-agent-skills |
