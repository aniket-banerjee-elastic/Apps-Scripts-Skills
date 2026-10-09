# AI features (optional)

Default decision: **none**. Skip this file's requirements when AI is off.

## Allowed path

- BigQuery `AI.GENERATE` (or equivalent) only.
- Prompt materials are on-screen facts already returned for the current scope.
- Cache keys include full request scope (mode, as-of, lens, filters, audiences).
- Do **not** write AI responses to Drive extracts.
- Provenance field: `bigquery_ai` or template fallback label.
- Chat: rate limit (reference 20 requests / 600 seconds); refuse when off-scope.

## Talking track

- Audiences: RevOps and Executive when two-audience decision is on.
- Output is narrative over existing scoreboard/trend/pipeline facts, not a second data path.

## When unavailable

If `BQ_AI_*` / project access is missing, set AI decision to none and ship without talking track or chat. Do not stub fake AI responses in production.
