<script>
	/**
	 * Canvas.svelte — Grid renderer and mouse/touch interaction handler.
	 *
	 * Renders the pathfinding grid onto an HTML Canvas.
	 * Reports cell interactions via callbacks; never mutates props directly.
	 */
	import { onMount } from 'svelte';

	let {
		cellStates,
		rows,
		cols,
		weightMap,
		renderTick = 0,
		onCellDown,
		onCellDrag,
		strings,
	} = $props();

	let canvas = $state(null);
	let ctx = $state(null);
	let dpr = 1;
	let cellW = 0;
	let cellH = 0;

	// ─── Cell colour palette (CSS custom properties read at paint time) ──────────
	const COLOURS = {
		'': () => getVar('--cell-empty'),
		wall: () => getVar('--cell-wall'),
		start: () => getVar('--cell-start'),
		end: () => getVar('--cell-end'),
		open: () => getVar('--cell-open'),
		closed: () => getVar('--cell-closed'),
		path: () => getVar('--cell-path'),
		'open-bwd': () => getVar('--cell-open-bwd'),
		'closed-bwd': () => getVar('--cell-closed-bwd'),
	};

	function getVar(name) {
		return getComputedStyle(canvas).getPropertyValue(name).trim();
	}

	function weightColour(level) {
		// Purple family, darker for higher weights
		const alpha = 0.25 + (level - 2) * 0.12;
		return `rgba(139,92,246,${alpha.toFixed(2)})`;
	}

	// ─── Sizing ──────────────────────────────────────────────────────────────────
	function resize() {
		if (!canvas) return;
		dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx = canvas.getContext('2d');
		ctx.scale(dpr, dpr);
		cellW = rect.width / cols;
		cellH = rect.height / rows;
		draw();
	}

	// ─── Drawing ─────────────────────────────────────────────────────────────────
	function draw() {
		if (!ctx || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		const W = rect.width;
		const H = rect.height;

		ctx.clearRect(0, 0, W, H);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const state = cellStates[r]?.[c] ?? '';
				const x = c * cellW;
				const y = r * cellH;

				// Background
				if (state.startsWith('weight-')) {
					const level = parseInt(state.slice(7), 10);
					ctx.fillStyle = weightColour(level);
					ctx.fillRect(x, y, cellW, cellH);
					// Faint label
					ctx.fillStyle = 'rgba(109,40,217,0.7)';
					ctx.font = `bold ${Math.max(8, cellH * 0.45)}px var(--mono, monospace)`;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(String(level), x + cellW / 2, y + cellH / 2);
				} else {
					const colFn = COLOURS[state] ?? COLOURS[''];
					ctx.fillStyle = colFn();
					ctx.fillRect(x, y, cellW, cellH);

					// Icons for start / end
					if (state === 'start' || state === 'end') {
						ctx.fillStyle = state === 'start' ? '#ffffff' : '#ffffff';
						ctx.font = `bold ${Math.max(9, cellH * 0.5)}px var(--sans, sans-serif)`;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(state === 'start' ? 'S' : 'E', x + cellW / 2, y + cellH / 2);
					}
				}

				// Grid line
				ctx.strokeStyle = getVar('--cell-grid');
				ctx.lineWidth = 0.5;
				ctx.strokeRect(x, y, cellW, cellH);
			}
		}
	}

	// ─── Reactivity: redraw whenever cellStates or renderTick changes ────────────
	$effect(() => {
		void cellStates;
		void renderTick;
		draw();
	});

	// ─── Mouse / touch interaction ───────────────────────────────────────────────
	function cellAt(clientX, clientY) {
		if (!canvas) return null;
		const rect = canvas.getBoundingClientRect();
		const r = Math.floor(((clientY - rect.top) / rect.height) * rows);
		const c = Math.floor(((clientX - rect.left) / rect.width) * cols);
		if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
		return { r, c };
	}

	let dragging = false;
	let lastCell = null;

	function handlePointerDown(e) {
		e.preventDefault();
		dragging = true;
		lastCell = null;
		const cell = cellAt(e.clientX, e.clientY);
		if (cell) { onCellDown?.(cell.r, cell.c, e.button); lastCell = cell; }
		canvas.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e) {
		if (!dragging) return;
		const cell = cellAt(e.clientX, e.clientY);
		if (!cell) return;
		if (cell.r === lastCell?.r && cell.c === lastCell?.c) return;
		onCellDrag?.(cell.r, cell.c, e.button);
		lastCell = cell;
	}

	function handlePointerUp() {
		dragging = false;
		lastCell = null;
	}

	function handleContextMenu(e) {
		e.preventDefault(); // allow right-click drag
	}

	// ─── Mount ───────────────────────────────────────────────────────────────────
	onMount(() => {
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		resize();
		return () => ro.disconnect();
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<canvas
	bind:this={canvas}
	aria-label={strings.tagline}
	style="width:100%;height:100%;cursor:crosshair;display:block;"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerUp}
	oncontextmenu={handleContextMenu}
></canvas>

<style>
	canvas {
		/* ── Cell palette: light theme defaults ── */
		--cell-empty: #f1f5f9;
		--cell-wall: #1e293b;
		--cell-grid: #cbd5e1;
		--cell-start: #10b981;
		--cell-end: #ef4444;
		--cell-open: rgba(251, 191, 36, 0.75);
		--cell-closed: rgba(59, 130, 246, 0.55);
		--cell-path: #fbbf24;
		--cell-open-bwd: rgba(167, 139, 250, 0.75);
		--cell-closed-bwd: rgba(139, 92, 246, 0.55);
	}

	/* Dark theme overrides — applied via [data-theme="dark"] on <html> */
	:global([data-theme='dark']) canvas {
		--cell-empty: #0e1626;
		--cell-wall: #334155;
		--cell-grid: #1e2d45;
		--cell-start: #34d399;
		--cell-end: #f87171;
		--cell-open: rgba(251, 191, 36, 0.65);
		--cell-closed: rgba(96, 165, 250, 0.5);
		--cell-path: #fcd34d;
		--cell-open-bwd: rgba(196, 181, 253, 0.7);
		--cell-closed-bwd: rgba(167, 139, 250, 0.5);
	}
</style>
