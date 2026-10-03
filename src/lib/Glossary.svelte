<script>
	/** Glossary.svelte — Modal dialog listing all algorithm and grid terms. */

	let { strings, open = $bindable(false) } = $props();

	let dialog = $state(null);

	$effect(() => {
		if (!dialog) return;
		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});

	function handleClose() {
		open = false;
	}

	function handleBackdropClick(e) {
		if (e.target === dialog) open = false;
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') open = false;
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="modal-content"
	aria-label={strings.glossaryTitle}
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	onclose={handleClose}
>
	<div class="glossary-inner">
		<div class="glossary-head">
			<h2>{strings.glossaryTitle}</h2>
			<button
				class="close-btn"
				onclick={handleClose}
				aria-label={strings.glossaryClose}
			>✕</button>
		</div>

		<ul class="glossary-list" role="list">
			{#each strings.glossary as entry}
				<li>
					<dt class="term">{entry.term}</dt>
					<dd class="def">{entry.def}</dd>
				</li>
			{/each}
		</ul>
	</div>
</dialog>

<style>
	.glossary-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.glossary-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--panel-border);
		flex-shrink: 0;
	}
	.glossary-head h2 {
		font-size: 1.1rem;
		color: var(--text-primary);
		margin: 0;
	}
	.close-btn {
		background: transparent;
		border: 1px solid var(--control-border);
		border-radius: 6px;
		color: var(--text-secondary);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
	}
	.close-btn:hover {
		background: var(--red-tint);
		border-color: var(--red);
		color: var(--red-text);
	}
	.glossary-list {
		list-style: none;
		padding: 1rem 1.25rem;
		margin: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	.term {
		font-weight: 700;
		color: var(--accent);
		font-family: var(--mono);
		font-size: 0.88rem;
		margin: 0 0 0.25rem;
	}
	.def {
		margin: 0;
		font-size: 0.84rem;
		color: var(--text-primary);
		line-height: 1.55;
	}
</style>
