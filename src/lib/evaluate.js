/**
 * @file evaluate.js — Scoring a route, running a search to the end, and
 * comparing every algorithm on the same grid. Pure JS, no DOM, so the
 * self-check runs it under plain Node.
 *
 * ONE METRE IS THE UNIT (workspace rule). One grid cell is CELL_METRES wide;
 * every cost this file returns is in metres. A straight step costs one cell
 * times the weight of the cell entered, a diagonal step √2 times that.
 */

export const CELL_METRES = 1;

const same = (a, b) => a.r === b.r && a.c === b.c;

/** True when b is one legal move from a. */
export function adjacent(a, b, diagonal) {
	const dr = Math.abs(a.r - b.r);
	const dc = Math.abs(a.c - b.c);
	if (dr > 1 || dc > 1 || dr + dc === 0) return false;
	return diagonal || dr + dc === 1;
}

/** Cost in metres of stepping from a into the neighbouring cell b. */
export function stepCost(grid, a, b) {
	const diag = a.r !== b.r && a.c !== b.c;
	return (diag ? Math.SQRT2 : 1) * grid.weight(b.r, b.c) * CELL_METRES;
}

/** Cost in metres of a path, assumed already legal. */
export function pathCost(grid, path) {
	let total = 0;
	for (let i = 1; i < path.length; i++)
		total += stepCost(grid, path[i - 1], path[i]);
	return total;
}

/**
 * Check a learner's route. `reason` names the first problem, or is null.
 * @returns {{valid:boolean, reason:null|'empty'|'start'|'end'|'wall'|'gap', at?:{r:number,c:number}, cost:number}}
 */
export function checkPath(grid, path, start, end, diagonal) {
	if (path.length < 2) return { valid: false, reason: "empty", cost: 0 };
	if (!same(path[0], start))
		return { valid: false, reason: "start", at: path[0], cost: 0 };
	for (let i = 1; i < path.length; i++) {
		if (grid.isWall(path[i].r, path[i].c))
			return { valid: false, reason: "wall", at: path[i], cost: 0 };
		if (!adjacent(path[i - 1], path[i], diagonal))
			return { valid: false, reason: "gap", at: path[i], cost: 0 };
	}
	if (!same(path.at(-1), end))
		return { valid: false, reason: "end", at: path.at(-1), cost: 0 };
	return { valid: true, reason: null, cost: pathCost(grid, path) };
}

/**
 * The cells a pointer passes over from a to b, a excluded, so a fast drag
 * still leaves a connected route. Steps diagonally only when allowed.
 */
export function connect(a, b, diagonal) {
	const out = [];
	let { r, c } = a;
	while (r !== b.r || c !== b.c) {
		const dr = Math.sign(b.r - r);
		const dc = Math.sign(b.c - c);
		if (diagonal || dr === 0 || dc === 0) {
			r += dr;
			c += dc;
		} else if (Math.abs(b.r - r) >= Math.abs(b.c - c)) {
			r += dr;
		} else {
			c += dc;
		}
		out.push({ r, c });
	}
	return out;
}

/** Fraction of the cells of `b` that also lie on `a`. */
export function overlap(a, b) {
	if (!b.length) return 0;
	const keys = new Set(a.map((p) => `${p.r},${p.c}`));
	return b.filter((p) => keys.has(`${p.r},${p.c}`)).length / b.length;
}

/**
 * Manhattan distance overestimates once diagonal moves exist (one diagonal
 * step of √2 m is counted as 2 m), so A* and IDA* may then return a longer
 * path. Every other pairing here is a lower bound, because no cell weighs
 * less than 1.
 */
export const admissible = (heuristic, diagonal) =>
	!(diagonal && heuristic === "manhattan");

/** Run a search generator to the end without animating it. */
export function runToEnd(mod, grid, start, end, options) {
	let expanded = 0;
	let path = [];
	let gaveUp = false;
	for (const step of mod.run(grid, start, end, options)) {
		if (step.kind === "close") expanded++;
		else if (step.kind === "path") path = step.nodes;
		else if (step.kind === "fail" && step.reason === "limit") gaveUp = true;
	}
	return {
		expanded,
		path,
		gaveUp,
		cost: path.length ? pathCost(grid, path) : null,
	};
}

/** Equal to within floating-point noise from summing √2 many times. */
export const sameCost = (a, b) =>
	a !== null && b !== null && Math.abs(a - b) < 1e-6;

/**
 * Every algorithm on the current grid. Dijkstra's cost is the reference
 * optimum: it is exact for non-negative weights whatever the heuristic.
 */
export function compareAll(algorithms, order, grid, start, end, options) {
	const best = runToEnd(algorithms.dijkstra, grid, start, end, options).cost;
	return {
		best,
		rows: order.map((id) => {
			const r = runToEnd(algorithms[id], grid, start, end, options);
			return { id, ...r, optimal: sameCost(r.cost, best) };
		}),
	};
}
