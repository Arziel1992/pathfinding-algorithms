# Pathfinding Algorithms

An interactive visualiser for seven search algorithms used in game AI navigation.
Built for Swinburne's **COS30002 Artificial Intelligence for Games** and linked from its Canvas page.

## Teaching Design

| Question | Answer |
|---|---|
| What does the learner **do**? | Paints walls and weight cells, selects an algorithm, presses Play or steps through frame-by-frame. |
| Where do they **commit to a prediction**? | Before pressing Play: "Which cells will this algorithm visit before it finds the path?" |
| How do they **know they got it right**? | They compare the live frontier colouring against their prediction; the Telemetry panel shows visited count and path length for comparison across algorithms. |
| What is on screen **at load**? | A 22 × 42 grid with start (S) and end (E) pre-placed, and A* selected — the tool demonstrates its concept the moment it loads. |

## Algorithms

| ID | Name | Optimal | Weighted | Heuristic |
|---|---|---|---|---|
| `bfs` | Breadth-First Search | Yes | No | No |
| `dfs` | Depth-First Search | No | No | No |
| `dijkstra` | Dijkstra's Algorithm | Yes | Yes | No |
| `astar` | A\* | Yes | Yes | Yes |
| `greedy` | Greedy Best-First Search | No | No | Yes |
| `bibfs` | Bidirectional BFS | Yes | No | No |
| `idastar` | IDA\* | Yes | Yes | Yes |

## File Structure

```
src/
  app.css                    House design system (byte-identical to template)
  main.js                    Entry point
  App.svelte                 Root: all shared state, maze generators, keyboard
  lib/
    Grid.js                  Pure grid model — walls, weights, neighbours
    PathfindingSim.js        Simulation runner — generator stepping, timer
    MinHeap.js               Binary min-heap for Dijkstra and A*
    Heuristics.js            Manhattan, Euclidean, Chebyshev, Octile
    Canvas.svelte            Canvas renderer + mouse/touch interaction
    Controls.svelte          Right sidebar: algo, speed, draw mode, actions
    Telemetry.svelte         Live metrics + legend
    Sidebar.svelte           Left sidebar: theory, complexity, game examples
    Glossary.svelte          Modal dialog: term definitions
    i18n/
      en.js                  Australian English strings (baseline)
      es.js                  Latin-American Spanish strings
    algorithms/
      index.js               Registry — import here to add an algorithm
      BFS.js                 Breadth-First Search
      DFS.js                 Depth-First Search
      Dijkstra.js            Dijkstra's shortest path
      AStar.js               A* heuristic search
      GreedyBestFirst.js     Greedy Best-First Search
      BidirectionalBFS.js    Bidirectional BFS
      IDAStar.js             Iterative Deepening A*
```

## Adding an Algorithm

1. Create `src/lib/algorithms/MyAlgo.js` — export `meta` and `run*` generator.
2. Import and register it in `src/lib/algorithms/index.js`.
3. Add name strings to both `en.js` and `es.js` under `algoNames`.
4. Add theory entry to both i18n files under `algoInfo`.

## Development

```sh
# Requires Volta (Node 24) and pnpm >= 11 globally installed
cd pathfinding-algorithms
pnpm install
pnpm dev
```

## Build & Deploy

Push to `main`. The GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages automatically.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `S` | Step one frame |
| `R` | Clear path |
| Right-click drag | Erase cells |

## Licence

AGPL-3.0 — see [LICENSE](./LICENSE).

---

Made with ❤️ for Swinburne — AI for Games — By E. Ketterer
