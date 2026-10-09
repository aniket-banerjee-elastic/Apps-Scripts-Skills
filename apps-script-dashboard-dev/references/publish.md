# Publish to elastic/it-agent-skills

## Path

```
skills/RevOps/Analytics/apps-script-dashboard-dev/
skills/RevOps/Analytics/apps-script-dashboard-validation/
```

## Constraints

- Contributors typically have **pull** on `elastic/it-agent-skills`, not push.
- Ship via **fork → branch → PR** into the hub.
- First PR that creates `skills/RevOps/Analytics/` must update **`.github/CODEOWNERS`** (not a root file):

```
/skills/RevOps/Analytics/*         @elastic/it-ai-services @elastic/sales-insights
```

`sales-insights` is the GitHub team for Sales Insights (RevOps after re-org). Pattern reference: `/skills/Finance/Analytics/*` → `@elastic/ea`.

## Local validation

```bash
npx --yes skills-ref validate ./skills/RevOps/Analytics/apps-script-dashboard-dev
npx --yes skills-ref validate ./skills/RevOps/Analytics/apps-script-dashboard-validation
```

(Exact CLI may be `agentskills` / hub-documented validator; use the hub README if names differ.)

## PR checklist

- [ ] Both packages under `skills/RevOps/Analytics/`
- [ ] CODEOWNERS line for the new tree
- [ ] Frontmatter `name` matches directory
- [ ] Canonical tech doc URL in development skill
- [ ] No secrets in skill assets
- [ ] IT AI Services + RevOps reviewers requested
