<script>
	/**
	 * Controls.svelte — Right rail: algorithm, heuristic, options, drawing,
	 * scenes and the run buttons. Input only: values are $bindable and actions
	 * are callbacks; it never reaches into the grid or the runner.
	 */
	import { ALGORITHM_ORDER } from './algorithms/index.js';
	import { admissible } from './evaluate.js';
	import { HEURISTIC_ORDER } from './Heuristics.js';

	let {
		params = $bindable(),
		status,
		hasPrediction,
		strings,
		fmt,
		onPlay,
		onPause,
		onStep,
		onClearPath,
		onClearAll,
		onClearPrediction,
		onScene,
		onCompare,
		onGlossary,
	} = $props();

	const usesHeuristic = $derived(['astar', 'greedy', 'idastar'].includes(params.algorithm));
	const running = $derived(status === 'running');
	const finished = $derived(['done', 'noPath', 'gaveUp'].includes(status));
	const MODES = ['predict', 'wall', 'weight', 'erase', 'start', 'end'];
</script>

{#snippet help(section)}
	<button class="glossary-btn" onclick={() => onGlossary(section)} aria-label={strings.openGlossary} title={strings.openGlossary}>?</button>
{/snippet}

<div class="controls-panel">
	<div class="section-header" style="margin-top:0">
		<h2 id="algo-heading">{strings.algorithm}</h2>
		{@render help('open')}
	</div>
	<div class="toggle-list" role="group" aria-labelledby="algo-heading">
		{#each ALGORITHM_ORDER as id (id)}
			<button aria-pressed={params.algorithm === id} disabled={running} onclick={() => (params.algorithm = id)}>
				{strings.algoNames[id]}
			</button>
		{/each}
	</div>

	{#if usesHeuristic}
		<div class="control-group">
			<label class="field-label" for="heuristic">{strings.heuristic}</label>
			<select id="heuristic" bind:value={params.heuristic} disabled={running}>
				{#each HEURISTIC_ORDER as hid (hid)}
					<option value={hid}>{strings.heuristicNames[hid]}</option>
				{/each}
			</select>
			{#if !admissible(params.heuristic, params.diagonal)}
				<p class="warn" role="note">
					<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
					{strings.heuristicWarning}
				</p>
			{/if}
		</div>
	{/if}

	<div class="section-header"><h2>{strings.options}</h2>{@render help('costs')}</div>
	<div class="control-group">
		<label class="toggle-label">
			<input type="checkbox" bind:checked={params.diagonal} disabled={running} />
			{strings.diagonal}
		</label>
	</div>
	<div class="control-group">
		<label class="toggle-label">
			<input type="checkbox" bind:checked={params.showCosts} aria-describedby="costs-hint" />
			{strings.showCosts}
		</label>
		<p class="hint" id="costs-hint">{strings.showCostsHint}</p>
	</div>
	<div class="control-group">
		<div class="label-row">
			<label for="speed">{strings.speed}</label>
			<output for="speed">{fmt(strings.speedValue, { ms: 201 - params.speed })}</output>
		</div>
		<input id="speed" type="range" min="1" max="200" bind:value={params.speed} />
	</div>

	<div class="section-header"><h2 id="mode-heading">{strings.drawMode}</h2>{@render help('predict')}</div>
	<div class="toggle-list" role="group" aria-labelledby="mode-heading">
		{#each MODES as mode (mode)}
			<button aria-pressed={params.drawMode === mode} disabled={running} onclick={() => (params.drawMode = mode)}>
				{strings.modes[mode]}
			</button>
		{/each}
	</div>
	{#if params.drawMode === 'weight'}
		<div class="control-group">
			<div class="label-row">
				<label for="weight">{strings.weightLevel}</label>
				<output for="weight">× {params.weightLevel}</output>
			</div>
			<input id="weight" type="range" min="2" max="9" bind:value={params.weightLevel} />
			<p class="hint">{strings.weightHint}</p>
		</div>
	{/if}
	{#if params.drawMode === 'predict'}
		<p class="hint">{strings.predictHint}</p>
	{/if}
	{#if hasPrediction}
		<button class="clear-btn" onclick={onClearPrediction} disabled={running}>{strings.predictClear}</button>
	{/if}

	<div class="section-header"><h2>{strings.actions}</h2>{@render help('compare')}</div>
	<div class="action-row">
		{#if running}
			<button class="clear-btn primary" onclick={onPause}>
				<i class="fa-solid fa-pause" aria-hidden="true"></i> {strings.pause}
			</button>
		{:else}
			<button class="clear-btn primary" onclick={onPlay}>
				<i class="fa-solid fa-play" aria-hidden="true"></i> {strings.play}
			</button>
		{/if}
		<button class="clear-btn" onclick={onStep} disabled={finished}>
			<i class="fa-solid fa-forward-step" aria-hidden="true"></i> {strings.step}
		</button>
	</div>
	<div class="action-row">
		<button class="clear-btn" onclick={onClearPath}>{strings.clearPath}</button>
		<button class="clear-btn" onclick={onCompare} disabled={running}>
			<i class="fa-solid fa-table" aria-hidden="true"></i> {strings.compareAll}
		</button>
	</div>

	<div class="section-header"><h2>{strings.maze}</h2></div>
	<div class="action-row">
		<button class="clear-btn" onclick={() => onScene('demo')} disabled={running}>{strings.mazeDemo}</button>
		<button class="clear-btn" onclick={() => onScene('random')} disabled={running}>{strings.mazeRandom}</button>
		<button class="clear-btn" onclick={() => onScene('maze')} disabled={running}>{strings.mazeRecursive}</button>
		<button class="clear-btn" onclick={() => onScene('costs')} disabled={running}>
			<i class="fa-solid fa-dice" aria-hidden="true"></i> {strings.mazeCosts}
		</button>
	</div>
	<button class="reset-btn" onclick={onClearAll} disabled={running}>{strings.clearAll}</button>
</div>

<style>
	.field-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 700;
		margin-bottom: 0.3rem;
	}
	select {
		width: 100%;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--control-border);
		border-radius: 6px;
		background: var(--bg-primary);
		color: var(--text-primary);
		font-size: 0.82rem;
	}
	select:focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}
	.warn {
		margin: 0.5rem 0 0;
		padding: 0.5rem 0.6rem;
		border-radius: 6px;
		background: var(--orange-tint);
		color: var(--orange-text);
		border: 1px solid var(--orange);
		font-size: 0.76rem;
		line-height: 1.45;
	}
	.hint {
		font-size: 0.76rem;
		color: var(--text-secondary);
		margin: 0.35rem 0 0.5rem;
	}
	.action-row {
		flex-wrap: wrap;
	}
</style>
