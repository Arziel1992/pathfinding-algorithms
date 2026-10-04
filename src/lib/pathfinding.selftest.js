/**
 * Runnable self-check for the pure logic: the searches, route scoring and the
 * i18n lookup.
 *
 *   pnpm run selftest            (Node, exits non-zero on failure)
 *   open the tool with ?selftest (browser, prints a console table)
 *
 * VERIFIED IN BOTH DIRECTIONS (global §15): each check has a case it must
 * catch beside the nearest case it must pass.
 *
 * THE REFERENCE IS INDEPENDENT. Costs are checked against Bellman-Ford
 * relaxation written here, which shares no code with the searches, and hop
 * counts against a plain BFS written here.
 */

import ALGORITHMS, { ALGORITHM_ORDER } from "./algorithms/index.js";
import {
	admissible,
	CELL_METRES,
	checkPath,
	compareAll,
	connect,
	runToEnd,
	sameCost,
	stepCost,
} from "./evaluate.js";
import { Grid } from "./Grid.js";
import { HEURISTIC_ORDER } from "./Heuristics.js";
import en from "./i18n/en.js";
import es from "./i18n/es.js";
import { missingKeys, withFallback } from "./i18n/merge.js";

/* A seeded generator, so a failure names a grid that can be rebuilt. */
function rng(seed) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

function randomGrid(seed, rows = 9, cols = 13) {
	const rand = rng(seed);
	const g = new Grid(rows, cols);
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const x = rand();
			if (x < 0.25) g.setWall(r, c, true);
			else if (x < 0.4) g.setWeight(r, c, 2 + Math.floor(rand() * 8));
		}
	const start = { r: 0, c: 0 };
	const end = { r: rows - 1, c: cols - 1 };
	g.setWall(0, 0, false);
	g.setWall(rows - 1, cols - 1, false);
	return { g, start, end };
}

/* Reference optimum: Bellman-Ford over every cell. */
function bellmanFord(g, start, end, diagonal) {
	const key = (r, c) => r * g.cols + c;
	const dist = new Array(g.rows * g.cols).fill(Infinity);
	dist[key(start.r, start.c)] = 0;
	for (let pass = 0; pass < g.rows * g.cols; pass++) {
		let changed = false;
		for (let r = 0; r < g.rows; r++)
			for (let c = 0; c < g.cols; c++) {
				const d = dist[key(r, c)];
				if (d === Infinity || g.isWall(r, c)) continue;
				for (let dr = -1; dr <= 1; dr++)
					for (let dc = -1; dc <= 1; dc++) {
						if (!dr && !dc) continue;
						if (!diagonal && dr && dc) continue;
						const nr = r + dr;
						const nc = c + dc;
						if (!g.inBounds(nr, nc) || g.isWall(nr, nc)) continue;
						const w = (dr && dc ? Math.SQRT2 : 1) * g.weight(nr, nc);
						if (d + w < dist[key(nr, nc)] - 1e-12) {
							dist[key(nr, nc)] = d + w;
							changed = true;
						}
					}
			}
		if (!changed) break;
	}
	const best = dist[key(end.r, end.c)];
	return best === Infinity ? null : best * CELL_METRES;
}

/* Reference hop count: a plain BFS. */
function hops(g, start, end, diagonal) {
	const seen = new Map([[`${start.r},${start.c}`, 0]]);
	const queue = [start];
	while (queue.length) {
		const cur = queue.shift();
		const d = seen.get(`${cur.r},${cur.c}`);
		if (cur.r === end.r && cur.c === end.c) return d;
		for (const n of g.neighbors(cur.r, cur.c, diagonal)) {
			const k = `${n.r},${n.c}`;
			if (!seen.has(k)) {
				seen.set(k, d + 1);
				queue.push(n);
			}
		}
	}
	return null;
}

const results = [];
function check(name, ok) {
	results.push({ name, pass: Boolean(ok) });
}

