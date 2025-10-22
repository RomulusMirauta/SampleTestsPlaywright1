import { test, expect, request, APIRequestContext } from '@playwright/test';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';
import { DrugsService } from './services/drugs.service';

const baseUrl = 'http://localhost:3001/';

const drugData = {
  name: 'TestDrug_API',
  description: 'Test drug description',
  dosage: '10mg',
};

test.describe('API: Admin drug management', () => {
  let apiContext: APIRequestContext;
  let service: DrugsService;
  let drugId: number | undefined;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext();
    service = new DrugsService(apiContext, baseUrl);
  });

  test('add, check, and remove drug', async () => {
    // Add drug
    const addResponse = await service.addDrug(drugData, {
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    if (!addResponse.ok()) {
      const text = await addResponse.text();
      console.error('Add drug failed:', addResponse.status(), text);
    }
    expect(addResponse.ok()).toBeTruthy();

    // Fetch all drugs and get the last one (assume it's the one just added)
    const getAllResponse = await service.getAllDrugs({
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    const allDrugs = await service.jsonOrThrow(getAllResponse);
    const lastDrug = allDrugs[allDrugs.length - 1];
    expect(lastDrug).toBeTruthy();
    drugId = lastDrug.drugId || lastDrug.DrugID || lastDrug.id;
    expect(drugId).toBeTruthy();

    // Validate details
    expect(lastDrug.name || lastDrug.Name).toBe(drugData.name);
    expect(lastDrug.description || lastDrug.Description).toBe(drugData.description);
    expect(lastDrug.dosage || lastDrug.Dosage).toBe(drugData.dosage);

    // Remove drug
    const delResponse = await service.deleteDrug(drugId!, {
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    expect(delResponse.ok()).toBeTruthy();

    // Fetch all drugs again and check drug is removed
    const getAllAfterDelete = await service.getAllDrugs({
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    const drugsAfterDelete = await service.jsonOrThrow(getAllAfterDelete);
    const stillExists = drugsAfterDelete.some((d: any) =>
      (d.drugId || d.DrugID || d.id) === drugId
    );
    expect(stillExists).toBeFalsy();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
