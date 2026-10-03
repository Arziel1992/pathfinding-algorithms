/**
 * @file Heuristics.js — Admissible distance heuristics for A* and Greedy BFS.
 *
 * Each function estimates the cost from (r, c) to (er, ec).
 * All three are admissible (never overestimate) for 4-directional movement
 * with unit costs. For diagonal movement, use Chebyshev or Octile.
 */

export const heuristics = {
	/**
	 * Manhattan distance — exact for 4-directional unit-cost grids.
	 * @type {(r:number, c:number, er:number, ec:number) => number}
	 */
	manhattan: (r, c, er, ec) => Math.abs(r - er) + Math.abs(c - ec),

	/**
	 * Euclidean distance — admissible but not tight; useful for diagonal.
	 * @type {(r:number, c:number, er:number, ec:number) => number}
	 */
	euclidean: (r, c, er, ec) => Math.hypot(r - er, c - ec),

	/**
	 * Chebyshev distance — exact for 8-directional unit-cost grids.
	 * max(|dr|, |dc|)
	 * @type {(r:number, c:number, er:number, ec:number) => number}
	 */
	chebyshev: (r, c, er, ec) => Math.max(Math.abs(r - er), Math.abs(c - ec)),

	/**
	 * Octile distance — exact for 8-directional grids where diagonals cost √2.
	 * D * (|dr| + |dc|) + (√2 − 2D) * min(|dr|, |dc|)  where D = 1
	 * @type {(r:number, c:number, er:number, ec:number) => number}
	 */
	octile: (r, c, er, ec) => {
		const dr = Math.abs(r - er);
		const dc = Math.abs(c - ec);
		return Math.max(dr, dc) + (Math.SQRT2 - 1) * Math.min(dr, dc);
	},
};

/** @type {string[]} ordered list for the selector */
export const HEURISTIC_ORDER = [
	"manhattan",
	"euclidean",
	"chebyshev",
	"octile",
];
