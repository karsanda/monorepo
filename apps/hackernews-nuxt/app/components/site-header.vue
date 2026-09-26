<script setup lang="ts">
import { NAV_TABS } from '@repo/hn-core'

const route = useRoute()
const savedTheme = useTheme()

const systemDark = ref(false)
const theme = computed(() => savedTheme.value ?? (systemDark.value ? 'dark' : 'light'))

onMounted(() => {
  const query = matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = query.matches
  const onChange = () => (systemDark.value = query.matches)
  query.addEventListener('change', onChange)
  onBeforeUnmount(() => query.removeEventListener('change', onChange))
})

function toggleTheme() {
  savedTheme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const query = ref('')
watch(
  () => (route.path === '/search' ? (queryString(route.query.q) ?? '') : ''),
  (q) => (query.value = q),
  { immediate: true },
)

function search() {
  return navigateTo({ path: '/search', query: { q: query.value } })
}
</script>

<template>
  <header class="header">
    <nav class="navbar" aria-label="Main">
      <!-- Only the tabs are marked current; RouterLink would also mark the brand on "/". -->
      <NuxtLink class="brand" to="/" :aria-current="undefined">Hacker News - Nuxt</NuxtLink>
      <NuxtLink
        v-for="tab in NAV_TABS"
        :key="tab.type"
        class="navlink"
        :to="`/${tab.type}`"
        :aria-current="route.path === `/${tab.type}` ? 'page' : undefined"
      >
        {{ tab.label }}
      </NuxtLink>
      <div class="navbar-actions">
        <form class="search-form" role="search" action="/search" @submit.prevent="search">
          <input
            v-model="query"
            type="search"
            name="q"
            placeholder="Search"
            aria-label="Search stories"
          />
        </form>
        <button class="theme-toggle" type="button" @click="toggleTheme">
          <span aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span>
          <span class="visually-hidden">
            Switch to {{ theme === 'dark' ? 'light' : 'dark' }} theme
          </span>
        </button>
      </div>
    </nav>
  </header>
</template>
