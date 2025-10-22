import { test, expect, Page } from '@playwright/test';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';
import { LoginPage } from '../page-objects/LoginPage';

// Sample login test
test('login with valid credentials', async ({ page }: { page: Page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);
  // Assert username is visible in the UI after login (stable indicator)
  await expect(page.locator(`text=${TEST_ADMIN_CREDENTIALS.username}`)).toBeVisible();
});

test('login with invalid credentials', async ({ page }: { page: Page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('admin1', 'wrong_password');
  // Assertion for error message
  await expect(page.locator('text=401: Unauthorized')).toBeVisible(); // Adjust selector as needed
});
