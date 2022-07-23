import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'

function randomize(range: number) {
  return Math.floor(Math.random() * range)
}

export function mockStories(n: number) {
  return [...Array(n).keys()]
}

export function mockStory(id: number) {
  const descendants = randomize(5)
  return {
    id,
    by: faker.name.firstName(), 
    score: randomize(100),
    title: faker.lorem.lines(1),
    type: 'story',
    url: faker.fake('https://www.{{word.noun}}.com'),
    time: Math.floor(faker.date.between(subDays(new Date(), 2), new Date).getTime() / 1000),
    descendants,
    kids: [...Array(descendants)].map(() => randomize(1000))
  }
}