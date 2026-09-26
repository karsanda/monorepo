import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { formatJoinDate } from '@repo/hn-core'
import { NotFound } from '~/components/not-found'
import { Submissions } from '~/components/submissions'
import { loadUser } from '~/lib/data'

export const useUser = routeLoader$(async ({ params, status }) => {
  const data = await loadUser(params.id)
  if (!data) status(404)
  return data
})

export default component$(() => {
  const data = useUser().value
  if (!data) return <NotFound />
  const { user, stories } = data

  return (
    <>
      <h1 class="visually-hidden">Profile: {user.id}</h1>

      <dl class="user-grid">
        <dt>User:</dt>
        <dd>{user.id}</dd>
        <dt>Karma:</dt>
        <dd>{user.karma}</dd>
        <dt>Created:</dt>
        <dd>{formatJoinDate(user.created)}</dd>
        {user.about && (
          <>
            <dt>About:</dt>
            <dd class="about" dangerouslySetInnerHTML={user.about} />
          </>
        )}
      </dl>

      <Submissions key={user.id} user={user.id} firstStories={stories} />
    </>
  )
})

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useUser)
  return { title: data ? `Profile: ${data.user.id}` : 'Not found' }
}
