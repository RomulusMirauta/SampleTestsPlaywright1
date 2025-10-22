import { test, expect } from '@playwright/test';
import sql from 'mssql';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';
import { DB_CONFIG } from '../common/config';
import { LoginPage } from '../page-objects/LoginPage';
import { DrugsPage } from '../page-objects/DrugsPage';


const drugData = {
  name: 'E2E TestDrug',
  description: 'E2E Test Drug Description',
  dosage: '123mg',
};

test('E2E: add and remove drug (UI + DB check)', async ({ page }) => {
  const login = new LoginPage(page);
  const drugs = new DrugsPage(page);

  // 1. Log in as admin
  await login.goto();
  await login.login(TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);

  // 2. Go to Drugs page and add
  await drugs.goto();
  await drugs.addDrug(drugData.name, drugData.description, drugData.dosage);

  // 3. Ensure drug appears
  const matching = page.locator('.drugs-list .drug-card .drug-name', { hasText: drugData.name });
  await expect(matching.first()).toBeVisible();

  // 4. Remove all matching entries that match details
  await drugs.removeDrugByDetails(drugData.name, drugData.description, drugData.dosage);

  // 5. Verify gone
  await expect(page.locator('.drugs-list .drug-card .drug-name', { hasText: drugData.name })).toHaveCount(0);

  // 6. DB check: drug was added and deleted
  // const pool = await sql.connect(DB_CONFIG as any);
  const pool = await sql.connect(DB_CONFIG as any);
  const result = await pool.request()
    .input('name', sql.VarChar, drugData.name)
    .query('SELECT * FROM Drugs WHERE Name = @name');
  expect(result.recordset.length).toBe(0);
  await pool.close();
});
