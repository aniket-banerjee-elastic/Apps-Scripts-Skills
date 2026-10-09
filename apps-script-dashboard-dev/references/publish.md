# Publish to elastic/it-agent-skills

## Path

```
skills/Field/RevOps/Analytics/apps-script-dashboard-dev/
skills/Field/RevOps/Analytics/apps-script-dashboard-validation/
```

## Constraints

- Contributors typically have **pull** on `elastic/it-agent-skills`, not push.
- Ship via **fork → branch → PR** into the hub.
- Skills Hub path is **Field → RevOps → Analytics**. CODEOWNERS (`.github/CODEOWNERS`):

```
/skills/Field/RevOps/Analytics/*   @elastic/it-ai-services @elastic/sales-insights @elastic/field-team
```

`sales-insights` is the GitHub team for Sales Insights (RevOps after re-org). Parent `/skills/Field/` is `@elastic/field-team`; the nested line lists field-team with the RevOps analytics owners so reviews stay on the Field namespace. Pattern reference: `/skills/Finance/Analytics/*` → `@elastic/ea`.

## Local validation

```bash
npx --yes skills-ref validate ./skills/Field/RevOps/Analytics/apps-script-dashboard-dev
npx --yes skills-ref validate ./skills/Field/RevOps/Analytics/apps-script-dashboard-validation
```

(Exact CLI may be `agentskills` / hub-documented validator; use the hub README if names differ.)

## PR checklist

- [ ] Both packages under `skills/Field/RevOps/Analytics/`
- [ ] CODEOWNERS line for the tree
- [ ] Frontmatter `name` matches directory
- [ ] Canonical tech doc URL in development skill
- [ ] No secrets in skill assets
- [ ] IT AI Services + Sales Insights (+ Field) reviewers requested
