# Architecture

## Data flow

```
BigQuery certified models
  → warmCache() (daily, WARM_HOUR_PT)
  → Drive JSON extracts (fast + deals; live + snapshot)
  → CacheService (short TTL)
  → getDashboard / buildScope_
  → Client (panels, charts, SQL, CSV)
```

Viewers never hit BigQuery on scope changes.

## Repo layout

- Edit backend only under `shared/`.
- `tools/sync.sh` copies shared files into the clasp project folder (reference: `v2-workspace/`).
- Generate `ScopeEngine.html` from `buildScope_` before sync when applicable.
- Client-only files stay in the deploy folder (`Index.html`, `JavaScript.html`, `Stylesheet.html`, …).

## Mode registry

Each mode declares: id/slug, title, population, share kind, panels, queries, money fields, bands, toggles, copy slots, `schemaRev`, `enabledByDefault`. Shared code reads the registry; client must not hard-code mode ids.

Adding a view: new registry entry (`enabledByDefault: false`), pulls, warm wrapper, definitions/assumptions, tests, warm, then `enableDashboard`.

## Hub

Sibling Apps Script portal (Sheet catalog). Landing Related link when decision is on. Not a `DASH_MODES` entry.

## Reference

Forecast - Supporting Dashboards tech doc: https://docs.google.com/document/d/1dNZHVvf-oFRV-zv-jVLNdzxFXBNnsoZBVQ_Uf6H2q_0/edit
