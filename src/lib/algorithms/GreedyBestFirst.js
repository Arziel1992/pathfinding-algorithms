/**
 * @file GreedyBestFirst.js — Greedy Best-First Search.
 *
 * Expands the node that appears closest to the goal based on h(n) alone.
 * Very fast in open spaces, but NOT optimal — may find a longer path.
 * Not complete in infinite graphs (can follow the heuristic into a dead end).
 * Use as a baseline to show why A* is needed.
 *
 * Time  O((V + E) log V)   Space  O(V)
 */

import { heuristics } from "../Heuristics.js";
import { MinHeap } from "../MinHeap.js";

export const meta = {
	id: "greedy",
	weighted: false,
	heuristic: true,
	optimal: false,
	complete: false,
	timeComplexity: "O((V + E) log V)",
	spaceComplexity: "O(V)",
};

/**
 * @param {import('../Grid.js').Grid} grid
 * @param {{r:number,c:number}} start
 * @param {{r:number,c:number}} end
 * @param {{diagonal:boolean, heuristic:string}} options
 * @yields {{ kind: string, r?: number, c?: number, nodes?: Array<{r,c}> }}
 */
export function* run(
	grid,
	start,
	end,
	{ diagonal = false, heuristic = "manhattan" } = {},
) {
	const K = (r, c) => r * 10000 + c;
	const h = heuristics[heuristic] ?? heuristics.manhattan;

	const visited = new Set();
	const cameFrom = new Map();
	const heap = new MinHeap((a, b) => a.h - b.h);

	visited.add(K(start.r, start.c));
	heap.push({ r: start.r, c: start.c, h: h(start.r, start.c, end.r, end.c) });

	while (heap.size > 0) {
		const cur = heap.pop();

		if (cur.r === end.r && cur.c === end.c) {
			yield { kind: "path", nodes: reconstruct(cameFrom, start, end) };
			return;
		}

		yield { kind: "close", r: cur.r, c: cur.c };

		for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
			const nk = K(nb.r, nb.c);
			if (visited.has(nk)) continue;
			visited.add(nk);
			cameFrom.set(nk, { r: cur.r, c: cur.c });
			heap.push({ r: nb.r, c: nb.c, h: h(nb.r, nb.c, end.r, end.c) });
			yield { kind: "open", r: nb.r, c: nb.c };
		}
	}

	yield { kind: "fail" };
}

function reconstruct(cameFrom, start, end) {
	const K = (r, c) => r * 10000 + c;
	const path = [];
	let cur = { r: end.r, c: end.c };
	while (!(cur.r === start.r && cur.c === start.c)) {
		path.unshift(cur);
		cur = cameFrom.get(K(cur.r, cur.c));
		if (!cur) return [];
	}
	path.unshift(start);
	return path;
}
