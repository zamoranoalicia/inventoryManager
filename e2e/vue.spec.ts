import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h2')).toHaveText('Inventory Dashboard')
})

test('visits the inventory page', async ({ page }) => {
  await page.goto('/inventory')
  await expect(page.locator('h2')).toHaveText('Inventory Dashboard')
  await expect(page.locator('button').filter({ hasText: 'Add Product' })).toBeVisible()
})
