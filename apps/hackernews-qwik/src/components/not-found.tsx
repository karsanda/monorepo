import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

export const NotFound = component$(() => (
  <div class="status">
    <h1>Not found</h1>
    <p>
      That page, story or user doesn&apos;t exist. <Link href="/">Back to the front page</Link>
    </p>
  </div>
))
