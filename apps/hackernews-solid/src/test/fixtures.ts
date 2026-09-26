import type { StoryData, ThreadComment } from '@repo/hn-core'

export const story = (id: number, extra: Partial<StoryData> = {}): StoryData => ({
  id,
  by: 'pg',
  score: 1,
  time: 1_700_000_000,
  title: `Story ${id}`,
  type: 'story',
  ...extra,
})

export const comment = (
  id: number,
  by: string | null,
  kids: ThreadComment[] = [],
): ThreadComment => ({
  id,
  by,
  text: by ? `text by ${by}` : null,
  time: 1_700_000_000,
  parent: 0,
  kids,
})
