# Pathfinding Algorithms

An interactive visualiser for seven grid search algorithms — BFS, DFS, Dijkstra, A\*, Greedy
Best-First, Bidirectional BFS and IDA\* — on a grid of walls and weighted mud. The learner sketches
the route they expect, runs a search to see how it explores, and compares every algorithm's cost in
metres on the same grid.

It is for any unit that teaches graph search: AI for games (COS30002, where it is used first), data
structures and algorithms.

**Live:** <https://arziel1992.github.io/pathfinding-algorithms/> ·
**Repository:** <https://github.com/Arziel1992/pathfinding-algorithms>

## Teaching Design

| Question | Answer |
| --- | --- |
| What does the concept need that a page cannot give it? | Order: the difference between the algorithms is the order in which they expand cells, which only motion shows. And manipulation: moving one wall changes which algorithm wins. |
| Threshold concept or misconception? | That the shortest route is the cheapest (BFS ignores cost), that a "smart" search is always optimal (Greedy is not; A\* is not with an inadmissible heuristic), and that IDA\* is cheap (it re-expands every pass). |
| What does the learner do? | Sketches a predicted route, picks an algorithm and heuristic, runs or steps it, edits walls, mud, start and end, and compares all algorithms on the grid they built. |
| Where do they commit to a prediction? | Predict route is the default draw mode: they trace S to E before pressing Play. |
| How do they know they got it right? | Under the grid, the run reports whether their route is legal (and where it breaks), its cost against the cheapest possible, and how much of it the algorithm's path shares. Compare all marks which algorithms found the cheapest route. |
| What is on screen at load? | A cup of wall facing S and a band of mud with a gap at the top, with A\* already run: its expanded cells, frontier and path. |
| Can the support be turned down? | Both side panels fold away. |

## Key Features

- Seven algorithms: BFS, DFS, Dijkstra, A\*, Greedy Best-First, Bidirectional BFS, IDA\*.
- Four heuristics — Manhattan, Euclidean, Chebyshev, Octile — with a warning when Manhattan meets
  diagonal moves and stops being admissible.
- Walls, mud with weights 2–9, movable start and end; demo scene, random walls, maze generator,
  and Randomise costs (every open cell weighted 1–9).
- Show edge costs: each cell's move cost in its corner, and g — the cheapest cost found so far, in
  metres — in the centre as Dijkstra, A\* or IDA\* reach it.
- A "Manual and glossary" opened from the toolbar or at a topic by each panel's "?".
- Predict route: sketch, run, and get a scored verdict.
- Compare all algorithms: cells expanded, cost in metres, cheapest or not.
- The found path is a solid line, the prediction a dashed one, the frontier carries a dot — no
  meaning rests on colour alone.
- Fully keyboard operable, including drawing on the grid.
- Light and dark themes, English and Latin-American Spanish, both remembered.
- `?selftest`: every search checked against independent references.

## Mathematical Models

- **Scale:** one cell is 1 m. A straight step costs 1 m × the weight of the cell entered; a
  diagonal step √2 m × that weight.
- **Cost of a route:** the sum of its step costs. "Cheapest possible" is Dijkstra's cost on the
  same grid.
- **A\*:** expands the lowest f(n) = g(n) + h(n). Every heuristic here is a lower bound in metres,
  because no cell weighs less than 1 — except Manhattan with diagonal moves, which counts a √2 m
  step as 2 m.
- **IDA\*:** depth-first passes bounded by f; each pass raises the bound to the smallest f that
  exceeded it. Stops after 50,000 expansions and says it gave up, which is not proof there is no
  path.

## Running It

### Controls

| Control | What it does |
| --- | --- |
| Algorithm, Heuristic | What runs; the heuristic appears for A\*, Greedy and IDA\* |
| Allow diagonal movement | 8 directions instead of 4 |
| Show edge costs | Print each cell's move cost, and g where the search has reached it |
| Speed | Milliseconds per step while playing |
| Draw mode | Predict route, Wall, Mud (weight), Erase, Move start, Move end |
| Play / Pause / Step | Run, pause, or advance one expansion |
| Clear search / Compare all algorithms | Reset the search; run all seven on this grid |
| Demo scene / Random walls / Maze / Randomise costs / Clear grid | Replace the grid, or reweight it keeping the walls |
| Manual / language / Dark theme (toolbar) | Open the manual; switch language; switch theme |

### Keyboard

| Key | Action |
| --- | --- |
| `Space` | Play or pause |
| `S` | Step one expansion |
| `R` | Clear the search |
| `G` | Open or close the manual |
| Arrows (grid focused) | Move the cursor |
| `Enter` (grid focused) | Apply the draw mode at the cursor |
| Right-drag | Erase |

### Usage Examples

- At load, choose Predict route, trace S to E over the top of the cup, pick Dijkstra and press
  Play: the verdict says how much dearer your route was than the cheapest.
- Press Compare all algorithms on the demo scene: BFS wades through the mud (52 m against the
  cheapest 48 m), Greedy pays 76 m, and IDA\* gives up.
- Turn on diagonal movement with Manhattan and compare A\* against Dijkstra.
- Press Randomise costs, run BFS and then Dijkstra, and read the g values along each path: BFS
  takes the fewest steps, Dijkstra the cheapest.

## Tech Stack

Svelte 5 and Vite 8, no runtime dependencies. Biome for formatting and linting. Font Awesome,
Inter and JetBrains Mono from their CDNs.

## Local Development & Deployment

### Installation

Node is pinned by Volta (`package.json`); pnpm is global.

```sh
pnpm install
pnpm dev            # development server
pnpm run selftest   # the 30 checks, in Node
pnpm build          # production build in dist/
```

Open the running tool with `?selftest` to print the same checks in the browser console.

Source layout: `src/lib/algorithms/` one generator per search, registered in `index.js`;
`src/lib/evaluate.js` route scoring and comparison; `src/lib/i18n/` one file per language.

Deployment is GitHub Pages from `main` through `.github/workflows/deploy.yml`.

## License

AGPL-3.0 — see [LICENSE](./LICENSE).

---
_Made with ❤️ for Swinburne — Pathfinding — By E. Ketterer_
