import { test, expect, request, APIRequestContext } from '@playwright/test';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';
import { PatientsService } from './services/patients.service';

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
  let service: PatientsService;
  let patientId: number | undefined;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext();
    service = new PatientsService(apiContext, baseUrl);
  });

  test('add, check, and remove patient', async () => {
    const addResponse = await service.addPatient(patientData, {
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    if (!addResponse.ok()) {
      const text = await addResponse.text();
      console.error('Add patient failed:', addResponse.status(), text);
    }
    expect(addResponse.ok()).toBeTruthy();

    // Fetch all patients and get the last one (assume it's the one just added)
    const getAllResponse = await service.getAllPatients({
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    const allPatients = await service.jsonOrThrow(getAllResponse);
    const lastPatient = allPatients[allPatients.length - 1];
    expect(lastPatient).toBeTruthy();
    patientId = lastPatient.patientId || lastPatient.PatientID || lastPatient.id;
    expect(patientId).toBeTruthy();

    // Check if patient was added (validate details from the list)
    expect(lastPatient.firstName || lastPatient.FirstName).toBe(patientData.firstName);
    expect(lastPatient.lastName || lastPatient.LastName).toBe(patientData.lastName);

    // Remove patient
    const delResponse = await service.deletePatient(patientId!, {
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    expect(delResponse.ok()).toBeTruthy();

    // Fetch all patients again and check patient is removed
    const getAllAfterDelete = await service.getAllPatients({
      username: TEST_ADMIN_CREDENTIALS.username,
      password: TEST_ADMIN_CREDENTIALS.password,
    });
    const patientsAfterDelete = await service.jsonOrThrow(getAllAfterDelete);
    const stillExists = patientsAfterDelete.some((p: any) =>
      (p.patientId || p.PatientID || p.id) === patientId
    );
    expect(stillExists).toBeFalsy();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
