# Decision menu

Ask once; record in `DECISIONS.md`. If no preference, use Default.

| Decision | Options | Default |
|---|---|---|
| Percent rounding | whole numbers; one decimal; two decimals | Whole numbers; point deltas to one decimal |
| Currency unit | `$K`; `$M`; `$` full; mixed with defined units | `$K` tables; compact `$K`/`$M` on charts; units defined |
| Comparison basis | Y/Y only; Q/Q only; both | Y/Y only |
| Negative formatting | minus sign; parentheses | Minus sign |
| Fiscal calendar | calendar; company fiscal | Company fiscal |
| Data freshness | live query; daily extract; hybrid | Daily extract; `WARM_HOUR_PT` |
| As-of modes | live only; live + snapshot | Live + Snapshot |
| Book lens | all only; all + partners | All + Partners |
| Flag rules | none; spike/drop; spike/drop/concentration | All three |
| Insight cards | none; per flagged row; row + trend | Every flag has a card |
| Landing screen | none; links only; full | Full (Live / Not enabled badges) |
| RevOps Intelligence Hub link | omit; include | **Include** for RevOps |
| Theme | light; dark; user choice | User choice remembered; else reset on reload |
| Scope persistence | remember; reset on reload | Reset on reload |
| AI features | none; talking track; track + rate-limited chat | **None** if BQ AI unavailable |
| Talking-track audiences (if AI) | one; two | Two (RevOps, Executive) |
| CSV export | plain; annotated | Annotated |
| Access | domain; group | Group script property |
| Closed-deals pull cap | 600; 1500; custom | 600 (1500 for heavy modes) |

Conflict with org standard → state the standard and ask once more.
