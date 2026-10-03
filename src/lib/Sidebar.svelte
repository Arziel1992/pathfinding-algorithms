<script>
	/** Sidebar.svelte — Left sidebar: algorithm theory and worked examples. */

	let { strings, algorithm } = $props();

	let info = $derived(strings.algoInfo[algorithm] ?? strings.algoInfo.astar);

	const COLOUR_CLASS = {
		green: 'card-green',
		red: 'card-red',
		blue: 'card-blue',
		orange: 'card-orange',
		purple: 'card-purple',
	};
	const ICON_CLASS = {
		green: 'icon-green',
		red: 'icon-red',
		blue: 'icon-blue',
		orange: 'icon-orange',
		purple: 'icon-purple',
	};
	const PROP_ICON = {
		green: '✓',
		red: '✗',
		blue: '◈',
		orange: '~',
		purple: '◆',
	};
</script>

<div class="md-body" role="region" aria-label={strings.theory}>
	<h2>
		<i class="fa-solid fa-route" aria-hidden="true"></i>
		{strings.theory}
	</h2>

	<!-- Algorithm description -->
	<h3>{info.title}</h3>
	<p>{@html info.body.replace(/\n/g, '<br>')}</p>

	<!-- Properties table as rule cards -->
	{#each info.props as prop}
		<div class="rule-card {COLOUR_CLASS[prop.colour] ?? 'card-blue'}">
			<div class="rule-icon {ICON_CLASS[prop.colour] ?? 'icon-blue'}" aria-hidden="true">
				{PROP_ICON[prop.colour] ?? '·'}
			</div>
			<div class="rule-body">
				<h3>{prop.label}</h3>
				<p>{prop.value}</p>
			</div>
		</div>
	{/each}

	<!-- Complexity formulas -->
	{#if algorithm === 'bfs' || algorithm === 'dfs'}
		<div class="formula-block" aria-label="Time and space complexity">
			T: O(V + E)&nbsp;&nbsp;&nbsp;S: O(V)
		</div>
		<ul class="formula-desc">
			<li><strong>V</strong> — vertices (cells) in the grid</li>
			<li><strong>E</strong> — edges (cell adjacencies)</li>
		</ul>
	{:else if algorithm === 'dijkstra' || algorithm === 'astar' || algorithm === 'greedy'}
		<div class="formula-block" aria-label="Time and space complexity">
			T: O((V + E) log V)&nbsp;&nbsp;&nbsp;S: O(V)
		</div>
		<ul class="formula-desc">
			<li><strong>V</strong> — vertices (cells)</li>
			<li><strong>log V</strong> — from the priority queue (binary heap)</li>
		</ul>
	{:else if algorithm === 'idastar'}
		<div class="formula-block" aria-label="Time and space complexity">
			T: O(b<sup>d</sup>)&nbsp;&nbsp;&nbsp;S: O(d)
		</div>
		<ul class="formula-desc">
			<li><strong>b</strong> — branching factor (≤ 4 or 8)</li>
			<li><strong>d</strong> — depth of the optimal path</li>
			<li><strong>S: O(d)</strong> — only the current path is stored</li>
		</ul>
	{:else if algorithm === 'bibfs'}
		<div class="formula-block" aria-label="Time and space complexity">
			T: O(b<sup>d/2</sup>)&nbsp;&nbsp;&nbsp;S: O(b<sup>d/2</sup>)
		</div>
		<ul class="formula-desc">
			<li><strong>b</strong> — branching factor</li>
			<li><strong>d/2</strong> — half depth: both frontiers meet in the middle</li>
		</ul>
	{/if}

	<!-- Game / industry examples -->
	{#if info.games?.length > 0}
		<h2>
			<i class="fa-solid fa-gamepad" aria-hidden="true"></i>
			{strings.inGames}
		</h2>
		<div class="game-cases">
			{#each info.games as example}
				<article>
					<h4>{example.title}</h4>
					<p>{example.body}</p>
				</article>
			{/each}
		</div>
	{/if}

	<!-- A* heuristic comparison note -->
	{#if algorithm === 'astar'}
		<h2>
			<i class="fa-solid fa-compass" aria-hidden="true"></i>
			Choosing a heuristic
		</h2>
		<div class="rule-card card-blue">
			<div class="rule-icon icon-blue" aria-hidden="true">⬛</div>
			<div class="rule-body">
				<h3>Manhattan (4-dir)</h3>
				<p>|Δr| + |Δc|. Exact for 4-directional unit-cost grids. Use this by default.</p>
			</div>
		</div>
		<div class="rule-card card-green">
			<div class="rule-icon icon-green" aria-hidden="true">↗</div>
			<div class="rule-body">
				<h3>Octile (8-dir)</h3>
				<p>Exact for diagonal movement where diagonals cost √2. Best accuracy for 8-dir grids.</p>
			</div>
		</div>
		<div class="rule-card card-purple">
			<div class="rule-icon icon-purple" aria-hidden="true">◆</div>
			<div class="rule-body">
				<h3>Chebyshev (8-dir)</h3>
				<p>max(|Δr|, |Δc|). Exact when diagonal cost equals cardinal cost. Leads to more "staircased" paths.</p>
			</div>
		</div>
		<div class="rule-card card-orange">
			<div class="rule-icon icon-orange" aria-hidden="true">○</div>
			<div class="rule-body">
				<h3>Euclidean</h3>
				<p>√(Δr² + Δc²). Admissible but not tight. Useful as a teaching comparison.</p>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.fa-solid) {
		font-size: 0.9em;
	}
</style>
