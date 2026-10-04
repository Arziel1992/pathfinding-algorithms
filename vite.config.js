import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [svelte()],
	// ⛔ MUST be exactly "/pathfinding-algorithms/" or deployed assets 404
	base: "/pathfinding-algorithms/",
});
