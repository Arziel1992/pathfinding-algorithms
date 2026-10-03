<script>
	/**
	 * App.svelte — Root component for the Pathfinding Algorithms tool.
	 *
	 * Owns all shared state: grid model, reactive cell display, simulation runner,
	 * locale, theme, and telemetry. Coordinates between Canvas, Controls,
	 * Sidebar, Telemetry, and Glossary.
	 */

	import { onMount } from 'svelte';
	import Canvas from './lib/Canvas.svelte';
	import Controls from './lib/Controls.svelte';
	import Telemetry from './lib/Telemetry.svelte';
	import Sidebar from './lib/Sidebar.svelte';
	import Glossary from './lib/Glossary.svelte';

	import en from './lib/i18n/en.js';
	import es from './lib/i18n/es.js';

	import { Grid } from './lib/Grid.js';
	import { PathfindingSim } from './lib/PathfindingSim.js';
	import ALGORITHMS from './lib/algorithms/index.js';

	// ─── Constants ───────────────────────────────────────────────────────────────
	const VERSION = '2026.10.3-1533';
	const ROWS = 22;
	const COLS = 42;

	// ─── Locale & theme ──────────────────────────────────────────────────────────
	let locale = $state('en');
	let theme = $state('');
	let strings = $derived(locale === 'es' ? es : en);

	// ─── Grid model (pure, not Svelte-reactive) ───────────────────────────────
	const grid = new Grid(ROWS, COLS);

	// ─── Start / end positions ───────────────────────────────────────────────────
	let startPos = $state({ r: Math.floor(ROWS / 2), c: 3 });
	let endPos = $state({ r: Math.floor(ROWS / 2), c: COLS - 4 });

	// ─── Reactive cell display state ─────────────────────────────────────────────
	function makeStates(start = startPos, end = endPos) {
		const arr = Array.from({ length: ROWS }, () => new Array(COLS).fill(''));
		if (start) arr[start.r][start.c] = 'start';
		if (end) arr[end.r][end.c] = 'end';
		return arr;
	}
	let cellStates = $state(makeStates());
	let renderTick = $state(0);

	// Weight map for Canvas rendering (row*10000+col → level)
	let weightMap = $state(new Map());

	// ─── Controls / params ────────────────────────────────────────────────────────
	let params = $state({
		algorithm: 'astar',
		heuristic: 'manhattan',
		speed: 170, // slider 1–200 → interval 200-1ms
		diagonal: false,
		drawMode: 'wall',
		weightLevel: 3,
		showWeights: false,
	});

	// ─── Telemetry ───────────────────────────────────────────────────────────────
	let telemetry = $state({
		visited: 0,
		pathLength: 0,
		elapsed: 0,
		status: 'idle',
	});

	// ─── Simulation ──────────────────────────────────────────────────────────────
	const sim = new PathfindingSim();
	let _t0 = 0;
	let _visits = 0;

	function onStep(step) {
		if (!step) return;

		switch (step.kind) {
			case 'open': {
				const s = cellStates[step.r]?.[step.c];
				if (s !== 'start' && s !== 'end') {
					cellStates[step.r][step.c] = step.side === 'bwd' ? 'open-bwd' : 'open';
				}
				_visits++;
				telemetry.visited = _visits;
				telemetry.elapsed = Date.now() - _t0;
				break;
			}
			case 'close': {
				const s = cellStates[step.r]?.[step.c];
				if (s !== 'start' && s !== 'end') {
					cellStates[step.r][step.c] = step.side === 'bwd' ? 'closed-bwd' : 'closed';
				}
				break;
			}
			case 'path': {
				for (const node of step.nodes) {
					const s = cellStates[node.r]?.[node.c];
					if (s !== 'start' && s !== 'end') cellStates[node.r][node.c] = 'path';
				}
				telemetry.pathLength = step.nodes.length;
				telemetry.elapsed = Date.now() - _t0;
				telemetry.status = 'done';
				break;
			}
			case 'fail': {
				telemetry.status = 'noPath';
				telemetry.elapsed = Date.now() - _t0;
				break;
			}
		}
		renderTick++;
	}

	function onDone() {
		if (telemetry.status === 'running') telemetry.status = 'done';
	}

	// ─── Algorithm control ────────────────────────────────────────────────────────
	function handlePlay() {
		if (telemetry.status === 'paused') {
			sim.resume(201 - params.speed);
			telemetry.status = 'running';
			return;
		}
		_clearPathState();
		const mod = ALGORITHMS[params.algorithm];
		if (!mod) return;
		const gen = mod.run(grid, startPos, endPos, {
			heuristic: params.heuristic,
			diagonal: params.diagonal,
		});
		_t0 = Date.now();
		_visits = 0;
		Object.assign(telemetry, { visited: 0, pathLength: 0, elapsed: 0, status: 'running' });
		sim.init(gen, onStep, onDone);
		sim.play(201 - params.speed);
	}

	function handlePause() {
		sim.pause();
		telemetry.status = 'paused';
	}

	function handleStep() {
		if (telemetry.status === 'idle' || !sim.running) {
			// Initialise if needed
			_clearPathState();
			const mod = ALGORITHMS[params.algorithm];
			if (!mod) return;
			const gen = mod.run(grid, startPos, endPos, {
				heuristic: params.heuristic,
				diagonal: params.diagonal,
			});
			_t0 = Date.now();
			_visits = 0;
			Object.assign(telemetry, { visited: 0, pathLength: 0, elapsed: 0, status: 'running' });
			sim.init(gen, onStep, onDone);
			telemetry.status = 'paused';
		}
		sim.step();
	}

	function handleStop() {
		sim.stop();
		_clearPathState();
		Object.assign(telemetry, { visited: 0, pathLength: 0, elapsed: 0, status: 'idle' });
	}

	function handleClearPath() {
		sim.stop();
		_clearPathState();
		Object.assign(telemetry, { visited: 0, pathLength: 0, elapsed: 0, status: 'idle' });
	}

	function handleClearAll() {
		sim.stop();
		grid.clearAll();
		weightMap.clear();
		const newStates = makeStates();
		newStates[startPos.r][startPos.c] = 'start';
		newStates[endPos.r][endPos.c] = 'end';
		cellStates = newStates;
		Object.assign(telemetry, { visited: 0, pathLength: 0, elapsed: 0, status: 'idle' });
		renderTick++;
	}

	function _clearPathState() {
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				const s = cellStates[r][c];
				if (s === 'open' || s === 'closed' || s === 'path' || s === 'open-bwd' || s === 'closed-bwd') {
					cellStates[r][c] = '';
				}
			}
		}
		renderTick++;
	}

	// ─── Maze generators ─────────────────────────────────────────────────────────
	function handleMaze(type) {
		handleClearAll();
		if (type === 'random') {
			for (let r = 0; r < ROWS; r++) {
				for (let c = 0; c < COLS; c++) {
					if (isSpecial(r, c)) continue;
					if (Math.random() < 0.3) {
						grid.setWall(r, c, true);
						cellStates[r][c] = 'wall';
					}
				}
			}
		} else if (type === 'recursive') {
			generateRecursiveMaze();
		}
		renderTick++;
	}

	function isSpecial(r, c) {
		return (r === startPos.r && c === startPos.c) || (r === endPos.r && c === endPos.c);
	}

	function generateRecursiveMaze() {
		// Fill all with walls
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				if (!isSpecial(r, c)) {
					grid.setWall(r, c, true);
					cellStates[r][c] = 'wall';
				}
			}
		}
		// Carve from start
		const visited = new Set();

		function carve(r, c) {
			const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]].sort(() => Math.random() - 0.5);
			for (const [dr, dc] of dirs) {
				const nr = r + dr, nc = c + dc;
				const key = nr * 10000 + nc;
				if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
				if (visited.has(key)) continue;
				visited.add(key);
				// Remove wall between cur and next
				const mr = r + dr / 2, mc = c + dc / 2;
				grid.setWall(nr, nc, false);
				grid.setWall(mr, mc, false);
				if (!isSpecial(nr, nc)) cellStates[nr][nc] = '';
				if (!isSpecial(mr, mc)) cellStates[mr][mc] = '';
				carve(nr, nc);
			}
		}

		// Start carving from start position (clamp to odd)
		const sr = startPos.r % 2 === 0 ? Math.min(startPos.r + 1, ROWS - 1) : startPos.r;
		const sc = startPos.c % 2 === 0 ? Math.min(startPos.c + 1, COLS - 1) : startPos.c;
		grid.setWall(sr, sc, false);
		if (!isSpecial(sr, sc)) cellStates[sr][sc] = '';
		visited.add(sr * 10000 + sc);
		carve(sr, sc);
	}

	// ─── Cell interaction ─────────────────────────────────────────────────────────
	function handleCellDown(r, c, button) {
		if (telemetry.status === 'running') return;
		if (button === 2) {
			// Right click always erases
			eraseCell(r, c);
		} else {
			applyMode(r, c);
		}
	}

	function handleCellDrag(r, c, button) {
		if (telemetry.status === 'running') return;
		if (button === 2) {
			eraseCell(r, c);
		} else {
			applyMode(r, c);
		}
	}

	function applyMode(r, c) {
		const mode = params.drawMode;

		if (mode === 'start') {
			if (cellStates[startPos.r][startPos.c] === 'start') cellStates[startPos.r][startPos.c] = '';
			grid.setWall(r, c, false);
			grid.setWeight(r, c, 1);
			startPos = { r, c };
			cellStates[r][c] = 'start';
			renderTick++;
			return;
		}
		if (mode === 'end') {
			if (cellStates[endPos.r][endPos.c] === 'end') cellStates[endPos.r][endPos.c] = '';
			grid.setWall(r, c, false);
			grid.setWeight(r, c, 1);
			endPos = { r, c };
			cellStates[r][c] = 'end';
			renderTick++;
			return;
		}
		if (isSpecial(r, c)) return;
		if (mode === 'wall') {
			grid.setWall(r, c, true);
			cellStates[r][c] = 'wall';
		} else if (mode === 'erase') {
			eraseCell(r, c);
		} else if (mode === 'weight') {
			grid.setWeight(r, c, params.weightLevel);
			weightMap.set(Grid.key(r, c), params.weightLevel);
			cellStates[r][c] = `weight-${params.weightLevel}`;
		}
		renderTick++;
	}

	function eraseCell(r, c) {
		if (isSpecial(r, c)) return;
		grid.setWall(r, c, false);
		grid.setWeight(r, c, 1);
		weightMap.delete(Grid.key(r, c));
		cellStates[r][c] = '';
		renderTick++;
	}

	// ─── Sidebar / UI toggles ────────────────────────────────────────────────────
	let sidebarLeft = $state(true);
	let sidebarRight = $state(true);
	let glossaryOpen = $state(false);

	// ─── Keyboard shortcuts ───────────────────────────────────────────────────────
	function handleGlobalKey(e) {
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
		switch (e.code) {
			case 'Space':
				e.preventDefault();
				if (telemetry.status === 'running') handlePause();
				else handlePlay();
				break;
			case 'KeyS':
				e.preventDefault();
				handleStep();
				break;
			case 'KeyR':
				if (e.ctrlKey || e.metaKey) break;
				handleClearPath();
				break;
		}
	}

	// ─── Locale / theme ──────────────────────────────────────────────────────────
	function toggleTheme() {
		theme = theme === 'dark' ? '' : 'dark';
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('pf-theme', theme);
	}

	function toggleLocale() {
		locale = locale === 'en' ? 'es' : 'en';
		localStorage.setItem('pf-locale', locale);
	}

	function seedDefaultDemo() {
		// Place a vertical wall barrier with a passage in the middle
		const midC = Math.floor(COLS / 2);
		for (let r = 2; r < ROWS - 2; r++) {
			if (r >= 9 && r <= 12) continue; // 4-cell passage
			grid.setWall(r, midC, true);
			cellStates[r][midC] = 'wall';
		}
		// Also a small secondary obstacle
		grid.setWall(8, midC + 6, true);
		cellStates[8][midC + 6] = 'wall';
		grid.setWall(9, midC + 6, true);
		cellStates[9][midC + 6] = 'wall';
		grid.setWall(10, midC + 6, true);
		cellStates[10][midC + 6] = 'wall';

		// Run A* search to completion so the concept is demonstrated on load
		const mod = ALGORITHMS.astar;
		if (mod) {
			_t0 = Date.now();
			_visits = 0;
			const gen = mod.run(grid, startPos, endPos, {
				heuristic: params.heuristic,
				diagonal: params.diagonal,
			});
			for (const step of gen) {
				onStep(step);
			}
			telemetry.status = 'done';
		}
		renderTick++;
	}

	// ─── Mount ────────────────────────────────────────────────────────────────────
	onMount(() => {
		const savedTheme = localStorage.getItem('pf-theme');
		if (savedTheme) {
			theme = savedTheme;
		} else if (matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
		document.documentElement.dataset.theme = theme;

		const savedLocale = localStorage.getItem('pf-locale');
		if (savedLocale === 'es') locale = 'es';
		else if (!savedLocale) {
			const nav = navigator.language?.slice(0, 2);
			if (nav === 'es') locale = 'es';
		}

		// Seed initial demonstration
		seedDefaultDemo();
	});
</script>

<svelte:window onkeydown={handleGlobalKey} />

<a href="#main-canvas" class="skip-link">{strings.skipToMain}</a>

{#snippet footer()}
	<footer class="app-footer">
		{strings.footerMadeWith} — {strings.footerSubject} — By E. Ketterer<br />
		<span class="app-version" style="font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; opacity: 0.75;">v{VERSION}</span>
	</footer>
{/snippet}

<div class="app-layout">
	<!-- ── Left sidebar: theory ────────────────────────────────────────────── -->
	{#if sidebarLeft}
		<aside class="sidebar-left" aria-label={strings.theory}>
			<div class="sidebar-inner">
				<div class="tool-header">
					<h1>{strings.title}</h1>
					<p class="tagline">{strings.tagline}</p>
				</div>
				<Sidebar {strings} algorithm={params.algorithm} />
			</div>
			{#if !sidebarRight}
				{@render footer()}
			{/if}
		</aside>
	{/if}

	<!-- ── Canvas panel ────────────────────────────────────────────────────── -->
	<main class="canvas-panel" id="main-canvas">
		<!-- Toggle buttons -->
		<button
			class="toggle-btn toggle-left"
			onclick={() => { sidebarLeft = !sidebarLeft; }}
			aria-label={strings.toggleSidebarLeft}
			aria-pressed={sidebarLeft}
		>
			{sidebarLeft ? '‹' : '›'}
		</button>
		<button
			class="toggle-btn toggle-right"
			onclick={() => { sidebarRight = !sidebarRight; }}
			aria-label={strings.toggleSidebarRight}
			aria-pressed={sidebarRight}
		>
			{sidebarRight ? '›' : '‹'}
		</button>

		<!-- Theme / locale controls -->
		<div class="canvas-topbar" aria-label="Language and theme">
			<button
				class="icon-btn"
				onclick={toggleLocale}
				aria-label={strings.toggleLocale}
				title={strings.toggleLocale}
			>🌐 {locale.toUpperCase()}</button>
			<button
				class="icon-btn"
				onclick={toggleTheme}
				aria-label={strings.toggleTheme}
				title={strings.toggleTheme}
			>{theme === 'dark' ? '☀' : '🌙'}</button>
		</div>

		<Canvas
			{cellStates}
			rows={ROWS}
			cols={COLS}
			{weightMap}
			{renderTick}
			{strings}
			onCellDown={handleCellDown}
			onCellDrag={handleCellDrag}
		/>

		<!-- Keyboard hint -->
		<div class="kb-hint canvas-hint" aria-hidden="true">
			{strings.kbHint}
		</div>
	</main>

	<!-- ── Right sidebar: controls + telemetry ─────────────────────────────── -->
	{#if sidebarRight}
		<aside class="sidebar-right" aria-label={strings.controls}>
			<div class="sidebar-inner">
				<Controls
					bind:params
					{telemetry}
					{strings}
					onPlay={handlePlay}
					onPause={handlePause}
					onStep={handleStep}
					onStop={handleStop}
					onClearPath={handleClearPath}
					onClearAll={handleClearAll}
					onMaze={handleMaze}
					onGlossary={() => { glossaryOpen = true; }}
				/>
				<div style="margin-top:1rem">
					<Telemetry {telemetry} {strings} />
				</div>
			</div>
			{@render footer()}
		</aside>
	{/if}
</div>

<Glossary {strings} bind:open={glossaryOpen} />

<style>
	.tool-header {
		margin-bottom: 1rem;
	}
	.canvas-topbar {
		position: absolute;
		top: 0.5rem;
		right: 2.5rem;
		display: flex;
		gap: 0.4rem;
		z-index: 150;
	}
	.icon-btn {
		background: var(--glass-bg);
		backdrop-filter: blur(6px);
		border: 1px solid var(--panel-border);
		border-radius: 6px;
		padding: 0.25rem 0.6rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
		font-weight: 700;
	}
	.icon-btn:hover {
		background: var(--accent);
		color: var(--accent-text);
		border-color: var(--accent);
	}
	.canvas-hint {
		position: absolute;
		bottom: 0.75rem;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		pointer-events: none;
	}
</style>
