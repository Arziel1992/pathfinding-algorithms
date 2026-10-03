/**
 * @file AStar.js — A* (A-star) heuristic pathfinding algorithm.
 *
 * Combines Dijkstra's cost-so-far (g) with a heuristic estimate to goal (h).
 * f = g + h. Guaranteed optimal when h is admissible (never overestimates).
 * The most widely used pathfinding algorithm in games.
 *
 * Time  O((V + E) log V)   Space  O(V)
 */

import { heuristics } from "../Heuristics.js";
import { MinHeap } from "../MinHeap.js";

export const meta = {
	id: "astar",
	weighted: true,
	heuristic: true,
	optimal: true,
	complete: true,
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

	const gScore = new Map();
	const fScore = new Map();
	const cameFrom = new Map();
	const closed = new Set();
	const heap = new MinHeap((a, b) => a.f - b.f);

	const sk = K(start.r, start.c);
	const startH = h(start.r, start.c, end.r, end.c);
	gScore.set(sk, 0);
	fScore.set(sk, startH);
	heap.push({ r: start.r, c: start.c, f: startH });

	while (heap.size > 0) {
		const cur = heap.pop();
		const ck = K(cur.r, cur.c);

		if (closed.has(ck)) continue;
		closed.add(ck);

		if (cur.r === end.r && cur.c === end.c) {
			yield { kind: "path", nodes: reconstruct(cameFrom, start, end) };
			return;
		}

		yield { kind: "close", r: cur.r, c: cur.c };

		for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
			const nk = K(nb.r, nb.c);
			if (closed.has(nk)) continue;

			const tentativeG = (gScore.get(ck) ?? Infinity) + nb.cost;
			if (tentativeG < (gScore.get(nk) ?? Infinity)) {
				cameFrom.set(nk, { r: cur.r, c: cur.c });
				gScore.set(nk, tentativeG);
				const f = tentativeG + h(nb.r, nb.c, end.r, end.c);
				fScore.set(nk, f);
				heap.push({ r: nb.r, c: nb.c, f });
				yield { kind: "open", r: nb.r, c: nb.c };
			}
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
