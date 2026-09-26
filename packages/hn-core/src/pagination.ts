export const PAGE_SIZE = 30

/** Parses a `?page=` value, falling back to 1 for missing or invalid input. */
export function getPage(value: string | null | undefined): number {
  const page = Number.parseInt(value ?? '', 10)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export function paginateData<T>(data: readonly T[], page: number): T[] {
  const start = PAGE_SIZE * (page - 1)
  return data.slice(start, start + PAGE_SIZE)
}

export function pageCount(total: number): number {
  return Math.ceil(total / PAGE_SIZE)
}

/** 1-based index of the first item on `page`, for `<ol start>`. */
export function firstItemIndex(page: number): number {
  return PAGE_SIZE * (page - 1) + 1
}
