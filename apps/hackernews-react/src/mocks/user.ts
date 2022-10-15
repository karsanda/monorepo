import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'

function randomize(range: number) {
  return Math.ceil(Math.random() * range)
}

export function mockUser(id: string, submitted: string[]): UserData {
  return {
    id,
    created: Math.floor(faker.date.between(subDays(new Date(), 10), new Date).getTime() / 1000),
    karma: randomize(1000),
    about: faker.lorem.lines(10),
    submitted
  }
}