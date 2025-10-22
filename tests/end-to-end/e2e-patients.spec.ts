import { test, expect } from '@playwright/test';
import sql from 'mssql';
import { TEST_ADMIN_CREDENTIALS } from '../common/auth';
import { DB_CONFIG } from '../common/config';
import { LoginPage } from '../page-objects/LoginPage';
import { PatientsPage } from '../page-objects/PatientsPage';

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
  const login = new LoginPage(page);
  const patients = new PatientsPage(page);

  // 1. Log in as admin
  await login.goto();
  await login.login(TEST_ADMIN_CREDENTIALS.username, TEST_ADMIN_CREDENTIALS.password);

  // 2. Go to Patients page and add
  await patients.goto();
  await patients.addPatient(
    patientData.firstName,
    patientData.lastName,
    patientData.dob,
    patientData.gender,
    patientData.address
  );

  // 3. Ensure patient appears
  const matching = page.locator('.patient-name', { hasText: `${patientData.firstName} ${patientData.lastName}` });
  await expect(matching.first()).toBeVisible();

  // 4. Remove all matching entries
  await patients.removePatientByDetails(patientData.firstName, patientData.lastName);

  // 5. Verify gone
  await expect(page.locator('.patient-name', { hasText: `${patientData.firstName} ${patientData.lastName}` })).toHaveCount(0);

  // 6. DB check: patient was deleted
  const pool = await sql.connect(DB_CONFIG as any);
  const result = await pool.request()
    .input('firstName', sql.VarChar, patientData.firstName)
    .input('lastName', sql.VarChar, patientData.lastName)
    .query('SELECT * FROM Patients WHERE FirstName = @firstName AND LastName = @lastName');
  expect(result.recordset.length).toBe(0);
  await pool.close();
});
