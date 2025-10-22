import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
  await this.page.goto('http://localhost:3001/');
  }

  async login(username: string, password: string) {
  await this.page.getByPlaceholder('Username').fill(username);
  await this.page.getByPlaceholder('Password').fill(password);
  await this.page.getByRole('button', { name: /login/i }).click();
  }
}
