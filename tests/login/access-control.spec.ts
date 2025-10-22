import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { TEST_ADMIN_CREDENTIALS, TEST_USER_DRUGS, TEST_USER_PATIENTS } from '../common/auth';

// Helper to login using the page object
async function loginAs(page: Page, username: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}

test.describe('Role-based access control', () => {
  test('admin can access all sections, username and logout are displayed in UI', async ({ page }) => {
    await loginAs(page, TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);
    await expect(page.locator(`text=${TEST_ADMIN_CREDENTIALS.username}`)).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Patients' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Drugs' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Reports' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Admin' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Logout' })).toBeVisible();
  });

  test('user_drugs can access drugs, cannot access patients, username and logout are displayed in UI', async ({ page }) => {
    await loginAs(page, TEST_USER_DRUGS.username, TEST_USER_DRUGS.password);
    await expect(page.locator('.db-label', { hasText: 'Drugs' })).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    await expect(page.locator(`text=${TEST_USER_DRUGS.username}`)).toBeVisible();
    await expect(page.locator('text=Patients')).toHaveCount(0);
    await expect(page.locator('text=Reports')).toHaveCount(0);
    await expect(page.locator('text=Admin')).toHaveCount(0);
  });

  test('user_patients can access patients, cannot access drugs, username and logout are displayed in UI', async ({ page }) => {
    await loginAs(page, TEST_USER_PATIENTS.username, TEST_USER_PATIENTS.password);
    await expect(page.locator('.db-label', { hasText: 'Patients' })).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    await expect(page.locator(`text=${TEST_USER_PATIENTS.username}`)).toBeVisible();
    await expect(page.locator('text=Drugs')).toHaveCount(0);
    await expect(page.locator('text=Reports')).toHaveCount(0);
    await expect(page.locator('text=Admin')).toHaveCount(0);
  });

  test('non-existent user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('no_such_user', 'wrong_password');
    await expect(page.locator('text=401: Unauthorized')).toBeVisible(); // Adjust selector as needed
  });
});
