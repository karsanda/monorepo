# Hacker News – Svelte

Svelte 5 (runes) + SvelteKit 2, deployed with `@sveltejs/adapter-vercel`. Story lists and item/user pages are loaded on the server over the HN REST API (`src/lib/hn.ts`); `/` and `/<storytype>` share one `[[slug=storytype]]` route.

See the [root README](../../README.md) for setup and commands.
