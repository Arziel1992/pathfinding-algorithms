/**
 * @file index.js — Algorithm registry.
 *
 * Add a new algorithm here and it appears automatically in the UI.
 * Each entry must match the AlgorithmModule interface:
 *   { meta: AlgoMeta, run: GeneratorFunction }
 */

import * as AStar from "./AStar.js";
import * as BFS from "./BFS.js";
import * as BiBFS from "./BidirectionalBFS.js";
import * as DFS from "./DFS.js";
import * as Dijkstra from "./Dijkstra.js";
import * as Greedy from "./GreedyBestFirst.js";
import * as IDAStar from "./IDAStar.js";

/** @type {Record<string, {meta: object, run: GeneratorFunction}>} */
const ALGORITHMS = {
	bfs: BFS,
	dfs: DFS,
	dijkstra: Dijkstra,
	astar: AStar,
	greedy: Greedy,
	bibfs: BiBFS,
	idastar: IDAStar,
};

export default ALGORITHMS;

/** Ordered list for the selector (same order as above). */
export const ALGORITHM_ORDER = [
	"bfs",
	"dfs",
	"dijkstra",
	"astar",
	"greedy",
	"bibfs",
	"idastar",
];
