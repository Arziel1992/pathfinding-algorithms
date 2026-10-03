/**
 * @file BidirectionalBFS.js — Bidirectional Breadth-First Search.
 *
 * Runs two simultaneous BFS frontiers: one from the start, one from the goal.
 * Terminates when the frontiers meet. In open grids this can cut the search
 * space roughly in half compared to standard BFS.
 * Optimal for unweighted graphs. The meeting cells are coloured distinctly.
 *
 * Time  O(b^(d/2)) vs O(b^d) for single-directional BFS   Space  O(b^(d/2))
 */

export const meta = {
	id: "bibfs",
	weighted: false,
	heuristic: false,
	optimal: true,
	complete: true,
	timeComplexity: "O(b^(d/2))",
	spaceComplexity: "O(b^(d/2))",
};

/**
 * @param {import('../Grid.js').Grid} grid
 * @param {{r:number,c:number}} start
 * @param {{r:number,c:number}} end
 * @param {{diagonal:boolean}} options
 * @yields {{ kind: string, r?: number, c?: number, nodes?: Array<{r,c}>, side?: string }}
 */
export function* run(grid, start, end, { diagonal = false } = {}) {
	const K = (r, c) => r * 10000 + c;

	const visitedFwd = new Map(); // key -> {r,c} parent
	const visitedBwd = new Map();

	visitedFwd.set(K(start.r, start.c), null);
	visitedBwd.set(K(end.r, end.c), null);

	let queueFwd = [{ r: start.r, c: start.c }];
	let queueBwd = [{ r: end.r, c: end.c }];

	while (queueFwd.length > 0 || queueBwd.length > 0) {
		// Advance forward frontier one level
		if (queueFwd.length > 0) {
			const nextFwd = [];
			for (const cur of queueFwd) {
				yield { kind: "close", r: cur.r, c: cur.c, side: "fwd" };
				for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
					const nk = K(nb.r, nb.c);
					if (visitedFwd.has(nk)) continue;
					visitedFwd.set(nk, { r: cur.r, c: cur.c });
					yield { kind: "open", r: nb.r, c: nb.c, side: "fwd" };
					if (visitedBwd.has(nk)) {
						yield {
							kind: "path",
							nodes: buildPath(visitedFwd, visitedBwd, nb),
						};
						return;
					}
					nextFwd.push({ r: nb.r, c: nb.c });
				}
			}
			queueFwd = nextFwd;
		}

		// Advance backward frontier one level
		if (queueBwd.length > 0) {
			const nextBwd = [];
			for (const cur of queueBwd) {
				yield { kind: "close", r: cur.r, c: cur.c, side: "bwd" };
				for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
					const nk = K(nb.r, nb.c);
					if (visitedBwd.has(nk)) continue;
					visitedBwd.set(nk, { r: cur.r, c: cur.c });
					yield { kind: "open", r: nb.r, c: nb.c, side: "bwd" };
					if (visitedFwd.has(nk)) {
						yield {
							kind: "path",
							nodes: buildPath(visitedFwd, visitedBwd, nb),
						};
						return;
					}
					nextBwd.push({ r: nb.r, c: nb.c });
				}
			}
			queueBwd = nextBwd;
		}
	}

	yield { kind: "fail" };
}

/**
 * Stitch two came-from maps at the meeting node into a single path.
 */
function buildPath(fwd, bwd, meeting) {
	const K = (r, c) => r * 10000 + c;

	// Forward half: start → meeting
	const fwdPath = [];
	let cur = { r: meeting.r, c: meeting.c };
	while (cur !== null) {
		fwdPath.unshift(cur);
		cur = fwd.get(K(cur.r, cur.c));
	}

	// Backward half: meeting → end
	const bwdPath = [];
	cur = bwd.get(K(meeting.r, meeting.c));
	while (cur !== null) {
		bwdPath.push(cur);
		cur = bwd.get(K(cur.r, cur.c));
	}

	return [...fwdPath, ...bwdPath];
}
