import { Page } from '@playwright/test';

export class PatientsPage {
  constructor(private page: Page) {}

  async goto() {
    // navigate via dashboard label to ensure consistent app flow
    await this.page.locator('.db-label', { hasText: 'Patients' }).click();
  }

  async addPatient(firstName: string, lastName: string, dob: string, gender: string, address: string) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    // await this.page.getByPlaceholder('DOB').fill(dob);
    await this.page.getByTitle('Fill today').click();
    await this.page.getByPlaceholder('Gender').fill(gender);
    await this.page.getByPlaceholder('Address').fill(address);
    await this.page.getByRole('button', { name: /add patient/i }).click();
  }

  findPatientCardsByName(name: string) {
    return this.page.locator('.patients-list .patient-card', { hasText: name });
  }

  async removePatientByDetails(firstName: string, lastName: string) {
    const name = `${firstName} ${lastName}`;
    const cards = this.findPatientCardsByName(name);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(0);
      this.page.once('dialog', async dialog => dialog.accept());
      await card.locator('button', { hasText: 'Remove' }).click();
      await card.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    }
  }
}
