<script module>
	/** Search overlay codes, one byte per cell, written by App and read here. */
	export const SEARCH = { NONE: 0, OPEN: 1, CLOSED: 2, OPEN_BWD: 3, CLOSED_BWD: 4 };
</script>

<script>
	/**
	 * Canvas.svelte — Draws the grid in layers and turns pointer and keyboard
	 * input into cell events. Never mutates the grid or the search itself.
	 *
	 * Layers, bottom to top: terrain (open, wall, mud), the search overlay
	 * (expanded = tint, frontier = tint + dot), mud weights, grid lines,
	 * S and E, the predicted route (dashed), the found path (solid), and the
	 * keyboard cursor. The path is a LINE, not a fill colour, so it can never be
	 * confused with the cells the search expanded.
	 */
	import { onMount } from 'svelte';

	let {
		grid,
		search,
		gCost,
		showCosts = false,
		path,
		predicted,
		start,
		end,
		tick = 0,
		strings,
		fmt,
		onPaint,
	} = $props();

	let canvas = $state(null);
	let ctx = null;
	let cellW = 0;
	let cellH = 0;
	let cursor = $state({ r: 0, c: 0 });
	let focused = $state(false);

	function palette() {
		const css = getComputedStyle(document.documentElement);
		const v = (n) => css.getPropertyValue(n).trim();
		return {
			empty: v('--cell-empty'),
			grid: v('--cell-grid'),
			wall: v('--cell-wall'),
			mud: v('--cell-mud-rgb'),
			mudText: v('--cell-mud-text'),
			mudTextStrong: v('--cell-mud-text-strong'),
			costText: v('--cell-cost-text'),
			gText: v('--cell-g-text'),
			open: v('--cell-open'),
			openDot: v('--cell-open-dot'),
			closed: v('--cell-closed'),
			openBwd: v('--cell-open-bwd'),
			openBwdDot: v('--cell-open-bwd-dot'),
			closedBwd: v('--cell-closed-bwd'),
			start: v('--cell-start'),
			startText: v('--cell-start-text'),
			end: v('--cell-end'),
			endText: v('--cell-end-text'),
			path: v('--cell-path'),
			predicted: v('--cell-predicted'),
			focus: v('--focus'),
			mono: v('--mono'),
			sans: v('--sans'),
		};
	}

	function resize() {
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = Math.round(rect.width * dpr);
		canvas.height = Math.round(rect.height * dpr);
		ctx = canvas.getContext('2d');
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		cellW = rect.width / grid.cols;
		cellH = rect.height / grid.rows;
		draw();
	}

	const centre = (p) => [p.c * cellW + cellW / 2, p.r * cellH + cellH / 2];

	function line(points, colour, width, dash) {
		if (points.length < 2) return;
		ctx.save();
		ctx.strokeStyle = colour;
		ctx.lineWidth = width;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.setLineDash(dash);
		ctx.beginPath();
		ctx.moveTo(...centre(points[0]));
		for (const p of points.slice(1)) ctx.lineTo(...centre(p));
		ctx.stroke();
		ctx.restore();
	}

	function label(text, x, y, colour, font) {
		ctx.fillStyle = colour;
		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, x, y);
	}

	function draw() {
		if (!ctx) return;
		const P = palette();
		const { rows, cols } = grid;
		const size = Math.min(cellW, cellH);
		ctx.clearRect(0, 0, cols * cellW, rows * cellH);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const x = c * cellW;
				const y = r * cellH;
				const w = grid.weight(r, c);
				// Terrain
				if (grid.isWall(r, c)) ctx.fillStyle = P.wall;
				else if (w > 1) ctx.fillStyle = `rgba(${P.mud}, ${(0.12 + w * 0.07).toFixed(2)})`;
				else ctx.fillStyle = P.empty;
				ctx.fillRect(x, y, cellW, cellH);
				// Search overlay
				const s = search[r * cols + c];
				if (s) {
					ctx.fillStyle = [null, P.open, P.closed, P.openBwd, P.closedBwd][s];
					ctx.fillRect(x, y, cellW, cellH);
					if (s === SEARCH.OPEN || s === SEARCH.OPEN_BWD) {
						ctx.fillStyle = s === SEARCH.OPEN ? P.openDot : P.openBwdDot;
						ctx.beginPath();
						ctx.arc(x + cellW / 2, y + cellH / 2, size * 0.14, 0, Math.PI * 2);
						ctx.fill();
					}
				}
				// Entry cost. Off: mud shows its weight, centred. On: every open
				// cell shows its cost in the corner and, where the search knows
				// it, g (metres so far) in the centre.
				const wall = grid.isWall(r, c);
				const ink = w >= 6 ? P.mudTextStrong : w > 1 ? P.mudText : P.costText;
				if (!wall && showCosts) {
					ctx.textAlign = 'left';
					ctx.textBaseline = 'top';
					ctx.fillStyle = ink;
					ctx.font = `700 ${Math.max(7, size * 0.3)}px ${P.mono}`;
					ctx.fillText(String(w), x + 2, y + 1);
					const g = gCost[r * cols + c];
					if (!Number.isNaN(g))
						// Whole metres print without ".0"; only diagonal costs need a decimal.
						label(
							Number.isInteger(g) || g >= 100 ? String(Math.round(g)) : g.toFixed(1),
							x + cellW / 2,
							y + cellH * 0.64,
							w >= 6 ? P.mudTextStrong : P.gText,
							`700 ${Math.max(8, size * 0.4)}px ${P.mono}`,
						);
				} else if (w > 1 && !wall) {
					label(String(w), x + cellW / 2, y + cellH / 2, ink, `700 ${Math.max(8, size * 0.5)}px ${P.mono}`);
				}
				ctx.strokeStyle = P.grid;
				ctx.lineWidth = 0.5;
				ctx.strokeRect(x, y, cellW, cellH);
			}
		}

		line(predicted, P.predicted, Math.max(2, size * 0.16), [size * 0.35, size * 0.25]);
		line(path, P.path, Math.max(3, size * 0.28), []);

		for (const [p, fill, text, letter] of [
			[start, P.start, P.startText, 'S'],
			[end, P.end, P.endText, 'E'],
		]) {
			ctx.fillStyle = fill;
			ctx.fillRect(p.c * cellW + 1, p.r * cellH + 1, cellW - 2, cellH - 2);
			label(letter, ...centre(p), text, `800 ${Math.max(9, size * 0.6)}px ${P.sans}`);
		}

		if (focused) {
			ctx.strokeStyle = P.focus;
			ctx.lineWidth = 3;
			ctx.strokeRect(cursor.c * cellW + 1.5, cursor.r * cellH + 1.5, cellW - 3, cellH - 3);
		}
	}

	// Redraw on any change the parent signals, and when the theme flips.
	$effect(() => {
		void tick;
		void showCosts;
		void predicted;
		void path;
		void start;
		void end;
		void focused;
		void cursor;
		draw();
	});

	// ─── Pointer ─────────────────────────────────────────────────────────────
	function cellAt(e) {
		const rect = canvas.getBoundingClientRect();
		const r = Math.floor(((e.clientY - rect.top) / rect.height) * grid.rows);
		const c = Math.floor(((e.clientX - rect.left) / rect.width) * grid.cols);
		return grid.inBounds(r, c) ? { r, c } : null;
	}

	let dragButton = -1;
	let last = null;

	function down(e) {
		e.preventDefault();
		dragButton = e.button;
		const cell = cellAt(e);
		if (!cell) return;
		last = cell;
		cursor = cell;
		onPaint(cell.r, cell.c, e.button, false);
		canvas.setPointerCapture(e.pointerId);
	}

	function move(e) {
		if (dragButton < 0) return;
		const cell = cellAt(e);
		if (!cell || (cell.r === last?.r && cell.c === last?.c)) return;
		last = cell;
		cursor = cell;
		onPaint(cell.r, cell.c, dragButton, true);
	}

	function up() {
		dragButton = -1;
		last = null;
	}

	// ─── Keyboard: the grid is fully operable without a pointer (WCAG 2.1.1) ──
	const MOVES = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };

	function key(e) {
		if (MOVES[e.key]) {
			e.preventDefault();
			const [dr, dc] = MOVES[e.key];
			const r = Math.min(grid.rows - 1, Math.max(0, cursor.r + dr));
			const c = Math.min(grid.cols - 1, Math.max(0, cursor.c + dc));
			cursor = { r, c };
		} else if (e.key === 'Enter') {
			e.preventDefault();
			onPaint(cursor.r, cursor.c, 0, false);
		}
	}

	function describe(p) {
		const k = strings.cellKinds;
		if (p.r === start.r && p.c === start.c) return k.start;
		if (p.r === end.r && p.c === end.c) return k.end;
		if (grid.isWall(p.r, p.c)) return k.wall;
		const w = grid.weight(p.r, p.c);
		const what = w > 1 ? fmt(k.weight, { w }) : k.empty;
		const g = gCost[p.r * grid.cols + p.c];
		return Number.isNaN(g) ? what : `${what}, ${fmt(strings.cellG, { g: g.toFixed(1) })}`;
	}

	let announcement = $derived.by(() => {
		void tick;
		return focused
			? fmt(strings.cursorAt, { r: cursor.r + 1, c: cursor.c + 1, what: describe(cursor) })
			: '';
	});

	onMount(() => {
		cursor = { ...start };
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		const mo = new MutationObserver(draw);
		mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		resize();
		return () => {
			ro.disconnect();
			mo.disconnect();
		};
	});
</script>

<canvas
	bind:this={canvas}
	tabindex="0"
	aria-label={fmt(strings.canvasLabel, { rows: grid.rows, cols: grid.cols })}
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={up}
	oncontextmenu={(e) => e.preventDefault()}
	onkeydown={key}
	onfocus={() => (focused = true)}
	onblur={() => (focused = false)}
></canvas>
<p class="visually-hidden" aria-live="polite">{announcement}</p>

<style>
	canvas {
		width: 100%;
		height: 100%;
		display: block;
		cursor: crosshair;
		touch-action: none;
	}
	canvas:focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: -3px;
	}
</style>
