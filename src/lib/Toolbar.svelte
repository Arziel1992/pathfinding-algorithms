<script>
	/**
	 * Toolbar.svelte — the house toolbar: Manual, language, theme, floating at
	 * the top right of the main panel, as every house tool shows it.
	 *
	 * SHARED FILE (shell: house). Byte-identical in Templates/svelte-app and in
	 * every tool whose catalogue record says `shell: house`;
	 * Scripts/check_conformance.py fails a tool whose copy differs. Change it
	 * here, in the template, then copy it to the tools.
	 *
	 * All text comes from the locale strings: toolbarLabel, manualButton,
	 * languageLabel, themeToggle. `locales` maps a code to the language's own
	 * name ("English", "Español"), which is never translated.
	 */
	let { strings, locale, theme, locales, onmanual, onlocale, ontheme } = $props();
</script>

<div class="float-toolbar" role="toolbar" aria-label={strings.toolbarLabel}>
	<button type="button" onclick={onmanual}>
		<i class="fa-solid fa-book-open" aria-hidden="true"></i>
		{strings.manualButton}
	</button>
	<label class="visually-hidden" for="locale">{strings.languageLabel}</label>
	<select id="locale" value={locale} onchange={(event) => onlocale(event.currentTarget.value)}>
		{#each Object.entries(locales) as [code, name] (code)}
			<option value={code} lang={code}>{name}</option>
		{/each}
	</select>
	<button type="button" aria-pressed={theme === 'dark'} onclick={ontheme}>
		<i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
		{strings.themeToggle}
	</button>
</div>

<style>
	.float-toolbar {
		position: absolute;
		top: 0.6rem;
		right: 2.4rem;
		z-index: 150;
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}

	.float-toolbar button,
	.float-toolbar select {
		background: var(--glass-bg);
		backdrop-filter: blur(6px);
		border: 1px solid var(--control-border);
		border-radius: 99px;
		padding: 0.3rem 0.75rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.float-toolbar button:hover,
	.float-toolbar select:hover {
		border-color: var(--accent);
	}

	.float-toolbar button[aria-pressed='true'] {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--accent-text);
	}

	@media (max-width: 899px) {
		.float-toolbar {
			right: 0.6rem;
			flex-wrap: wrap;
			justify-content: flex-end;
		}
	}
</style>
