# Design standards

## Numbers

- Percents: whole numbers unless decision says otherwise.
- Share deltas: one decimal in points.
- Money: define `$K` / `$M` on screen and in CSV annotations.
- Comparisons: Y/Y only by default (same fiscal quarter prior year).

## Charts

- Stacked bars: end-of-bar total on tip series; use near-zero tip segment when the tip series is empty so closed quarters still label.
- Combo bar+line: banded axes so bar totals and line labels do not collide.
- Tooltips: clamp to nearest clipping ancestor (card), not only the window.
- Captions: hover language on charts; click language on tables that open decomposition.

## Flags and cards

- Spike/drop: percentage floor and dollar floor together.
- Concentration: separate marker on deal stack.
- Every marker has an insight card (including flagged trend points).
- Click marker → jump to card.

## Layout

- Landing first unless `?dash=` names an enabled view.
- Drill path (Geo → Area → Region) vs filters (Segment, Deal band).
- Reload resets scope/filters/toggles; theme may persist.
- Narrow breakpoints collapse the rail.

## Accessibility

- Okabe & Ito palette.
- Markers are glyphs/links, not colour alone.
- `aria-pressed` / `aria-selected` / `aria-expanded` on controls.
