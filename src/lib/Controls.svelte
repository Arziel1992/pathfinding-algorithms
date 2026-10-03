<script>
	/**
	 * Controls.svelte — Right sidebar: algorithm selector, drawing tools, actions.
	 *
	 * All interactive values are $bindable() or callback props. This component
	 * never mutates shared state directly.
	 */
	import { ALGORITHM_ORDER } from './algorithms/index.js';
	import { HEURISTIC_ORDER } from './Heuristics.js';

	let {
		params = $bindable(),
		telemetry,
		strings,
		onPlay,
		onPause,
		onStep,
		onStop,
		onClearPath,
		onClearAll,
		onMaze,
		onGlossary,
	} = $props();

	const selectedAlgo = $derived(ALGORITHM_ORDER.find((id) => id === params.algorithm));
	const algoSupportsHeuristic = $derived(
		['astar', 'greedy', 'idastar'].includes(params.algorithm),
	);
	const algoSupportsWeights = $derived(
		['dijkstra', 'astar', 'idastar'].includes(params.algorithm),
	);

	const isRunning = $derived(telemetry.status === 'running');
	const isDone = $derived(['done', 'noPath'].includes(telemetry.status));
	const canPlay = $derived(!isRunning && !isDone);
	const canPause = $derived(isRunning);
	const canStep = $derived(telemetry.status !== 'done' && telemetry.status !== 'noPath');

	// Speed: 200ms (slow) → 5ms (fast), mapped from slider 1–200
	const SPEED_MS = $derived(201 - params.speed);
</script>

<div class="controls-panel" role="complementary" aria-label={strings.controls}>

	<!-- ── Algorithm ─────────────────────────────────────────────── -->
	<div class="section-header" style="margin-top:0">
		<h2>{strings.algorithm}</h2>
		<button class="glossary-btn" onclick={onGlossary} aria-label="Open glossary">?</button>
	</div>

	<div class="toggle-list" role="radiogroup" aria-label={strings.algorithm}>
		{#each ALGORITHM_ORDER as id}
			<button
				role="radio"
				aria-checked={params.algorithm === id}
				disabled={isRunning}
				onclick={() => { params.algorithm = id; }}
			>
				{strings.algoNames[id]}
			</button>
		{/each}
	</div>

	<!-- ── Heuristic (conditional) ───────────────────────────────── -->
	{#if algoSupportsHeuristic}
		<div class="section-header">
			<h2>{strings.heuristic}</h2>
		</div>
		<div class="control-group">
			<select
				bind:value={params.heuristic}
				disabled={isRunning}
				aria-label={strings.heuristic}
			>
				{#each HEURISTIC_ORDER as hid}
					<option value={hid}>{strings.heuristicNames[hid]}</option>
				{/each}
			</select>
		</div>
	{/if}

	<!-- ── Options ───────────────────────────────────────────────── -->
	<div class="section-header">
		<h2>{strings.controls}</h2>
	</div>

	<div class="control-group">
		<label class="toggle-label">
			<input type="checkbox" bind:checked={params.diagonal} disabled={isRunning} />
			{strings.diagonal}
		</label>
	</div>

	{#if algoSupportsWeights}
		<div class="control-group">
			<label class="toggle-label">
				<input type="checkbox" bind:checked={params.showWeights} disabled={isRunning} />
				{strings.showWeightMode}
			</label>
		</div>
	{/if}

	<!-- ── Speed ─────────────────────────────────────────────────── -->
	<div class="control-group">
		<div class="label-row">
			<span>{strings.speed}</span>
			<output>{SPEED_MS === 1 ? `${strings.speedFast}` : SPEED_MS < 50 ? `${SPEED_MS}ms` : strings.speedSlow}</output>
		</div>
		<input
			type="range"
			min="1"
			max="200"
			bind:value={params.speed}
			aria-label={strings.speed}
		/>
		<p class="hint">{strings.speedSlow} ← → {strings.speedFast}</p>
	</div>

	<!-- ── Draw mode ─────────────────────────────────────────────── -->
	<div class="section-header">
		<h2>{strings.drawMode}</h2>
	</div>
	<div class="toggle-list" role="radiogroup" aria-label={strings.drawMode}>
		{#each Object.keys(strings.modes) as mode}
			{#if mode !== 'weight' || algoSupportsWeights}
				<button
					role="radio"
					aria-checked={params.drawMode === mode}
					onclick={() => { params.drawMode = mode; }}
					disabled={isRunning}
				>
					{strings.modes[mode]}
				</button>
			{/if}
		{/each}
	</div>

	{#if params.drawMode === 'weight' && algoSupportsWeights}
		<div class="control-group">
			<div class="label-row">
				<span>{strings.weightLevel}</span>
				<output>{params.weightLevel}</output>
			</div>
			<input
				type="range"
				min="2"
				max="9"
				bind:value={params.weightLevel}
				aria-label={strings.weightLevel}
			/>
		</div>
	{/if}

	<!-- ── Maze generator ────────────────────────────────────────── -->
	<div class="section-header">
		<h2>{strings.maze}</h2>
	</div>
	<div class="action-row">
		<button class="clear-btn" onclick={() => onMaze('random')} disabled={isRunning}>
			{strings.mazeRandom}
		</button>
		<button class="clear-btn" onclick={() => onMaze('recursive')} disabled={isRunning}>
			{strings.mazeRecursive}
		</button>
	</div>

	<!-- ── Actions ───────────────────────────────────────────────── -->
	<div class="section-header">
		<h2>{strings.actions}</h2>
	</div>
	<div class="action-row">
		{#if canPlay}
			<button class="clear-btn primary" onclick={onPlay} aria-label={strings.play}>
				▶ {strings.play}
			</button>
		{:else if canPause}
			<button class="clear-btn primary" onclick={onPause} aria-label={strings.pause}>
				⏸ {strings.pause}
			</button>
		{:else}
			<button class="clear-btn primary" onclick={onPlay} aria-label={strings.play} disabled>
				▶ {strings.play}
			</button>
		{/if}
		<button
			class="clear-btn"
			onclick={onStep}
			disabled={!canStep}
			aria-label={strings.step}
		>
			⏭ {strings.step}
		</button>
	</div>
	<div class="action-row">
		<button class="clear-btn" onclick={onClearPath} aria-label={strings.clearPath}>
			{strings.clearPath}
		</button>
		<button class="clear-btn" onclick={onStop} disabled={!isRunning} aria-label={strings.stop}>
			⏹ {strings.stop}
		</button>
	</div>
	<button class="reset-btn" onclick={onClearAll} aria-label={strings.clearAll}>
		{strings.clearAll}
	</button>
</div>

<style>
	select {
		width: 100%;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--control-border);
		border-radius: 6px;
		background: var(--bg-primary);
		color: var(--text-primary);
		font-size: 0.82rem;
		cursor: pointer;
	}
	select:focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}
</style>
