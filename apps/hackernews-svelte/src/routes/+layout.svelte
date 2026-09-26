<script lang="ts">
  import { NAV_TABS, themeCookie, type Theme } from '@repo/hn-core'
  import '@repo/hn-styles/index.css'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { APP_NAME } from '$lib/meta'
  import { prefs } from '$lib/prefs.svelte'
  import { onMount } from 'svelte'
  import type { LayoutProps } from './$types'

  let { data, children }: LayoutProps = $props()

  let chosenTheme = $state<Theme>()
  let systemDark = $state(false)
  const theme = $derived(chosenTheme ?? data.theme ?? (systemDark ? 'dark' : 'light'))

  onMount(() => {
    prefs.load()
    const query = matchMedia('(prefers-color-scheme: dark)')
    systemDark = query.matches
    const onChange = () => (systemDark = query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  })

  function toggleTheme() {
    chosenTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = chosenTheme
    document.cookie = themeCookie(chosenTheme)
  }
</script>

<div class="app">
  <header class="header">
    <nav class="navbar" aria-label="Main">
      <a class="brand" href={resolve('/')}>{APP_NAME}</a>
      {#each NAV_TABS as tab (tab.type)}
        <a
          class="navlink"
          href={resolve('/[[slug=storytype]]', { slug: tab.type })}
          aria-current={page.url.pathname === `/${tab.type}` ? 'page' : undefined}
        >
          {tab.label}
        </a>
      {/each}
      <div class="navbar-actions">
        <form class="search-form" role="search" action={resolve('/search')}>
          <input
            type="search"
            name="q"
            placeholder="Search"
            aria-label="Search stories"
            value={page.url.pathname === '/search' ? page.url.searchParams.get('q') : ''}
          />
        </form>
        <button class="theme-toggle" type="button" onclick={toggleTheme}>
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span class="visually-hidden">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</span>
        </button>
      </div>
    </nav>
  </header>

  <main class="main">
    {@render children()}
  </main>

  <footer class="footer">
    ©{new Date().getFullYear()} Karsanda ·
    <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-svelte">Source</a>
  </footer>
</div>

<style>
  :global(:root) {
    --brand: #ff3e00;
  }
</style>
