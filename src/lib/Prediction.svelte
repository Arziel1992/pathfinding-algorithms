<script>
	/**
	 * Prediction.svelte — The verdict on the learner's sketched route, shown
	 * under the grid where their eyes already are. Read-only.
	 */
	import { sameCost } from './evaluate.js';

	let { prediction, predictedCells, strings, fmt, num } = $props();
	const pct = (v, best) => Math.round(((v - best) / best) * 100);
</script>

<section class="predict" aria-labelledby="predict-heading" aria-live="polite">
	<h2 id="predict-heading">{strings.predictTitle}</h2>
	{#if prediction?.valid}
		<p>
			{fmt(strings.predictCost, { cost: num.format(prediction.cost) })}
			{#if prediction.best !== null && sameCost(prediction.cost, prediction.best)}
				<span class="good"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> {strings.predictOptimal}</span>
			{:else if prediction.best !== null}
				<span class="bad">
					<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
					{fmt(strings.predictAbove, { best: num.format(prediction.best), pct: pct(prediction.cost, prediction.best) })}
				</span>
			{/if}
			{fmt(strings.predictOverlap, { pct: Math.round(prediction.overlap * 100) })}
		</p>
	{:else if prediction}
		<p class="bad">
			<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
			{fmt(strings.predictReasons[prediction.reason], { r: (prediction.at?.r ?? 0) + 1, c: (prediction.at?.c ?? 0) + 1 })}
		</p>
	{:else if predictedCells > 0}
		<p>{fmt(strings.predictDrawn, { n: predictedCells })}</p>
	{:else}
		<p>{strings.predictHint}</p>
	{/if}
</section>

<style>
	.predict {
		width: 100%;
		margin-top: 0.6rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--panel-border);
		border-left: 4px solid var(--cell-predicted);
		border-radius: 6px;
		background: var(--bg-secondary);
	}
	h2 {
		margin: 0 0 0.15rem;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}
	p {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.45;
	}
	.good {
		color: var(--good);
		font-weight: 700;
	}
	.bad {
		color: var(--bad);
		font-weight: 700;
	}
</style>
