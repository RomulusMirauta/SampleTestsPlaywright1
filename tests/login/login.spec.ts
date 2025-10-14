import { test, expect, Page } from '@playwright/test';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

// Sample login test
const baseUrl = 'http://localhost:3001/';

test('login with valid credentials', async ({ page }: { page: Page }) => {
  await page.goto(baseUrl);
  await page.fill('input[type="text"]', TEST_ADMIN_CREDENTIALS.username);
  await page.fill('input[type="password"]', TEST_ADMIN_CREDENTIALS.password);
  await page.click('button:has-text("Login")');
  // Add assertion for successful login, e.g., dashboard visible
  await expect(page).toHaveURL(/dashboard.html/); // Adjust as needed
});

test('login with invalid credentials', async ({ page }: { page: Page }) => {
  await page.goto(baseUrl);
  await page.fill('input[type="text"]', 'admin1');
  await page.fill('input[type="password"]', 'wrong_password');
  await page.click('button:has-text("Login")');
  // Add assertion for error message
  await expect(page.locator('text=401: Unauthorized')).toBeVisible(); // Adjust selector as needed
});
