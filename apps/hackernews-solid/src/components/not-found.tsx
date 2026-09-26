import { HttpStatusCode } from '@solidjs/start'
import { Title } from '@solidjs/meta'
import { pageTitle } from '~/lib/meta'

export function NotFound() {
  return (
    <div class="status">
      <HttpStatusCode code={404} />
      <Title>{pageTitle('Not found')}</Title>
      <h1>Not found</h1>
      <p>
        That page, story or user doesn't exist. <a href="/">Back to top stories</a>
      </p>
    </div>
  )
}
