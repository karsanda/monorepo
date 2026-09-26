/**
 * Title template and `<html data-theme>`, shared by `app.vue` and `error.vue` (which Nuxt
 * renders instead of `app.vue`). The theme comes from the cookie, so the server renders it and
 * dark mode doesn't flash on load.
 */
export function useAppHead() {
  const theme = useTheme()
  useHead({
    titleTemplate: (title) => (title ? `${title} | Hacker News - Nuxt` : 'Hacker News - Nuxt'),
    htmlAttrs: { 'data-theme': () => theme.value },
  })
}
