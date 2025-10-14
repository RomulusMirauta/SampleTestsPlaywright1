import { test, expect, request, APIRequestContext } from '@playwright/test';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';

const baseUrl = 'http://localhost:3001/';

// Patient data matching backend's expected field names
const patientData = {
  firstName: 'Test',
  lastName: 'API',
  dob: '2025-10-14',
  gender: 'test',
  address: 'test',
};

test.describe('API: Admin patient management', () => {
  let apiContext: APIRequestContext;
  let patientId: number | undefined;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext();
  });

  test('add, check, and remove patient', async () => {
    // Add patient (include credentials in body)
    const addResponse = await apiContext.post(baseUrl + 'api/patients', {
      data: {
        ...patientData,
        username: TEST_ADMIN_CREDENTIALS.username,
        password: TEST_ADMIN_CREDENTIALS.password,
      },
    });
    const addStatus = addResponse.status();
    const addText = await addResponse.text();
    console.log('Add patient status:', addStatus);
    console.log('Add patient body:', addText);
    expect(addResponse.ok()).toBeTruthy();

    // Fetch all patients and get the last one (assume it's the one just added)
    const getAllResponse = await apiContext.get(
      baseUrl +
        `api/patients?username=${encodeURIComponent(
          TEST_ADMIN_CREDENTIALS.username
        )}&password=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.password)}`
    );
    expect(getAllResponse.ok()).toBeTruthy();
    const allPatients = await getAllResponse.json();
    console.log('All patients:', allPatients);
    const lastPatient = allPatients[allPatients.length - 1];
    expect(lastPatient).toBeTruthy();
    patientId = lastPatient.patientId || lastPatient.PatientID || lastPatient.id;
    expect(patientId).toBeTruthy();

    // Check if patient was added (validate details from the list)
    expect(lastPatient.firstName || lastPatient.FirstName).toBe(patientData.firstName);
    expect(lastPatient.lastName || lastPatient.LastName).toBe(patientData.lastName);

    // Remove patient (include credentials in query)
    const delResponse = await apiContext.delete(
      baseUrl +
        `api/patients/${patientId}?username=${encodeURIComponent(
          TEST_ADMIN_CREDENTIALS.username
        )}&password=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.password)}`
    );
    expect(delResponse.ok()).toBeTruthy();

    // Fetch all patients again and check patient is removed
    const getAllAfterDelete = await apiContext.get(
      baseUrl +
        `api/patients?username=${encodeURIComponent(
          TEST_ADMIN_CREDENTIALS.username
        )}&password=${encodeURIComponent(TEST_ADMIN_CREDENTIALS.password)}`
    );
    expect(getAllAfterDelete.ok()).toBeTruthy();
    const patientsAfterDelete = await getAllAfterDelete.json();
    const stillExists = patientsAfterDelete.some((p: any) =>
      (p.patientId || p.PatientID || p.id) === patientId
    );
    expect(stillExists).toBeFalsy();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
