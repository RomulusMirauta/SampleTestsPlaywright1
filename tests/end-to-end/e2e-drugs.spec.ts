import { test, expect } from '@playwright/test';
import sql from 'mssql';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

const baseUrl = 'http://localhost:3001/';
const dbConfig = {
  user: 'sa',
  password: 'sa57843hFL^%*#',
  server: 'localhost',
  database: 'HealthcareDB',
  options: {
    trustServerCertificate: true,
  },
};

const drugData = {
  name: 'E2E TestDrug',
  description: 'E2E Test Drug Description',
  dosage: '123mg',
};

test('E2E: add and remove drug (UI + DB check)', async ({ page }) => {
  // 1. Log in as admin
  await page.goto(baseUrl);
  await page.getByPlaceholder('Username').fill(TEST_ADMIN_CREDENTIALS.username);
  await page.getByPlaceholder('Password').fill(TEST_ADMIN_CREDENTIALS.password);
  await page.getByRole('button', { name: /login/i }).click();

  // 2. Go to Drugs page
  await expect(page.locator('.db-label', { hasText: 'Drugs' })).toBeVisible();
  await page.locator('.db-label', { hasText: 'Drugs' }).click();

  // 3. Add a drug
  await page.getByPlaceholder('Drug Name').fill(drugData.name);
  await page.getByPlaceholder('Description').fill(drugData.description);
  await page.getByPlaceholder('Dosage').fill(drugData.dosage);
  await page.getByRole('button', { name: /add drug/i }).click();

  // 4. Press Back
  await page.getByRole('button', { name: /back/i }).click();

  // 5. Go to Drugs again
  await page.locator('.db-label', { hasText: 'Drugs' }).click();

  // 6. Check if at least one matching drug appears in the list (handle multiple occurrences)
  // Updated selector to match actual DOM structure (see .drug-card .drug-name)
  const matchingNames = page.locator('.drugs-list .drug-card .drug-name', { hasText: drugData.name });
  await expect(matchingNames.first()).toBeVisible();
  const visibleCount = await matchingNames.count();
  expect(visibleCount).toBeGreaterThan(0);

  // 7. Delete all matching test drugs (in case of duplicates)
  const drugCards = page.locator('.drugs-list .drug-card', { hasText: drugData.name });
  const count = await drugCards.count();
  for (let i = 0; i < count; i++) {
    const card = drugCards.nth(0);
    const descriptionText = await card.textContent();
    if (descriptionText && descriptionText.includes(drugData.description) && descriptionText.includes(drugData.dosage)) {
      page.once('dialog', async dialog => {
        await dialog.accept();
      });
      await card.locator('button', { hasText: 'Remove' }).click();
      await expect(card).not.toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  }

  // 8. Check drug is gone from the list
  await expect(page.locator('.drugs-list .drug-card .drug-name', { hasText: drugData.name })).toHaveCount(0);

  // 9. Press Back
  await page.getByRole('button', { name: /back/i }).click();

  // 10. Go to Drugs again
  await page.locator('.db-label', { hasText: 'Drugs' }).click();

  // 11. Check drug is gone from the list
  await expect(page.locator('.drugs-list .drug-card .drug-name', { hasText: drugData.name })).toHaveCount(0);

  // 12. DB check: drug was added and deleted
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('name', sql.VarChar, drugData.name)
    .query('SELECT * FROM Drugs WHERE Name = @name');
  expect(result.recordset.length).toBe(0);
  await pool.close();
});
