import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'

function randomize(range: number) {
  return Math.ceil(Math.random() * range)
}

export function mockStories(n: number) {
  return [...Array(n).keys()]
}

export function mockStory(id: string) {
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

export function mockNewStory(id: string) {
  return {
    id,
    by: faker.name.firstName(),
    score: randomize(100),
    title: faker.lorem.lines(1),
    type: 'story',
    url: faker.fake('https://www.{{word.noun}}.com'),
    time: Math.floor(faker.date.between(subDays(new Date(), 2), new Date).getTime() / 1000),
    descendants: 0,
  }
}

export function mockAsk(id: string) {
  return {
    ...mockStory(id),
    text: '<p data-testid="dummy-paragraph">This is a paragraph</p>'
  }
}

export function mockJob(id: string) {
  return {
    id,
    by: faker.name.firstName(),
    score: 1,
    title: faker.lorem.lines(1),
    time: Math.floor(faker.date.between(subDays(new Date(), 2), new Date).getTime() / 1000),
    url: faker.fake('https://www.{{word.noun}}.com'),
    type: 'job'
  }
}