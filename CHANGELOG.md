# Changelog

Reverse-chronological, newest first. Each heading is the release instant;
the version in `package.json` is the same instant written `YYYY.M.D-HHMM`.

## 2026-10-04 - 22:09

### Added

- **Show edge costs:** every open cell prints the cost of a move into it in its corner, and, as
  Dijkstra, A\* or IDA\* reach a cell, its g value — the cheapest cost found so far from S, in
  metres — in the centre. The keyboard cursor reads both out.
- **Randomise costs:** gives every open cell a weight from 1 to 9 (two in five stay at 1) and
  switches the costs on, so BFS's fewest-steps route and Dijkstra's cheapest route come apart.
- The house shell, shared byte for byte with `Templates/svelte-app`: the floating toolbar
  (Manual, language, Dark theme), the two-pane "Manual and glossary" with a "?" on each panel and
  five new "Using the tool" entries, the footer version badge, and a favicon.

### Changed

- The title takes the house size; the language is a `<select>`; the version comes from
  `package.json` alone.

## 2026-10-04 - 19:07

Renewal under `tool-sequence` (rules 4–8, 11, 21, and the one-metre rule).

### Added

- **Predict route:** the learner sketches the route they expect from S to E; the run scores it —
  valid or not (and where it breaks), its cost against the cheapest possible, and how much of it
  the algorithm's path shares.
- **Compare all algorithms:** every algorithm on the current grid, with cells expanded, cost in
  metres and whether it found the cheapest route (checked against Dijkstra).
- Costs in metres: one cell is 1 m, a diagonal step √2 m, times the weight of the cell entered.
- The grid is fully operable by keyboard: arrow keys move a cursor, Enter applies the draw mode,
  and a live region names the cell.
- A warning when Manhattan is paired with diagonal moves, where it overestimates.
- IDA\* shows its cost bound and clears the view at each new pass.
- `?selftest` and `pnpm run selftest`: 30 checks against Bellman-Ford and a reference BFS on 60
  seeded grids, route scoring both ways, and zero missing Spanish strings.

### Changed

- The found path is a solid line and the prediction a dashed one, over terrain and search layers
  kept apart; the frontier carries a dot. Path and frontier used to be the same amber.
- A new load scene — a cup facing S and a band of mud with a gap — in which BFS, Greedy, DFS and
  IDA\* visibly differ from Dijkstra and A\*.
- Light theme first, persisted, applied before first paint; `localStorage` wrapped in `try`/`catch`.
- Spanish rewritten in neutral Latin-American Spanish (tú); claims nothing supported were cut
  from the "in games" cards.

### Fixed

- IDA\* reported "No path exists" when it hit its expansion cap on a reachable goal; it now says it
  gave up.
- Mud lost its colour once a search passed over it; "Show weight mode" did nothing (removed).
- The selected algorithm and draw mode were not highlighted: `aria-checked` had replaced the
  `aria-pressed` the stylesheet selects on.
- The maze generator could wall S or E in on an even row or column.
- Hardcoded English labels in the sidebar, glossary button and canvas.

## 2026-10-03 - 15:33

### Fixed

- Build failure: corrected unescaped quote in `src/lib/i18n/en.js`.
- Template conformance: added AGPL-3.0 `LICENSE`, canonical `.markdownlint.jsonc`, `.gitattributes`, `svelte.config.js`, and synchronized `biome.json` with `Templates/svelte-app/`.
- Accessibility: removed invalid `role="img"` from `<canvas>` in `Canvas.svelte` and replaced invalid `aria-pressed` with `aria-checked` on radio elements in `Controls.svelte`.
- Real-time search visualisation: introduced reactive `renderTick` triggering immediate canvas redraws during simulation stepping across all algorithms.
- IDA* path reconstruction: fixed path backtracking so found path nodes are yielded upon reaching goal rather than an empty array.
- Load demonstration: seeded initial obstacle pattern and visualised shortest path on load per workspace rule 7.
- House attribution: updated in-app and README footers to Swinburne house format with version badge.

## 2026-10-03 - 13:17

### Added

- Initial scaffold from `Templates/svelte-app/` via tool-scaffold skill.
- Seven algorithms in separate, independently maintainable modules:
  BFS, DFS, Dijkstra, A\*, Greedy Best-First Search, Bidirectional BFS, IDA\*.
- `Grid.js` — pure grid model; walls, weights, 4- and 8-directional neighbours.
- `PathfindingSim.js` — generator runner with play/pause/step/stop.
- `MinHeap.js` — binary min-heap used by Dijkstra and A\*.
- `Heuristics.js` — Manhattan, Euclidean, Chebyshev, Octile.
- `algorithms/index.js` — registry; adding an algorithm requires one import here.
- Canvas renderer with light/dark cell palette, weight labels, start/end glyphs.
- Controls: algorithm selector, heuristic picker, diagonal toggle, speed slider,
  draw-mode buttons (wall / erase / weight / move start / move end),
  weight-level slider, maze generators (random + recursive backtracker), actions.
- Telemetry panel: visited count, path length, elapsed time, legend.
- Sidebar: per-algorithm theory prose, rule cards, complexity formulas, game examples.
- Glossary modal with 11 key terms.
- Full i18n: `en.js` (Australian English) and `es.js` (Latin-American Spanish).
- Dark/light theme; respects `prefers-color-scheme`, persisted to `localStorage`.
- Keyboard shortcuts: Space (play/pause), S (step), R (clear path).
- Right-click drag to erase cells.
- Bidirectional BFS colours forward and backward frontiers separately.
- GitHub Actions deploy workflow for GitHub Pages.
- Teaching Design section in README (tool-sequence gate 3b).
