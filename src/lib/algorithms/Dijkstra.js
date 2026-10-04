/**
 * @file Dijkstra.js — Dijkstra's shortest-path algorithm.
 *
 * Expands the node with the lowest accumulated cost from the start.
 * Guaranteed optimal for non-negative edge weights. Respects cell weights.
 * Equivalent to A* with a zero heuristic (h = 0).
 *
 * Time  O((V + E) log V)   Space  O(V)
 */

import { MinHeap } from "../MinHeap.js";

export const meta = {
	id: "dijkstra",
	weighted: true,
	heuristic: false,
	optimal: true,
	complete: true,
	timeComplexity: "O((V + E) log V)",
	spaceComplexity: "O(V)",
};

/**
 * @param {import('../Grid.js').Grid} grid
 * @param {{r:number,c:number}} start
 * @param {{r:number,c:number}} end
 * @param {{diagonal:boolean}} options
 * @yields {{ kind: string, r?: number, c?: number, nodes?: Array<{r,c}> }}
 */
export function* run(grid, start, end, { diagonal = false } = {}) {
	const K = (r, c) => r * 10000 + c;
	const dist = new Map();
	const cameFrom = new Map();
	const heap = new MinHeap((a, b) => a.g - b.g);

	const sk = K(start.r, start.c);
	dist.set(sk, 0);
	heap.push({ r: start.r, c: start.c, g: 0 });

	while (heap.size > 0) {
		const cur = heap.pop();
		const ck = K(cur.r, cur.c);

		// Skip stale heap entries
		if (cur.g > (dist.get(ck) ?? Infinity)) continue;

		if (cur.r === end.r && cur.c === end.c) {
			yield { kind: "path", nodes: reconstruct(cameFrom, start, end) };
			return;
		}

		yield { kind: "close", r: cur.r, c: cur.c, g: cur.g };

		for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
			const nk = K(nb.r, nb.c);
			const ng = cur.g + nb.cost;
			if (ng < (dist.get(nk) ?? Infinity)) {
				dist.set(nk, ng);
				cameFrom.set(nk, { r: cur.r, c: cur.c });
				heap.push({ r: nb.r, c: nb.c, g: ng });
				yield { kind: "open", r: nb.r, c: nb.c, g: ng };
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
