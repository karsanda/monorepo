import { expect, test } from '@playwright/test'

test('home page lists top stories and paginates', async ({ page }) => {
  await page.goto('/')

  const main = page.getByRole('main', { name: 'topstories' })
  await expect(main.getByRole('listitem').first()).toBeVisible()

  await page.getByRole('link', { name: 'Next Page' }).click()
  await expect(page).toHaveURL(/\/topstories\?page=2$/)
  await expect(page.getByRole('list').first()).toHaveAttribute('start', '31')
})

test('nav tabs route to each story type', async ({ page }) => {
  await page.goto('/')

  for (const [label, type] of [
    ['New', 'newstories'],
    ['Best', 'beststories'],
    ['Ask', 'askstories'],
    ['Show', 'showstories'],
    ['Jobs', 'jobstories'],
  ]) {
    await page.getByRole('link', { name: label, exact: true }).click()
    await expect(page.getByRole('main', { name: type })).toBeVisible()
  }
})

test('unknown slugs 404 instead of hitting the API', async ({ page }) => {
  const response = await page.goto('/not-a-story-type')
  expect(response?.status()).toBe(404)
})
