import { faker } from '@faker-js/faker'
import type { StoryData } from '@repo/hn-core'
import { subDays } from 'date-fns'

function randomize(range: number) {
  return Math.ceil(Math.random() * range)
}

const recentTime = () =>
  Math.floor(faker.date.between({ from: subDays(new Date(), 2), to: new Date() }).getTime() / 1000)

export function mockStory(id: number): StoryData {
  const descendants = randomize(5)
  return {
    id,
    by: faker.person.firstName(),
    score: randomize(100),
    title: faker.lorem.lines(1),
    type: 'story',
    url: faker.helpers.fake('https://www.{{word.noun}}.com'),
    time: recentTime(),
    descendants,
    kids: [...Array(descendants)].map(() => randomize(10)),
  }
}

export function mockNewStory(id: number): StoryData {
  return {
    id,
    by: faker.person.firstName(),
    descendants: 0,
    score: randomize(100),
    title: faker.lorem.lines(1),
    type: 'story',
    url: faker.helpers.fake('https://www.{{word.noun}}.com'),
    time: recentTime(),
  }
}

export function mockStoryWithText(id: number): StoryData {
  return {
    ...mockStory(id),
    text: '<p data-testid="dummy-paragraph">This is a paragraph</p>',
  }
}

export function mockJob(id: number): StoryData {
  return {
    id,
    by: faker.person.firstName(),
    score: 1,
    title: faker.lorem.lines(1),
    time: recentTime(),
    url: faker.helpers.fake('https://www.{{word.noun}}.com'),
    type: 'job',
  }
}
