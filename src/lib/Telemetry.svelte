<script>
	/** Telemetry.svelte — Live algorithm run metrics panel. */

	let { telemetry, strings } = $props();

	const STATUS_COLOUR = {
		idle: 'blue',
		running: 'orange',
		paused: 'orange',
		done: 'green',
		noPath: 'red',
	};

	let colour = $derived(STATUS_COLOUR[telemetry.status] ?? 'blue');
</script>

<div class="telemetry-panel" aria-live="polite" aria-label={strings.telemetry}>
	<div class="section-header" style="margin-top:0">
		<h2>{strings.telemetry}</h2>
	</div>

	<!-- Status badge -->
	<div class="stat-row">
		<span class="stat-label">{strings.status}</span>
		<span class="stat-val badge-status card-{colour}">
			{strings.statuses[telemetry.status] ?? telemetry.status}
		</span>
	</div>

	<div class="stat-row">
		<span class="stat-label">{strings.visited}</span>
		<output class="stat-num">{telemetry.visited.toLocaleString()}</output>
	</div>

	<div class="stat-row">
		<span class="stat-label">{strings.pathLength}</span>
		<output class="stat-num">
			{telemetry.pathLength > 0 ? `${telemetry.pathLength} ${strings.cells}` : '—'}
		</output>
	</div>

	<div class="stat-row">
		<span class="stat-label">{strings.elapsed}</span>
		<output class="stat-num">
			{telemetry.elapsed > 0 ? `${telemetry.elapsed} ${strings.ms}` : '—'}
		</output>
	</div>

	<!-- Legend -->
	<div class="section-header">
		<h2>{strings.legend}</h2>
	</div>
	<ul class="legend-list" aria-label={strings.legend}>
		<li><span class="swatch start"></span>{strings.legendStart}</li>
		<li><span class="swatch end"></span>{strings.legendEnd}</li>
		<li><span class="swatch wall"></span>{strings.legendWall}</li>
		<li><span class="swatch weight"></span>{strings.legendWeight}</li>
		<li><span class="swatch open"></span>{strings.legendOpen}</li>
		<li><span class="swatch closed"></span>{strings.legendClosed}</li>
		<li><span class="swatch path"></span>{strings.legendPath}</li>
		<li><span class="swatch open-bwd"></span>{strings.legendBwdOpen}</li>
		<li><span class="swatch closed-bwd"></span>{strings.legendBwdClosed}</li>
	</ul>
</div>

<style>
	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.82rem;
		margin: 0.35rem 0;
	}
	.stat-label {
		color: var(--text-secondary);
		font-weight: 600;
		flex-shrink: 0;
	}
	.stat-num {
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
		font-size: 0.78rem;
		text-align: right;
	}
	.badge-status {
		padding: 0.15rem 0.5rem;
		border-radius: 99px;
		font-size: 0.72rem;
		font-weight: 700;
		text-align: right;
		line-height: 1.4;
	}
	.legend-list {
		list-style: none;
		padding: 0;
		margin: 0.4rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.78rem;
		color: var(--text-primary);
	}
	.legend-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.swatch {
		display: inline-block;
		width: 14px;
		height: 14px;
		border-radius: 3px;
		flex-shrink: 0;
		border: 1px solid var(--panel-border);
	}
	.swatch.start { background: #10b981; }
	.swatch.end { background: #ef4444; }
	.swatch.wall { background: #1e293b; }
	.swatch.weight { background: rgba(139,92,246,0.55); }
	.swatch.open { background: rgba(251,191,36,0.75); }
	.swatch.closed { background: rgba(59,130,246,0.55); }
	.swatch.path { background: #fbbf24; }
	.swatch.open-bwd { background: rgba(167,139,250,0.75); }
	.swatch.closed-bwd { background: rgba(139,92,246,0.55); }

	:global([data-theme='dark']) .swatch.start { background: #34d399; }
	:global([data-theme='dark']) .swatch.end { background: #f87171; }
	:global([data-theme='dark']) .swatch.wall { background: #334155; }
</style>
