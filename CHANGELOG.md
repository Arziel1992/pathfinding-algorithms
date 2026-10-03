# Changelog

Reverse-chronological, newest first. Each heading is the release instant;
the version in `package.json` is the same instant written `YYYY.M.D-HHMM`.

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
