import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'

function randomize(range: number) {
  return Math.ceil(Math.random() * range)
}

export function mockComment(id: string, parent: string): CommentData {
  const descendants = randomize(3)
  return {
    id,
    by: faker.name.firstName(),
    parent: Number(parent),
    text: '<p data-testid="dummy-comment">This is a comment</p>',
    time: Math.floor(faker.date.between(subDays(new Date(), 2), new Date).getTime() / 1000),
    type: 'comment',
    kids: [...Array(descendants)].map(() => randomize(1000))
  }
}