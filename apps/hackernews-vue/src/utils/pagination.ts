export const PAGE_SIZE = 30

export function getPage(page: string) {
  return page ? parseInt(page) : 1
}

export function paginateData(data: number[], page: number) {
  return data.slice((30 * (page - 1)), (30 * (page -1 ) + PAGE_SIZE))
}