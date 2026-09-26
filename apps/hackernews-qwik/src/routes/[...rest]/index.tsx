import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { NotFound } from '~/components/not-found'

// Anything no other route matches.
export const useNotFound = routeLoader$(({ status }) => void status(404))

export default component$(() => {
  useNotFound()
  return <NotFound />
})

export const head: DocumentHead = { title: 'Not found' }
