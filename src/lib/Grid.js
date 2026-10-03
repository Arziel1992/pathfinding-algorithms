/**
 * @file Grid.js — Pure grid model: walls, weights, neighbour enumeration.
 *
 * No Svelte reactivity. No DOM. Pure JS logic that the algorithm files consume.
 * The visual/reactive counterpart lives in App.svelte as a 2D $state array.
 */

/** 4-directional and 8-directional neighbour offsets. */
const DIRS_4 = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];
const DIRS_8 = [...DIRS_4, [-1, -1], [-1, 1], [1, -1], [1, 1]];

export class Grid {
	/**
	 * @param {number} rows
	 * @param {number} cols
	 */
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		/** @type {Set<number>} packed keys of wall cells */
		this._walls = new Set();
		/** @type {Map<number, number>} packed key → weight (1–9) */
		this._weights = new Map();
	}

	/** @param {number} r @param {number} c @returns {number} */
	static key(r, c) {
		return r * 10000 + c;
	}

	/** @returns {boolean} */
	inBounds(r, c) {
		return r >= 0 && r < this.rows && c >= 0 && c < this.cols;
	}

	/** @returns {boolean} */
	isWall(r, c) {
		return this._walls.has(Grid.key(r, c));
	}

	/**
	 * @param {number} r
	 * @param {number} c
	 * @param {boolean} [on=true]
	 */
	setWall(r, c, on = true) {
		const k = Grid.key(r, c);
		if (on) {
			this._walls.add(k);
			this._weights.delete(k); // walls cannot have weights
		} else {
			this._walls.delete(k);
		}
	}

	/** @returns {number} movement cost (1 for unweighted cells) */
	weight(r, c) {
		return this._weights.get(Grid.key(r, c)) ?? 1;
	}

	/**
	 * @param {number} r
	 * @param {number} c
	 * @param {number} w  weight in [2,9]; pass 1 to remove weight
	 */
	setWeight(r, c, w) {
		const k = Grid.key(r, c);
		if (w <= 1) {
			this._weights.delete(k);
		} else {
			this._weights.set(k, w);
			this._walls.delete(k); // weighted cells are walkable
		}
	}

	/**
	 * Returns walkable neighbours of (r, c).
	 * @param {number} r
	 * @param {number} c
	 * @param {boolean} [diagonal=false]
	 * @returns {Array<{r:number, c:number, cost:number}>}
	 */
	neighbors(r, c, diagonal = false) {
		const dirs = diagonal ? DIRS_8 : DIRS_4;
		const result = [];
		for (const [dr, dc] of dirs) {
			const nr = r + dr;
			const nc = c + dc;
			if (!this.inBounds(nr, nc) || this.isWall(nr, nc)) continue;
			// Diagonal cost: sqrt(2) * weight
			const isDiag = dr !== 0 && dc !== 0;
			const w = this.weight(nr, nc);
			result.push({ r: nr, c: nc, cost: isDiag ? Math.SQRT2 * w : w });
		}
		return result;
	}

	/** Remove all walls and weights. */
	clearAll() {
		this._walls.clear();
		this._weights.clear();
	}

	/** Remove only walls (keep weights). */
	clearWalls() {
		this._walls.clear();
	}

	/** Remove only weights (keep walls). */
	clearWeights() {
		this._weights.clear();
	}

	/** @returns {boolean} */
	hasWeight(r, c) {
		return this._weights.has(Grid.key(r, c));
	}
}
