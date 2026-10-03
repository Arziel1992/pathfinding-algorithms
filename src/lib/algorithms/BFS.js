/**
 * @file BFS.js — Breadth-First Search pathfinding algorithm.
 *
 * Explores all neighbours at the current depth before moving deeper.
 * Guarantees the shortest path in terms of number of edges (unweighted).
 * Does not use a heuristic; ignores cell weights.
 *
 * Time  O(V + E)   Space  O(V)
 */

export const meta = {
	id: "bfs",
	weighted: false,
	heuristic: false,
	optimal: true,
	complete: true,
	timeComplexity: "O(V + E)",
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
	const cameFrom = new Map();
	const visited = new Set();
	const queue = [{ r: start.r, c: start.c }];

	visited.add(K(start.r, start.c));

	while (queue.length > 0) {
		const cur = queue.shift();

		if (cur.r === end.r && cur.c === end.c) {
			yield { kind: "path", nodes: reconstruct(cameFrom, start, end) };
			return;
		}

		yield { kind: "close", r: cur.r, c: cur.c };

		for (const nb of grid.neighbors(cur.r, cur.c, diagonal)) {
			const k = K(nb.r, nb.c);
			if (visited.has(k)) continue;
			visited.add(k);
			cameFrom.set(k, { r: cur.r, c: cur.c });
			queue.push({ r: nb.r, c: nb.c });
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
