/**
 * @file IDAStar.js — Iterative Deepening A* (IDA*).
 *
 * Performs iterative depth-first searches, each bounded by a cost threshold.
 * The threshold starts at h(start) and is raised to the lowest f-value that
 * exceeded the previous threshold. Uses O(d) memory (only the current path).
 *
 * Optimal with an admissible heuristic. Slower than A* on grids (many revisits),
 * but memory-efficient and teaches the trade-off between time and space.
 *
 * Time  O(b^d)   Space  O(d)   — d = depth, b = branching factor
 */

import { heuristics } from "../Heuristics.js";

export const meta = {
	id: "idastar",
	weighted: true,
	heuristic: true,
	optimal: true,
	complete: true,
	timeComplexity: "O(b^d)",
	spaceComplexity: "O(d)",
};

const FOUND = Symbol("FOUND");
const MAX_ITERATIONS = 50_000; // safety cap for dense grids

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

	let threshold = h(start.r, start.c, end.r, end.c);
	const pathSet = new Set();
	pathSet.add(K(start.r, start.c));
	const pathList = [{ r: start.r, c: start.c }];

	let iterations = 0;

	while (true) {
		const result = yield* search(
			grid,
			start,
			end,
			0,
			threshold,
			pathSet,
			pathList,
			K,
			h,
			diagonal,
			() => {
				iterations++;
				return iterations < MAX_ITERATIONS;
			},
		);

		if (result === FOUND) return;
		if (result === Infinity) {
			yield { kind: "fail" };
			return;
		}
		if (iterations >= MAX_ITERATIONS) {
			yield { kind: "fail" };
			return;
		}

		threshold = result;
		pathSet.clear();
		pathSet.add(K(start.r, start.c));
		pathList.length = 0;
		pathList.push({ r: start.r, c: start.c });
	}
}

function* search(
	grid,
	cur,
	end,
	g,
	threshold,
	pathSet,
	pathList,
	K,
	h,
	diagonal,
	tick,
) {
	const f = g + h(cur.r, cur.c, end.r, end.c);

	if (f > threshold) return f;
	if (!tick()) return Infinity;

	yield { kind: "close", r: cur.r, c: cur.c };

	if (cur.r === end.r && cur.c === end.c) {
		yield { kind: "path", nodes: pathList.map((p) => ({ r: p.r, c: p.c })) };
		return FOUND;
	}

	let minExceeded = Infinity;

	for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
		const nk = K(nb.r, nb.c);
		if (pathSet.has(nk)) continue;

		pathSet.add(nk);
		pathList.push({ r: nb.r, c: nb.c });
		yield { kind: "open", r: nb.r, c: nb.c };

		const t = yield* search(
			grid,
			{ r: nb.r, c: nb.c },
			end,
			g + nb.cost,
			threshold,
			pathSet,
			pathList,
			K,
			h,
			diagonal,
			tick,
		);

		if (t === FOUND) return FOUND;
		if (t < minExceeded) minExceeded = t;

		pathSet.delete(nk);
		pathList.pop();
	}

	return minExceeded;
}
