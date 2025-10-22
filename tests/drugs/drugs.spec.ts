import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { DrugsPage } from '../page-objects/DrugsPage';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

test('add and remove drug via UI', async ({ page }: { page: Page }) => {
  const login = new LoginPage(page);
  const drugs = new DrugsPage(page);

  const name = `ui-test-${Date.now()}`;
  const description = 'Automated test drug';
  const dosage = '10mg';

  await login.goto();
  await login.login(TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);

  await drugs.goto();
  await drugs.addDrug(name, description, dosage);

  const match = page.locator('.drugs-list .drug-card .drug-name', { hasText: name });
  await expect(match.first()).toBeVisible();

  // Cleanup
  await drugs.removeDrugByDetails(name, description, dosage);
  await expect(page.locator('.drugs-list .drug-card .drug-name', { hasText: name })).toHaveCount(0);
});
