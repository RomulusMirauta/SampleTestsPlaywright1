import { Page } from '@playwright/test';

export class DrugsPage {
  constructor(private page: Page) {}

  async goto() {
    // navigate via dashboard label to ensure consistent app flow
    await this.page.locator('.db-label', { hasText: 'Drugs' }).click();
  }

  async addDrug(name: string, description: string, dosage: string) {
    await this.page.getByPlaceholder('Drug Name').fill(name);
    await this.page.getByPlaceholder('Description').fill(description);
    await this.page.getByPlaceholder('Dosage').fill(dosage);
    await this.page.getByRole('button', { name: /add drug/i }).click();
  }

  findDrugCardsByName(name: string) {
    return this.page.locator('.drugs-list .drug-card', { hasText: name });
  }

  async removeDrugByDetails(name: string, description: string, dosage: string) {
    const cards = this.findDrugCardsByName(name);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(0);
      const text = await card.textContent();
      if (text && text.includes(description) && text.includes(dosage)) {
        this.page.once('dialog', async dialog => dialog.accept());
        await card.locator('button', { hasText: 'Remove' }).click();
        await card.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
      }
    }
  }
}
