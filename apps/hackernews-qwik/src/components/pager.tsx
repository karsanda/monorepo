import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

interface Props {
  page: number
  pageCount: number
  /** URL up to the page number, e.g. `/newstories?page=`. */
  prefix: string
}

export const Pager = component$<Props>(({ page, pageCount, prefix }) => {
  if (page <= 1 && page >= pageCount) return null
  return (
    <nav class="pager" aria-label="Pagination">
      {page > 1 && <Link href={`${prefix}${page - 1}`}>Prev page</Link>}
      {page < pageCount && <Link href={`${prefix}${page + 1}`}>Next page</Link>}
    </nav>
  )
})
