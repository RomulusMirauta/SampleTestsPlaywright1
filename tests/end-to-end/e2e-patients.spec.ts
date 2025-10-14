import { test, expect } from '@playwright/test';
import sql from 'mssql';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

const baseUrl = 'http://localhost:3001/';
const dbConfig = {
  user: 'sa', // update with your SQL Server username
  password: 'sa57843hFL^%*#', // update with your SQL Server password
  server: 'localhost',
  database: 'HealthcareDB',
  options: {
    trustServerCertificate: true,
  },
};

const patientData = {
  firstName: 'E2E',
  lastName: 'TestPatient',
  dob: '2000-01-01',
  gender: 'Other',
  address: 'E2E Test Address',
};

test('E2E: add and remove patient (UI + DB check)', async ({ page }) => {
  // 1. Log in as admin
  await page.goto(baseUrl);
  await page.getByPlaceholder('Username').fill(TEST_ADMIN_CREDENTIALS.username);
  await page.getByPlaceholder('Password').fill(TEST_ADMIN_CREDENTIALS.password);
  await page.getByRole('button', { name: /login/i }).click();

  // 2. Go to Patients page
  await expect(page.locator('.db-label', { hasText: 'Patients' })).toBeVisible();
  await page.locator('.db-label', { hasText: 'Patients' }).click();

  // 3. Add a patient
  await page.getByPlaceholder('First Name').fill(patientData.firstName);
  await page.getByPlaceholder('Last Name').fill(patientData.lastName);
  // Click the calendar icon and then the Today button
  await page.locator('input#dob').click();
  await page.locator('button#fillTodayBtn').click();
  await page.getByPlaceholder('Gender').fill(patientData.gender);
  await page.getByPlaceholder('Address').fill(patientData.address);
  await page.getByRole('button', { name: /add patient/i }).click();

  // 4. Press Back
  await page.getByRole('button', { name: /back/i }).click();

  // 5. Go to Patients again
  await page.locator('.db-label', { hasText: 'Patients' }).click();

  // 6. Check if at least one matching patient appears in the list (handle multiple occurrences)
  const matchingNames = page.locator('.patient-name', { hasText: `${patientData.firstName} ${patientData.lastName}` });
  await expect(matchingNames.first()).toBeVisible();
  const visibleCount = await matchingNames.count();
  expect(visibleCount).toBeGreaterThan(0);

  // 7. Delete all matching test patients (in case of duplicates)
  const patientCards = page.locator('.patient-card', { hasText: `${patientData.firstName} ${patientData.lastName}` });
  const count = await patientCards.count();
  for (let i = 0; i < count; i++) {
    // Use first() since the list updates after each removal
    const card = patientCards.nth(0);
    // Optionally check address for extra safety
    const addressText = await card.locator('.patient-details').textContent();
    if (addressText && addressText.includes(patientData.address)) {
      page.once('dialog', async dialog => {
        await dialog.accept();
      });
      await card.locator('button.remove-btn').click();
      // Wait for the card to be removed
      await expect(card).not.toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  }

  // 10. Check patient is gone from the list
  await expect(page.locator('.patient-name', { hasText: `${patientData.firstName} ${patientData.lastName}` })).not.toBeVisible();

  // 8. Press Back
  await page.getByRole('button', { name: /back/i }).click();

  // 9. Go to Patients again
  await page.locator('.db-label', { hasText: 'Patients' }).click();

  // 10. Check patient is gone from the list
  await expect(page.locator('.patient-name', { hasText: `${patientData.firstName} ${patientData.lastName}` })).not.toBeVisible();


  // 11. DB check: patient was added and deleted
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('firstName', sql.VarChar, patientData.firstName)
    .input('lastName', sql.VarChar, patientData.lastName)
    .query('SELECT * FROM Patients WHERE FirstName = @firstName AND LastName = @lastName');
  expect(result.recordset.length).toBe(0);
  await pool.close();
});
