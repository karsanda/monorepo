import { component$ } from '@builder.io/qwik'

export const LoadError = component$<{ what: string }>(({ what }) => (
  <p class="status" role="alert">
    Couldn&apos;t load {what}. Hacker News may be slow right now;{' '}
    <button class="link-button" type="button" onClick$={() => location.reload()}>
      try again
    </button>
    .
  </p>
))
