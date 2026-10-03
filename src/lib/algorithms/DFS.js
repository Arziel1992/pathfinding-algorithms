/**
 * @file DFS.js — Depth-First Search pathfinding algorithm.
 *
 * Explores as far as possible along each branch before backtracking.
 * Complete (will find a path if one exists), but NOT optimal —
 * the path returned is not necessarily shortest.
 *
 * Time  O(V + E)   Space  O(V)
 */

export const meta = {
	id: "dfs",
	weighted: false,
	heuristic: false,
	optimal: false,
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

	// Iterative DFS via explicit stack to allow generator yielding
	const stack = [{ r: start.r, c: start.c }];
	visited.add(K(start.r, start.c));

	while (stack.length > 0) {
		const cur = stack.pop();

		if (cur.r === end.r && cur.c === end.c) {
			yield { kind: "path", nodes: reconstruct(cameFrom, start, end) };
			return;
		}

		yield { kind: "close", r: cur.r, c: cur.c };

		// Push neighbours in reverse so natural order is explored first
		const nbs = grid.neighbors(cur.r, cur.c, diagonal);
		for (let i = nbs.length - 1; i >= 0; i--) {
			const nb = nbs[i];
			const k = K(nb.r, nb.c);
			if (visited.has(k)) continue;
			visited.add(k);
			cameFrom.set(k, { r: cur.r, c: cur.c });
			stack.push({ r: nb.r, c: nb.c });
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
