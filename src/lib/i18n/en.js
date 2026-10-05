/**
 * @file en.js — Australian English strings, the baseline locale.
 * Every learner-visible string lives here; `{name}` placeholders are filled by
 * `fmt()` in App.svelte. Not translated: E. Ketterer, unit codes, the version,
 * and mathematical notation.
 */

export default {
	// App shell
	title: "Pathfinding Algorithms",
	tagline:
		"Watch seven search algorithms explore the same grid, and predict the route first.",
	description:
		"Interactive visualiser for BFS, DFS, Dijkstra, A*, Greedy Best-First, Bidirectional BFS and IDA* on a weighted grid: sketch the route you expect, run a search, and compare every algorithm's cost in metres.",
	skipToMain: "Skip to the grid",
	toolbarLabel: "Tool settings",
	manualButton: "Manual",
	languageLabel: "Language",
	themeToggle: "Dark theme",
	toggleSidebarLeft: "Show or hide the theory panel",
	toggleSidebarRight: "Show or hide the controls panel",
	openGlossary: "Open the manual at this topic",

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

	heuristicNames: {
		manhattan: "Manhattan",
		euclidean: "Euclidean",
		chebyshev: "Chebyshev",
		octile: "Octile",
	},
	heuristicWarning:
		"Manhattan overestimates once diagonal moves are allowed: it counts a √2 m diagonal step as 2 m. A* may then miss the cheapest route. Try Octile.",

	// Controls
	controls: "Controls",
	algorithm: "Algorithm",
	heuristic: "Heuristic",
	options: "Options",
	speed: "Speed",
	speedValue: "{ms} ms per step",
	diagonal: "Allow diagonal movement",
	showCosts: "Show edge costs",
	showCostsHint:
		"Corner: the cost of a move into that cell. Centre: g, the cheapest cost found so far from S, in metres (Dijkstra, A*, IDA*).",
	cellG: "g = {g} m",
	drawMode: "Draw mode",
	modes: {
		predict: "Predict route",
		wall: "Wall",
		weight: "Mud (weight)",
		erase: "Erase",
		start: "Move start",
		end: "Move end",
	},
	weightLevel: "Mud weight",
	weightHint: "Entering a mud cell costs its weight times the step length.",
	maze: "Generate a grid",
	mazeDemo: "Demo scene",
	mazeRandom: "Random walls",
	mazeRecursive: "Maze",
	mazeCosts: "Randomise costs",
	actions: "Run",
	play: "Play",
	pause: "Pause",
	step: "Step",
	stop: "Stop",
	clearPath: "Clear search",
	clearAll: "Clear grid",

	// Prediction
	predictTitle: "Your prediction",
	predictHint:
		"Choose Predict route, trace from S to E, then press Play. The run scores your route.",
	predictDrawn: "Route sketched: {n} cells. Press Play to check it.",
	predictClear: "Clear prediction",
	predictReasons: {
		empty: "Your route is empty — start it on S.",
		start: "Your route must begin on S.",
		end: "Your route stops before E (at row {r}, column {c}).",
		wall: "Your route crosses a wall at row {r}, column {c}.",
		gap: "Your route jumps a cell at row {r}, column {c}.",
	},
	predictCost: "Your route costs {cost} m.",
	predictOptimal: "That is the cheapest possible route.",
	predictAbove: "The cheapest route costs {best} m — yours is {pct}% dearer.",
	predictOverlap: "{pct}% of your route lies on the path this algorithm found.",

	// Telemetry
	telemetry: "Run metrics",
	status: "Status",
	statuses: {
		idle: "Ready — sketch a prediction, then press Play",
		running: "Running…",
		paused: "Paused",
		done: "Path found",
		noPath: "No path exists",
		gaveUp: "Gave up after {n} expansions — not proof that no path exists",
	},
	expanded: "Nodes expanded",
	frontier: "Frontier size",
	pathCost: "Path cost",
	pathSteps: "Path steps",
	bestCost: "Cheapest possible",
	optimalYes: "optimal",
	optimalNo: "{pct}% above",
	threshold: "IDA* cost bound",
	metres: "m",
	scale: "Scale: 1 cell = {m} m. Diagonal steps cost √2 × the weight.",

	// Compare
	compareAll: "Compare all algorithms",
	compareTitle: "Same grid, every algorithm",
	compareCaption: "Cost in metres; the cheapest is {best} m.",
	colAlgo: "Algorithm",
	colExpanded: "Expanded",
	colCost: "Cost (m)",
	colOptimal: "Cheapest?",
	yes: "Yes",
	no: "No",
	none: "none",
	gaveUp: "gave up",

	// Legend
	legend: "Legend",
	legendStart: "Start (S)",
	legendEnd: "End (E)",
	legendWall: "Wall",
	legendWeight: "Mud — the number is its weight",
	legendOpen: "Frontier (open set), with a dot",
	legendClosed: "Expanded (closed set)",
	legendPath: "Path found (solid line)",
	legendPredicted: "Your predicted route (dashed line)",
	legendBwdOpen: "Backward frontier (bidirectional)",
	legendBwdClosed: "Backward expanded (bidirectional)",

	// Grid and keyboard
	canvasLabel:
		"Search grid, {rows} rows by {cols} columns. Arrow keys move the cursor; Enter applies the draw mode.",
	cursorAt: "Row {r}, column {c}: {what}",
	cellKinds: {
		empty: "open ground",
		wall: "wall",
		weight: "mud, weight {w}",
		start: "start",
		end: "end",
	},
	kbHint:
		"Drag to draw · right-drag erases · on the grid: arrows + Enter · Space play/pause · S step",

	// Sidebar — theory
	theory: "Theory",
	inGames: "In games",
	complexityLabel: "Time and space complexity",
	complexity: {
		bfs: {
			formula: "T: O(V + E)   S: O(V)",
			items: ["V — cells in the grid", "E — moves between neighbouring cells"],
		},
		dfs: {
			formula: "T: O(V + E)   S: O(V)",
			items: ["V — cells in the grid", "E — moves between neighbouring cells"],
		},
		dijkstra: {
			formula: "T: O((V + E) log V)   S: O(V)",
			items: ["V — cells", "log V — the binary-heap priority queue"],
		},
		astar: {
			formula: "T: O((V + E) log V)   S: O(V)",
			items: [
				"Worst case as Dijkstra; a good heuristic expands far fewer cells",
				"log V — the binary-heap priority queue",
			],
		},
		greedy: {
			formula: "T: O((V + E) log V)   S: O(V)",
			items: ["V — cells", "log V — the priority queue ordered by h alone"],
		},
		bibfs: {
			formula: "T: O(b^(d/2))   S: O(b^(d/2))",
			items: [
				"b — branching factor (4 or 8 here)",
				"d/2 — each frontier only searches half the depth",
			],
		},
		idastar: {
			formula: "T: O(b^d)   S: O(d)",
			items: [
				"b — branching factor; d — depth of the cheapest path",
				"S: O(d) — only the current path is stored, so cells are re-expanded every pass",
			],
		},
	},
	heuristicGuideTitle: "Choosing a heuristic",
	heuristicGuide: [
		{
			name: "Manhattan — |Δr| + |Δc|",
			body: "The true distance on an empty 4-direction grid. Overestimates with diagonals, so not admissible there.",
		},
		{
			name: "Octile",
			body: "The true distance on an empty 8-direction grid where a diagonal costs √2. The best choice with diagonals on.",
		},
		{
			name: "Chebyshev — max(|Δr|, |Δc|)",
			body: "Exact only if a diagonal cost 1. Here it costs √2, so Chebyshev underestimates: still admissible, but A* expands more.",
		},
		{
			name: "Euclidean — √(Δr² + Δc²)",
			body: "Straight-line distance. Always admissible on this grid, never tighter than Octile.",
		},
	],
	algoInfo: {
		bfs: {
			title: "Breadth-First Search",
			body: "BFS expands every cell one step away, then every cell two steps away, and so on, using a first-in, first-out queue. It finds the route with the fewest steps — which is the cheapest route only when every step costs the same. Add mud or allow diagonals and compare its cost with Dijkstra's.",
			props: [
				{
					label: "Cheapest route",
					value: "Only if every step costs the same",
					colour: "orange",
				},
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "None", colour: "orange" },
			],
			games: [
				{
					title: "Movement range",
					body: "Turn-based tactics games show which tiles a unit can reach in N moves: a BFS from the unit, stopped at depth N.",
				},
				{
					title: "Flood fill",
					body: 'The paint-bucket tool and "which rooms connect?" checks are BFS over neighbouring cells.',
				},
			],
		},
		dfs: {
			title: "Depth-First Search",
			body: "DFS follows one branch as far as it can before backing up, using a last-in, first-out stack. The route it returns depends on the order it tries neighbours, and is rarely the shortest. Its strength is visiting everything reachable with very little bookkeeping.",
			props: [
				{ label: "Cheapest route", value: "No", colour: "red" },
				{ label: "Complete", value: "Yes, on a finite grid", colour: "green" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "None", colour: "orange" },
			],
			games: [
				{
					title: "Maze generation",
					body: "The recursive backtracker — DFS with neighbours in random order — carves the Maze button's mazes.",
				},
				{
					title: "Connected regions",
					body: "Labelling which areas of a level connect lets an AI skip a search towards a region it can never reach.",
				},
			],
		},
		dijkstra: {
			title: "Dijkstra's Algorithm",
			body: "Dijkstra always expands the frontier cell with the lowest cost so far, g. Unlike BFS it pays attention to cost, so it walks around mud when that is cheaper. It is A* with h = 0: it spreads out evenly in every direction until it reaches the goal.",
			props: [
				{ label: "Cheapest route", value: "Yes", colour: "green" },
				{
					label: "Complete",
					value: "Yes, with non-negative weights",
					colour: "green",
				},
				{ label: "Weights", value: "Respected", colour: "green" },
				{ label: "Heuristic", value: "None (h = 0)", colour: "orange" },
			],
			games: [
				{
					title: "Terrain costs",
					body: "Strategy games give terrain a movement cost (forest 2, road 1). Dijkstra returns the cheapest route, not the shortest.",
				},
				{
					title: "Distance maps",
					body: 'One Dijkstra run from a point gives the cost to every cell. Roguelike developers call these "Dijkstra maps" and use them to drive many monsters at once.',
				},
			],
		},
		astar: {
			title: "A* Algorithm",
			body: "A* expands the frontier cell with the lowest f = g + h: the cost paid so far plus a heuristic guess of the cost still to go. With an admissible heuristic (one that never overestimates) it still finds the cheapest route, while expanding far fewer cells than Dijkstra.",
			props: [
				{
					label: "Cheapest route",
					value: "Yes, with an admissible h",
					colour: "green",
				},
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Respected", colour: "green" },
				{ label: "Heuristic", value: "g + h", colour: "blue" },
			],
			games: [
				{
					title: "Navigation meshes",
					body: "Game engines plan agent routes with A* over a navigation mesh, a graph of walkable polygons, rather than over a grid of cells.",
				},
				{
					title: "Tile grids",
					body: "On 8-direction tile grids, Octile is the usual heuristic, because it is the exact distance when nothing is in the way.",
				},
			],
		},
		greedy: {
			title: "Greedy Best-First Search",
			body: "Greedy expands the cell that looks closest to the goal, using h alone and ignoring the cost paid so far. It is fast in open space, but a wall between it and the goal can lead it into a dead end, and the route it returns can be far from the cheapest. Compare its expanded count and cost with A*'s.",
			props: [
				{ label: "Cheapest route", value: "No", colour: "red" },
				{
					label: "Complete",
					value: "Yes on a finite grid, as implemented here",
					colour: "green",
				},
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "h only", colour: "blue" },
			],
			games: [
				{
					title: "Good-enough routes",
					body: "Where a plausible route matters more than the cheapest one, a greedy search finishes sooner and expands fewer cells.",
				},
			],
		},
		bibfs: {
			title: "Bidirectional BFS",
			body: "Two breadth-first searches run at once, one from the start and one from the end, a level at a time. When they touch, the route is joined from both halves. On an open grid each frontier only needs half the depth, so far fewer cells are expanded. Like BFS, it counts steps, not cost.",
			props: [
				{
					label: "Cheapest route",
					value: "Only if every step costs the same",
					colour: "orange",
				},
				{ label: "Complete", value: "Yes", colour: "green" },
				{ label: "Weights", value: "Ignored", colour: "orange" },
				{ label: "Heuristic", value: "None", colour: "orange" },
			],
			games: [
				{
					title: "Route planning",
					body: "Planners on large road graphs search from both ends at once — the weighted version is bidirectional Dijkstra — to shrink the explored area.",
				},
			],
		},
		idastar: {
			title: "IDA* (Iterative Deepening A*)",
			body: "IDA* runs depth-first passes that stop wherever f = g + h exceeds a bound. The first bound is h(start); each pass raises it to the smallest f that went over. Only the current path is kept, so memory is tiny — but every pass re-expands the cells before it, which is why the count climbs so fast here.",
			props: [
				{
					label: "Cheapest route",
					value: "Yes, with an admissible h",
					colour: "green",
				},
				{
					label: "Complete",
					value: "Yes, given time; this tool stops at 50,000 expansions",
					colour: "orange",
				},
				{ label: "Weights", value: "Respected", colour: "green" },
				{
					label: "Memory",
					value: "O(d) — the current path only",
					colour: "purple",
				},
			],
			games: [
				{
					title: "Puzzle solvers",
					body: "Korf (1985) introduced IDA* and used it to find optimal solutions to random instances of the 15-puzzle, where A*'s open list would not fit in memory.",
				},
			],
		},
	},

	// Manual and glossary (the shared Glossary.svelte reads these keys)
	glossaryTitle: "Manual and glossary",
	glossaryClose: "Close",
	glossaryFooter:
		"Every cost in this tool is in metres; one cell is 1 m across.",
	glossGroups: {
		use: "Using the tool",
		search: "Search",
		cost: "Cost",
	},
	gloss: {
		manual: {
			title: "How to use this tool",
			body: "Pick an algorithm on the right. Sketch the route you expect from S to E with Predict route, then press Play or Step: the grid shows which cells the search expands, and the panel under the grid scores your route.\nEdit the grid with walls and mud, move S and E, or generate a scene, then press Compare all algorithms to see every search on the same grid.",
		},
		keys: {
			title: "Keyboard and mouse",
			body: "Drag on the grid to draw with the current mode; right-drag erases.\nWith the grid focused, the arrow keys move a cursor and Enter draws at it; the cursor's cell is read out. Space plays or pauses, S steps one expansion, R clears the search.",
		},
		predict: {
			title: "Predicting a route",
			body: "Predict route draws your guess as a dashed line, starting from S. When the search finishes, the tool checks that your route is legal — starts on S, ends on E, never jumps a cell or crosses a wall — then compares its cost with the cheapest possible, and says how much of it the algorithm's path shares.",
		},
		compare: {
			title: "Comparing algorithms",
			body: "Compare all algorithms runs every search on the grid as it is, without animating. It lists the cells each one expanded, the cost of the route it found, and whether that route is the cheapest — checked against Dijkstra, which is always optimal with non-negative costs.",
		},
		costs: {
			title: "Edge costs",
			body: "A move's cost is the weight of the cell it enters, times 1 for a straight step or √2 for a diagonal one. Show edge costs prints that weight in each cell's corner, and, as Dijkstra, A* or IDA* reach a cell, its g value in the centre.\nRandomise costs gives every open cell a weight from 1 to 9. With every move priced differently, the route with the fewest steps (BFS) and the cheapest route (Dijkstra, A*) come apart.",
		},
		open: {
			title: "Open set (frontier)",
			body: "Cells discovered but not yet expanded, drawn with a dot. BFS keeps them in a queue; Dijkstra and A* in a priority queue.",
		},
		closed: {
			title: "Closed set (expanded)",
			body: "Cells already expanded. With a consistent heuristic, Dijkstra and A* never need to expand one again.",
		},
		g: {
			title: "g(n)",
			body: "The cost in metres of the cheapest route found so far from the start to n. It can fall while n waits in the frontier, when a cheaper way in is found.",
		},
		h: {
			title: "h(n)",
			body: "A heuristic estimate, in metres, of the cost from n to the goal.",
		},
		f: {
			title: "f(n) = g(n) + h(n)",
			body: "A*'s priority: the cell with the lowest f is expanded next.",
		},
		admissible: {
			title: "Admissible heuristic",
			body: "One that never overestimates the true remaining cost. A* with an admissible h always returns the cheapest route.",
		},
		optimal: {
			title: "Cheapest (optimal)",
			body: "A route is optimal when no other route from S to E costs less.",
		},
		complete: {
			title: "Complete",
			body: "An algorithm is complete if it always finds a route when one exists.",
		},
		mud: {
			title: "Mud (cell weight)",
			body: "A cost multiplier for entering a cell. BFS, DFS, Greedy and Bidirectional BFS ignore it.",
		},
		metre: {
			title: "Metre",
			body: "This tool's unit of cost: one cell is 1 m across, so a straight step onto open ground costs 1 m and a diagonal step √2 ≈ 1.414 m.",
		},
	},

	// Attribution
	footerMadeWith: "Made with ❤️ for Swinburne",
	footerSubject: "Pathfinding",
	versionTitle: "Version: the date and time of this release",
	repository: "Repository",
};
