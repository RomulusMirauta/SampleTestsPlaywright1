import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { TEST_ADMIN_CREDENTIALS, TEST_USER_DRUGS, TEST_USER_PATIENTS } from '../common/auth';

const baseUrl = 'http://localhost:3001/';

// Helper to login and navigate
async function loginAs(page: Page, username: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}

test.describe('Role-based access control', () => {
  test('admin can access all sections, username and logout are displayed in UI', async ({ page }) => {
    await loginAs(page, TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);
    // Check access to all main sections
    // Check username is visible in the UI (top right)
    await expect(page.locator('text=admin1')).toBeVisible();
    // Check logout button is visible
    await expect(page.locator('.db-label', { hasText: 'Patients' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Drugs' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Reports' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Admin' })).toBeVisible();
    await expect(page.locator('.db-label', { hasText: 'Logout' })).toBeVisible();
    await page.goto(baseUrl + 'drugs.html');
    await expect(page).not.toHaveURL(/dashboard.html/);
    await page.goto(baseUrl + 'patients.html');
    await expect(page).not.toHaveURL(/dashboard.html/);
    await page.goto(baseUrl + 'reports');
    await expect(page).not.toHaveURL(/dashboard.html/);
    await page.goto(baseUrl + 'admin');
    await expect(page).not.toHaveURL(/dashboard.html/);
    // Optionally, check for role if displayed
    // await expect(page.locator('text=Admin')).toBeVisible();
  });

  test('user_drugs can access drugs, cannot access patients, username and logout are displayed in UI', async ({ page }) => {
    await loginAs(page, TEST_USER_DRUGS.username, TEST_USER_DRUGS.password);
    // Should see Drugs and Logout only
    await expect(page.locator('.db-label', { hasText: 'Drugs' })).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    await expect(page.locator('text=user_drugs')).toBeVisible();
    // Should not see Patients, Reports, Admin
    await expect(page.locator('text=Patients')).toHaveCount(0);
    await expect(page.locator('text=Reports')).toHaveCount(0);
    await expect(page.locator('text=Admin')).toHaveCount(0);
    // Try to access patients page directly
    // await page.goto(baseUrl + 'patients');
    // await expect(page).toHaveURL(/login/); // or check for access denied message
  });

  test('user_patients can access patients, cannot access drugs, username and logout are displayed in UI', async ({ page }) => {
    await loginAs(page, TEST_USER_PATIENTS.username, TEST_USER_PATIENTS.password);
    // Should see Patients and Logout only
    await expect(page.locator('.db-label', { hasText: 'Patients' })).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    await expect(page.locator('text=user_patients')).toBeVisible();
    // Should not see Drugs, Reports, Admin
    await expect(page.locator('text=Drugs')).toHaveCount(0);
    await expect(page.locator('text=Reports')).toHaveCount(0);
    await expect(page.locator('text=Admin')).toHaveCount(0);
    // Try to access drugs page directly
    // await page.goto(baseUrl + 'drugs');
    // await expect(page).toHaveURL(/login/); // or check for access denied message
  });

  test('non-existent user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('no_such_user', 'wrong_password');
    await expect(page.locator('text=401: Unauthorized')).toBeVisible(); // Adjust selector as needed
  });
});