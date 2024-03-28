<script setup lang="ts">
  import Navbar from './components/navbar.vue'
</script>

<template>
  <header class="header">
    <Navbar />
  </header>
  <router-view />
  <footer class="footer">
    ©{{ new Date().getFullYear() }} Karsanda
    <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-vue">
      Hacker News - Vue 
    </a>
  </footer>
</template>

<style scoped>
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
</style>
