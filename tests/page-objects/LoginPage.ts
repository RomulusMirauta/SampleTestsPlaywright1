import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3001/');
  }

  async login(username: string, password: string) {
    await this.page.fill('input[type="text"]', username);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button:has-text("Login")');
  }
}
