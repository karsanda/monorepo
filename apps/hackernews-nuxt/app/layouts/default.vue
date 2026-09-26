<template>
  <div class="app">
    <SiteHeader />
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      ©{{ new Date().getFullYear() }} Karsanda ·
      <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-nuxt">Source</a>
    </footer>
  </div>
</template>
