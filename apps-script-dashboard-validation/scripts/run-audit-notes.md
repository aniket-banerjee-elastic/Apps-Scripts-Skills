# How to run an audit

1. Open the target dashboard repo in Cursor.
2. Invoke skill `apps-script-dashboard-validation`.
3. Ensure `apps-script-dashboard-dev` is available for remediation after the report.
4. If the repo has `tools/test_*.js`, run the offline harness first and attach pass/fail to D6.
5. Fill `references/report-template.md` and return it as the deliverable.

No separate CLI binary is required; the checklist is agent-executed.
