<script>
	/**
	 * App.svelte — Root of the Pathfinding Algorithms tool.
	 *
	 * Owns the grid (terrain), the search overlay, the learner's predicted
	 * route, the runner and the metrics. Terrain and search are separate
	 * layers, so clearing a search never erases the mud it ran over.
	 */
	import { onMount, untrack } from 'svelte';
	import { version } from '../package.json';
	import Canvas, { SEARCH } from './lib/Canvas.svelte';
	import Controls from './lib/Controls.svelte';
	import Glossary from './lib/Glossary.svelte';
	import Prediction from './lib/Prediction.svelte';
	import Toolbar from './lib/Toolbar.svelte';
	import Sidebar from './lib/Sidebar.svelte';
	import Telemetry from './lib/Telemetry.svelte';

	import ALGORITHMS, { ALGORITHM_ORDER } from './lib/algorithms/index.js';
	import { MAX_ITERATIONS } from './lib/algorithms/IDAStar.js';
	import {
		checkPath,
		compareAll,
		connect,
		overlap,
		pathCost,
		runToEnd,
	} from './lib/evaluate.js';
	import { Grid } from './lib/Grid.js';
	import en from './lib/i18n/en.js';
	import es from './lib/i18n/es.js';
	import { fmt, withFallback } from './lib/i18n/merge.js';
	import { PathfindingSim } from './lib/PathfindingSim.js';

	// One source for the version: package.json, synced with the changelog.
	const VERSION = version;
	const ROWS = 21;
	const COLS = 41;
	const KEY = 'pathfinding-algorithms';
	const REPOSITORY = 'https://github.com/Arziel1992/pathfinding-algorithms';

	// ─── Locale and theme (already resolved before first paint in index.html) ──
	let locale = $state(document.documentElement.lang === 'es' ? 'es' : 'en');
	let theme = $state(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
	const MARK = import.meta.env.DEV ? '⚠[es?] ' : '';
	let strings = $derived(locale === 'en' ? en : withFallback(en, es, MARK));
	let num = $derived(new Intl.NumberFormat(locale === 'es' ? 'es-419' : 'en-AU', { maximumFractionDigits: 1 }));

	function save(name, value) {
		try {
			localStorage.setItem(`${KEY}.${name}`, value);
		} catch {
			/* not persisted this session; the tool still works */
		}
	}

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		save('theme', theme);
	}

	function setLocale(code) {
		if (code !== 'en' && code !== 'es') return;
		locale = code;
		save('locale', locale);
	}
	// A language's own name is never translated.
	const LOCALES = { en: 'English', es: 'Español' };

	$effect(() => {
		document.documentElement.lang = locale;
		document.title = strings.title;
		document.querySelector('meta[name="description"]')?.setAttribute('content', strings.description);
	});

	// ─── Grid, overlay, routes ─────────────────────────────────────────────────
	const grid = new Grid(ROWS, COLS);
	const search = new Uint8Array(ROWS * COLS);
	// g, the cost so far in metres, for searches that track it (Dijkstra, A*, IDA*).
	const gCost = new Float64Array(ROWS * COLS).fill(Number.NaN);
	let start = $state({ r: 10, c: 5 });
	let end = $state({ r: 10, c: 35 });
	let path = $state([]);
	let predicted = $state([]);
	let tick = $state(0);
	const redraw = () => tick++;

	let params = $state({
		algorithm: 'astar',
		heuristic: 'octile',
		speed: 185,
		diagonal: false,
		drawMode: 'predict',
		weightLevel: 5,
		showCosts: false,
	});
	const delay = () => 201 - params.speed;

	let telemetry = $state({
		status: 'idle',
		expanded: 0,
		frontier: 0,
		pathCost: null,
		pathSteps: 0,
		best: null,
		threshold: null,
	});
	let prediction = $state(null);
	let comparison = $state(null);

	// ─── Runner ────────────────────────────────────────────────────────────────
	const sim = new PathfindingSim();
	const options = () => ({ heuristic: params.heuristic, diagonal: params.diagonal });

	function onStep(step) {
		const i = step.r * COLS + step.c;
		switch (step.kind) {
			case 'open':
				if (search[i] !== SEARCH.OPEN && search[i] !== SEARCH.OPEN_BWD) telemetry.frontier++;
				search[i] = step.side === 'bwd' ? SEARCH.OPEN_BWD : SEARCH.OPEN;
				if (step.g !== undefined) gCost[i] = step.g;
				break;
			case 'close':
				if (search[i] === SEARCH.OPEN || search[i] === SEARCH.OPEN_BWD) telemetry.frontier--;
				search[i] = step.side === 'bwd' ? SEARCH.CLOSED_BWD : SEARCH.CLOSED;
				if (step.g !== undefined) gCost[i] = step.g;
				telemetry.expanded++;
				break;
			case 'iteration':
				search.fill(SEARCH.NONE);
				gCost.fill(Number.NaN);
				telemetry.frontier = 0;
				telemetry.threshold = step.threshold;
				break;
			case 'path':
				path = step.nodes;
				telemetry.pathCost = pathCost(grid, step.nodes);
				telemetry.pathSteps = step.nodes.length - 1;
				telemetry.status = 'done';
				scorePrediction();
				break;
			case 'fail':
				telemetry.status = step.reason === 'limit' ? 'gaveUp' : 'noPath';
				scorePrediction();
				break;
		}
		redraw();
	}

	function scorePrediction() {
		if (!predicted.length) return;
		const r = checkPath(grid, predicted, start, end, params.diagonal);
		prediction = { ...r, best: telemetry.best, overlap: overlap(path, predicted) };
	}

	function clearSearch() {
		sim.stop();
		search.fill(SEARCH.NONE);
		gCost.fill(Number.NaN);
		path = [];
		prediction = null;
		Object.assign(telemetry, {
			status: 'idle',
			expanded: 0,
			frontier: 0,
			pathCost: null,
			pathSteps: 0,
			best: null,
			threshold: null,
		});
		redraw();
	}

	function begin() {
		clearSearch();
		telemetry.best = runToEnd(ALGORITHMS.dijkstra, grid, start, end, options()).cost;
		const gen = ALGORITHMS[params.algorithm].run(grid, start, end, options());
		sim.init(gen, onStep, () => {});
		telemetry.status = 'paused';
	}

	function handlePlay() {
		if (telemetry.status !== 'paused') begin();
		telemetry.status = 'running';
		sim.play(delay());
	}

	function handlePause() {
		sim.pause();
		telemetry.status = 'paused';
	}

	function handleStep() {
		if (telemetry.status === 'running') handlePause();
		if (telemetry.status !== 'paused') begin();
		sim.step();
	}

	// A new speed applies to a run already going.
	$effect(() => {
		const ms = delay();
		if (telemetry.status === 'running') sim.play(ms);
	});

	// Changing what the search would do makes its result stale.
	let lastSettings = '';
	$effect(() => {
		const now = `${params.algorithm}|${params.heuristic}|${params.diagonal}`;
		if (lastSettings && now !== lastSettings) {
			untrack(() => {
				clearSearch();
				comparison = null;
			});
		}
		lastSettings = now;
	});

	function handleCompare() {
		comparison = compareAll(ALGORITHMS, ALGORITHM_ORDER, grid, start, end, options());
	}

	// ─── Editing the grid ──────────────────────────────────────────────────────
	const isStart = (r, c) => r === start.r && c === start.c;
	const isEnd = (r, c) => r === end.r && c === end.c;

	function terrainChanged() {
		if (telemetry.status !== 'idle') clearSearch();
		comparison = null;
		redraw();
	}

	function paint(r, c, button, dragging) {
		if (telemetry.status === 'running') return;
		const mode = button === 2 ? 'erase' : params.drawMode;

		if (mode === 'predict') {
			const here = { r, c };
			if (!dragging && (isStart(r, c) || !predicted.length)) {
				predicted = isStart(r, c) ? [here] : [{ ...start }, ...connect(start, here, params.diagonal)];
			} else {
				predicted = [...predicted, ...connect(predicted.at(-1), here, params.diagonal)];
			}
			prediction = null;
			redraw();
			return;
		}
		if (mode === 'start' || mode === 'end') {
			if (isStart(r, c) || isEnd(r, c)) return;
			grid.setWall(r, c, false);
			grid.setWeight(r, c, 1);
			if (mode === 'start') start = { r, c };
			else end = { r, c };
			predicted = [];
			terrainChanged();
			return;
		}
		if (isStart(r, c) || isEnd(r, c)) return;
		if (mode === 'wall') grid.setWall(r, c, true);
		else if (mode === 'weight') grid.setWeight(r, c, params.weightLevel);
		else {
			grid.setWall(r, c, false);
			grid.setWeight(r, c, 1);
		}
		terrainChanged();
	}

	function clearGrid() {
		grid.clearAll();
		predicted = [];
		terrainChanged();
	}

	// ─── Scenes ────────────────────────────────────────────────────────────────
	/**
	 * The load scene: a cup of wall opening towards S, then a band of mud with
	 * a gap at the top. Greedy walks into the cup; BFS wades through the mud
	 * because it counts steps; Dijkstra and A* detour through the gap, agree
	 * on the cost, and differ in how much they expand.
	 */
	function demoScene() {
		grid.clearAll();
		start = { r: 10, c: 5 };
		end = { r: 10, c: 35 };
		for (let r = 4; r <= 16; r++) grid.setWall(r, 22, true);
		for (let c = 14; c <= 22; c++) {
			grid.setWall(4, c, true);
			grid.setWall(16, c, true);
		}
		for (let r = 2; r < ROWS; r++) for (let c = 28; c <= 29; c++) grid.setWeight(r, c, 5);
		predicted = [];
		terrainChanged();
	}

	function randomScene() {
		grid.clearAll();
		for (let r = 0; r < ROWS; r++)
			for (let c = 0; c < COLS; c++)
				if (!isStart(r, c) && !isEnd(r, c) && Math.random() < 0.3) grid.setWall(r, c, true);
		predicted = [];
		terrainChanged();
	}

	/** Recursive backtracker: carve passages on odd cells, walls on even ones. */
	function mazeScene() {
		const odd = (v, max) => (v % 2 ? v : v + 1 < max ? v + 1 : v - 1);
		start = { r: odd(start.r, ROWS), c: odd(start.c, COLS) };
		end = { r: odd(end.r, ROWS), c: odd(end.c, COLS) };
		grid.clearAll();
		for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) grid.setWall(r, c, true);
		const seen = new Set([`${start.r},${start.c}`]);
		grid.setWall(start.r, start.c, false);
		const stack = [start];
		while (stack.length) {
			const cur = stack.at(-1);
			const unvisited = [
				[0, 2],
				[2, 0],
				[0, -2],
				[-2, 0],
			]
				.map(([dr, dc]) => ({ r: cur.r + dr, c: cur.c + dc, mr: cur.r + dr / 2, mc: cur.c + dc / 2 }))
				.filter((n) => grid.inBounds(n.r, n.c) && !seen.has(`${n.r},${n.c}`));
			if (!unvisited.length) {
				stack.pop();
				continue;
			}
			const next = unvisited[Math.floor(Math.random() * unvisited.length)];
			seen.add(`${next.r},${next.c}`);
			grid.setWall(next.mr, next.mc, false);
			grid.setWall(next.r, next.c, false);
			stack.push({ r: next.r, c: next.c });
		}
		grid.setWall(end.r, end.c, false);
		predicted = [];
		terrainChanged();
	}

	/**
	 * Randomise the cost of every open cell, keeping the walls: two in five
	 * stay at 1, the rest get 2–9. With every step priced differently, BFS's
	 * fewest-steps route and Dijkstra's cheapest route come apart, and A*'s
	 * g values become worth reading — so the costs are switched on to show it.
	 */
	function randomCosts() {
		for (let r = 0; r < ROWS; r++)
			for (let c = 0; c < COLS; c++) {
				if (isStart(r, c) || isEnd(r, c) || grid.isWall(r, c)) continue;
				grid.setWeight(r, c, Math.random() < 0.4 ? 1 : 2 + Math.floor(Math.random() * 8));
			}
		params.showCosts = true;
		terrainChanged();
	}

	function handleScene(kind) {
		if (telemetry.status === 'running') return;
		({ demo: demoScene, random: randomScene, maze: mazeScene, costs: randomCosts })[kind]();
	}

	// ─── Layout and keys ───────────────────────────────────────────────────────
	let sidebarLeft = $state(true);
	let sidebarRight = $state(true);
	let glossaryOpen = $state(false);
	let glossarySection = $state('manual');
	function openGlossary(section = 'manual') {
		glossarySection = section;
		glossaryOpen = true;
	}
	/** The manual's contents, in reading order; the text is in the locale files. */
	const GLOSSARY = [
		['use', ['manual', 'keys', 'predict', 'compare', 'costs']],
		['search', ['open', 'closed', 'g', 'h', 'f', 'admissible', 'optimal', 'complete']],
		['cost', ['mud', 'metre']],
	];

	function handleGlobalKey(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return;
		if (e.code === 'Space') {
			e.preventDefault();
			telemetry.status === 'running' ? handlePause() : handlePlay();
		} else if (e.code === 'KeyS') {
			e.preventDefault();
			handleStep();
		} else if (e.code === 'KeyR') {
			clearSearch();
		} else if (e.code === 'KeyG') {
			glossaryOpen ? (glossaryOpen = false) : openGlossary();
		}
	}

	onMount(() => {
		demoScene();
		// Rule 7: the tool demonstrates itself on load — A* already run.
		begin();
		while (telemetry.status === 'paused') sim.step();

		if (new URLSearchParams(location.search).has('selftest')) {
			import('./lib/pathfinding.selftest.js').then((m) => m.report());
		}
	});
