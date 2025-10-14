import { Page } from '@playwright/test';

export class PatientsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3001/patients.html');
  }

  // Add methods for add/edit/delete/search patients as needed
}
