import { expect, test } from '@playwright/test'

const stories = (page: import('@playwright/test').Page) =>
  page.getByRole('list', { name: 'Stories' })

test('home page lists 30 best stories', async ({ page }) => {
  await page.goto('/')
  await expect(stories(page).getByRole('listitem')).toHaveCount(30)
  await expect(page).toHaveTitle(/^Best stories/)
})

test('best stories also have their own URL', async ({ page }) => {
  await page.goto('/beststories')
  await expect(stories(page).getByRole('listitem')).toHaveCount(30)
  await expect(page).toHaveTitle(/^Best stories/)
})

test('pagination moves to the next 30 stories', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /next page/i }).click()
  await expect(page).toHaveURL(/[?&]page=2\b/)
  await expect(stories(page)).toHaveAttribute('start', '31')
})

test('nav tabs route to each story type and mark the current one', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation')

  for (const [label, type, title] of [
    ['Top', 'topstories', /Top stories/],
    ['New', 'newstories', /New stories/],
    ['Ask', 'askstories', /Ask HN/],
    ['Show', 'showstories', /Show HN/],
    ['Jobs', 'jobstories', /Jobs/],
  ] as const) {
    const link = nav.getByRole('link', { name: label, exact: true })
    await link.click()
    await expect(page).toHaveURL(new RegExp(`/${type}$`))
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page).toHaveTitle(title)
    await expect(stories(page).getByRole('listitem').first()).toBeVisible()
  }
})

test('stories show their domain and link to their comments', async ({ page }) => {
  await page.goto('/')
  const first = stories(page).getByRole('listitem').first()
  await expect(first.getByRole('link', { name: /^(\d+ comments?|discuss)$/ })).toHaveAttribute(
    'href',
    /\/comments\/\d+$/,
  )
})

test('hidden stories stay hidden after a reload', async ({ page }) => {
  await page.goto('/newstories')
  const first = stories(page).getByRole('listitem').first()
  const title = await first.getByRole('heading').innerText()

  await first.getByRole('button', { name: /hide/i }).click()
  await expect(stories(page).getByRole('heading', { name: title, exact: true })).toHaveCount(0)

  await page.reload()
  await expect(stories(page).getByRole('listitem').first()).toBeVisible()
  await expect(stories(page).getByRole('heading', { name: title, exact: true })).toHaveCount(0)
})
