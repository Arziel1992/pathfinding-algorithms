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
// ponytail: a fixed expansion cap keeps an animated run finite; weighted grids
// have many distinct f-values, so IDA* can need more. Raise it, or add a
// transposition table, if a scene genuinely needs IDA* to finish there.
export const MAX_ITERATIONS = 50_000;

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
	{ diagonal = false, heuristic = "manhattan", limit = MAX_ITERATIONS } = {},
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
				return iterations < limit;
			},
		);

		if (result === FOUND) return;
		// The cap is checked first: hitting it also unwinds as Infinity, and
		// reporting that as "no path" told learners a reachable goal was
		// unreachable. Giving up is its own outcome.
		if (iterations >= limit) {
			yield { kind: "fail", reason: "limit", limit };
			return;
		}
		if (result === Infinity) {
			yield { kind: "fail" };
			return;
		}

		threshold = result;
		// Each pass starts from scratch; the view clears so the deeper bound
		// is visible, and the re-expansion is the cost IDA* pays for O(d) memory.
		yield { kind: "iteration", threshold };
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

	yield { kind: "close", r: cur.r, c: cur.c, g };

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
		yield { kind: "open", r: nb.r, c: nb.c, g: g + nb.cost };

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
