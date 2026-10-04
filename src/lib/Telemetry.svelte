<script>
	/**
	 * Telemetry.svelte — Read-only: run metrics, the verdict on the learner's
	 * prediction, the compare-all table, and the legend. Every cost is metres.
	 */
	import { CELL_METRES, sameCost } from './evaluate.js';

	let { telemetry, comparison, algorithm, limit, strings, fmt, num } = $props();

	const m = (v) => (v === null || v === undefined ? '—' : `${num.format(v)} ${strings.metres}`);
	const pct = (v, best) => Math.round(((v - best) / best) * 100);

	const STATUS_CARD = { idle: 'blue', running: 'orange', paused: 'orange', done: 'green', noPath: 'red', gaveUp: 'red' };
	const statusText = $derived(fmt(strings.statuses[telemetry.status] ?? telemetry.status, { n: num.format(limit) }));
	const optimal = $derived(
		telemetry.pathCost === null || telemetry.best === null ? null : sameCost(telemetry.pathCost, telemetry.best),
	);
</script>

<section class="telemetry-panel" aria-labelledby="tele-heading">
	<div class="section-header" style="margin-top:1rem">
		<h2 id="tele-heading">{strings.telemetry}</h2>
	</div>

	<p class="status card-{STATUS_CARD[telemetry.status]}" role="status">{statusText}</p>

	<dl class="stats">
		<dt>{strings.expanded}</dt>
		<dd>{num.format(telemetry.expanded)}</dd>
		<dt>{strings.frontier}</dt>
		<dd>{num.format(telemetry.frontier)}</dd>
		<dt>{strings.pathCost}</dt>
		<dd>
			{m(telemetry.pathCost)}
			{#if optimal === true}<span class="tag good">{strings.optimalYes}</span>{/if}
			{#if optimal === false}<span class="tag bad">{fmt(strings.optimalNo, { pct: pct(telemetry.pathCost, telemetry.best) })}</span>{/if}
		</dd>
		<dt>{strings.pathSteps}</dt>
		<dd>{telemetry.pathSteps || '—'}</dd>
		<dt>{strings.bestCost}</dt>
		<dd>{m(telemetry.best)}</dd>
		{#if algorithm === 'idastar' && telemetry.threshold !== null}
			<dt>{strings.threshold}</dt>
			<dd>{m(telemetry.threshold)}</dd>
		{/if}
	</dl>
	<p class="hint">{fmt(strings.scale, { m: CELL_METRES })}</p>

	{#if comparison}
		<div class="section-header"><h2>{strings.compareTitle}</h2></div>
		<table class="compare">
			<caption>{fmt(strings.compareCaption, { best: comparison.best === null ? strings.none : num.format(comparison.best) })}</caption>
			<thead>
				<tr>
					<th scope="col">{strings.colAlgo}</th>
					<th scope="col">{strings.colExpanded}</th>
					<th scope="col">{strings.colCost}</th>
					<th scope="col">{strings.colOptimal}</th>
				</tr>
			</thead>
			<tbody>
				{#each comparison.rows as row (row.id)}
					<tr class:current={row.id === algorithm}>
						<th scope="row">{strings.algoNames[row.id]}</th>
						<td>{num.format(row.expanded)}</td>
						<td>{row.gaveUp ? strings.gaveUp : row.cost === null ? '—' : num.format(row.cost)}</td>
						<td class={row.optimal ? 'good' : 'bad'}>{row.gaveUp ? '—' : row.optimal ? strings.yes : strings.no}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<div class="section-header"><h2>{strings.legend}</h2></div>
	<ul class="legend-list">
		<li><span class="swatch" style="background:var(--cell-start)"></span>{strings.legendStart}</li>
		<li><span class="swatch" style="background:var(--cell-end)"></span>{strings.legendEnd}</li>
		<li><span class="swatch" style="background:var(--cell-wall)"></span>{strings.legendWall}</li>
		<li><span class="swatch mud">5</span>{strings.legendWeight}</li>
		<li><span class="swatch dot" style="background:var(--cell-open);--dot:var(--cell-open-dot)"></span>{strings.legendOpen}</li>
		<li><span class="swatch" style="background:var(--cell-closed)"></span>{strings.legendClosed}</li>
		<li><span class="swatch line" style="--line:var(--cell-path)"></span>{strings.legendPath}</li>
		<li><span class="swatch line dashed" style="--line:var(--cell-predicted)"></span>{strings.legendPredicted}</li>
		{#if algorithm === 'bibfs'}
			<li><span class="swatch dot" style="background:var(--cell-open-bwd);--dot:var(--cell-open-bwd-dot)"></span>{strings.legendBwdOpen}</li>
			<li><span class="swatch" style="background:var(--cell-closed-bwd)"></span>{strings.legendBwdClosed}</li>
		{/if}
	</ul>
</section>

<style>
	.status {
		margin: 0.4rem 0 0.6rem;
		padding: 0.45rem 0.6rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 700;
	}
	.stats {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.3rem 0.75rem;
		margin: 0;
		font-size: 0.82rem;
	}
	.stats dt {
		color: var(--text-secondary);
		font-weight: 600;
	}
	.stats dd {
		margin: 0;
		text-align: right;
		font-family: var(--mono);
		font-weight: 700;
		color: var(--text-primary);
	}
	.tag {
		display: inline-block;
		margin-left: 0.3rem;
		padding: 0 0.35rem;
		border-radius: 4px;
		font-family: var(--sans);
		font-size: 0.7rem;
		border: 1px solid currentColor;
	}
	.good {
		color: var(--good);
	}
	.bad {
		color: var(--bad);
	}
	.hint {
		font-size: 0.74rem;
		color: var(--text-secondary);
		margin: 0.4rem 0 0;
	}
	.compare {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.74rem;
	}
	.compare caption {
		caption-side: bottom;
		text-align: left;
		color: var(--text-secondary);
		padding-top: 0.3rem;
	}
	.compare th,
	.compare td {
		padding: 0.25rem 0.3rem;
		border-bottom: 1px solid var(--panel-border);
		text-align: right;
	}
	.compare th[scope='row'],
	.compare th[scope='col']:first-child {
		text-align: left;
		font-weight: 600;
	}
	.compare td {
		font-family: var(--mono);
	}
	.compare tr.current th[scope='row'] {
		color: var(--accent);
		font-weight: 800;
	}
	.legend-list {
		list-style: none;
		padding: 0;
		margin: 0.4rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.78rem;
	}
	.legend-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.swatch {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		border-radius: 3px;
		border: 1px solid var(--panel-border);
		position: relative;
		background: var(--cell-empty);
	}
	.swatch.mud {
		background: rgba(var(--cell-mud-rgb), 0.47);
		color: var(--cell-mud-text);
		font: 700 0.62rem/14px var(--mono);
		text-align: center;
	}
	.swatch.dot::after {
		content: '';
		position: absolute;
		inset: 5px;
		border-radius: 50%;
		background: var(--dot);
	}
	.swatch.line::after {
		content: '';
		position: absolute;
		left: 1px;
		right: 1px;
		top: 6px;
		border-top: 3px solid var(--line);
	}
	.swatch.line.dashed::after {
		border-top-style: dashed;
	}
</style>
