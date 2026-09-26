import Link from 'next/link'

interface Props {
  page: number
  pageCount: number
  href: (page: number) => string
}

export function Pager({ page, pageCount, href }: Props) {
  if (page <= 1 && page >= pageCount) return null
  return (
    <nav className="pager" aria-label="Pagination">
      {page > 1 && <Link href={href(page - 1)}>Prev page</Link>}
      {page < pageCount && <Link href={href(page + 1)}>Next page</Link>}
    </nav>
  )
}
