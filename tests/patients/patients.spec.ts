import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { PatientsPage } from '../page-objects/PatientsPage';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

test('add and remove patient via UI', async ({ page }: { page: Page }) => {
  const login = new LoginPage(page);
  const patients = new PatientsPage(page);

  const firstName = `ui-patient-${Date.now()}`;
  const lastName = 'Spec';
  const dob = '1990-01-01';
  const gender = 'Other';
  const address = '123 Test St';

  await login.goto();
  await login.login(TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);

  await patients.goto();
  await patients.addPatient(firstName, lastName, dob, gender, address);

  const name = `${firstName} ${lastName}`;
  const match = page.locator('.patient-name', { hasText: name });
  await expect(match.first()).toBeVisible();

  // Cleanup
  await patients.removePatientByDetails(firstName, lastName);
  await expect(page.locator('.patient-name', { hasText: name })).toHaveCount(0);
});
