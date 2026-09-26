import { expect, test } from '@playwright/test'

test('comments page shows a thread with collapsible comments', async ({ page }) => {
  // HN item 1 ("Y Combinator" by pg) has a small, stable thread.
  await page.goto('/comments/1')
  await expect(page.getByRole('heading', { name: 'Y Combinator' })).toBeVisible()
  await expect(page).toHaveTitle(/Y Combinator/)

  const collapse = page.getByRole('button', { name: /collapse comment by sama/i })
  await expect(collapse).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('Is there anywhere to eat on Sandhill Road?')).toBeVisible()

  await collapse.click()
  const expand = page.getByRole('button', { name: /expand comment by sama/i })
  await expect(expand).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByText('Is there anywhere to eat on Sandhill Road?')).toBeHidden()
})

test('comments load in one request', async ({ page }) => {
  const itemRequests: string[] = []
  page.on('request', (req) => {
    if (/firebaseio\.com\/v0\/item\//.test(req.url())) itemRequests.push(req.url())
  })
  await page.goto('/comments/1')
  await expect(page.getByText('sure', { exact: true })).toBeVisible()
  // Server-rendered apps make no item requests from the browser at all.
  expect(itemRequests.length).toBeLessThanOrEqual(1)
})

test('user page shows the profile and paginates submissions', async ({ page }) => {
  await page.goto('/user/pg')
  await expect(page.getByText('karma', { exact: false }).first()).toBeVisible()
  await expect(page).toHaveTitle(/pg/)

  const submissions = page.getByRole('button', { name: 'Submissions' })
  const comments = page.getByRole('button', { name: 'Comments' })
  await expect(submissions).toHaveAttribute('aria-pressed', 'true')

  const list = page.getByRole('list', { name: 'Submissions' })
  await expect(list.getByRole('listitem')).toHaveCount(30)
  await page.getByRole('button', { name: /load more/i }).click()
  await expect(list.getByRole('listitem')).toHaveCount(60)

  await comments.click()
  await expect(comments).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('list', { name: 'Comments' }).getByRole('listitem').first(),
  ).toBeVisible()
})

test('missing items and users are 404s', async ({ page }) => {
  for (const path of ['/comments/999999999999', '/user/this-user-does-not-exist-xyz']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible()
  }
})

test('unknown routes are 404s', async ({ page }) => {
  const response = await page.goto('/not-a-real-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible()
})
