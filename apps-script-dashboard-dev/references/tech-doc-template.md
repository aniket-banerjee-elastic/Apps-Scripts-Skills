# Tech doc template (exit criteria)

Produce a Google Doc (preferred) or markdown. Worked example:
https://docs.google.com/document/d/1dNZHVvf-oFRV-zv-jVLNdzxFXBNnsoZBVQ_Uf6H2q_0/edit

## Required sections (order)

1. Purpose and audience  
2. Product surface (views, landing)  
3. Architecture and data flow  
4. Mode registry and enablement  
5. Extracts, warm schedule, `schemaRev`  
6. Scope model (drill vs filters)  
7. As-of and book lens  
8. Scoreboard and comparisons  
9. Charts and captions  
10. Flags and insight cards  
11. Pipeline, deals, what-moved-it  
12. Show SQL and CSV  
13. Assumptions and definitions  
14. Security and access  
15. Performance and cache  
16. AI features (or explicit "none")  
17. Hub Related link (or explicit omit)  
18. Testing  
19. Deploy and rollback  
20. Known limitations  
21. Open decisions / follow-ups  
22. Related links  

Then **Document Metadata** at the **end** (never first): ownership, status, source of truth, production deployment id, facts-read date. Unknowns: "to be measured" / "to be named".

## Google Docs formatting

- Never paste raw markdown into Docs.
- Prefer Drive convert markdown→Doc, then style; or Docs MCP paragraph/table styles.
- Smoke check before done: headings/tables are native; no literal `#`, `**`, or fenced code as body text; diagrams are PNG with captions (`insert_image`).
- Mermaid sources may live in repo `docs/figures/*.mmd`; PNGs in `docs/figures/*.png`.
