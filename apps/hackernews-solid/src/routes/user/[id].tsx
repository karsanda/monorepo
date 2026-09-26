import { formatJoinDate } from '@repo/hn-core'
import { Title } from '@solidjs/meta'
import { createAsync, useParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import { NotFound } from '~/components/not-found'
import { Submissions } from '~/components/submissions'
import { pageTitle } from '~/lib/meta'
import { getUser } from '~/lib/queries'

export const route = {
  preload: ({ params }) => getUser(params.id!),
} satisfies RouteDefinition

export default function UserPage() {
  const params = useParams<{ id: string }>()
  // Held back from streaming until it resolves, so a missing user can still answer 404.
  const data = createAsync(() => getUser(params.id), { deferStream: true })

  return (
    <Show when={data() !== undefined}>
      <Show when={data()} keyed fallback={<NotFound />}>
        {({ user, stories }) => (
          <>
            <Title>{pageTitle(`Profile: ${user.id}`)}</Title>
            <h1 class="visually-hidden">Profile: {user.id}</h1>

            <dl class="user-grid">
              <dt>User:</dt>
              <dd>{user.id}</dd>
              <dt>Karma:</dt>
              <dd>{user.karma}</dd>
              <dt>Created:</dt>
              <dd>{formatJoinDate(user.created)}</dd>
              <Show when={user.about}>
                {(about) => (
                  <>
                    <dt>About:</dt>
                    <dd class="about" innerHTML={about()} />
                  </>
                )}
              </Show>
            </dl>

            <Submissions user={user.id} firstStories={stories} />
          </>
        )}
      </Show>
    </Show>
  )
}
