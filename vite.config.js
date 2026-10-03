import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	// ⛔ MUST be exactly "/pathfinding-algorithms/" or deployed assets 404
	base: '/pathfinding-algorithms/',
});
