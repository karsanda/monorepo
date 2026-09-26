<script lang="ts">
  import { resolve } from '$app/paths'
  import type { StoryType } from '@repo/hn-core'
  import type { Snippet } from 'svelte'
  import './styles.css'

  let { children }: { children: Snippet } = $props()

  const tabs: [label: string, slug: StoryType][] = [
    ['New', 'newstories'],
    ['Best', 'beststories'],
    ['Ask', 'askstories'],
    ['Show', 'showstories'],
    ['Jobs', 'jobstories'],
  ]
</script>

<div class='app'>
	<header class='header'>
		<nav class='navbar'>
			<a class='navlink' href={resolve('/')}><h1 class='title'>Hacker News - Svelte</h1></a>
			{#each tabs as [label, slug] (slug)}
				<a class='navlink' href={resolve('/[[slug=storytype]]', { slug })}>{label}</a>
			{/each}
		</nav>
	</header>

	{@render children()}

	<footer class='footer'>
		©{new Date().getFullYear()} Karsanda
		<a href='https://github.com/karsanda/monorepo/tree/main/apps/hackernews-svelte'>
			Hacker News - Svelte
		</a>
	</footer>
</div>

<style>
	.navbar {
		display: flex;
		align-items: center;
		line-height: 1em;
	}

	.navlink {
		color: var(--white);
		padding: 0 8px;
		font-weight: 400;
		height: 14px;
	}

	.title {
		color: var(--primary-color);
		font-size: 14px;
		margin-right: 10px;
		font-weight: 600;
	}

	.header {
		padding: 10px;
		background-color: var(--dark-bg);
	}

	.footer {
		border-top: 2px solid var(--primary-color);
		margin: 0 5px;
		padding: 10px 0;
		text-align: center;
		font-size: 11px;
	}

	@media only screen and (max-width: 400px) {
		.title {
			font-size: 14px;
		}

		.navlink {
			font-size: 12px;
			padding: 0 7px;
			height: 12px;
		}
	}

	@media only screen and (max-width: 360px) {
		.title {
			font-size: 13px;
			margin-right: 7px;
		}
	}
</style>
