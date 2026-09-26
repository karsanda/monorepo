import { faker } from '@faker-js/faker'
import type { CommentData } from '@repo/hn-core'
import { subDays } from 'date-fns'

function randomize(range: number) {
  return Math.ceil(Math.random() * range)
}

export function mockComment(id: number, parent: number): CommentData {
  const descendants = randomize(3)
  return {
    id,
    by: faker.person.firstName(),
    parent,
    text: '<p data-testid="dummy-comment">This is a comment</p>',
    time: Math.floor(
      faker.date.between({ from: subDays(new Date(), 2), to: new Date() }).getTime() / 1000,
    ),
    type: 'comment',
    kids: [...Array(descendants)].map(() => randomize(1000)),
  }
}
