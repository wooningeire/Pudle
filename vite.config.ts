import { sveltekit } from '@sveltejs/kit/vite';
import deno from "@deno/vite-plugin";
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), deno()],
});
