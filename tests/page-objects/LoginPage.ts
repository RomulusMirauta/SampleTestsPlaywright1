import { Page } from '@playwright/test';
import { BASE_URL } from '../common/config';

export class LoginPage {
  constructor(private page: Page) {}

  async goto(path = '/') {
    await this.page.goto(new URL(path, BASE_URL).toString());
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }
}
