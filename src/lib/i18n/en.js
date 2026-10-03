/**
 * @file en.js — Australian English strings.
 * Every user-visible string lives here. Nothing is hardcoded in components.
 */

export default {
	// App shell
	title: "Pathfinding Algorithms",
	tagline:
		"Visualise how search algorithms explore a grid — AI for Games · COS30002",
	description:
		"An interactive visualiser for Breadth-First Search, Depth-First Search, Dijkstra, A*, Greedy Best-First Search, Bidirectional BFS, and IDA*.",
	skipToMain: "Skip to main content",
	toggleTheme: "Toggle dark/light theme",
	toggleLocale: "Cambiar a Español",
	toggleSidebarLeft: "Toggle theory sidebar",
	toggleSidebarRight: "Toggle controls sidebar",

	// Algorithm names
	algoNames: {
		bfs: "Breadth-First Search",
		dfs: "Depth-First Search",
		dijkstra: "Dijkstra's Algorithm",
		astar: "A* (A-star)",
		greedy: "Greedy Best-First Search",
		bibfs: "Bidirectional BFS",
		idastar: "IDA* (Iterative Deepening A*)",
	},

	// Heuristic names
	heuristicNames: {
		manhattan: "Manhattan",
		euclidean: "Euclidean",
		chebyshev: "Chebyshev",
		octile: "Octile",
	},

	// Controls
	controls: "Controls",
	algorithm: "Algorithm",
	heuristic: "Heuristic",
	speed: "Speed",
	speedSlow: "Slow",
	speedFast: "Fast",
	diagonal: "Allow diagonal movement",
	drawMode: "Draw mode",
	modes: {
		wall: "Wall",
		erase: "Erase",
		weight: "Weight",
		start: "Move Start",
		end: "Move End",
	},
	showWeightMode: "Show weight mode",
	weightLevel: "Weight level",
	maze: "Maze generator",
	mazeRandom: "Random walls",
	mazeRecursive: "Recursive backtracker",
	actions: "Actions",
	play: "Play",
	pause: "Pause",
	step: "Step",
	stop: "Stop",
	clearPath: "Clear path",
	clearAll: "Clear all",

	// Telemetry
	telemetry: "Run metrics",
	status: "Status",
	statuses: {
		idle: "Idle — draw a maze and press Play",
		running: "Running…",
		paused: "Paused",
		done: "Done — path found",
		noPath: "No path exists",
	},
	visited: "Nodes visited",
	pathLength: "Path length",
	elapsed: "Time elapsed",
	ms: "ms",
	cells: "cells",

	// Legend
	legend: "Legend",
	legendStart: "Start",
	legendEnd: "End",
	legendWall: "Wall",
	legendWeight: "Weight (2–9)",
	legendOpen: "Frontier (open set)",
	legendClosed: "Visited (closed set)",
	legendPath: "Shortest path",
	legendBwdOpen: "Backward frontier",
	legendBwdClosed: "Backward visited",

	// Keyboard hints
	kbHint:
		"Click/drag to paint · R right-click to erase · Space to play/pause · S to step",

	// Sidebar — theory
	theory: "Theory",
	inGames: "In games",
	algoInfo: {
		bfs: {
			title: "Breadth-First Search",
			body: `BFS explores every node at the current "depth" before moving deeper.
It uses a FIFO queue: nodes are processed in the exact order they are discovered.
In an unweighted grid, this guarantees the path with the fewest edges —
the classic "shortest hop count" result used in network routing and tile maps.`,
			props: [
				{ label: "Optimal", value: "Yes — fewest hops", colour: "green" },
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "None", colour: "orange" },
			],
			games: [
				{
					title: "Tile-map pathfinding",
					body: 'BFS underlies flood-fill and paint-bucket tools. It is also used for "can this unit reach that tile?" reachability checks in turn-based strategy games.',
				},
				{
					title: "NavMesh seeding",
					body: 'BFS from the player\'s position seeds which NavMesh regions are reachable, powering the "show reachable tiles" UI in games like Into the Breach.',
				},
			],
		},
		dfs: {
			title: "Depth-First Search",
			body: `DFS commits to one branch and follows it as deep as possible before backtracking.
It uses a LIFO stack (or recursion). The path it finds is rarely the shortest —
it depends entirely on the order neighbours are explored.
DFS is primarily used for maze generation, cycle detection, and topological sort.`,
			props: [
				{ label: "Optimal", value: "No — path may be longer", colour: "red" },
				{ label: "Complete", value: "Yes (finite graphs)", colour: "green" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "None", colour: "orange" },
			],
			games: [
				{
					title: "Maze generation",
					body: "Recursive backtracker (DFS + random neighbour order) is the most common maze-generation algorithm in procedural dungeon games.",
				},
				{
					title: "Graph colouring",
					body: 'DFS-based graph colouring partitions a level into "zones" for AI area awareness without the overhead of a full pathfinder.',
				},
			],
		},
		dijkstra: {
			title: "Dijkstra's Algorithm",
			body: `Dijkstra's algorithm expands the node with the lowest accumulated cost (g).
Unlike BFS, it respects edge weights — heavier terrain costs more to traverse.
It is essentially A* with a zero heuristic, so it expands outward uniformly
in all directions until the goal is reached.`,
			props: [
				{ label: "Optimal", value: "Yes — lowest cost", colour: "green" },
				{
					label: "Complete",
					value: "Yes (non-negative weights)",
					colour: "green",
				},
				{ label: "Weights", value: "Respected", colour: "green" },
				{ label: "Heuristic", value: "None (h = 0)", colour: "orange" },
			],
			games: [
				{
					title: "Terrain cost pathfinding",
					body: "Strategy games assign movement costs per terrain type (forest = 2, road = 1). Dijkstra returns the minimum-cost path, not minimum-hop.",
				},
				{
					title: "NavMesh edge weights",
					body: "Unreal Engine and Unity NavMesh agents use Dijkstra-like cost accumulation when area modifiers (mud, water, crowd density) are applied.",
				},
			],
		},
		astar: {
			title: "A* Algorithm",
			body: `A* combines the cost paid so far (g) with a heuristic estimate of the remaining cost (h).
f = g + h.  By choosing an admissible heuristic (one that never overestimates),
A* is guaranteed optimal while visiting far fewer nodes than Dijkstra.
It is the industry-standard pathfinding algorithm in commercial games.`,
			props: [
				{ label: "Optimal", value: "Yes — with admissible h", colour: "green" },
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Respected", colour: "green" },
				{
					label: "Heuristic",
					value: "Manhattan / Euclidean / Chebyshev / Octile",
					colour: "blue",
				},
			],
			games: [
				{
					title: "NPC navigation",
					body: "Every major game engine (Unreal, Unity, Godot) uses A* or a variant in its NavMesh pathfinder. The octile heuristic is the standard choice for tile grids with diagonal movement.",
				},
				{
					title: "Real-time strategy",
					body: "StarCraft, Age of Empires, and Warcraft III all used A* variants. Flow fields (used in Planetary Annihilation) pre-compute an A* gradient for the entire map.",
				},
			],
		},
		greedy: {
			title: "Greedy Best-First Search",
			body: `Greedy BFS always expands the node that looks closest to the goal — it uses h(n) alone,
ignoring the cost paid so far. This makes it very fast in open spaces, but it can
be fooled by a heuristic that points toward a wall, producing non-optimal or very
long paths. Compare its visited count with A*'s to see the trade-off.`,
			props: [
				{
					label: "Optimal",
					value: "No — can find longer paths",
					colour: "red",
				},
				{ label: "Complete", value: "Not guaranteed", colour: "red" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "h(n) only", colour: "blue" },
			],
			games: [
				{
					title: 'Approximate "line to target"',
					body: "Greedy BFS is sometimes used in RTS games for very short-range chase behaviour when exact optimality is not required and speed matters.",
				},
			],
		},
		bibfs: {
			title: "Bidirectional BFS",
			body: `Two BFS frontiers expand simultaneously — one from the start, one from the goal.
When they meet, the path is assembled from both halves. In open grids the combined
frontier is roughly b^(d/2) nodes, compared to b^d for single-directional BFS.
Watch the two coloured frontiers close in on each other.`,
			props: [
				{ label: "Optimal", value: "Yes — fewest hops", colour: "green" },
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "None", colour: "orange" },
			],
			games: [
				{
					title: "Two-way road graphs",
					body: "GPS navigation systems use bidirectional Dijkstra (the weighted variant) to plan routes on road networks with millions of nodes.",
				},
			],
		},
		idastar: {
			title: "IDA* (Iterative Deepening A*)",
			body: `IDA* performs depth-first searches bounded by a cost threshold that starts at h(start)
and increases each iteration to the lowest f-value that exceeded the previous bound.
Memory usage is O(d) — only the current path is stored — making it ideal for
very large search spaces where A*'s open list would be enormous.`,
			props: [
				{ label: "Optimal", value: "Yes — with admissible h", colour: "green" },
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Respected", colour: "green" },
				{ label: "Heuristic", value: "h(n), same as A*", colour: "blue" },
				{ label: "Memory", value: "O(d) — very low", colour: "purple" },
			],
			games: [
				{
					title: "Puzzle solvers",
					body: "IDA* was the first algorithm to optimally solve the 15-puzzle in real time. It is used in combinatorial game AI where the state space is enormous.",
				},
			],
		},
	},

	// Glossary
	glossaryTitle: "Glossary",
	glossaryClose: "Close glossary",
	glossary: [
		{
			term: "Open set (frontier)",
			def: "The set of discovered nodes not yet fully explored. BFS uses a queue; Dijkstra and A* use a priority queue.",
		},
		{
			term: "Closed set (visited)",
			def: "Nodes that have been fully processed and whose optimal cost is known. They are never re-expanded.",
		},
		{
			term: "g(n)",
			def: "The exact cost of the cheapest known path from the start node to n.",
		},
		{
			term: "h(n)",
			def: "The heuristic estimate of the cost from n to the goal. Must be admissible (never overestimate) for A* to be optimal.",
		},
		{
			term: "f(n) = g(n) + h(n)",
			def: "A*'s priority key. Nodes with the lowest f are expanded first.",
		},
		{
			term: "Admissible heuristic",
			def: "A heuristic that never overestimates the true cost to the goal. Manhattan distance is admissible for 4-directional unit-cost grids.",
		},
		{
			term: "Optimal",
			def: "An algorithm is optimal if it always finds the lowest-cost path when one exists.",
		},
		{
			term: "Complete",
			def: "An algorithm is complete if it always finds a path when one exists.",
		},
		{
			term: "Cell weight",
			def: "A movement cost multiplier applied when entering a cell. Unweighted algorithms (BFS, DFS, Greedy) treat all walkable cells as cost 1.",
		},
		{
			term: "Diagonal movement",
			def: "When enabled, agents may move in 8 directions. Diagonal steps cost √2 ≈ 1.414 × the cell weight. The Octile and Chebyshev heuristics are exact for this case.",
		},
		{
			term: "NavMesh",
			def: "A navigation mesh — a walkability graph of the level used by game engines. A* typically runs on NavMesh edges rather than on a raw grid.",
		},
	],

	// Attribution
	attribution: "Made with ❤️ for Swinburne — AI for Games — By E. Ketterer",
	footerMadeWith: "Made with ❤️ for Swinburne",
	footerSubject: "AI for Games",
	version: "v",
	source: "Source",
};
