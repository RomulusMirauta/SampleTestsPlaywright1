import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

// Sample logout test
test('logout redirects to login page', async ({ page }: { page: Page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);
  // Click logout and assert we return to login
  await page.locator('.db-label', { hasText: 'Logout' }).click();
  await expect(page.locator('button:has-text("Login")')).toBeVisible();
});
