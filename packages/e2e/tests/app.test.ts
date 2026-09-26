import { expect, test } from '@playwright/test'

test('search finds stories through Algolia', async ({ page }) => {
  await page.goto('/')
  const box = page.getByRole('searchbox', { name: /search/i })
  await box.fill('sveltekit')
  await box.press('Enter')

  await expect(page).toHaveURL(/\/search\?q=sveltekit/)
  await expect(page).toHaveTitle(/sveltekit/i)
  const results = page.getByRole('list', { name: 'Search results' })
  await expect(results.getByRole('listitem').first()).toBeVisible()
})

test('theme toggle switches to dark and survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByRole('button', { name: /dark theme/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: /light theme/i })).toBeVisible()
})

test('keyboard focus is visible', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const outline = await page.evaluate(() => {
    const el = document.activeElement
    return el && el !== document.body ? getComputedStyle(el).outlineStyle : null
  })
  expect(outline).not.toBeNull()
  expect(outline).not.toBe('none')
})

test('every route has its own title, ending in the app name', async ({ page }) => {
  const titles = new Set<string>()
  for (const path of ['/', '/newstories', '/comments/1', '/user/pg', '/not-a-real-page']) {
    await page.goto(path)
    // e.g. "Best stories | Hacker News - Next"
    await expect(page).toHaveTitle(/^.+ \| Hacker News - \w+$/)
    titles.add(await page.title())
  }
  expect(titles.size).toBe(5)
})

test('the app is installable', async ({ page }) => {
  await page.goto('/')
  const href = await page.locator('link[rel="manifest"]').getAttribute('href')
  expect(href).toBeTruthy()
  const manifest = await (await page.request.get(new URL(href!, page.url()).href)).json()
  expect(manifest).toMatchObject({ name: expect.any(String), icons: expect.any(Array) })
})
