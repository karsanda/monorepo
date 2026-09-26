import { Show } from 'solid-js'

interface Props {
  page: number
  pageCount: number
  href: (page: number) => string
}

export function Pager(props: Props) {
  return (
    <Show when={props.page > 1 || props.page < props.pageCount}>
      <nav class="pager" aria-label="Pagination">
        <Show when={props.page > 1}>
          <a href={props.href(props.page - 1)}>Prev page</a>
        </Show>
        <Show when={props.page < props.pageCount}>
          <a href={props.href(props.page + 1)}>Next page</a>
        </Show>
      </nav>
    </Show>
  )
}
