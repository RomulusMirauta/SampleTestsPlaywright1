import { Page } from '@playwright/test';

export class DrugsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3001/drugs.html');
  }

  // Add methods for add/edit/delete/search drugs as needed
}