</script>

<svelte:window onkeydown={handleGlobalKey} />

<a href="#grid" class="skip-link">{strings.skipToMain}</a>

{#snippet footer()}
	<footer class="app-footer">
		{strings.footerMadeWith} — {strings.footerSubject} — By E. Ketterer<br />
		<!-- The repository was confirmed with git ls-remote on 2026-10-05 before
		     this link was written. -->
		<a href={REPOSITORY} rel="noopener">
			<i class="fa-brands fa-github" aria-hidden="true"></i>
			{strings.repository}
		</a>
		<a class="badge" href="{REPOSITORY}/blob/main/CHANGELOG.md" rel="noopener" title={strings.versionTitle}>v{VERSION}</a>
	</footer>
{/snippet}

<div class="app-layout">
	{#if sidebarLeft}
		<aside class="sidebar-left" aria-labelledby="tool-title">
			<div class="sidebar-inner">
				<header class="tool-header">
					<h1 id="tool-title">{strings.title}</h1>
					<p class="tagline">{strings.tagline}</p>
				</header>
				<Sidebar {strings} algorithm={params.algorithm} onglossary={openGlossary} />
			</div>
			{#if !sidebarRight}
				{@render footer()}
			{/if}
		</aside>
	{/if}

	<main class="canvas-panel" id="grid">
		{#if !sidebarLeft}<h1 class="visually-hidden">{strings.title}</h1>{/if}
		<button
			class="toggle-btn toggle-left"
			onclick={() => (sidebarLeft = !sidebarLeft)}
			aria-label={strings.toggleSidebarLeft}
			aria-expanded={sidebarLeft}
		>
			<i class="fa-solid {sidebarLeft ? 'fa-chevron-left' : 'fa-chevron-right'}" aria-hidden="true"></i>
		</button>
		<button
			class="toggle-btn toggle-right"
			onclick={() => (sidebarRight = !sidebarRight)}
			aria-label={strings.toggleSidebarRight}
			aria-expanded={sidebarRight}
		>
			<i class="fa-solid {sidebarRight ? 'fa-chevron-right' : 'fa-chevron-left'}" aria-hidden="true"></i>
		</button>

		<Toolbar
			{strings}
			{locale}
			{theme}
			locales={LOCALES}
			onmanual={() => openGlossary('manual')}
			onlocale={setLocale}
			ontheme={toggleTheme}
		/>

		<div class="grid-frame" style="aspect-ratio: {COLS} / {ROWS}">
			<Canvas
				{grid}
				{search}
				{gCost}
				showCosts={params.showCosts}
				{path}
				{predicted}
				{start}
				{end}
				{tick}
				{strings}
				{fmt}
				onPaint={paint}
			/>
		</div>

		<div class="under-grid">
			<Prediction {prediction} predictedCells={predicted.length} {strings} {fmt} {num} />
		</div>

		<p class="kb-hint canvas-hint">{strings.kbHint}</p>
	</main>

	{#if sidebarRight}
		<aside class="sidebar-right" aria-label={strings.controls}>
			<div class="sidebar-inner">
				<Controls
					bind:params
					status={telemetry.status}
					hasPrediction={predicted.length > 0}
					{strings}
					{fmt}
					onPlay={handlePlay}
					onPause={handlePause}
					onStep={handleStep}
					onClearPath={clearSearch}
					onClearAll={clearGrid}
					onClearPrediction={() => {
						predicted = [];
						prediction = null;
						redraw();
					}}
					onScene={handleScene}
					onCompare={handleCompare}
					onGlossary={openGlossary}
				/>
				<Telemetry
					{telemetry}
					{comparison}
					algorithm={params.algorithm}
					limit={MAX_ITERATIONS}
					{strings}
					{fmt}
					{num}
				/>
			</div>
			{@render footer()}
		</aside>
	{/if}
</div>

<Glossary {strings} groups={GLOSSARY} bind:isOpen={glossaryOpen} bind:section={glossarySection} />

<style>
	/* The title and tagline take the house h1 and .tagline from app.css. */
	.tool-header {
		margin-bottom: 1.2rem;
	}
	.canvas-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2.5rem 3.25rem;
	}
	.grid-frame,
	.under-grid {
		width: 100%;
		max-width: calc((100vh - 11rem) * 41 / 21);
	}
	.grid-frame {
		border: 1px solid var(--panel-border);
	}
	.canvas-hint {
		position: absolute;
		bottom: 0.6rem;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		margin: 0;
	}
	.app-footer .badge {
		margin-top: 0.3rem;
	}
</style>
