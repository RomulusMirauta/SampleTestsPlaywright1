import { test, expect, request, APIRequestContext } from '@playwright/test';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

const baseUrl = 'http://localhost:3001/';

const drugData = {
  name: 'TestDrug_API',
  description: 'Test drug description',
  dosage: '10mg',
};

test.describe('API: Admin drug management', () => {
  let apiContext: APIRequestContext;
  let drugId: number | undefined;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext();
  });

  test('add, check, and remove drug', async () => {
    // Add drug (include credentials in body)
    const addResponse = await apiContext.post(baseUrl + 'api/drugs', {
      data: {
        ...drugData,
        username: TEST_ADMIN_CREDENTIALS.username,
        password: TEST_ADMIN_CREDENTIALS.password,
      },
    });
    const addStatus = addResponse.status();
    const addText = await addResponse.text();
    console.log('Add drug status:', addStatus);
    console.log('Add drug body:', addText);
    expect(addResponse.ok()).toBeTruthy();

    // Fetch all drugs and get the last one (assume it's the one just added)
    const getAllResponse = await apiContext.get(baseUrl + `api/drugs?username=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.username)}&password=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.password)}`);
    expect(getAllResponse.ok()).toBeTruthy();
    const allDrugs = await getAllResponse.json();
    console.log('All drugs:', allDrugs);
    const lastDrug = allDrugs[allDrugs.length - 1];
    expect(lastDrug).toBeTruthy();
    drugId = lastDrug.drugId || lastDrug.DrugID || lastDrug.id;
    expect(drugId).toBeTruthy();

    // Check if drug was added (validate details from the list)
    expect(lastDrug.name || lastDrug.Name).toBe(drugData.name);
    expect(lastDrug.description || lastDrug.Description).toBe(drugData.description);
    expect(lastDrug.dosage || lastDrug.Dosage).toBe(drugData.dosage);

    // Remove drug (include credentials in query)
    const delResponse = await apiContext.delete(baseUrl + `api/drugs/${drugId}?username=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.username)}&password=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.password)}`);
    expect(delResponse.ok()).toBeTruthy();

    // Fetch all drugs again and check drug is removed
    const getAllAfterDelete = await apiContext.get(baseUrl + `api/drugs?username=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.username)}&password=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.password)}`);
    expect(getAllAfterDelete.ok()).toBeTruthy();
    const drugsAfterDelete = await getAllAfterDelete.json();
    const stillExists = drugsAfterDelete.some((d: any) =>
      (d.drugId || d.DrugID || d.id) === drugId
    );
    expect(stillExists).toBeFalsy();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