export function run() {
	results.length = 0;
	const SEEDS = 60;

	for (const diagonal of [false, true]) {
		const tag = diagonal ? "8-dir" : "4-dir";
		let dijkstraOk = true;
		let astarOk = true;
		let bfsHopsOk = true;
		let bibfsHopsOk = true;
		let pathsLegal = true;
		let failsAgree = true;
		let idaFinished = 0;
		let idaGaveUp = 0;
		for (let seed = 1; seed <= SEEDS; seed++) {
			const { g, start, end } = randomGrid(seed);
			const best = bellmanFord(g, start, end, diagonal);
			const minHops = hops(g, start, end, diagonal);
			const opts = { diagonal, heuristic: "octile" };
			const dij = runToEnd(ALGORITHMS.dijkstra, g, start, end, opts);
			if (!(best === null ? dij.cost === null : sameCost(dij.cost, best)))
				dijkstraOk = false;
			for (const h of HEURISTIC_ORDER) {
				if (!admissible(h, diagonal)) continue;
				const r = runToEnd(ALGORITHMS.astar, g, start, end, {
					diagonal,
					heuristic: h,
				});
				if (!(best === null ? r.cost === null : sameCost(r.cost, best)))
					astarOk = false;
			}
			// IDA* re-expands every pass, so it is checked on a smaller grid
			// from the same seed; on this one it is too slow to run 120 times in
			// a browser. Giving up at the cap is "not checked", never "no path"
			// (global §15.3).
			{
				const small = randomGrid(seed, 6, 8);
				const smallBest = bellmanFord(
					small.g,
					small.start,
					small.end,
					diagonal,
				);
				for (const h of ["octile", "euclidean"]) {
					const r = runToEnd(
						ALGORITHMS.idastar,
						small.g,
						small.start,
						small.end,
						{ diagonal, heuristic: h, limit: 4000 },
					);
					if (r.gaveUp) {
						idaGaveUp++;
						continue;
					}
					idaFinished++;
					if (
						!(smallBest === null
							? r.cost === null
							: sameCost(r.cost, smallBest))
					)
						astarOk = false;
					if (smallBest !== null && !r.path.length) failsAgree = false;
				}
			}
			const bfs = runToEnd(ALGORITHMS.bfs, g, start, end, opts);
			const bibfs = runToEnd(ALGORITHMS.bibfs, g, start, end, opts);
			if (minHops !== null && bfs.path.length - 1 !== minHops)
				bfsHopsOk = false;
			if (minHops !== null && bibfs.path.length - 1 !== minHops)
				bibfsHopsOk = false;
			for (const id of ALGORITHM_ORDER) {
				if (id === "idastar") continue; // covered on the small grid above
				const r = runToEnd(ALGORITHMS[id], g, start, end, opts);
				if (best === null && r.path.length) failsAgree = false;
				if (best !== null && !r.path.length) failsAgree = false;
				if (r.path.length && !checkPath(g, r.path, start, end, diagonal).valid)
					pathsLegal = false;
			}
		}
		check(`${tag}: Dijkstra cost = Bellman-Ford on ${SEEDS} grids`, dijkstraOk);
		check(
			`${tag}: A* and IDA* optimal with every admissible heuristic (IDA* finished ${idaFinished}, gave up ${idaGaveUp}, not checked)`,
			astarOk && idaFinished > 0,
		);
		check(`${tag}: BFS hop count = reference BFS`, bfsHopsOk);
		check(`${tag}: bidirectional BFS hop count = reference BFS`, bibfsHopsOk);
		check(`${tag}: every returned path is a legal route S to E`, pathsLegal);
		check(
			`${tag}: every complete search finds a path exactly when one exists`,
			failsAgree,
		);
	}

	// Negative control for the optimality check: the admissibility flag fires
	// for Manhattan with diagonals and only for it, and the cost comparison
	// tells a dearer path from the optimum.
	{
		const g = new Grid(7, 7);
		const s = { r: 0, c: 0 };
		const e = { r: 6, c: 6 };
		const best = bellmanFord(g, s, e, true);
		const fast = runToEnd(ALGORITHMS.astar, g, s, e, {
			diagonal: true,
			heuristic: "manhattan",
		});
		check(
			"Manhattan + diagonal is flagged inadmissible",
			!admissible("manhattan", true),
		);
		check(
			"Manhattan + 4-dir is admissible (nearest legitimate case)",
			admissible("manhattan", false),
		);
		check(
			"sameCost tells a longer path from the optimum",
			!sameCost(best + 1, best) && sameCost(best, best),
		);
		check(
			"compareAll marks optimal rows against Dijkstra",
			(() => {
				const cmp = compareAll(ALGORITHMS, ALGORITHM_ORDER, g, s, e, {
					diagonal: true,
					heuristic: "octile",
				});
				return (
					sameCost(cmp.best, best) &&
					cmp.rows.find((r) => r.id === "dijkstra").optimal
				);
			})(),
		);
		check(
			"A* still returns a legal path when h overestimates",
			checkPath(g, fast.path, s, e, true).valid,
		);
	}

	// Route scoring, both ways.
	{
		const g = new Grid(3, 4);
		g.setWall(1, 1, true);
		g.setWeight(0, 2, 5);
		const s = { r: 0, c: 0 };
		const e = { r: 0, c: 3 };
		const good = [s, { r: 0, c: 1 }, { r: 0, c: 2 }, e];
		check(
			"a legal route is valid and costs 1 + 5 + 1 m",
			(() => {
				const r = checkPath(g, good, s, e, false);
				return r.valid && sameCost(r.cost, 7 * CELL_METRES);
			})(),
		);
		check(
			"a route through a wall is rejected as 'wall'",
			checkPath(
				g,
				[s, { r: 1, c: 0 }, { r: 1, c: 1 }],
				s,
				{ r: 1, c: 1 },
				false,
			).reason === "wall",
		);
		check(
			"a route with a jump is rejected as 'gap'",
			checkPath(g, [s, { r: 0, c: 2 }, e], s, e, false).reason === "gap",
		);
		const diag = [s, { r: 1, c: 0 }, { r: 2, c: 1 }];
		check(
			"a diagonal step is a gap in 4-dir",
			checkPath(g, diag, s, { r: 2, c: 1 }, false).reason === "gap",
		);
		check(
			"the same diagonal step is legal in 8-dir",
			checkPath(g, diag, s, { r: 2, c: 1 }, true).valid,
		);
		check(
			"a route that stops short is rejected as 'end'",
			checkPath(g, good.slice(0, 3), s, e, false).reason === "end",
		);
		check(
			"a diagonal step into weight 5 costs 5√2 m",
			sameCost(
				stepCost(g, { r: 1, c: 3 }, { r: 0, c: 2 }),
				5 * Math.SQRT2 * CELL_METRES,
			),
		);
		const filled = connect({ r: 0, c: 0 }, { r: 3, c: 2 }, false);
		check(
			"connect() fills a fast drag with 4-dir steps",
			filled.length === 5 &&
				filled.every(
					(p, i) =>
						i === 0 ||
						Math.abs(p.r - filled[i - 1].r) +
							Math.abs(p.c - filled[i - 1].c) ===
							1,
				),
		);
		check(
			"connect() takes diagonal steps when allowed",
			connect({ r: 0, c: 0 }, { r: 3, c: 3 }, true).length === 3,
		);
	}

	// i18n: zero missing Spanish strings, and the check sees a missing one.
	{
		const missing = missingKeys(en, es);
		check(
			`es: zero missing strings${missing.length ? ` (${missing.slice(0, 5).join(", ")})` : ""}`,
			missing.length === 0,
		);
		const { title: _drop, ...partial } = es;
		check(
			"a deleted Spanish key is reported missing",
			missingKeys(en, partial).includes("title"),
		);
		check(
			"a missing key falls back to English, visibly marked",
			withFallback(en, partial, "⚠ ").title === `⚠ ${en.title}`,
		);
		check(
			"a present key is used unmarked",
			withFallback(en, es, "⚠ ").title === es.title,
		);
	}

	return results;
}

/** Browser entry: `?selftest` prints the table. */
export function report() {
	const rows = run();
	console.table(rows);
	const failed = rows.filter((r) => !r.pass).length;
	console[failed ? "error" : "info"](
		`selftest: ${rows.length - failed}/${rows.length} passed`,
	);
	return failed;
}

// Node entry: `node src/lib/pathfinding.selftest.js`
if (
	typeof process !== "undefined" &&
	process.argv?.[1]?.endsWith("pathfinding.selftest.js")
) {
	const rows = run();
	for (const r of rows) console.log(`${r.pass ? "pass" : "FAIL"}  ${r.name}`);
	const failed = rows.filter((r) => !r.pass).length;
	console.log(`\n${rows.length - failed}/${rows.length} passed`);
	process.exit(failed ? 1 : 0);
}
