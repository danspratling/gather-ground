import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Gather Ground/);
  await expect(
    page.getByRole('heading', { name: 'Gather Ground' })
  ).toBeVisible();
});
