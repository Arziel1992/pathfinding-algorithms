<script>
	/** Sidebar.svelte — Left rail: the selected algorithm's theory. Content only. */

	let { strings, algorithm, onglossary } = $props();

	const info = $derived(strings.algoInfo[algorithm] ?? strings.algoInfo.astar);
	const complexity = $derived(strings.complexity[algorithm]);
	const ICON = { green: 'fa-check', red: 'fa-xmark', blue: 'fa-compass', orange: 'fa-circle-info', purple: 'fa-memory' };
</script>

<section class="md-body" aria-labelledby="theory-heading">
	<h2 id="theory-heading" class="with-help">
		<span><i class="fa-solid fa-route" aria-hidden="true"></i> {strings.theory}</span>
		<button class="glossary-btn" onclick={() => onglossary('g')} aria-label={strings.openGlossary} title={strings.openGlossary}>?</button>
	</h2>

	<h3>{info.title}</h3>
	<p>{info.body}</p>

	{#each info.props as prop (prop.label)}
		<div class="rule-card card-{prop.colour}">
			<div class="rule-icon icon-{prop.colour}" aria-hidden="true">
				<i class="fa-solid {ICON[prop.colour]}"></i>
			</div>
			<div class="rule-body">
				<h4>{prop.label}</h4>
				<p>{prop.value}</p>
			</div>
		</div>
	{/each}

	{#if complexity}
		<h3>{strings.complexityLabel}</h3>
		<div class="formula-block">{complexity.formula}</div>
		<ul class="formula-desc">
			{#each complexity.items as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}

	{#if ['astar', 'greedy', 'idastar'].includes(algorithm)}
		<h2>
			<i class="fa-solid fa-compass" aria-hidden="true"></i>
			{strings.heuristicGuideTitle}
		</h2>
		{#each strings.heuristicGuide as h (h.name)}
			<div class="rule-card card-blue">
				<div class="rule-body">
					<h4>{h.name}</h4>
					<p>{h.body}</p>
				</div>
			</div>
		{/each}
	{/if}

	{#if info.games?.length}
		<h2>
			<i class="fa-solid fa-gamepad" aria-hidden="true"></i>
			{strings.inGames}
		</h2>
		<div class="game-cases">
			{#each info.games as example (example.title)}
				<article>
					<h4>{example.title}</h4>
					<p>{example.body}</p>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	.with-help {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.formula-block {
		white-space: pre;
	}
	.rule-body h4 {
		margin: 0 0 0.15rem;
		font-size: 0.85rem;
	}
</style>
